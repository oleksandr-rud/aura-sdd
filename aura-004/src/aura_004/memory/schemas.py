"""
Memory schemas for AURA-004.

This module defines the data schemas used throughout the memory system,
including entries, queries, results, and metadata structures.
"""

import datetime
from enum import Enum
from typing import Any, Dict, List, Optional, Union
from uuid import UUID, uuid4

from pydantic import BaseModel, Field, validator


class MemoryType(str, Enum):
    """Enumeration of memory types."""

    WORKING = "working"
    LONG_TERM = "long_term"
    EPISODIC = "episodic"
    SEMANTIC = "semantic"
    PROCEDURAL = "procedural"


class EntryStatus(str, Enum):
    """Enumeration of entry statuses."""

    ACTIVE = "active"
    ARCHIVED = "archived"
    DELETED = "deleted"
    PENDING = "pending"


class AccessLevel(str, Enum):
    """Enumeration of access levels."""

    PUBLIC = "public"
    PRIVATE = "private"
    RESTRICTED = "restricted"
    CONFIDENTIAL = "confidential"


class MemoryMetadata(BaseModel):
    """Schema for memory entry metadata."""

    source: Optional[str] = None
    author: Optional[str] = None
    category: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    language: Optional[str] = None
    file_path: Optional[str] = None
    line_number: Optional[int] = None
    function_name: Optional[str] = None
    class_name: Optional[str] = None
    project_name: Optional[str] = None
    version: Optional[str] = None

    # Temporal metadata
    expires_at: Optional[datetime.datetime] = None
    valid_from: Optional[datetime.datetime] = None

    # Quality metadata
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)
    relevance: float = Field(default=1.0, ge=0.0, le=1.0)
    quality_score: float = Field(default=1.0, ge=0.0, le=1.0)

    # Access control
    access_level: AccessLevel = AccessLevel.PUBLIC
    allowed_users: List[str] = Field(default_factory=list)
    allowed_roles: List[str] = Field(default_factory=list)

    # Custom fields
    custom_fields: Dict[str, Any] = Field(default_factory=dict)

    class Config:
        use_enum_values = True
        json_encoders = {
            datetime.datetime: lambda v: v.isoformat(),
        }

    def add_tag(self, tag: str) -> None:
        """Add a tag."""
        if tag not in self.tags:
            self.tags.append(tag)

    def remove_tag(self, tag: str) -> None:
        """Remove a tag."""
        if tag in self.tags:
            self.tags.remove(tag)

    def has_tag(self, tag: str) -> bool:
        """Check if has a tag."""
        return tag in self.tags

    def set_custom_field(self, key: str, value: Any) -> None:
        """Set a custom field."""
        self.custom_fields[key] = value

    def get_custom_field(self, key: str, default: Any = None) -> Any:
        """Get a custom field."""
        return self.custom_fields.get(key, default)


class MemoryEntry(BaseModel):
    """Enhanced schema for memory entries."""

    id: Union[str, UUID] = Field(default_factory=uuid4)
    content: str
    memory_type: MemoryType = MemoryType.WORKING
    status: EntryStatus = EntryStatus.ACTIVE
    metadata: MemoryMetadata = Field(default_factory=MemoryMetadata)

    # Vector representation
    embedding: Optional[List[float]] = None
    embedding_model: Optional[str] = None

    # Temporal information
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    last_accessed: Optional[datetime.datetime] = None
    access_count: int = Field(default=0, ge=0)

    # Relationship information
    parent_id: Optional[Union[str, UUID]] = None
    child_ids: List[Union[str, UUID]] = Field(default_factory=list)
    related_ids: List[Union[str, UUID]] = Field(default_factory=list)

    # Content analysis
    summary: Optional[str] = None
    keywords: List[str] = Field(default_factory=list)
    entities: List[Dict[str, Any]] = Field(default_factory=list)

    # Performance metrics
    retrieval_count: int = Field(default=0, ge=0)
    relevance_history: List[float] = Field(default_factory=list)

    class Config:
        use_enum_values = True
        json_encoders = {
            datetime.datetime: lambda v: v.isoformat(),
            UUID: lambda v: str(v),
        }

    def update_access(self) -> None:
        """Update access information."""
        self.last_accessed = datetime.datetime.utcnow()
        self.access_count += 1
        self.updated_at = datetime.datetime.utcnow()

    def add_child(self, child_id: Union[str, UUID]) -> None:
        """Add a child entry."""
        if child_id not in self.child_ids:
            self.child_ids.append(child_id)

    def remove_child(self, child_id: Union[str, UUID]) -> None:
        """Remove a child entry."""
        if child_id in self.child_ids:
            self.child_ids.remove(child_id)

    def add_related(self, related_id: Union[str, UUID]) -> None:
        """Add a related entry."""
        if related_id not in self.related_ids:
            self.related_ids.append(related_id)

    def remove_related(self, related_id: Union[str, UUID]) -> None:
        """Remove a related entry."""
        if related_id in self.related_ids:
            self.related_ids.remove(related_id)

    def add_keyword(self, keyword: str) -> None:
        """Add a keyword."""
        if keyword not in self.keywords:
            self.keywords.append(keyword)

    def update_relevance(self, relevance: float) -> None:
        """Update relevance score."""
        self.relevance_history.append(relevance)
        # Keep only last 10 scores
        if len(self.relevance_history) > 10:
            self.relevance_history = self.relevance_history[-10:]

    def get_average_relevance(self) -> float:
        """Get average relevance score."""
        if not self.relevance_history:
            return 1.0
        return sum(self.relevance_history) / len(self.relevance_history)

    def is_expired(self) -> bool:
        """Check if entry is expired."""
        if self.metadata.expires_at:
            return datetime.datetime.utcnow() > self.metadata.expires_at
        return False

    def is_valid(self) -> bool:
        """Check if entry is currently valid."""
        if self.metadata.valid_from:
            return datetime.datetime.utcnow() >= self.metadata.valid_from
        return True

    def archive(self) -> None:
        """Archive the entry."""
        self.status = EntryStatus.ARCHIVED
        self.updated_at = datetime.datetime.utcnow()

    def delete(self) -> None:
        """Delete the entry."""
        self.status = EntryStatus.DELETED
        self.updated_at = datetime.datetime.utcnow()


