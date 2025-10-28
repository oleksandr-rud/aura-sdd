"""
Basic tests for AURA-004 core functionality.

These tests verify the fundamental components and their integration.
"""

import pytest
import asyncio
from unittest.mock import Mock, patch

from aura_004.core.state import (
    ConversationState,
    AgentState,
    MessageState,
    TaskState,
    MessageRole,
    TaskStatus,
    AgentRole,
)
from aura_004.core.config import Settings, get_settings
from aura_004.core.exceptions import AuraError, StateError


class TestConversationState:
    """Test conversation state management."""

    def test_conversation_creation(self):
        """Test creating a new conversation."""
        conv = ConversationState(title="Test Conversation")

        assert conv.title == "Test Conversation"
        assert conv.message_count == 0
        assert len(conv.messages) == 0
        assert conv.status == "active"

    def test_add_message(self):
        """Test adding messages to conversation."""
        conv = ConversationState()

        # Add user message
        user_msg = MessageState(role=MessageRole.USER, content="Hello")
        conv.add_message(user_msg)

        assert conv.message_count == 1
        assert conv.get_last_message() == user_msg
        assert conv.current_message_id == user_msg.id

        # Add assistant message
        assistant_msg = MessageState(role=MessageRole.ASSISTANT, content="Hi there!")
        conv.add_message(assistant_msg)

        assert conv.message_count == 2
        assert conv.get_last_message() == assistant_msg

    def test_get_messages_by_role(self):
        """Test filtering messages by role."""
        conv = ConversationState()

        # Add messages
        conv.add_message(MessageState(role=MessageRole.USER, content="Hello"))
        conv.add_message(MessageState(role=MessageRole.ASSISTANT, content="Hi"))
        conv.add_message(MessageState(role=MessageRole.USER, content="How are you?"))

        user_messages = conv.get_messages_by_role(MessageRole.USER)
        assistant_messages = conv.get_messages_by_role(MessageRole.ASSISTANT)

        assert len(user_messages) == 2
        assert len(assistant_messages) == 1
        assert user_messages[0].content == "Hello"

    def test_task_management(self):
        """Test task management in conversation."""
        conv = ConversationState()

        # Add task
        task = TaskState(
            title="Analyze code",
            description="Analyze the provided Python code",
        )
        conv.add_task(task)

        assert len(conv.tasks) == 1
        assert conv.get_task(task.id) == task

        # Update task
        task.start()
        updated_task = conv.get_task(task.id)
        assert updated_task.status == TaskStatus.IN_PROGRESS

    def test_agent_management(self):
        """Test agent management in conversation."""
        conv = ConversationState()

        # Add agent
        agent = AgentState(name="analyzer", role=AgentRole.ANALYSIS)
        conv.add_agent(agent)

        assert len(conv.agents) == 1
        assert "analyzer" in conv.agents

        # Set active agent
        conv.active_agent = agent.id
        assert conv.active_agent == agent.id


class TestMessageState:
    """Test message state management."""

    def test_message_creation(self):
        """Test creating a message."""
        msg = MessageState(role=MessageRole.USER, content="Hello, world!")

        assert msg.role == MessageRole.USER
        assert msg.content == "Hello, world!"
        assert msg.token_count is None
        assert len(msg.children_ids) == 0

    def test_message_hierarchy(self):
        """Test message parent-child relationships."""
        parent = MessageState(role=MessageRole.USER, content="Parent")
        child1 = MessageState(role=MessageRole.ASSISTANT, content="Child 1")
        child2 = MessageState(role=MessageRole.ASSISTANT, content="Child 2")

        # Link messages
        child1.parent_id = parent.id
        child2.parent_id = parent.id
        parent.add_child(child1.id)
        parent.add_child(child2.id)

        assert len(parent.children_ids) == 2
        assert child1.id in parent.children_ids
        assert child2.id in parent.children_ids

    def test_message_to_langchain(self):
        """Test converting to LangChain message format."""
        from langchain_core.messages import HumanMessage, AIMessage

        user_msg = MessageState(role=MessageRole.USER, content="Hello")
        lc_msg = user_msg.to_langchain_message()

        assert isinstance(lc_msg, HumanMessage)
        assert lc_msg.content == "Hello"

        assistant_msg = MessageState(role=MessageRole.ASSISTANT, content="Hi there!")
        lc_msg = assistant_msg.to_langchain_message()

        assert isinstance(lc_msg, AIMessage)
        assert lc_msg.content == "Hi there!"


