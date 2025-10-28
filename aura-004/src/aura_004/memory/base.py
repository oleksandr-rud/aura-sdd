"""
Base memory implementation for AURA-004.

This module provides the abstract base class for all memory implementations,
defining the common interface and core functionality.
"""

import asyncio
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, Union
from datetime import datetime

from pydantic import BaseModel, Field

from aura_004.core.base import BaseMemory as BaseMemoryComponent
from aura_004.core.exceptions import MemoryError


class MemoryEntry(BaseModel):
    """Schema for memory entries."""

    id: str
    content: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    embedding: Optional[List[float]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    access_count: int = Field(default=0)
    last_accessed: Optional[datetime] = None
    tags: List[str] = Field(default_factory=list)
    source: Optional[str] = None
    relevance_score: float = Field(default=0.0)

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat(),
        }

    def update_access(self) -> None:
        """Update access metadata."""
        self.access_count += 1
        self.last_accessed = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def add_tag(self, tag: str) -> None:
        """Add a tag to the entry."""
        if tag not in self.tags:
            self.tags.append(tag)

    def remove_tag(self, tag: str) -> None:
        """Remove a tag from the entry."""
        if tag in self.tags:
            self.tags.remove(tag)


class MemoryQuery(BaseModel):
    """Schema for memory queries."""

    query: str
    filters: Dict[str, Any] = Field(default_factory=dict)
    limit: int = Field(default=10, ge=1, le=100)
    threshold: float = Field(default=0.7, ge=0.0, le=1.0)
    include_metadata: bool = Field(default=True)
    include_content: bool = Field(default=True)
    tags: Optional[List[str]] = None
    date_range: Optional[Dict[str, datetime]] = None
    sort_by: str = Field(default="relevance_score")
    sort_order: str = Field(default="desc")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat(),
        }


class MemoryResult(BaseModel):
    """Schema for memory query results."""

    entries: List[MemoryEntry]
    total_count: int
    query_time: float
    has_more: bool
    query_metadata: Dict[str, Any] = Field(default_factory=dict)

    def get_top_entries(self, n: int) -> List[MemoryEntry]:
        """Get top n entries by relevance."""
        return self.entries[:n]

    def filter_by_tags(self, tags: List[str]) -> "MemoryResult":
        """Filter results by tags."""
        filtered_entries = [
            entry for entry in self.entries
            if any(tag in entry.tags for tag in tags)
        ]
        return MemoryResult(
            entries=filtered_entries,
            total_count=len(filtered_entries),
            query_time=self.query_time,
            has_more=False,
            query_metadata={**self.query_metadata, "filtered": True},
        )