class MemoryQuery(BaseModel):
    """Enhanced schema for memory queries."""

    query: str
    query_type: MemoryType = MemoryType.WORKING
    filters: Dict[str, Any] = Field(default_factory=dict)

    # Retrieval parameters
    limit: int = Field(default=10, ge=1, le=100)
    threshold: float = Field(default=0.7, ge=0.0, le=1.0)
    include_content: bool = Field(default=True)
    include_metadata: bool = Field(default=True)
    include_embedding: bool = Field(default=False)

    # Filtering options
    tags: Optional[List[str]] = None
    categories: Optional[List[str]] = None
    access_levels: Optional[List[AccessLevel]] = None
    date_range: Optional[Dict[str, datetime.datetime]] = None
    sources: Optional[List[str]] = None

    # Sorting options
    sort_by: str = Field(default="relevance")
    sort_order: str = Field(default="desc")

    # Context and preferences
    context: Optional[str] = None
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    preference_boost: Dict[str, float] = Field(default_factory=dict)

    # Advanced options
    rerank: bool = Field(default=False)
    expand_query: bool = Field(default=False)
    max_expansions: int = Field(default=5, ge=1, le=20)

    class Config:
        use_enum_values = True
        json_encoders = {
            datetime.datetime: lambda v: v.isoformat(),
        }

    @validator("sort_by")
    def validate_sort_by(cls, v):
        """Validate sort field."""
        valid_fields = [
            "relevance", "created_at", "updated_at", "access_count",
            "retrieval_count", "quality_score", "confidence", "last_accessed"
        ]
        if v not in valid_fields:
            raise ValueError(f"Sort field must be one of {valid_fields}")
        return v

    @validator("sort_order")
    def validate_sort_order(cls, v):
        """Validate sort order."""
        if v not in ["asc", "desc"]:
            raise ValueError("Sort order must be 'asc' or 'desc'")
        return v

    def add_filter(self, key: str, value: Any) -> None:
        """Add a filter."""
        self.filters[key] = value

    def remove_filter(self, key: str) -> None:
        """Remove a filter."""
        if key in self.filters:
            del self.filters[key]

    def add_tag_filter(self, tag: str) -> None:
        """Add a tag filter."""
        if self.tags is None:
            self.tags = []
        if tag not in self.tags:
            self.tags.append(tag)

    def add_preference_boost(self, category: str, boost: float) -> None:
        """Add a preference boost."""
        self.preference_boost[category] = boost