class TestTaskState:
    """Test task state management."""

    def test_task_creation(self):
        """Test creating a task."""
        task = TaskState(
            title="Test Task",
            description="A test task",
            priority="medium",
        )

        assert task.title == "Test Task"
        assert task.description == "A test task"
        assert task.status == TaskStatus.PENDING
        assert task.progress == 0.0

    def test_task_lifecycle(self):
        """Test task lifecycle states."""
        task = TaskState(title="Lifecycle Test")

        # Start task
        task.start()
        assert task.status == TaskStatus.IN_PROGRESS
        assert task.started_at is not None

        # Update progress
        task.update_progress(0.5)
        assert task.progress == 0.5

        # Complete task
        task.complete({"result": "success"})
        assert task.status == TaskStatus.COMPLETED
        assert task.progress == 1.0
        assert task.completed_at is not None
        assert task.output_data["result"] == "success"

        # Fail task
        failed_task = TaskState(title="Failed Test")
        failed_task.fail("Something went wrong")
        assert failed_task.status == TaskStatus.FAILED
        assert failed_task.error_message == "Something went wrong"
        assert failed_task.progress == 0.0

    def test_task_dependencies(self):
        """Test task dependencies."""
        task1 = TaskState(title="Task 1")
        task2 = TaskState(title="Task 2")
        task3 = TaskState(title="Task 3")

        # Set up dependencies
        task2.dependencies = [task1.id]
        task3.dependencies = [task1.id, task2.id]

        assert len(task2.dependencies) == 1
        assert task1.id in task2.dependencies
        assert len(task3.dependencies) == 2


class TestAgentState:
    """Test agent state management."""

    def test_agent_creation(self):
        """Test creating an agent."""
        agent = AgentState(
            name="test_agent",
            role=AgentRole.ANALYSIS,
            model="gpt-4",
        )

        assert agent.name == "test_agent"
        assert agent.role == AgentRole.ANALYSIS
        assert agent.model == "gpt-4"
        assert agent.status == "idle"
        assert agent.iteration_count == 0

    def test_agent_task_execution(self):
        """Test agent task execution tracking."""
        agent = AgentState(name="executor", role=AgentRole.CODING)

        # Start task
        task_id = "task_123"
        agent.start_task(task_id)

        assert agent.current_task == task_id
        assert agent.status == "working"

        # Increment iteration
        agent.increment_iteration()
        assert agent.iteration_count == 1

        # Complete task
        agent.complete_task()
        assert agent.current_task is None
        assert agent.status == "idle"

    def test_agent_execution_history(self):
        """Test agent execution history tracking."""
        agent = AgentState(name="historian", role=AgentRole.QA)

        # Add execution record
        record = {
            "input": {"test": "data"},
            "output": {"result": "success"},
            "duration": 1.5,
        }
        agent.add_execution_record(record)

        assert len(agent.execution_history) == 1
        assert agent.execution_history[0]["iteration"] == 0
        assert "timestamp" in agent.execution_history[0]

    def test_agent_memory(self):
        """Test agent memory management."""
        agent = AgentState(name="memory_agent", role=AgentRole.PRODUCT_OPS)

        # Set working memory
        agent.memory.set_working_memory("context", "analysis_session")
        assert agent.memory.get_working_memory("context") == "analysis_session"

        # Add episodic memory
        agent.memory.add_episodic_memory({
            "event": "code_review",
            "outcome": "approved",
        })

        assert len(agent.memory.episodic_memory) == 1


class TestSettings:
    """Test configuration settings."""

    def test_default_settings(self):
        """Test default settings values."""
        settings = Settings()

        assert settings.environment == "development"
        assert settings.debug is False
        assert settings.max_workers == 4
        assert settings.timeout == 30

    def test_settings_validation(self):
        """Test settings validation."""
        # Valid environment
        settings = Settings(environment="production")
        assert settings.environment == "production"

        # Invalid environment should raise error
        with pytest.raises(ValueError):
            Settings(environment="invalid_env")

    def test_settings_paths(self):
        """Test settings path utilities."""
        settings = Settings(data_dir="./test_data")

        data_path = settings.get_data_path()
        log_path = settings.get_log_path()
        cache_path = settings.get_cache_path()

        assert data_path.name == "test_data"
        assert log_path.name == "logs"
        assert cache_path.name == "cache"


