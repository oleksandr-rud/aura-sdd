"""
Memory retrieval strategies for AURA-004.

This module provides various retrieval strategies for accessing memory
entries, including vector similarity, metadata filtering, and hybrid approaches.
"""

import asyncio
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, Tuple, Union
from datetime import datetime

import numpy as np

from aura_004.memory.base import BaseMemory, MemoryQuery, MemoryResult
from aura_004.memory.schemas import MemoryEntry, MemoryMetadata
from aura_004.memory.embeddings import EmbeddingProvider, cosine_similarity
from aura_004.core.exceptions import MemoryError


class MemoryRetriever(ABC):
    """Abstract base class for memory retrievers."""

    def __init__(self, memory: BaseMemory, **kwargs):
        self.memory = memory
        self.embedding_provider = kwargs.get("embedding_provider")

    @abstractmethod
    async def retrieve(self, query: MemoryQuery) -> MemoryResult:
        """Retrieve memory entries based on query."""
        pass

    @abstractmethod
    async def batch_retrieve(self, queries: List[MemoryQuery]) -> List[MemoryResult]:
        """Retrieve entries for multiple queries."""
        pass


class VectorRetriever(MemoryRetriever):
    """Vector-based memory retriever using similarity search."""

    def __init__(
        self,
        memory: BaseMemory,
        embedding_provider: Optional[EmbeddingProvider] = None,
        similarity_threshold: float = 0.7,
        **kwargs,
    ):
        super().__init__(memory, **kwargs)
        self.embedding_provider = embedding_provider
        self.similarity_threshold = similarity_threshold

    async def retrieve(self, query: MemoryQuery) -> MemoryResult:
        """Retrieve entries using vector similarity."""
        start_time = asyncio.get_event_loop().time()
        embedding_time = 0.0
        search_time = 0.0

        try:
            # Generate query embedding
            if self.embedding_provider:
                embedding_start = asyncio.get_event_loop().time()
                query_embedding = await self.embedding_provider.embed(query.query)
                embedding_time = asyncio.get_event_loop().time() - embedding_start
            else:
                # Use memory's default embedding
                query_embedding = None

            # Update query with embedding
            if query_embedding:
                # Custom vector search implementation
                entries = await self._vector_search(query, query_embedding)
            else:
                # Fall back to memory's query method
                entries = await self.memory.query(query)

            search_time = asyncio.get_event_loop().time() - start_time - embedding_time

            # Create result
            result = MemoryResult(
                query=query.query,
                entries=entries.entries if hasattr(entries, 'entries') else entries,
                total_count=len(entries.entries) if hasattr(entries, 'entries') else len(entries),
                returned_count=len(entries.entries) if hasattr(entries, 'entries') else len(entries),
                query_time=asyncio.get_event_loop().time() - start_time,
                embedding_time=embedding_time,
                search_time=search_time,
            )

            # Calculate quality metrics
            result.calculate_quality_metrics()

            return result

        except Exception as e:
            raise MemoryError(f"Vector retrieval failed: {e}") from e

    async def _vector_search(self, query: MemoryQuery, query_embedding: List[float]) -> List[MemoryEntry]:
        """Perform vector similarity search."""
        # Get all entries from memory
        all_entries = await self.memory.list_entries(limit=1000)  # Adjust limit as needed

        # Filter entries based on query criteria
        filtered_entries = []
        for entry in all_entries:
            if self._matches_query(entry, query):
                filtered_entries.append(entry)

        # Calculate similarities
        similarities = []
        for entry in filtered_entries:
            if entry.embedding:
                similarity = cosine_similarity(query_embedding, entry.embedding)
                if similarity >= self.similarity_threshold:
                    similarities.append((entry, similarity))

        # Sort by similarity
        similarities.sort(key=lambda x: x[1], reverse=True)

        # Apply limit
        results = []
        for entry, similarity in similarities[:query.limit]:
            entry.metadata.relevance = similarity
            results.append(entry)

        return results

    def _matches_query(self, entry: MemoryEntry, query: MemoryQuery) -> bool:
        """Check if entry matches query criteria."""
        # Check memory type
        if entry.memory_type != query.query_type:
            return False

        # Check status
        if entry.status != "active":
            return False

        # Check tags
        if query.tags:
            if not any(tag in entry.metadata.tags for tag in query.tags):
                return False

        # Check categories
        if query.categories and entry.metadata.category not in query.categories:
            return False

        # Check access levels
        if query.access_levels and entry.metadata.access_level not in query.access_levels:
            return False

        # Check date range
        if query.date_range:
            start_date = query.date_range.get("start")
            end_date = query.date_range.get("end")
            if start_date and entry.created_at < start_date:
                return False
            if end_date and entry.created_at > end_date:
                return False

        # Check sources
        if query.sources and entry.metadata.source not in query.sources:
            return False

        # Check expiration and validity
        if entry.is_expired() or not entry.is_valid():
            return False

        return True

    async def batch_retrieve(self, queries: List[MemoryQuery]) -> List[MemoryResult]:
        """Retrieve entries for multiple queries."""
        tasks = [self.retrieve(query) for query in queries]
        return await asyncio.gather(*tasks)