class MemoryResult(BaseModel):
    """Enhanced schema for memory query results."""

    query_id: Union[str, UUID] = Field(default_factory=uuid4)
    query: str
    entries: List[MemoryEntry] = Field(default_factory=list)

    # Result statistics
    total_count: int = Field(default=0)
    returned_count: int = Field(default=0)
    has_more: bool = Field(default=False)

    # Performance metrics
    query_time: float = Field(default=0.0)
    embedding_time: float = Field(default=0.0)
    search_time: float = Field(default=0.0)
    rerank_time: float = Field(default=0.0)

    # Quality metrics
    avg_relevance: float = Field(default=0.0)
    min_relevance: float = Field(default=0.0)
    max_relevance: float = Field(default=0.0)

    # Metadata
    query_metadata: Dict[str, Any] = Field(default_factory=dict)
    suggestions: List[str] = Field(default_factory=list)
    related_queries: List[str] = Field(default_factory=list)

    class Config:
        json_encoders = {
            UUID: lambda v: str(v),
        }

    def get_top_entries(self, n: int) -> List[MemoryEntry]:
        """Get top n entries."""
        return self.entries[:n]

    def get_entries_by_tag(self, tag: str) -> List[MemoryEntry]:
        """Get entries with a specific tag."""
        return [entry for entry in self.entries if entry.metadata.has_tag(tag)]

    def get_entries_by_category(self, category: str) -> List[MemoryEntry]:
        """Get entries from a specific category."""
        return [
            entry for entry in self.entries
            if entry.metadata.category == category
        ]

    def filter_by_relevance(self, min_relevance: float) -> "MemoryResult":
        """Filter results by minimum relevance."""
        filtered_entries = [
            entry for entry in self.entries
            if entry.metadata.relevance >= min_relevance
        ]
        return MemoryResult(
            query_id=self.query_id,
            query=self.query,
            entries=filtered_entries,
            total_count=len(filtered_entries),
            returned_count=len(filtered_entries),
            has_more=False,
            query_time=self.query_time,
            query_metadata=self.query_metadata,
        )

    def calculate_quality_metrics(self) -> None:
        """Calculate quality metrics for the result."""
        if not self.entries:
            return

        relevances = [entry.metadata.relevance for entry in self.entries]
        self.avg_relevance = sum(relevances) / len(relevances)
        self.min_relevance = min(relevances)
        self.max_relevance = max(relevances)

    def add_suggestion(self, suggestion: str) -> None:
        """Add a query suggestion."""
        if suggestion not in self.suggestions:
            self.suggestions.append(suggestion)

    def add_related_query(self, related_query: str) -> None:
        """Add a related query."""
        if related_query not in self.related_queries:
            self.related_queries.append(related_query)


class ConversationMemory(BaseModel):
    """Schema for conversation-specific memory."""

    conversation_id: Union[str, UUID] = Field(default_factory=uuid4)
    title: Optional[str] = None
    summary: Optional[str] = None

    # Conversation metadata
    participants: List[str] = Field(default_factory=list)
    started_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    ended_at: Optional[datetime.datetime] = None
    message_count: int = Field(default=0)

    # Memory integration
    entry_ids: List[Union[str, UUID]] = Field(default_factory=list)
    context_entries: List[Union[str, UUID]] = Field(default_factory=list)

    # Analytics
    sentiment_score: float = Field(default=0.0, ge=-1.0, le=1.0)
    engagement_score: float = Field(default=0.0, ge=0.0, le=1.0)

    class Config:
        json_encoders = {
            UUID: lambda v: str(v),
            datetime.datetime: lambda v: v.isoformat(),
        }

    def add_entry(self, entry_id: Union[str, UUID]) -> None:
        """Add an entry to the conversation."""
        if entry_id not in self.entry_ids:
            self.entry_ids.append(entry_id)

    def add_context_entry(self, entry_id: Union[str, UUID]) -> None:
        """Add a context entry."""
        if entry_id not in self.context_entries:
            self.context_entries.append(entry_id)

    def end_conversation(self) -> None:
        """End the conversation."""
        self.ended_at = datetime.datetime.utcnow()


class KnowledgeBaseEntry(BaseModel):
    """Schema for knowledge base entries."""

    id: Union[str, UUID] = Field(default_factory=uuid4)
    title: str
    content: str
    summary: str

    # Classification
    domain: str
    topic: str
    subtopic: Optional[str] = None
    difficulty_level: int = Field(default=1, ge=1, le=5)

    # Knowledge graph connections
    prerequisites: List[Union[str, UUID]] = Field(default_factory=list)
    related_concepts: List[Union[str, UUID]] = Field(default_factory=list)
    applications: List[Union[str, UUID]] = Field(default_factory=list)

    # Quality and verification
    verified: bool = Field(default=False)
    verification_date: Optional[datetime.datetime] = None
    verifier: Optional[str] = None
    confidence_score: float = Field(default=1.0, ge=0.0, le=1.0)

    # Temporal information
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    last_reviewed: Optional[datetime.datetime] = None

    # Usage statistics
    usage_count: int = Field(default=0, ge=0)
    helpful_votes: int = Field(default=0, ge=0)
    total_votes: int = Field(default=0, ge=0)

    class Config:
        json_encoders = {
            UUID: lambda v: str(v),
            datetime.datetime: lambda v: v.isoformat(),
        }

    def record_usage(self) -> None:
        """Record usage of this entry."""
        self.usage_count += 1
        self.last_reviewed = datetime.datetime.utcnow()

    def add_vote(self, helpful: bool) -> None:
        """Add a vote for this entry."""
        self.total_votes += 1
        if helpful:
            self.helpful_votes += 1

    def get_helpfulness_score(self) -> float:
        """Get helpfulness score."""
        if self.total_votes == 0:
            return 0.0
        return self.helpful_votes / self.total_votes

    def verify(self, verifier: str) -> None:
        """Mark this entry as verified."""
        self.verified = True
        self.verification_date = datetime.datetime.utcnow()
        self.verifier = verifier

    def update_content(self, content: str, summary: str) -> None:
        """Update the content."""
        self.content = content
        self.summary = summary
        self.updated_at = datetime.datetime.utcnow()
        self.verified = False  # Require re-verification