class TestExceptions:
    """Test custom exceptions."""

    def test_aura_error_creation(self):
        """Test AuraError creation and serialization."""
        error = AuraError(
            message="Test error",
            error_code="TEST_ERROR",
            context={"key": "value"},
        )

        assert str(error) == "[TEST_ERROR] Test error | Context: {'key': 'value'}"
        assert error.error_code == "TEST_ERROR"
        assert error.context["key"] == "value"

        # Test serialization
        error_dict = error.to_dict()
        assert error_dict["error_type"] == "AuraError"
        assert error_dict["message"] == "Test error"
        assert error_dict["error_code"] == "TEST_ERROR"

    def test_state_error(self):
        """Test StateError specifics."""
        error = StateError(
            message="Invalid state",
            state_type="conversation",
            state_id="conv_123",
        )

        assert "conversation" in str(error)
        assert "conv_123" in error.context

    def test_error_deserialization(self):
        """Test error deserialization."""
        error_data = {
            "error_type": "AuraError",
            "message": "Deserialized error",
            "error_code": "DESER_ERROR",
            "context": {"test": True},
        }

        from aura_004.core.exceptions import deserialize_error
        error = deserialize_error(error_data)

        assert isinstance(error, AuraError)
        assert error.message == "Deserialized error"
        assert error.error_code == "DESER_ERROR"


@pytest.mark.asyncio
class TestAsyncFunctionality:
    """Test async functionality."""

    async def test_async_state_updates(self):
        """Test async state updates."""
        conv = ConversationState()

        # Simulate async message addition
        async def add_messages():
            for i in range(3):
                msg = MessageState(
                    role=MessageRole.USER,
                    content=f"Message {i}"
                )
                conv.add_message(msg)
                await asyncio.sleep(0.01)  # Simulate async work

        await add_messages()
        assert conv.message_count == 3

    async def test_concurrent_agent_operations(self):
        """Test concurrent agent operations."""
        agent = AgentState(name="concurrent_agent", role=AgentRole.TECH_LEAD)

        async def simulate_work():
            agent.start_task("task_1")
            await asyncio.sleep(0.01)
            agent.increment_iteration()
            await asyncio.sleep(0.01)
            agent.complete_task()

        # Run concurrent operations
        tasks = [simulate_work() for _ in range(3)]
        await asyncio.gather(*tasks)

        # Agent should be idle after all tasks complete
        assert agent.status == "idle"
        assert agent.current_task is None


class TestIntegration:
    """Integration tests for multiple components."""

    def test_conversation_with_agents_and_tasks(self):
        """Test integration of conversation, agents, and tasks."""
        # Create conversation
        conv = ConversationState(title="Integration Test")

        # Add agent
        agent = AgentState(name="integration_agent", role=AgentRole.COORDINATION)
        conv.add_agent(agent)

        # Add task and assign to agent
        task = TaskState(
            title="Integration Task",
            description="Test integration components",
        )
        conv.add_task(task)
        task.assigned_agent = agent.id

        # Add messages
        conv.add_message(MessageState(
            role=MessageRole.USER,
            content="Start integration test"
        ))

        # Verify integration
        assert len(conv.agents) == 1
        assert len(conv.tasks) == 1
        assert conv.message_count == 1
        assert task.assigned_agent == agent.id

    def test_memory_state_integration(self):
        """Test memory integration with agent state."""
        agent = AgentState(name="memory_integration_agent", role=AgentRole.QA)

        # Use agent memory
        agent.memory.set_working_memory("session_id", "session_123")
        agent.memory.add_episodic_memory({
            "action": "code_review",
            "files_reviewed": 5,
        })

        # Verify memory state
        assert agent.memory.get_working_memory("session_id") == "session_123"
        assert len(agent.memory.episodic_memory) == 1
        assert agent.memory.access_count > 0


if __name__ == "__main__":
    pytest.main([__file__])