"""
Base classes for AURA-004 components.

This module provides abstract base classes that define the interface
for agents, graphs, and other core components.
"""

import asyncio
import uuid
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, Union

from langchain_core.runnables import Runnable
from langchain_core.callbacks import BaseCallbackHandler

from aura_004.core.state import AgentState, ConversationState, MessageState
from aura_004.core.exceptions import AgentError, GraphError, StateError


class BaseAgent(ABC):
    """Abstract base class for all agents in the system."""

    def __init__(
        self,
        name: str,
        role: str,
        model: str = "gpt-4o-mini",
        temperature: float = 0.1,
        max_tokens: int = 4096,
        **kwargs,
    ):
        self.id = str(uuid.uuid4())
        self.name = name
        self.role = role
        self.model = model
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.state = AgentState(
            id=self.id,
            name=name,
            role=role,
            model=model,
            temperature=temperature,
            max_tokens=max_tokens,
            **kwargs,
        )
        self._callbacks: List[BaseCallbackHandler] = []

    @abstractmethod
    async def process(
        self,
        input_data: Dict[str, Any],
        context: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Process input data and return results."""
        pass

    @abstractmethod
    def get_capabilities(self) -> List[str]:
        """Get list of agent capabilities."""
        pass

    @abstractmethod
    def validate_input(self, input_data: Dict[str, Any]) -> bool:
        """Validate input data for processing."""
        pass

    def add_callback(self, callback: BaseCallbackHandler) -> None:
        """Add a callback handler."""
        self._callbacks.append(callback)

    def remove_callback(self, callback: BaseCallbackHandler) -> None:
        """Remove a callback handler."""
        if callback in self._callbacks:
            self._callbacks.remove(callback)

    async def execute(
        self,
        input_data: Dict[str, Any],
        context: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Execute the agent with error handling and state management."""
        try:
            # Validate input
            if not self.validate_input(input_data):
                raise AgentError(f"Invalid input data for agent {self.name}")

            # Update state
            self.state.status = "working"
            self.state.last_activity = self.state.last_activity.__class__.utcnow()

            # Process the input
            result = await self.process(input_data, context)

            # Update state
            self.state.status = "idle"
            self.state.add_execution_record({
                "input": input_data,
                "output": result,
                "success": True,
            })

            return result

        except Exception as e:
            self.state.status = "error"
            self.state.add_execution_record({
                "input": input_data,
                "error": str(e),
                "success": False,
            })
            raise AgentError(f"Agent {self.name} execution failed: {e}") from e

    def __str__(self) -> str:
        return f"{self.__class__.__name__}(name={self.name}, role={self.role})"

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(id={self.id}, name={self.name}, role={self.role})"


class BaseGraph(ABC):
    """Abstract base class for execution graphs."""

    def __init__(self, name: str, **kwargs):
        self.id = str(uuid.uuid4())
        self.name = name
        self.nodes: Dict[str, Any] = {}
        self.edges: List[Dict[str, str]] = []
        self.state: ConversationState = ConversationState()
        self._is_built = False

    @abstractmethod
    def build(self) -> None:
        """Build the graph structure."""
        pass

    @abstractmethod
    async def execute(
        self,
        input_data: Dict[str, Any],
        config: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Execute the graph."""
        pass

    def add_node(self, node_id: str, node: Any) -> None:
        """Add a node to the graph."""
        if node_id in self.nodes:
            raise GraphError(f"Node {node_id} already exists in graph {self.name}")
        self.nodes[node_id] = node

    def add_edge(self, from_node: str, to_node: str, condition: Optional[str] = None) -> None:
        """Add an edge between nodes."""
        if from_node not in self.nodes:
            raise GraphError(f"Source node {from_node} not found in graph {self.name}")
        if to_node not in self.nodes:
            raise GraphError(f"Target node {to_node} not found in graph {self.name}")

        edge = {"from": from_node, "to": to_node}
        if condition:
            edge["condition"] = condition
        self.edges.append(edge)

    def get_node(self, node_id: str) -> Any:
        """Get a node by ID."""
        if node_id not in self.nodes:
            raise GraphError(f"Node {node_id} not found in graph {self.name}")
        return self.nodes[node_id]

    def is_built(self) -> bool:
        """Check if the graph is built."""
        return self._is_built

    def validate_structure(self) -> None:
        """Validate the graph structure."""
        if not self.nodes:
            raise GraphError(f"Graph {self.name} has no nodes")

        # Check for cycles (basic validation)
        visited = set()
        recursion_stack = set()

        def has_cycle(node_id: str) -> bool:
            visited.add(node_id)
            recursion_stack.add(node_id)

            for edge in self.edges:
                if edge["from"] == node_id:
                    next_node = edge["to"]
                    if next_node not in visited:
                        if has_cycle(next_node):
                            return True
                    elif next_node in recursion_stack:
                        return True

            recursion_stack.remove(node_id)
            return False

        for node_id in self.nodes:
            if node_id not in visited:
                if has_cycle(node_id):
                    raise GraphError(f"Graph {self.name} contains cycles")

    def __str__(self) -> str:
        return f"{self.__class__.__name__}(name={self.name}, nodes={len(self.nodes)})"

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(id={self.id}, name={self.name}, nodes={len(self.nodes)})"


class BaseMemory(ABC):
    """Abstract base class for memory systems."""

    def __init__(self, **kwargs):
        self.id = str(uuid.uuid4())
        self._is_initialized = False

    @abstractmethod
    async def initialize(self) -> None:
        """Initialize the memory system."""
        pass

    @abstractmethod
    async def store(
        self,
        key: str,
        value: Any,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> bool:
        """Store a value in memory."""
        pass

    @abstractmethod
    async def retrieve(
        self,
        query: str,
        limit: int = 10,
        **kwargs,
    ) -> List[Dict[str, Any]]:
        """Retrieve values from memory."""
        pass

    @abstractmethod
    async def delete(self, key: str) -> bool:
        """Delete a value from memory."""
        pass

    @abstractmethod
    async def clear(self) -> bool:
        """Clear all memory."""
        pass

    @abstractmethod
    async def search(
        self,
        query: str,
        filters: Optional[Dict[str, Any]] = None,
        limit: int = 10,
    ) -> List[Dict[str, Any]]:
        """Search memory with filters."""
        pass

    def is_initialized(self) -> bool:
        """Check if memory is initialized."""
        return self._is_initialized

    def __str__(self) -> str:
        return f"{self.__class__.__name__}(id={self.id})"

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(id={self.id}, initialized={self._is_initialized})"


class BaseAnalyzer(ABC):
    """Abstract base class for code analyzers."""

    def __init__(self, **kwargs):
        self.id = str(uuid.uuid4())
        self.supported_languages: List[str] = []
        self._is_initialized = False

    @abstractmethod
    async def initialize(self) -> None:
        """Initialize the analyzer."""
        pass

    @abstractmethod
    async def analyze(
        self,
        code: str,
        language: str,
        file_path: Optional[str] = None,
        **kwargs,
    ) -> Dict[str, Any]:
        """Analyze code and return results."""
        pass

    @abstractmethod
    def supports_language(self, language: str) -> bool:
        """Check if the analyzer supports a language."""
        pass

    @abstractmethod
    async def extract_ast(
        self,
        code: str,
        language: str,
    ) -> Dict[str, Any]:
        """Extract AST from code."""
        pass

    @abstractmethod
    async def chunk_code(
        self,
        code: str,
        chunk_size: int = 1000,
        overlap: int = 200,
    ) -> List[str]:
        """Chunk code into smaller pieces."""
        pass

    def is_initialized(self) -> bool:
        """Check if analyzer is initialized."""
        return self._is_initialized

    def get_supported_languages(self) -> List[str]:
        """Get list of supported languages."""
        return self.supported_languages.copy()

    def __str__(self) -> str:
        return f"{self.__class__.__name__}(languages={len(self.supported_languages)})"

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(id={self.id}, languages={self.supported_languages})"


class BaseCallbackHandler(BaseCallbackHandler):
    """Base callback handler for monitoring and logging."""

    def __init__(self, **kwargs):
        super().__init__()
        self.id = str(uuid.uuid4())
        self.events: List[Dict[str, Any]] = []

    def on_chain_start(self, serialized: Dict[str, Any], inputs: Dict[str, Any], **kwargs) -> None:
        """Called when a chain starts."""
        self.events.append({
            "type": "chain_start",
            "serialized": serialized,
            "inputs": inputs,
            "timestamp": self._get_timestamp(),
            **kwargs,
        })

    def on_chain_end(self, outputs: Dict[str, Any], **kwargs) -> None:
        """Called when a chain ends."""
        self.events.append({
            "type": "chain_end",
            "outputs": outputs,
            "timestamp": self._get_timestamp(),
            **kwargs,
        })

    def on_chain_error(self, error: Exception, **kwargs) -> None:
        """Called when a chain errors."""
        self.events.append({
            "type": "chain_error",
            "error": str(error),
            "timestamp": self._get_timestamp(),
            **kwargs,
        })

    def on_llm_start(self, serialized: Dict[str, Any], prompts: List[str], **kwargs) -> None:
        """Called when LLM starts."""
        self.events.append({
            "type": "llm_start",
            "serialized": serialized,
            "prompts": prompts,
            "timestamp": self._get_timestamp(),
            **kwargs,
        })

    def on_llm_end(self, response: Any, **kwargs) -> None:
        """Called when LLM ends."""
        self.events.append({
            "type": "llm_end",
            "response": str(response),
            "timestamp": self._get_timestamp(),
            **kwargs,
        })

    def on_llm_error(self, error: Exception, **kwargs) -> None:
        """Called when LLM errors."""
        self.events.append({
            "type": "llm_error",
            "error": str(error),
            "timestamp": self._get_timestamp(),
            **kwargs,
        })

    def get_events(self) -> List[Dict[str, Any]]:
        """Get all recorded events."""
        return self.events.copy()

    def clear_events(self) -> None:
        """Clear all recorded events."""
        self.events.clear()

    def _get_timestamp(self) -> str:
        """Get current timestamp."""
        from datetime import datetime
        return datetime.utcnow().isoformat()

    def __str__(self) -> str:
        return f"{self.__class__.__name__}(events={len(self.events)})"

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(id={self.id}, events={len(self.events)})"