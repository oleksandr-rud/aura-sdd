"""
LangGraph integration for AURA-004.

This module provides the core graph implementation using LangGraph,
including state management, node execution, and edge routing.
"""

import asyncio
from typing import Any, Dict, List, Optional, Union, Callable

from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import ToolNode

from aura_004.core.base import BaseGraph, BaseAgent
from aura_004.core.state import ConversationState, AgentState, TaskState, TaskStatus
from aura_004.core.exceptions import GraphError, StateError
from aura_004.core.config import get_settings


class AgentGraph(BaseGraph):
    """Main graph implementation using LangGraph."""

    def __init__(
        self,
        name: str,
        memory: Optional[Any] = None,
        checkpoint_saver: Optional[Any] = None,
        **kwargs,
    ):
        super().__init__(name, **kwargs)
        self.memory = memory
        self.checkpoint_saver = checkpoint_saver or MemorySaver()
        self.langgraph: Optional[StateGraph] = None
        self.tool_node: Optional[ToolNode] = None
        self.compiled_graph: Optional[Any] = None
        self.settings = get_settings()

    def build(self) -> None:
        """Build the LangGraph structure."""
        try:
            # Create LangGraph instance
            self.langgraph = StateGraph(ConversationState)

            # Add nodes
            for node_id, node in self.nodes.items():
                if isinstance(node, BaseAgent):
                    # Wrap agent for LangGraph
                    self.langgraph.add_node(node_id, self._create_agent_wrapper(node))
                else:
                    # Add node directly
                    self.langgraph.add_node(node_id, node)

            # Add edges
            for edge in self.edges:
                from_node = edge["from"]
                to_node = edge["to"]
                condition = edge.get("condition")

                if condition:
                    # Conditional edge
                    self.langgraph.add_conditional_edges(
                        from_node,
                        self._create_condition_function(condition),
                        {to_node: to_node}
                    )
                else:
                    # Direct edge
                    self.langgraph.add_edge(from_node, to_node)

            # Set entry point
            if self.nodes:
                entry_node = list(self.nodes.keys())[0]
                self.langgraph.set_entry_point(entry_node)

            # Compile the graph
            self.compiled_graph = self.langgraph.compile(
                checkpointer=self.checkpoint_saver
            )

            self._is_built = True

        except Exception as e:
            raise GraphError(f"Failed to build graph {self.name}: {e}") from e

    async def execute(
        self,
        input_data: Dict[str, Any],
        config: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Execute the graph with LangGraph."""
        if not self._is_built:
            raise GraphError(f"Graph {self.name} is not built")

        if not self.compiled_graph:
            raise GraphError(f"Graph {self.name} is not compiled")

        try:
            # Prepare config
            execution_config = {
                "configurable": {
                    "thread_id": self.state.id,
                    **(config.get("configurable", {}) if config else {}),
                }
            }

            # Add checkpoint config if available
            if config and "checkpoint" in config:
                execution_config["checkpoint"] = config["checkpoint"]

            # Execute the graph
            result = await self.compiled_graph.ainvoke(
                input_data,
                config=execution_config,
            )

            # Update state
            self.state.update_metrics(
                tokens=result.get("total_tokens", 0),
                cost=result.get("total_cost", 0.0),
                execution_time=result.get("execution_time", 0.0),
            )

            return result

        except Exception as e:
            raise GraphError(f"Graph {self.name} execution failed: {e}") from e

    async def stream(
        self,
        input_data: Dict[str, Any],
        config: Optional[Dict[str, Any]] = None,
    ) -> Any:
        """Stream graph execution."""
        if not self._is_built or not self.compiled_graph:
            raise GraphError(f"Graph {self.name} is not built or compiled")

        try:
            execution_config = {
                "configurable": {
                    "thread_id": self.state.id,
                    **(config.get("configurable", {}) if config else {}),
                }
            }

            async for event in self.compiled_graph.astream(
                input_data,
                config=execution_config,
            ):
                yield event

        except Exception as e:
            raise GraphError(f"Graph {self.name} streaming failed: {e}") from e

    def _create_agent_wrapper(self, agent: BaseAgent) -> Callable:
        """Create a wrapper function for agents to work with LangGraph."""
        async def agent_wrapper(state: ConversationState) -> ConversationState:
            try:
                # Prepare input for agent
                last_message = state.get_last_message()
                if not last_message:
                    raise StateError("No messages found in state")

                input_data = {
                    "message": last_message.content,
                    "context": state.metadata,
                    "memory": agent.state.memory,
                }

                # Execute agent
                result = await agent.execute(input_data)

                # Create response message
                response_content = result.get("response", "No response generated")

                # Add response to state
                from aura_004.core.state import MessageState, MessageRole
                response_message = MessageState(
                    role=MessageRole.ASSISTANT,
                    content=response_content,
                    metadata=result.get("metadata", {}),
                )
                state.add_message(response_message)

                # Update agent state
                agent.state.add_execution_record({
                    "input": input_data,
                    "output": result,
                    "success": True,
                })

                return state

            except Exception as e:
                # Add error message to state
                from aura_004.core.state import MessageState, MessageRole
                error_message = MessageState(
                    role=MessageRole.ASSISTANT,
                    content=f"Error: {str(e)}",
                    metadata={"error": True, "agent": agent.name},
                )
                state.add_message(error_message)

                # Update agent state
                agent.state.add_execution_record({
                    "error": str(e),
                    "success": False,
                })

                return state

        return agent_wrapper

    def _create_condition_function(self, condition: str) -> Callable:
        """Create a condition function for conditional edges."""
        def condition_function(state: ConversationState) -> str:
            try:
                # Evaluate condition based on state
                if condition == "has_active_tasks":
                    return "continue" if state.get_active_tasks() else "end"
                elif condition == "has_messages":
                    return "continue" if state.messages else "end"
                elif condition == "is_complete":
                    return "end" if state.status == "completed" else "continue"
                else:
                    # Default to continue
                    return "continue"

            except Exception as e:
                # Log error and default to end
                print(f"Condition evaluation error: {e}")
                return "end"

        return condition_function


class GraphBuilder:
    """Builder class for creating agent graphs."""

    def __init__(self, name: str):
        self.name = name
        self.nodes: Dict[str, Any] = {}
        self.edges: List[Dict[str, Any]] = []
        self.entry_point: Optional[str] = None
        self.conditional_edges: List[Dict[str, Any]] = []

    def add_agent(
        self,
        agent_id: str,
        agent: BaseAgent,
        **kwargs,
    ) -> "GraphBuilder":
        """Add an agent node to the graph."""
        self.nodes[agent_id] = agent
        return self

    def add_node(
        self,
        node_id: str,
        node_func: Callable,
        **kwargs,
    ) -> "GraphBuilder":
        """Add a custom node to the graph."""
        self.nodes[node_id] = node_func
        return self

    def add_edge(
        self,
        from_node: str,
        to_node: str,
        **kwargs,
    ) -> "GraphBuilder":
        """Add an edge between nodes."""
        self.edges.append({
            "from": from_node,
            "to": to_node,
            **kwargs,
        })
        return self

    def add_conditional_edge(
        self,
        from_node: str,
        condition: Union[str, Callable],
        mapping: Dict[str, str],
        **kwargs,
    ) -> "GraphBuilder":
        """Add a conditional edge."""
        self.conditional_edges.append({
            "from": from_node,
            "condition": condition,
            "mapping": mapping,
            **kwargs,
        })
        return self

    def set_entry_point(self, node_id: str) -> "GraphBuilder":
        """Set the entry point of the graph."""
        self.entry_point = node_id
        return self

    def build(
        self,
        memory: Optional[Any] = None,
        checkpoint_saver: Optional[Any] = None,
    ) -> AgentGraph:
        """Build the final graph."""
        graph = AgentGraph(
            name=self.name,
            memory=memory,
            checkpoint_saver=checkpoint_saver,
        )

        # Add all nodes
        for node_id, node in self.nodes.items():
            graph.add_node(node_id, node)

        # Add all edges
        for edge in self.edges:
            graph.add_edge(edge["from"], edge["to"])

        # Add conditional edges
        for edge in self.conditional_edges:
            graph.add_edge(
                edge["from"],
                edge["to"],  # Will be processed in build()
                condition=edge["condition"],
            )

        # Set entry point
        if self.entry_point:
            # Reorder nodes to make entry point first
            if self.entry_point in graph.nodes:
                entry_node = graph.nodes.pop(self.entry_point)
                graph.nodes = {self.entry_point: entry_node, **graph.nodes}

        # Build and validate
        graph.build()
        graph.validate_structure()

        return graph

    def __str__(self) -> str:
        return f"GraphBuilder(name={self.name}, nodes={len(self.nodes)}, edges={len(self.edges)})"

    def __repr__(self) -> str:
        return f"GraphBuilder(name={self.name}, nodes={len(self.nodes)}, edges={len(self.edges)})"


# Utility functions for common graph patterns

def create_linear_graph(
    name: str,
    agents: List[BaseAgent],
    agent_ids: Optional[List[str]] = None,
) -> AgentGraph:
    """Create a linear graph with agents executed in sequence."""
    if not agents:
        raise GraphError("No agents provided for linear graph")

    agent_ids = agent_ids or [f"agent_{i}" for i in range(len(agents))]

    if len(agent_ids) != len(agents):
        raise GraphError("Number of agent IDs must match number of agents")

    builder = GraphBuilder(name)
    builder.set_entry_point(agent_ids[0])

    # Add agents
    for agent_id, agent in zip(agent_ids, agents):
        builder.add_agent(agent_id, agent)

    # Add edges
    for i in range(len(agent_ids) - 1):
        builder.add_edge(agent_ids[i], agent_ids[i + 1])

    return builder.build()


def create_conditional_graph(
    name: str,
    entry_agent: BaseAgent,
    condition_branches: Dict[str, BaseAgent],
    condition_function: Optional[Callable] = None,
) -> AgentGraph:
    """Create a graph with conditional branching."""
    builder = GraphBuilder(name)
    builder.set_entry_point("entry")

    # Add entry agent
    builder.add_agent("entry", entry_agent)

    # Add branch agents
    for branch_name, agent in condition_branches.items():
        builder.add_agent(branch_name, agent)

    # Add conditional edge
    condition = condition_function or "default_condition"
    mapping = {name: name for name in condition_branches.keys()}
    builder.add_conditional_edge("entry", condition, mapping)

    return builder.build()


def create_parallel_graph(
    name: str,
    entry_agent: BaseAgent,
    parallel_agents: List[BaseAgent],
    join_agent: Optional[BaseAgent] = None,
) -> AgentGraph:
    """Create a graph with parallel execution."""
    builder = GraphBuilder(name)
    builder.set_entry_point("entry")

    # Add entry agent
    builder.add_agent("entry", entry_agent)

    # Add parallel agents
    for i, agent in enumerate(parallel_agents):
        builder.add_agent(f"parallel_{i}", agent)
        builder.add_edge("entry", f"parallel_{i}")

    # Add join agent if provided
    if join_agent:
        builder.add_agent("join", join_agent)
        for i in range(len(parallel_agents)):
            builder.add_edge(f"parallel_{i}", "join")

    return builder.build()