class MetadataRetriever(MemoryRetriever):
    """Metadata-based memory retriever using filtering."""

    def __init__(self, memory: BaseMemory, **kwargs):
        super().__init__(memory, **kwargs)

    async def retrieve(self, query: MemoryQuery) -> MemoryResult:
        """Retrieve entries using metadata filtering."""
        start_time = asyncio.get_event_loop().time()

        try:
            # Build search filters
            filters = self._build_filters(query)

            # Search memory
            entries = await self.memory.search_by_metadata(
                filters=filters,
                limit=query.limit * 2,  # Get more to allow for post-filtering
            )

            # Apply additional filtering
            filtered_entries = []
            for entry in entries:
                if self._matches_query(entry, query):
                    filtered_entries.append(entry)

            # Sort results
            sorted_entries = self._sort_entries(filtered_entries, query)

            # Apply limit
            results = sorted_entries[:query.limit]

            # Create result
            result = MemoryResult(
                query=query.query,
                entries=results,
                total_count=len(results),
                returned_count=len(results),
                query_time=asyncio.get_event_loop().time() - start_time,
            )

            # Calculate quality metrics
            result.calculate_quality_metrics()

            return result

        except Exception as e:
            raise MemoryError(f"Metadata retrieval failed: {e}") from e

    def _build_filters(self, query: MemoryQuery) -> Dict[str, Any]:
        """Build metadata filters from query."""
        filters = {}

        # Add basic filters
        if query.filters:
            filters.update(query.filters)

        # Add memory type filter
        filters["memory_type"] = query.query_type

        # Add tag filters
        if query.tags:
            filters["tags"] = {"$contains": query.tags}

        # Add category filter
        if query.categories:
            filters["category"] = {"$in": query.categories}

        # Add access level filter
        if query.access_levels:
            filters["access_level"] = {"$in": query.access_levels}

        # Add source filter
        if query.sources:
            filters["source"] = {"$in": query.sources}

        # Add date range filter
        if query.date_range:
            date_filter = {}
            if "start" in query.date_range:
                date_filter["$gte"] = query.date_range["start"].isoformat()
            if "end" in query.date_range:
                date_filter["$lte"] = query.date_range["end"].isoformat()
            if date_filter:
                filters["created_at"] = date_filter

        return filters

    def _matches_query(self, entry: MemoryEntry, query: MemoryQuery) -> bool:
        """Check if entry matches query criteria."""
        # This is similar to VectorRetriever but might have additional logic
        return True  # Simplified for now

    def _sort_entries(self, entries: List[MemoryEntry], query: MemoryQuery) -> List[MemoryEntry]:
        """Sort entries based on query criteria."""
        reverse = query.sort_order == "desc"

        if query.sort_by == "relevance":
            entries.sort(key=lambda x: x.metadata.relevance, reverse=reverse)
        elif query.sort_by == "created_at":
            entries.sort(key=lambda x: x.created_at, reverse=reverse)
        elif query.sort_by == "updated_at":
            entries.sort(key=lambda x: x.updated_at, reverse=reverse)
        elif query.sort_by == "access_count":
            entries.sort(key=lambda x: x.access_count, reverse=reverse)
        elif query.sort_by == "retrieval_count":
            entries.sort(key=lambda x: x.retrieval_count, reverse=reverse)
        elif query.sort_by == "quality_score":
            entries.sort(key=lambda x: x.metadata.quality_score, reverse=reverse)
        elif query.sort_by == "last_accessed":
            entries.sort(
                key=lambda x: x.last_accessed or datetime.min,
                reverse=reverse
            )

        return entries

    async def batch_retrieve(self, queries: List[MemoryQuery]) -> List[MemoryResult]:
        """Retrieve entries for multiple queries."""
        tasks = [self.retrieve(query) for query in queries]
        return await asyncio.gather(*tasks)