class BaseMemory(BaseMemoryComponent):
    """Enhanced base class for memory implementations."""

    def __init__(
        self,
        collection_name: str = "default",
        embedding_dim: int = 384,
        **kwargs,
    ):
        super().__init__(**kwargs)
        self.collection_name = collection_name
        self.embedding_dim = embedding_dim
        self._stats = {
            "total_entries": 0,
            "total_queries": 0,
            "total_store_time": 0.0,
            "total_query_time": 0.0,
        }

    @abstractmethod
    async def store_entry(self, entry: MemoryEntry) -> bool:
        """Store a memory entry."""
        pass

    @abstractmethod
    async def get_entry(self, entry_id: str) -> Optional[MemoryEntry]:
        """Get a memory entry by ID."""
        pass

    @abstractmethod
    async def update_entry(self, entry_id: str, updates: Dict[str, Any]) -> bool:
        """Update a memory entry."""
        pass

    @abstractmethod
    async def delete_entry(self, entry_id: str) -> bool:
        """Delete a memory entry."""
        pass

    @abstractmethod
    async def list_entries(
        self,
        limit: int = 100,
        offset: int = 0,
        filters: Optional[Dict[str, Any]] = None,
    ) -> List[MemoryEntry]:
        """List memory entries with pagination."""
        pass

    @abstractmethod
    async def search_by_metadata(
        self,
        filters: Dict[str, Any],
        limit: int = 10,
    ) -> List[MemoryEntry]:
        """Search entries by metadata."""
        pass

    async def store(
        self,
        key: str,
        value: Any,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> bool:
        """Store a value in memory (backward compatibility)."""
        if isinstance(value, str):
            entry = MemoryEntry(
                id=key,
                content=value,
                metadata=metadata or {},
            )
            return await self.store_entry(entry)
        else:
            # For non-string values, serialize to JSON
            import json
            entry = MemoryEntry(
                id=key,
                content=json.dumps(value),
                metadata={**(metadata or {}), "serialized": True},
            )
            return await self.store_entry(entry)

    async def retrieve(
        self,
        query: str,
        limit: int = 10,
        **kwargs,
    ) -> List[Dict[str, Any]]:
        """Retrieve values from memory (backward compatibility)."""
        memory_query = MemoryQuery(
            query=query,
            limit=limit,
            **kwargs,
        )
        result = await self.query(memory_query)
        return [entry.model_dump() for entry in result.entries]

    async def query(self, query: MemoryQuery) -> MemoryResult:
        """Query memory with advanced options."""
        start_time = asyncio.get_event_loop().time()
        try:
            result = await self._execute_query(query)
            query_time = asyncio.get_event_loop().time() - start_time

            # Update stats
            self._stats["total_queries"] += 1
            self._stats["total_query_time"] += query_time

            return result

        except Exception as e:
            raise MemoryError(f"Query execution failed: {e}") from e

    @abstractmethod
    async def _execute_query(self, query: MemoryQuery) -> MemoryResult:
        """Execute the actual query implementation."""
        pass

    async def get_stats(self) -> Dict[str, Any]:
        """Get memory statistics."""
        return {
            **self._stats,
            "collection_name": self.collection_name,
            "embedding_dim": self.embedding_dim,
            "is_initialized": self._is_initialized,
            "avg_query_time": (
                self._stats["total_query_time"] / self._stats["total_queries"]
                if self._stats["total_queries"] > 0 else 0.0
            ),
            "avg_store_time": (
                self._stats["total_store_time"] / self._stats["total_entries"]
                if self._stats["total_entries"] > 0 else 0.0
            ),
        }

    async def reset_stats(self) -> None:
        """Reset memory statistics."""
        self._stats = {
            "total_entries": 0,
            "total_queries": 0,
            "total_store_time": 0.0,
            "total_query_time": 0.0,
        }

    def _validate_entry(self, entry: MemoryEntry) -> None:
        """Validate a memory entry."""
        if not entry.content:
            raise MemoryError("Memory entry content cannot be empty")
        if not entry.id:
            raise MemoryError("Memory entry ID cannot be empty")

    def _validate_query(self, query: MemoryQuery) -> None:
        """Validate a memory query."""
        if not query.query:
            raise MemoryError("Query string cannot be empty")
        if query.limit <= 0:
            raise MemoryError("Query limit must be positive")
        if not (0.0 <= query.threshold <= 1.0):
            raise MemoryError("Query threshold must be between 0.0 and 1.0")


class MemoryManager:
    """Manager for multiple memory instances."""

    def __init__(self):
        self.memories: Dict[str, BaseMemory] = {}
        self.default_memory: Optional[str] = None

    def add_memory(self, name: str, memory: BaseMemory, is_default: bool = False) -> None:
        """Add a memory instance."""
        self.memories[name] = memory
        if is_default or self.default_memory is None:
            self.default_memory = name

    def get_memory(self, name: Optional[str] = None) -> BaseMemory:
        """Get a memory instance."""
        memory_name = name or self.default_memory
        if memory_name not in self.memories:
            raise MemoryError(f"Memory '{memory_name}' not found")
        return self.memories[memory_name]

    def remove_memory(self, name: str) -> None:
        """Remove a memory instance."""
        if name not in self.memories:
            raise MemoryError(f"Memory '{name}' not found")
        del self.memories[name]
        if self.default_memory == name:
            self.default_memory = next(iter(self.memories.keys()), None)

    async def initialize_all(self) -> None:
        """Initialize all memory instances."""
        for memory in self.memories.values():
            if not memory.is_initialized():
                await memory.initialize()

    async def close_all(self) -> None:
        """Close all memory instances."""
        for memory in self.memories.values():
            if hasattr(memory, 'close'):
                await memory.close()

    def list_memories(self) -> List[str]:
        """List all memory names."""
        return list(self.memories.keys())

    def get_default_memory(self) -> Optional[BaseMemory]:
        """Get the default memory instance."""
        if self.default_memory:
            return self.memories[self.default_memory]
        return None

    async def get_all_stats(self) -> Dict[str, Dict[str, Any]]:
        """Get statistics for all memory instances."""
        stats = {}
        for name, memory in self.memories.items():
            stats[name] = await memory.get_stats()
        return stats