"""
State management schemas for AURA-004.

This module defines the core state schemas used throughout the system,
including conversation state, agent state, memory state, and task state.
Built with Pydantic for type safety and validation.
"""

import datetime
import uuid
from enum import Enum
from typing import Any, Dict, List, Optional, Union

from pydantic import BaseModel, Field, validator
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage

from aura_004.core.exceptions import StateError


class AgentRole(str, Enum):
    """Enumeration of agent roles in the system."""

    ARCHITECT = "architect"
    PRODUCT_OPS = "product_ops"
    TECH_LEAD = "tech_lead"
    QA = "qa"
    CODING = "coding"
    ANALYSIS = "analysis"
    COORDINATION = "coordination"


class TaskStatus(str, Enum):
    """Enumeration of task statuses."""

    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    BLOCKED = "blocked"


class MessageRole(str, Enum):
    """Enumeration of message roles."""

    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"
    TOOL = "tool"


class Priority(str, Enum):
    """Enumeration of task priorities."""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class MessageState(BaseModel):
    """State for individual messages in conversations."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    role: MessageRole
    content: str
    timestamp: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    token_count: Optional[int] = None
    parent_id: Optional[str] = None
    children_ids: List[str] = Field(default_factory=list)

    class Config:
        use_enum_values = True
        json_encoders = {
            datetime.datetime: lambda v: v.isoformat(),
        }

    def add_child(self, child_id: str) -> None:
        """Add a child message ID."""
        if child_id not in self.children_ids:
            self.children_ids.append(child_id)

    def to_langchain_message(self) -> BaseMessage:
        """Convert to LangChain message format."""
        if self.role == MessageRole.USER:
            return HumanMessage(content=self.content)
        elif self.role == MessageRole.ASSISTANT:
            return AIMessage(content=self.content)
        elif self.role == MessageRole.SYSTEM:
            return SystemMessage(content=self.content)
        else:
            raise StateError(f"Unsupported message role: {self.role}")

    @classmethod
    def from_langchain_message(cls, message: BaseMessage) -> "MessageState":
        """Create from LangChain message format."""
        if isinstance(message, HumanMessage):
            role = MessageRole.USER
        elif isinstance(message, AIMessage):
            role = MessageRole.ASSISTANT
        elif isinstance(message, SystemMessage):
            role = MessageRole.SYSTEM
        else:
            raise StateError(f"Unsupported message type: {type(message)}")

        return cls(
            role=role,
            content=message.content,
            metadata=message.additional_kwargs or {},
        )


class TaskState(BaseModel):
    """State for tracking tasks and their execution."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    status: TaskStatus = TaskStatus.PENDING
    priority: Priority = Priority.MEDIUM
    assigned_agent: Optional[str] = None
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    started_at: Optional[datetime.datetime] = None
    completed_at: Optional[datetime.datetime] = None
    deadline: Optional[datetime.datetime] = None

    # Task metadata
    tags: List[str] = Field(default_factory=list)
    dependencies: List[str] = Field(default_factory=list)
    subtasks: List[str] = Field(default_factory=list)
    parent_task: Optional[str] = None

    # Execution details
    input_data: Dict[str, Any] = Field(default_factory=dict)
    output_data: Dict[str, Any] = Field(default_factory=dict)
    error_message: Optional[str] = None
    progress: float = Field(default=0.0, ge=0.0, le=1.0)

    class Config:
        use_enum_values = True
        json_encoders = {
            datetime.datetime: lambda v: v.isoformat(),
        }

    @validator("progress")
    def validate_progress(cls, v, values):
        """Validate progress based on status."""
        status = values.get("status")
        if status == TaskStatus.COMPLETED and v != 1.0:
            raise ValueError("Completed tasks must have progress of 1.0")
        if status == TaskStatus.FAILED and v != 0.0:
            raise ValueError("Failed tasks must have progress of 0.0")
        return v

    def start(self) -> None:
        """Mark task as started."""
        self.status = TaskStatus.IN_PROGRESS
        self.started_at = datetime.datetime.utcnow()
        self.updated_at = datetime.datetime.utcnow()

    def complete(self, output_data: Optional[Dict[str, Any]] = None) -> None:
        """Mark task as completed."""
        self.status = TaskStatus.COMPLETED
        self.completed_at = datetime.datetime.utcnow()
        self.updated_at = datetime.datetime.utcnow()
        self.progress = 1.0
        if output_data:
            self.output_data.update(output_data)

    def fail(self, error_message: str) -> None:
        """Mark task as failed."""
        self.status = TaskStatus.FAILED
        self.error_message = error_message
        self.updated_at = datetime.datetime.utcnow()
        self.progress = 0.0

    def update_progress(self, progress: float) -> None:
        """Update task progress."""
        self.progress = max(0.0, min(1.0, progress))
        self.updated_at = datetime.datetime.utcnow()


