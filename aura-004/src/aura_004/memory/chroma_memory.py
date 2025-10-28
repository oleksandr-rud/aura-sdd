"""
ChromaDB memory implementation for AURA-004.

This module provides a complete ChromaDB integration for vector storage
and retrieval with advanced features like metadata filtering and
semantic search.
"""

import asyncio
import uuid
from typing import Any, Dict, List, Optional, Union
import json

from chromadb import Collection, Client, PersistentClient
from chromadb.config import Settings as ChromaSettings
from chromadb.utils import embedding_functions

from aura_004.memory.base import BaseMemory, MemoryEntry, MemoryQuery, MemoryResult
from aura_004.memory.embeddings import EmbeddingProvider, EmbeddingProviderFactory
from aura_004.core.exceptions import MemoryError
from aura_004.core.config import get_settings


class ChromaMemory(BaseMemory):
    """ChromaDB-based memory implementation."""

    def __init__(
        self,
        collection_name: str = "aura_memory",
        persist_directory: Optional[str] = None,
        embedding_provider: Optional[EmbeddingProvider] = None,
        distance_metric: str = "cosine",
        **kwargs,
    ):
        super().__init__(
            collection_name=collection_name,
            embedding_dim=kwargs.get("embedding_dim", 384),
            **kwargs,
        )
        self.persist_directory = persist_directory
        self.distance_metric = distance_metric
        self.embedding_provider = embedding_provider
        self._client: Optional[Client] = None
        self._collection: Optional[Collection] = None
        self._lock = asyncio.Lock()

    async def initialize(self) -> None:
        """Initialize ChromaDB client and collection."""
        async with self._lock:
            if self._is_initialized:
                return

            try:
                # Initialize embedding provider if not provided
                if self.embedding_provider is None:
                    settings = get_settings()
                    self.embedding_provider = EmbeddingProviderFactory.create_provider(
                        provider_type="sentence-transformers",
                        model_name=settings.vector_db.embedding_model,
                    )

                await self.embedding_provider.ensure_initialized()
                self.embedding_dim = self.embedding_provider.embedding_dim

                # Initialize ChromaDB client
                if self.persist_directory:
                    self._client = PersistentClient(
                        path=self.persist_directory,
                        settings=ChromaSettings(
                            anonymized_telemetry=False,
                            allow_reset=True,
                        )
                    )
                else:
                    self._client = Client(
                        settings=ChromaSettings(
                            anonymized_telemetry=False,
                            allow_reset=True,
                        )
                    )

                # Get or create collection
                try:
                    self._collection = self._client.get_collection(
                        name=self.collection_name
                    )
                except Exception:
                    # Collection doesn't exist, create it
                    self._collection = self._client.create_collection(
                        name=self.collection_name,
                        metadata={"distance_metric": self.distance_metric},
                    )

                self._is_initialized = True

            except Exception as e:
                raise MemoryError(f"Failed to initialize ChromaMemory: {e}") from e

    async def store_entry(self, entry: MemoryEntry) -> bool:
        """Store a memory entry in ChromaDB."""
        await self.ensure_initialized()

        if not self._collection:
            raise MemoryError("Collection not initialized")

        try:
            # Generate embedding if not provided
            if entry.embedding is None:
                entry.embedding = await self.embedding_provider.embed(entry.content)

            # Prepare data for ChromaDB
            embedding = entry.embedding
            metadata = {
                "content": entry.content,
                "created_at": entry.created_at.isoformat(),
                "updated_at": entry.updated_at.isoformat(),
                "access_count": entry.access_count,
                "tags": json.dumps(entry.tags),
                "source": entry.source,
                **entry.metadata,
            }

            if entry.last_accessed:
                metadata["last_accessed"] = entry.last_accessed.isoformat()

            # Store in ChromaDB
            self._collection.add(
                ids=[entry.id],
                embeddings=[embedding],
                metadatas=[metadata],
                documents=[entry.content],  # Store content as document for search
            )

            # Update stats
            self._stats["total_entries"] += 1

            return True

        except Exception as e:
            raise MemoryError(f"Failed to store entry: {e}") from e

    async def get_entry(self, entry_id: str) -> Optional[MemoryEntry]:
        """Get a memory entry by ID."""
        await self.ensure_initialized()

        if not self._collection:
            raise MemoryError("Collection not initialized")

        try:
            result = self._collection.get(ids=[entry_id])

            if not result["ids"]:
                return None

            return self._chromadb_result_to_entry(
                result["ids"][0],
                result["embeddings"][0] if result["embeddings"] else None,
                result["metadatas"][0] if result["metadatas"] else {},
                result["documents"][0] if result["documents"] else "",
            )

        except Exception as e:
            raise MemoryError(f"Failed to get entry: {e}") from e

    async def update_entry(self, entry_id: str, updates: Dict[str, Any]) -> bool:
        """Update a memory entry."""
        await self.ensure_initialized()

        if not self._collection:
            raise MemoryError("Collection not initialized")

        try:
            # Get current entry
            current_entry = await self.get_entry(entry_id)
            if not current_entry:
                return False

            # Update fields
            if "content" in updates:
                current_entry.content = updates["content"]
                # Regenerate embedding for new content
                current_entry.embedding = await self.embedding_provider.embed(
                    updates["content"]
                )

            if "metadata" in updates:
                current_entry.metadata.update(updates["metadata"])

            if "tags" in updates:
                current_entry.tags = updates["tags"]

            # Update timestamps
            from datetime import datetime
            current_entry.updated_at = datetime.utcnow()

            # Prepare update data
            metadata = {
                "content": current_entry.content,
                "created_at": current_entry.created_at.isoformat(),
                "updated_at": current_entry.updated_at.isoformat(),
                "access_count": current_entry.access_count,
                "tags": json.dumps(current_entry.tags),
                "source": current_entry.source,
                **current_entry.metadata,
            }

            if current_entry.last_accessed:
                metadata["last_accessed"] = current_entry.last_accessed.isoformat()

            # Update in ChromaDB
            self._collection.update(
                ids=[entry_id],
                embeddings=[current_entry.embedding] if current_entry.embedding else None,
                metadatas=[metadata],
                documents=[current_entry.content],
            )

            return True

        except Exception as e:
            raise MemoryError(f"Failed to update entry: {e}") from e

    async def delete_entry(self, entry_id: str) -> bool:
        """Delete a memory entry."""
        await self.ensure_initialized()

        if not self._collection:
            raise MemoryError("Collection not initialized")

        try:
            self._collection.delete(ids=[entry_id])

            # Update stats
            if self._stats["total_entries"] > 0:
                self._stats["total_entries"] -= 1

            return True

        except Exception as e:
            raise MemoryError(f"Failed to delete entry: {e}") from e

    async def list_entries(
        self,
        limit: int = 100,
        offset: int = 0,
        filters: Optional[Dict[str, Any]] = None,
    ) -> List[MemoryEntry]:
        """List memory entries with pagination."""
        await self.ensure_initialized()

        if not self._collection:
            raise MemoryError("Collection not initialized")

        try:
            # Build query
            query_kwargs = {"n_results": limit + offset}

            if filters:
                query_kwargs["where"] = filters

            # Get all results
            result = self._collection.get(**query_kwargs)

            if not result["ids"]:
                return []

            # Convert to MemoryEntry objects
            entries = []
            start_idx = offset
            end_idx = min(offset + limit, len(result["ids"]))

            for i in range(start_idx, end_idx):
                entry = self._chromadb_result_to_entry(
                    result["ids"][i],
                    result["embeddings"][i] if result["embeddings"] else None,
                    result["metadatas"][i] if result["metadatas"] else {},
                    result["documents"][i] if result["documents"] else "",
                )
                entries.append(entry)

            return entries

        except Exception as e:
            raise MemoryError(f"Failed to list entries: {e}") from e

    async def search_by_metadata(
        self,
        filters: Dict[str, Any],
        limit: int = 10,
    ) -> List[MemoryEntry]:
        """Search entries by metadata."""
        return await self.list_entries(limit=limit, filters=filters)

    async def _execute_query(self, query: MemoryQuery) -> MemoryResult:
        """Execute the actual query implementation."""
        if not self._collection:
            raise MemoryError("Collection not initialized")

        try:
            # Generate query embedding
            query_embedding = await self.embedding_provider.embed(query.query)

            # Build query filters
            where_filter = {}
            if query.filters:
                where_filter.update(query.filters)

            if query.tags:
                where_filter["tags"] = {"$contains": query.tags}

            if query.date_range:
                date_filter = {}
                if "start" in query.date_range:
                    date_filter["$gte"] = query.date_range["start"].isoformat()
                if "end" in query.date_range:
                    date_filter["$lte"] = query.date_range["end"].isoformat()
                where_filter["created_at"] = date_filter

            # Execute query
            result = self._collection.query(
                query_embeddings=[query_embedding],
                n_results=query.limit,
                where=where_filter if where_filter else None,
            )

            if not result["ids"][0]:
                return MemoryResult(
                    entries=[],
                    total_count=0,
                    query_time=0.0,
                    has_more=False,
                )

            # Convert results to MemoryEntry objects
            entries = []
            for i in range(len(result["ids"][0])):
                entry = self._chromadb_result_to_entry(
                    result["ids"][0][i],
                    result["embeddings"][0][i] if result["embeddings"] else None,
                    result["metadatas"][0][i] if result["metadatas"] else {},
                    result["documents"][0][i] if result["documents"] else "",
                )

                # Set relevance score from distance
                if result["distances"] and result["distances"][0]:
                    # Convert distance to relevance score (inverse)
                    distance = result["distances"][0][i]
                    entry.relevance_score = 1.0 / (1.0 + distance)

                # Filter by threshold
                if entry.relevance_score >= query.threshold:
                    entries.append(entry)

            # Sort by relevance score
            entries.sort(key=lambda x: x.relevance_score, reverse=True)

            # Apply sorting if specified
            if query.sort_by != "relevance_score":
                reverse = query.sort_order == "desc"
                if query.sort_by == "created_at":
                    entries.sort(key=lambda x: x.created_at, reverse=reverse)
                elif query.sort_by == "access_count":
                    entries.sort(key=lambda x: x.access_count, reverse=reverse)

            return MemoryResult(
                entries=entries[:query.limit],
                total_count=len(entries),
                query_time=0.0,  # Will be set by wrapper
                has_more=len(result["ids"][0]) > query.limit,
                query_metadata={
                    "query_embedding_dim": len(query_embedding),
                    "total_results": len(result["ids"][0]),
                },
            )

        except Exception as e:
            raise MemoryError(f"Query execution failed: {e}") from e

    def _chromadb_result_to_entry(
        self,
        entry_id: str,
        embedding: Optional[List[float]],
        metadata: Dict[str, Any],
        document: str,
    ) -> MemoryEntry:
        """Convert ChromaDB result to MemoryEntry."""
        from datetime import datetime

        # Parse metadata
        created_at = datetime.fromisoformat(
            metadata.get("created_at", datetime.utcnow().isoformat())
        )
        updated_at = datetime.fromisoformat(
            metadata.get("updated_at", created_at.isoformat())
        )

        last_accessed = None
        if "last_accessed" in metadata:
            last_accessed = datetime.fromisoformat(metadata["last_accessed"])

        tags = []
        if "tags" in metadata:
            try:
                tags = json.loads(metadata["tags"])
            except (json.JSONDecodeError, TypeError):
                tags = []

        return MemoryEntry(
            id=entry_id,
            content=document or metadata.get("content", ""),
            metadata={k: v for k, v in metadata.items()
                     if k not in ["content", "created_at", "updated_at",
                                 "access_count", "tags", "source", "last_accessed"]},
            embedding=embedding,
            created_at=created_at,
            updated_at=updated_at,
            access_count=metadata.get("access_count", 0),
            last_accessed=last_accessed,
            tags=tags,
            source=metadata.get("source"),
        )

    async def get_collection_info(self) -> Dict[str, Any]:
        """Get information about the ChromaDB collection."""
        await self.ensure_initialized()

        if not self._collection:
            raise MemoryError("Collection not initialized")

        try:
            count = self._collection.count()
            metadata = self._collection.metadata or {}

            return {
                "name": self.collection_name,
                "count": count,
                "metadata": metadata,
                "embedding_dim": self.embedding_dim,
                "distance_metric": self.distance_metric,
            }

        except Exception as e:
            raise MemoryError(f"Failed to get collection info: {e}") from e

    async def reset_collection(self) -> bool:
        """Reset the entire collection."""
        await self.ensure_initialized()

        if not self._client:
            raise MemoryError("Client not initialized")

        try:
            # Delete the collection
            self._client.delete_collection(name=self.collection_name)

            # Recreate it
            self._collection = self._client.create_collection(
                name=self.collection_name,
                metadata={"distance_metric": self.distance_metric},
            )

            # Reset stats
            self._stats["total_entries"] = 0

            return True

        except Exception as e:
            raise MemoryError(f"Failed to reset collection: {e}") from e

    async def close(self) -> None:
        """Close the ChromaDB connection."""
        # ChromaDB doesn't have explicit close method for in-memory
        # but we can reset our references
        self._collection = None
        self._client = None
        self._is_initialized = False