class HybridRetriever(MemoryRetriever):
    """Hybrid retriever combining vector and metadata search."""

    def __init__(
        self,
        memory: BaseMemory,
        vector_retriever: Optional[VectorRetriever] = None,
        metadata_retriever: Optional[MetadataRetriever] = None,
        vector_weight: float = 0.7,
        **kwargs,
    ):
        super().__init__(memory, **kwargs)
        self.vector_retriever = vector_retriever or VectorRetriever(memory, **kwargs)
        self.metadata_retriever = metadata_retriever or MetadataRetriever(memory, **kwargs)
        self.vector_weight = max(0.0, min(1.0, vector_weight))
        self.metadata_weight = 1.0 - self.vector_weight

    async def retrieve(self, query: MemoryQuery) -> MemoryResult:
        """Retrieve entries using hybrid approach."""
        start_time = asyncio.get_event_loop().time()

        try:
            # Run both retrievers concurrently
            vector_task = self.vector_retriever.retrieve(query)
            metadata_task = self.metadata_retriever.retrieve(query)

            vector_result, metadata_result = await asyncio.gather(
                vector_task, metadata_task
            )

            # Merge results
            merged_entries = self._merge_results(
                vector_result.entries,
                metadata_result.entries,
                query,
            )

            # Sort and limit
            merged_entries.sort(key=lambda x: x.metadata.relevance, reverse=True)
            final_entries = merged_entries[:query.limit]

            # Create result
            total_time = asyncio.get_event_loop().time() - start_time
            result = MemoryResult(
                query=query.query,
                entries=final_entries,
                total_count=len(final_entries),
                returned_count=len(final_entries),
                query_time=total_time,
                vector_time=vector_result.query_time,
                metadata_time=metadata_result.query_time,
            )

            # Add query metadata
            result.query_metadata.update({
                "vector_entries": len(vector_result.entries),
                "metadata_entries": len(metadata_result.entries),
                "merged_entries": len(merged_entries),
                "vector_weight": self.vector_weight,
                "metadata_weight": self.metadata_weight,
            })

            # Calculate quality metrics
            result.calculate_quality_metrics()

            return result

        except Exception as e:
            raise MemoryError(f"Hybrid retrieval failed: {e}") from e

    def _merge_results(
        self,
        vector_entries: List[MemoryEntry],
        metadata_entries: List[MemoryEntry],
        query: MemoryQuery,
    ) -> List[MemoryEntry]:
        """Merge results from vector and metadata retrievers."""
        # Create a map of entry IDs to entries
        entry_map = {}

        # Add vector entries with weighted scores
        for entry in vector_entries:
            entry_copy = entry.model_copy(deep=True)
            entry_copy.metadata.relevance *= self.vector_weight
            entry_map[entry_copy.id] = entry_copy

        # Add metadata entries with weighted scores
        for entry in metadata_entries:
            if entry.id in entry_map:
                # Combine scores
                existing_entry = entry_map[entry.id]
                combined_relevance = (
                    existing_entry.metadata.relevance +
                    (entry.metadata.relevance * self.metadata_weight)
                )
                existing_entry.metadata.relevance = combined_relevance
            else:
                entry_copy = entry.model_copy(deep=True)
                entry_copy.metadata.relevance *= self.metadata_weight
                entry_map[entry_copy.id] = entry_copy

        # Apply preference boosts
        if query.preference_boost:
            for entry in entry_map.values():
                for category, boost in query.preference_boost.items():
                    if entry.metadata.category == category:
                        entry.metadata.relevance *= boost

        return list(entry_map.values())

    async def batch_retrieve(self, queries: List[MemoryQuery]) -> List[MemoryResult]:
        """Retrieve entries for multiple queries."""
        tasks = [self.retrieve(query) for query in queries]
        return await asyncio.gather(*tasks)