class MemoryState(BaseModel):
    """State for memory management and context retrieval."""

    # Memory collections
    working_memory: Dict[str, Any] = Field(default_factory=dict)
    long_term_memory: Dict[str, Any] = Field(default_factory=dict)
    episodic_memory: List[Dict[str, Any]] = Field(default_factory=list)
    semantic_memory: Dict[str, Any] = Field(default_factory=dict)

    # Memory metadata
    last_access: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    access_count: int = Field(default=0)
    memory_size: int = Field(default=0)  # in bytes

    # Retrieval configuration
    retrieval_threshold: float = Field(default=0.7)
    max_retrieval_results: int = Field(default=10)

    def update_access(self) -> None:
        """Update access metadata."""
        self.last_access = datetime.datetime.utcnow()
        self.access_count += 1

    def add_episodic_memory(self, memory: Dict[str, Any]) -> None:
        """Add episodic memory entry."""
        self.episodic_memory.append({
            **memory,
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "id": str(uuid.uuid4()),
        })
        self.update_access()

    def get_working_memory(self, key: str, default: Any = None) -> Any:
        """Get value from working memory."""
        self.update_access()
        return self.working_memory.get(key, default)

    def set_working_memory(self, key: str, value: Any) -> None:
        """Set value in working memory."""
        self.working_memory[key] = value
        self.update_access()


class AgentState(BaseModel):
    """State for individual agents in the system."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: AgentRole
    status: str = Field(default="idle")
    current_task: Optional[str] = None
    capabilities: List[str] = Field(default_factory=list)

    # Agent configuration
    model: str = Field(default="gpt-4o-mini")
    temperature: float = Field(default=0.1)
    max_tokens: int = Field(default=4096)

    # Execution state
    iteration_count: int = Field(default=0)
    max_iterations: int = Field(default=10)
    last_activity: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    execution_history: List[Dict[str, Any]] = Field(default_factory=list)

    # Agent memory and context
    memory: MemoryState = Field(default_factory=MemoryState)
    context: Dict[str, Any] = Field(default_factory=dict)

    class Config:
        use_enum_values = True
        json_encoders = {
            datetime.datetime: lambda v: v.isoformat(),
        }

    def start_task(self, task_id: str) -> None:
        """Start a new task."""
        self.current_task = task_id
        self.status = "working"
        self.iteration_count = 0
        self.last_activity = datetime.datetime.utcnow()

    def complete_task(self) -> None:
        """Complete the current task."""
        self.current_task = None
        self.status = "idle"
        self.last_activity = datetime.datetime.utcnow()

    def increment_iteration(self) -> None:
        """Increment iteration counter."""
        self.iteration_count += 1
        self.last_activity = datetime.datetime.utcnow()

    def add_execution_record(self, record: Dict[str, Any]) -> None:
        """Add execution record to history."""
        self.execution_history.append({
            **record,
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "iteration": self.iteration_count,
        })

    def is_max_iterations_reached(self) -> bool:
        """Check if maximum iterations reached."""
        return self.iteration_count >= self.max_iterations


class ConversationState(BaseModel):
    """Main state for conversation management."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: Optional[str] = None
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

    # Messages and conversation flow
    messages: List[MessageState] = Field(default_factory=list)
    current_message_id: Optional[str] = None
    message_count: int = Field(default=0)

    # Task management
    tasks: List[TaskState] = Field(default_factory=list)
    active_tasks: List[str] = Field(default_factory=list)
    completed_tasks: List[str] = Field(default_factory=list)

    # Agent management
    agents: Dict[str, AgentState] = Field(default_factory=dict)
    active_agent: Optional[str] = None
    agent_history: List[Dict[str, Any]] = Field(default_factory=list)

    # Conversation metadata
    tags: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    status: str = Field(default="active")

    # Performance metrics
    total_tokens: int = Field(default=0)
    total_cost: float = Field(default=0.0)
    execution_time: float = Field(default=0.0)

    class Config:
        use_enum_values = True
        json_encoders = {
            datetime.datetime: lambda v: v.isoformat(),
        }

    def add_message(self, message: MessageState) -> None:
        """Add a message to the conversation."""
        self.messages.append(message)
        self.current_message_id = message.id
        self.message_count += 1
        self.updated_at = datetime.datetime.utcnow()

        # Update token count
        if message.token_count:
            self.total_tokens += message.token_count

    def get_last_message(self) -> Optional[MessageState]:
        """Get the last message in the conversation."""
        return self.messages[-1] if self.messages else None

    def get_messages_by_role(self, role: MessageRole) -> List[MessageState]:
        """Get all messages by role."""
        return [msg for msg in self.messages if msg.role == role]

    def add_task(self, task: TaskState) -> None:
        """Add a task to the conversation."""
        self.tasks.append(task)
        self.updated_at = datetime.datetime.utcnow()

    def get_task(self, task_id: str) -> Optional[TaskState]:
        """Get a task by ID."""
        for task in self.tasks:
            if task.id == task_id:
                return task
        return None

    def add_agent(self, agent: AgentState) -> None:
        """Add an agent to the conversation."""
        self.agents[agent.id] = agent
        self.updated_at = datetime.datetime.utcnow()

    def get_active_tasks(self) -> List[TaskState]:
        """Get all active tasks."""
        return [task for task in self.tasks if task.status == TaskStatus.IN_PROGRESS]

    def update_metrics(self, tokens: int, cost: float, execution_time: float) -> None:
        """Update performance metrics."""
        self.total_tokens += tokens
        self.total_cost += cost
        self.execution_time += execution_time
        self.updated_at = datetime.datetime.utcnow()


# Type aliases for convenience
StateDict = Dict[str, Any]
MessageDict = Dict[str, Any]
TaskDict = Dict[str, Any]
AgentDict = Dict[str, Any]