"""
Advanced retrieval strategies for AURA-004.

This module provides sophisticated retrieval algorithms including
learning-to-rank, relevance feedback, query expansion, and
performance-optimized search for large-scale codebases.
"""

import asyncio
import math
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, Tuple, Union, Set
from datetime import datetime, timedelta
from dataclasses import dataclass
from enum import Enum
import json

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity as sklearn_cosine_similarity
import networkx as nx

from aura_004.memory.base import BaseMemory, MemoryQuery, MemoryResult, MemoryEntry
from aura_004.memory.schemas import MemoryMetadata
from aura_004.memory.retrieval import MemoryRetriever, VectorRetriever, HybridRetriever
from aura_004.memory.advanced_embeddings import AdvancedEmbeddingProvider, EmbeddingStrategy
from aura_004.core.exceptions import MemoryError


class RetrievalMode(Enum):
    """Enumeration of retrieval modes."""

    PRECISE = "precise"  # High precision, lower recall
    COMPREHENSIVE = "comprehensive"  # High recall, lower precision
    BALANCED = "balanced"  # Balance between precision and recall
    EXPLORATORY = "exploratory"  # Discover related content
    PERFORMANCE = "performance"  # Optimized for speed


@dataclass
class RetrievalConfig:
    """Configuration for advanced retrieval."""

    mode: RetrievalMode = RetrievalMode.BALANCED
    max_results: int = 100
    min_relevance: float = 0.3
    enable_reranking: bool = True
    enable_query_expansion: bool = True
    enable_relevance_feedback: bool = True

    # Performance settings
    cache_results: bool = True
    parallel_search: bool = True
    batch_size: int = 32

    # Ranking settings
    diversity_penalty: float = 0.1
    temporal_decay: float = 0.95
    access_boost: float = 0.2

    # Learning settings
    learning_rate: float = 0.01
    feedback_weight: float = 0.3


@dataclass
class QueryExpansion:
    """Query expansion information."""

    expanded_terms: List[str]
    original_query: str
    expansion_method: str
    confidence: float


@dataclass
class RetrievalFeedback:
    """Feedback for retrieval learning."""

    query: str
    relevant_results: List[str]  # Entry IDs
    irrelevant_results: List[str]  # Entry IDs
    timestamp: datetime