class RerankingRetriever(MemoryRetriever):
    """Retriever with advanced reranking capabilities."""

    def __init__(
        self,
        memory: BaseMemory,
        base_retriever: Optional[MemoryRetriever] = None,
        reranker: Optional[callable] = None,
        **kwargs,
    ):
        super().__init__(memory, **kwargs)
        self.base_retriever = base_retriever or VectorRetriever(memory, **kwargs)
        self.reranker = reranker

    async def retrieve(self, query: MemoryQuery) -> MemoryResult:
        """Retrieve entries with reranking."""
        start_time = asyncio.get_event_loop().time()

        try:
            # Get initial results
            initial_result = await self.base_retriever.retrieve(query)

            if not query.rerank or not self.reranker:
                return initial_result

            # Rerank results
            rerank_start = asyncio.get_event_loop().time()
            reranked_entries = await self._rerank_results(query, initial_result.entries)
            rerank_time = asyncio.get_event_loop().time() - rerank_start

            # Create final result
            result = MemoryResult(
                query=query.query,
                entries=reranked_entries[:query.limit],
                total_count=len(reranked_entries),
                returned_count=min(len(reranked_entries), query.limit),
                query_time=asyncio.get_event_loop().time() - start_time,
                rerank_time=rerank_time,
            )

            # Add metadata
            result.query_metadata.update({
                "initial_entries": len(initial_result.entries),
                "reranked_entries": len(reranked_entries),
                "reranking_applied": True,
            })

            # Calculate quality metrics
            result.calculate_quality_metrics()

            return result

        except Exception as e:
            raise MemoryError(f"Reranking retrieval failed: {e}") from e

    async def _rerank_results(
        self,
        query: MemoryQuery,
        entries: List[MemoryEntry],
    ) -> List[MemoryEntry]:
        """Rerank entries using the reranker function."""
        if not self.reranker:
            return entries

        try:
            # Prepare data for reranking
            rerank_data = [
                {
                    "entry": entry.model_dump(),
                    "query": query.query,
                    "context": query.context,
                    "current_score": entry.metadata.relevance,
                }
                for entry in entries
            ]

            # Apply reranking
            reranked_data = await self.reranker(rerank_data)

            # Update entries with new scores
            reranked_entries = []
            for item in reranked_data:
                entry_data = item["entry"]
                new_score = item.get("score", item["current_score"])
                entry_data["metadata"]["relevance"] = new_score
                entry = MemoryEntry(**entry_data)
                reranked_entries.append(entry)

            # Sort by new scores
            reranked_entries.sort(key=lambda x: x.metadata.relevance, reverse=True)

            return reranked_entries

        except Exception as e:
            # Fallback to original order if reranking fails
            return entries

    async def batch_retrieve(self, queries: List[MemoryQuery]) -> List[MemoryResult]:
        """Retrieve entries for multiple queries."""
        tasks = [self.retrieve(query) for query in queries]
        return await asyncio.gather(*tasks)


class RetrieverFactory:
    """Factory for creating retrievers."""

    _retrievers = {
        "vector": VectorRetriever,
        "metadata": MetadataRetriever,
        "hybrid": HybridRetriever,
        "reranking": RerankingRetriever,
    }

    @classmethod
    def create_retriever(
        self,
        retriever_type: str,
        memory: BaseMemory,
        **kwargs,
    ) -> MemoryRetriever:
        """Create a retriever instance."""
        if retriever_type not in self._retrievers:
            raise MemoryError(f"Unknown retriever type: {retriever_type}")

        return self._retrievers[retriever_type](memory, **kwargs)

    @classmethod
    def register_retriever(cls, name: str, retriever_class: type) -> None:
        """Register a custom retriever."""
        if not issubclass(retriever_class, MemoryRetriever):
            raise MemoryError(f"Retriever class must inherit from MemoryRetriever")
        cls._retrievers[name] = retriever_class

    @classmethod
    def list_retrievers(cls) -> List[str]:
        """List available retriever types."""
        return list(cls._retrievers.keys())


# Utility functions

async def retrieve_memories(
    memory: BaseMemory,
    query: str,
    retriever_type: str = "hybrid",
    **kwargs,
) -> MemoryResult:
    """Retrieve memories using the specified retriever."""
    retriever = RetrieverFactory.create_retriever(
        retriever_type=retriever_type,
        memory=memory,
        **kwargs,
    )

    memory_query = MemoryQuery(query=query, **kwargs)
    return await retriever.retrieve(memory_query)