class AdvancedRetriever(MemoryRetriever):
    """Advanced retriever with learning and optimization capabilities."""

    def __init__(
        self,
        memory: BaseMemory,
        embedding_provider: Optional[AdvancedEmbeddingProvider] = None,
        config: Optional[RetrievalConfig] = None,
        **kwargs,
    ):
        super().__init__(memory, **kwargs)
        self.embedding_provider = embedding_provider
        self.config = config or RetrievalConfig()

        # Initialize components
        self.base_retriever = HybridRetriever(memory, **kwargs)
        self.query_expander = QueryExpander(self.memory, self.embedding_provider)
        self.reranker = AdvancedReranker(self.config)
        self.feedback_learner = FeedbackLearner(self.config)

        # Caches
        self._query_cache: Dict[str, Tuple[MemoryResult, datetime]] = {}
        self._expansion_cache: Dict[str, QueryExpansion] = {}

        # Statistics
        self._stats = {
            "total_queries": 0,
            "cache_hits": 0,
            "expansions": 0,
            "rerankings": 0,
            "feedback_updates": 0,
        }

    async def retrieve(self, query: MemoryQuery) -> MemoryResult:
        """Retrieve memories with advanced processing."""
        start_time = asyncio.get_event_loop().time()
        self._stats["total_queries"] += 1

        try:
            # Check cache
            cache_key = self._get_cache_key(query)
            if self.config.cache_results:
                cached_result = await self._get_cached_result(cache_key)
                if cached_result:
                    self._stats["cache_hits"] += 1
                    return cached_result

            # Query expansion
            expanded_query = await self._expand_query(query)

            # Initial retrieval
            initial_results = await self.base_retriever.retrieve(expanded_query)

            # Apply mode-specific processing
            processed_results = await self._apply_retrieval_mode(initial_results, query)

            # Reranking
            if self.config.enable_reranking and len(processed_results.entries) > 1:
                processed_results = await self.reranker.rerank(processed_results, query)
                self._stats["rerankings"] += 1

            # Apply post-processing
            final_results = await self._post_process_results(processed_results, query)

            # Update cache
            if self.config.cache_results:
                await self._cache_result(cache_key, final_results)

            return final_results

        except Exception as e:
            raise MemoryError(f"Advanced retrieval failed: {e}") from e

    async def _expand_query(self, query: MemoryQuery) -> MemoryQuery:
        """Expand query with related terms and concepts."""
        if not self.config.enable_query_expansion:
            return query

        expansion = await self.query_expander.expand_query(query)
        if expansion:
            self._stats["expansions"] += 1

            # Update query with expanded terms
            expanded_query_text = f"{query.query} {expansion.expanded_terms}"
            expanded_query = MemoryQuery(
                query=expanded_query_text,
                limit=query.limit,
                query_type=query.query_type,
                **query.__dict__
            )

            # Store expansion for feedback
            expanded_query.metadata = expanded_query.metadata or {}
            expanded_query.metadata["expansion"] = expansion

            return expanded_query

        return query

    async def _apply_retrieval_mode(self, results: MemoryResult, query: MemoryQuery) -> MemoryResult:
        """Apply retrieval mode-specific processing."""
        if self.config.mode == RetrievalMode.PRECISE:
            return await self._apply_precise_mode(results, query)
        elif self.config.mode == RetrievalMode.COMPREHENSIVE:
            return await self._apply_comprehensive_mode(results, query)
        elif self.config.mode == RetrievalMode.EXPLORATORY:
            return await self._apply_exploratory_mode(results, query)
        elif self.config.mode == RetrievalMode.PERFORMANCE:
            return await self._apply_performance_mode(results, query)
        else:  # BALANCED
            return await self._apply_balanced_mode(results, query)

    async def _apply_precise_mode(self, results: MemoryResult, query: MemoryQuery) -> MemoryResult:
        """Apply high-precision filtering."""
        # Filter by higher relevance threshold
        precise_entries = [
            entry for entry in results.entries
            if entry.metadata.relevance >= (self.config.min_relevance + 0.2)
        ]

        # Apply strict matching
        filtered_entries = []
        for entry in precise_entries:
            if self._strict_match_check(entry, query):
                filtered_entries.append(entry)

        results.entries = filtered_entries[:query.limit]
        results.returned_count = len(results.entries)
        results.total_count = len(filtered_entries)

        return results

    async def _apply_comprehensive_mode(self, results: MemoryResult, query: MemoryQuery) -> MemoryResult:
        """Apply high-recall processing."""
        # Lower relevance threshold
        comprehensive_entries = [
            entry for entry in results.entries
            if entry.metadata.relevance >= (self.config.min_relevance - 0.1)
        ]

        # Include related entries
        related_entries = await self._find_related_entries(comprehensive_entries, query)
        all_entries = comprehensive_entries + related_entries

        # Remove duplicates and sort
        unique_entries = self._remove_duplicates(all_entries)
        unique_entries.sort(key=lambda x: x.metadata.relevance, reverse=True)

        results.entries = unique_entries[:query.limit * 2]  # Return more results
        results.returned_count = len(results.entries)
        results.total_count = len(unique_entries)

        return results

    async def _apply_exploratory_mode(self, results: MemoryResult, query: MemoryQuery) -> MemoryResult:
        """Apply exploratory search with diversity."""
        # Ensure diversity in results
        diverse_entries = self._ensure_diversity(results.entries, query)

        # Include serendipitous results
        serendipitous_entries = await self._find_serendipitous_entries(results.entries, query)

        all_entries = diverse_entries + serendipitous_entries
        unique_entries = self._remove_duplicates(all_entries)

        # Sort by combination of relevance and diversity
        scored_entries = []
        for entry in unique_entries:
            score = self._calculate_exploratory_score(entry, query, results.entries)
            entry.metadata.relevance = score
            scored_entries.append(entry)

        scored_entries.sort(key=lambda x: x.metadata.relevance, reverse=True)

        results.entries = scored_entries[:query.limit]
        results.returned_count = len(results.entries)
        results.total_count = len(scored_entries)

        return results

    async def _apply_performance_mode(self, results: MemoryResult, query: MemoryQuery) -> MemoryResult:
        """Apply performance-optimized retrieval."""
        # Simple filtering and limiting
        performance_entries = results.entries[:query.limit]

        results.entries = performance_entries
        results.returned_count = len(performance_entries)
        results.total_count = min(len(results.entries), query.limit)

        return results

    async def _apply_balanced_mode(self, results: MemoryResult, query: MemoryQuery) -> MemoryResult:
        """Apply balanced precision and recall."""
        # Standard filtering with moderate threshold
        balanced_entries = [
            entry for entry in results.entries
            if entry.metadata.relevance >= self.config.min_relevance
        ]

        # Apply temporal boosting
        boosted_entries = self._apply_temporal_boosting(balanced_entries)

        # Apply access pattern boosting
        final_entries = self._apply_access_boosting(boosted_entries)

        final_entries.sort(key=lambda x: x.metadata.relevance, reverse=True)
        final_entries = final_entries[:query.limit]

        results.entries = final_entries
        results.returned_count = len(final_entries)
        results.total_count = len(final_entries)

        return results

    async def _post_process_results(self, results: MemoryResult, query: MemoryQuery) -> MemoryResult:
        """Apply post-processing to results."""
        # Apply relevance feedback if available
        if self.config.enable_relevance_feedback:
            results = await self._apply_relevance_feedback(results, query)

        # Add result metadata
        results.query_metadata.update({
            "retrieval_mode": self.config.mode.value,
            "total_candidates": len(results.entries),
            "processing_time": results.query_time,
        })

        return results

    async def _find_related_entries(self, entries: List[MemoryEntry], query: MemoryQuery) -> List[MemoryEntry]:
        """Find entries related to the current results."""
        related_entries = []

        for entry in entries:
            # Find entries with similar tags
            if entry.metadata.tags:
                related_query = MemoryQuery(
                    query="",
                    tags=entry.metadata.tags[:3],  # Limit to top 3 tags
                    limit=5,
                    query_type=query.query_type,
                )
                related_results = await self.memory.query(related_query)
                related_entries.extend(related_results.entries if hasattr(related_results, 'entries') else related_results)

        return related_entries

    async def _find_serendipitous_entries(self, entries: List[MemoryEntry], query: MemoryQuery) -> List[MemoryEntry]:
        """Find unexpected but potentially relevant entries."""
        # Use random sampling with constraints for serendipity
        try:
            all_entries = await self.memory.list_entries(limit=1000)

            # Filter by different categories to ensure diversity
            current_categories = set(entry.metadata.category for entry in entries)
            serendipitous = [
                entry for entry in all_entries
                if entry.metadata.category not in current_categories
                and entry.metadata.relevance >= self.config.min_relevance * 0.5
            ]

            # Sample a few entries
            import random
            sampled = random.sample(
                serendipitous,
                min(len(serendipitous), max(1, len(entries) // 4))
            )

            return sampled

        except Exception:
            return []

    def _ensure_diversity(self, entries: List[MemoryEntry], query: MemoryQuery) -> List[MemoryEntry]:
        """Ensure diversity in results using maximal marginal relevance."""
        if not entries:
            return entries

        diverse_entries = [entries[0]]  # Start with highest relevance

        for candidate in entries[1:]:
            # Calculate similarity to already selected entries
            max_similarity = 0
            for selected in diverse_entries:
                similarity = self._calculate_entry_similarity(candidate, selected)
                max_similarity = max(max_similarity, similarity)

            # Calculate marginal relevance
            marginal_relevance = (
                (1 - self.config.diversity_penalty) * candidate.metadata.relevance
                - self.config.diversity_penalty * max_similarity
            )

            # Update relevance with marginal relevance
            candidate.metadata.relevance = marginal_relevance

            if marginal_relevance > self.config.min_relevance:
                diverse_entries.append(candidate)

        return diverse_entries

    def _calculate_exploratory_score(
        self,
        entry: MemoryEntry,
        query: MemoryQuery,
        reference_entries: List[MemoryEntry],
    ) -> float:
        """Calculate exploratory score combining relevance and novelty."""
        base_relevance = entry.metadata.relevance

        # Calculate novelty (inverse of average similarity to reference entries)
        if reference_entries:
            similarities = [
                self._calculate_entry_similarity(entry, ref)
                for ref in reference_entries
            ]
            avg_similarity = sum(similarities) / len(similarities)
            novelty = 1.0 - avg_similarity
        else:
            novelty = 1.0

        # Combine relevance and novelty
        exploratory_score = 0.7 * base_relevance + 0.3 * novelty

        return exploratory_score

    def _calculate_entry_similarity(self, entry1: MemoryEntry, entry2: MemoryEntry) -> float:
        """Calculate similarity between two entries."""
        # Use multiple similarity measures

        # Text similarity (if available)
        text_sim = 0.0
        if hasattr(entry1, 'embedding') and hasattr(entry2, 'embedding') and entry1.embedding and entry2.embedding:
            text_sim = cosine_similarity(entry1.embedding, entry2.embedding)

        # Category similarity
        cat_sim = 1.0 if entry1.metadata.category == entry2.metadata.category else 0.0

        # Tag similarity
        if entry1.metadata.tags and entry2.metadata.tags:
            common_tags = set(entry1.metadata.tags) & set(entry2.metadata.tags)
            all_tags = set(entry1.metadata.tags) | set(entry2.metadata.tags)
            tag_sim = len(common_tags) / len(all_tags) if all_tags else 0.0
        else:
            tag_sim = 0.0

        # Weighted combination
        similarity = 0.5 * text_sim + 0.3 * cat_sim + 0.2 * tag_sim

        return similarity

    def _apply_temporal_boosting(self, entries: List[MemoryEntry]) -> List[MemoryEntry]:
        """Apply temporal decay to boost recent entries."""
        now = datetime.now()

        for entry in entries:
            # Calculate time difference in days
            time_diff = (now - entry.updated_at).days
            decay_factor = self.config.temporal_decay ** time_diff

            # Apply temporal boost
            entry.metadata.relevance *= decay_factor

        return entries

    def _apply_access_boosting(self, entries: List[MemoryEntry]) -> List[MemoryEntry]:
        """Apply boosting based on access patterns."""
        max_access = max((entry.access_count for entry in entries), default=1)

        for entry in entries:
            # Calculate access boost
            access_boost = 1.0 + (self.config.access_boost * entry.access_count / max_access)
            entry.metadata.relevance *= access_boost

        return entries

    def _strict_match_check(self, entry: MemoryEntry, query: MemoryQuery) -> bool:
        """Check if entry strictly matches query criteria."""
        # Check for exact term matches
        query_terms = query.query.lower().split()
        entry_text = (entry.content + " " + " ".join(entry.metadata.tags or [])).lower()

        # Require at least 50% of query terms to match
        matches = sum(1 for term in query_terms if term in entry_text)
        match_ratio = matches / len(query_terms) if query_terms else 0

        return match_ratio >= 0.5

    def _remove_duplicates(self, entries: List[MemoryEntry]) -> List[MemoryEntry]:
        """Remove duplicate entries based on ID."""
        seen_ids = set()
        unique_entries = []

        for entry in entries:
            if entry.id not in seen_ids:
                seen_ids.add(entry.id)
                unique_entries.append(entry)

        return unique_entries

    async def _apply_relevance_feedback(self, results: MemoryResult, query: MemoryQuery) -> MemoryResult:
        """Apply relevance feedback to improve results."""
        # This would use stored feedback to adjust rankings
        # Implementation would depend on feedback storage mechanism
        return results

    def _get_cache_key(self, query: MemoryQuery) -> str:
        """Generate cache key for query."""
        import hashlib
        cache_data = {
            "query": query.query,
            "type": query.query_type,
            "limit": query.limit,
            "mode": self.config.mode.value,
        }
        cache_str = json.dumps(cache_data, sort_keys=True)
        return hashlib.md5(cache_str.encode()).hexdigest()

    async def _get_cached_result(self, cache_key: str) -> Optional[MemoryResult]:
        """Get cached result if valid."""
        if cache_key in self._query_cache:
            result, timestamp = self._query_cache[cache_key]
            # Check if cache is still valid (1 hour)
            if (datetime.now() - timestamp).total_seconds() < 3600:
                return result
            else:
                del self._query_cache[cache_key]
        return None

    async def _cache_result(self, cache_key: str, result: MemoryResult) -> None:
        """Cache retrieval result."""
        # Limit cache size
        if len(self._query_cache) > 1000:
            # Remove oldest entries
            oldest_keys = sorted(
                self._query_cache.keys(),
                key=lambda k: self._query_cache[k][1]
            )[:100]
            for key in oldest_keys:
                del self._query_cache[key]

        self._query_cache[cache_key] = (result, datetime.now())

    async def batch_retrieve(self, queries: List[MemoryQuery]) -> List[MemoryResult]:
        """Retrieve entries for multiple queries."""
        if self.config.parallel_search:
            tasks = [self.retrieve(query) for query in queries]
            return await asyncio.gather(*tasks)
        else:
            return [await self.retrieve(query) for query in queries]

    def get_stats(self) -> Dict[str, Any]:
        """Get retrieval statistics."""
        stats = self._stats.copy()

        if stats["total_queries"] > 0:
            stats["cache_hit_rate"] = stats["cache_hits"] / stats["total_queries"]
            stats["expansion_rate"] = stats["expansions"] / stats["total_queries"]
            stats["reranking_rate"] = stats["rerankings"] / stats["total_queries"]
        else:
            stats["cache_hit_rate"] = 0.0
            stats["expansion_rate"] = 0.0
            stats["reranking_rate"] = 0.0

        stats["cache_size"] = len(self._query_cache)
        stats["expansion_cache_size"] = len(self._expansion_cache)

        return stats

    async def provide_feedback(self, feedback: RetrievalFeedback) -> None:
        """Provide feedback for learning."""
        await self.feedback_learner.update_feedback(feedback)
        self._stats["feedback_updates"] += 1

    async def clear_cache(self) -> None:
        """Clear all caches."""
        self._query_cache.clear()
        self._expansion_cache.clear()


class QueryExpander:
    """Query expansion using various techniques."""

    def __init__(self, memory: BaseMemory, embedding_provider: Optional[AdvancedEmbeddingProvider] = None):
        self.memory = memory
        self.embedding_provider = embedding_provider
        self.tfidf_vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self._is_initialized = False

    async def initialize(self) -> None:
        """Initialize the query expander."""
        if self._is_initialized:
            return

        # Build vocabulary from existing memories
        try:
            entries = await self.memory.list_entries(limit=5000)
            documents = [entry.content for entry in entries if entry.content]

            if documents:
                self.tfidf_vectorizer.fit(documents)
                self._is_initialized = True
        except Exception as e:
            print(f"Warning: Query expander initialization failed: {e}")

    async def expand_query(self, query: MemoryQuery) -> Optional[QueryExpansion]:
        """Expand query with related terms."""
        if not self._is_initialized:
            await self.initialize()

        if not self._is_initialized:
            return None

        try:
            # Method 1: TF-IDF based expansion
            tfidf_expansion = await self._tfidf_expansion(query)

            # Method 2: Embedding-based expansion
            embedding_expansion = await self._embedding_expansion(query) if self.embedding_provider else None

            # Method 3: Tag-based expansion
            tag_expansion = await self._tag_expansion(query)

            # Combine expansions
            all_terms = []
            confidence = 0.0

            if tfidf_expansion:
                all_terms.extend(tfidf_expansion.terms)
                confidence += tfidf_expansion.confidence * 0.4

            if embedding_expansion:
                all_terms.extend(embedding_expansion.terms)
                confidence += embedding_expansion.confidence * 0.4

            if tag_expansion:
                all_terms.extend(tag_expansion.terms)
                confidence += tag_expansion.confidence * 0.2

            if not all_terms:
                return None

            # Remove duplicates and limit
            unique_terms = list(set(all_terms))[:5]

            return QueryExpansion(
                expanded_terms=unique_terms,
                original_query=query.query,
                expansion_method="hybrid",
                confidence=min(confidence, 1.0)
            )

        except Exception as e:
            print(f"Warning: Query expansion failed: {e}")
            return None

    async def _tfidf_expansion(self, query: MemoryQuery) -> Optional[QueryExpansion]:
        """TF-IDF based query expansion."""
        try:
            # Transform query
            query_vec = self.tfidf_vectorizer.transform([query.query])

            # Get feature names
            feature_names = self.tfidf_vectorizer.get_feature_names_out()

            # Find related terms (simplified)
            query_terms = query.query.lower().split()
            expanded_terms = []

            for term in feature_names:
                if term not in query_terms and len(term) > 2:
                    # Simple similarity check (could be improved)
                    for query_term in query_terms:
                        if term.startswith(query_term[:3]) or query_term.startswith(term[:3]):
                            expanded_terms.append(term)
                            break

            if expanded_terms:
                return QueryExpansion(
                    expanded_terms=expanded_terms[:3],
                    original_query=query.query,
                    expansion_method="tfidf",
                    confidence=0.6
                )

        except Exception:
            pass

        return None

    async def _embedding_expansion(self, query: MemoryQuery) -> Optional[QueryExpansion]:
        """Embedding-based query expansion."""
        try:
            # Generate query embedding
            query_embedding = await self.embedding_provider.embed(query.query)

            # Find similar entries
            similar_query = MemoryQuery(
                query=query.query,
                limit=10,
                query_type=query.query_type,
            )
            similar_results = await self.memory.query(similar_query)

            # Extract terms from similar entries
            expanded_terms = []
            for entry in similar_results.entries[:3] if hasattr(similar_results, 'entries') else similar_results[:3]:
                # Extract important terms from entry content
                terms = entry.content.lower().split()
                for term in terms:
                    if len(term) > 3 and term not in query.query.lower():
                        expanded_terms.append(term)

            if expanded_terms:
                return QueryExpansion(
                    expanded_terms=list(set(expanded_terms))[:3],
                    original_query=query.query,
                    expansion_method="embedding",
                    confidence=0.7
                )

        except Exception:
            pass

        return None

    async def _tag_expansion(self, query: MemoryQuery) -> Optional[QueryExpansion]:
        """Tag-based query expansion."""
        try:
            # Find entries with similar tags
            tag_query = MemoryQuery(
                query="",
                tags=query.tags[:2] if query.tags else [],
                limit=5,
                query_type=query.query_type,
            )
            tag_results = await self.memory.query(tag_query)

            # Extract tags from results
            expanded_terms = []
            for entry in tag_results.entries[:3] if hasattr(tag_results, 'entries') else tag_results[:3]:
                if entry.metadata.tags:
                    expanded_terms.extend(entry.metadata.tags)

            if expanded_terms:
                return QueryExpansion(
                    expanded_terms=list(set(expanded_terms))[:3],
                    original_query=query.query,
                    expansion_method="tag",
                    confidence=0.5
                )

        except Exception:
            pass

        return None


class AdvancedReranker:
    """Advanced reranking using multiple signals."""

    def __init__(self, config: RetrievalConfig):
        self.config = config

    async def rerank(self, results: MemoryResult, query: MemoryQuery) -> MemoryResult:
        """Rerank results using advanced algorithms."""
        if len(results.entries) <= 1:
            return results

        try:
            # Calculate multiple ranking signals
            for entry in results.entries:
                signals = await self._calculate_ranking_signals(entry, query, results.entries)
                entry.metadata.ranking_signals = signals

            # Apply learning-to-rank if available
            if hasattr(self, 'ranker_model'):
                await self._apply_learning_to_rank(results.entries, query)
            else:
                await self._apply_feature_based_ranking(results.entries, query)

            # Sort by new scores
            results.entries.sort(key=lambda x: x.metadata.relevance, reverse=True)

            return results

        except Exception as e:
            print(f"Warning: Reranking failed: {e}")
            return results

    async def _calculate_ranking_signals(
        self,
        entry: MemoryEntry,
        query: MemoryQuery,
        all_entries: List[MemoryEntry],
    ) -> Dict[str, float]:
        """Calculate multiple ranking signals for an entry."""
        signals = {}

        # Relevance signal (original)
        signals["relevance"] = entry.metadata.relevance

        # Freshness signal
        days_old = (datetime.now() - entry.updated_at).days
        signals["freshness"] = math.exp(-days_old / 30)  # 30-day half-life

        # Popularity signal
        max_access = max((e.access_count for e in all_entries), default=1)
        signals["popularity"] = entry.access_count / max_access

        # Diversity signal (inverse of average similarity)
        similarities = []
        for other in all_entries:
            if other.id != entry.id:
                sim = self._calculate_similarity(entry, other)
                similarities.append(sim)

        if similarities:
            avg_similarity = sum(similarities) / len(similarities)
            signals["diversity"] = 1.0 - avg_similarity
        else:
            signals["diversity"] = 1.0

        # Quality signal
        signals["quality"] = entry.metadata.quality_score or 0.5

        # Length signal (prefer medium-length entries)
        content_length = len(entry.content)
        if content_length < 100:
            signals["length"] = 0.3
        elif content_length > 2000:
            signals["length"] = 0.5
        else:
            signals["length"] = 1.0

        return signals

    def _calculate_similarity(self, entry1: MemoryEntry, entry2: MemoryEntry) -> float:
        """Calculate similarity between two entries."""
        # Simple similarity calculation
        if hasattr(entry1, 'embedding') and hasattr(entry2, 'embedding'):
            if entry1.embedding and entry2.embedding:
                return cosine_similarity(entry1.embedding, entry2.embedding)

        # Fallback to text similarity
        set1 = set(entry1.content.lower().split())
        set2 = set(entry2.content.lower().split())
        intersection = set1 & set2
        union = set1 | set2

        return len(intersection) / len(union) if union else 0.0

    async def _apply_feature_based_ranking(self, entries: List[MemoryEntry], query: MemoryQuery) -> None:
        """Apply feature-based ranking using weighted signals."""
        # Define weights for different signals
        weights = {
            "relevance": 0.4,
            "freshness": 0.15,
            "popularity": 0.15,
            "diversity": 0.1,
            "quality": 0.15,
            "length": 0.05,
        }

        for entry in entries:
            if hasattr(entry.metadata, 'ranking_signals'):
                signals = entry.metadata.ranking_signals

                # Calculate weighted score
                score = sum(weights.get(signal, 0) * value for signal, value in signals.items())

                # Update relevance with new score
                entry.metadata.relevance = score

    async def _apply_learning_to_rank(self, entries: List[MemoryEntry], query: MemoryQuery) -> None:
        """Apply learning-to-rank model if available."""
        # This would use a trained model for reranking
        # Implementation depends on the specific model used
        pass


class FeedbackLearner:
    """Learning from user feedback."""

    def __init__(self, config: RetrievalConfig):
        self.config = config
        self.feedback_history: List[RetrievalFeedback] = []

    async def update_feedback(self, feedback: RetrievalFeedback) -> None:
        """Update learning model with new feedback."""
        self.feedback_history.append(feedback)

        # Keep only recent feedback
        cutoff_date = datetime.now() - timedelta(days=30)
        self.feedback_history = [
            f for f in self.feedback_history
            if f.timestamp > cutoff_date
        ]

        # Update model (simplified)
        await self._update_model()

    async def _update_model(self) -> None:
        """Update the learning model."""
        # This would implement actual model updating
        # For now, just store the feedback
        pass