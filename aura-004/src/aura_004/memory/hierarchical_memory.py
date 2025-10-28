"""
Hierarchical memory system for AURA-004.

This module provides a sophisticated hierarchical memory architecture with
multiple levels of abstraction, context-aware storage, and intelligent
consolidation mechanisms.
"""

import asyncio
import json
import uuid
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, Tuple, Union, Set
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from enum import Enum
import hashlib
import networkx as nx
import numpy as np

from aura_004.memory.base import BaseMemory, MemoryQuery, MemoryResult, MemoryEntry
from aura_004.memory.schemas import MemoryMetadata, MemoryEntry
from aura_004.memory.chroma_memory import ChromaMemory
from aura_004.memory.advanced_embeddings import AdvancedEmbeddingProvider
from aura_004.core.exceptions import MemoryError


class MemoryLevel(Enum):
    """Hierarchical memory levels."""

    WORKING = "working"          # Immediate context (current session)
    EPISODIC = "episodic"        # Recent experiences (last few sessions)
    SEMANTIC = "semantic"        # General knowledge and concepts
    PROCEDURAL = "procedural"    # Skills and procedures
    LONG_TERM = "long_term"      # Persistent, consolidated knowledge


class MemoryType(Enum):
    """Types of memory entries."""

    FACT = "fact"                # Factual information
    PROCEDURE = "procedure"       # Step-by-step processes
    CONCEPT = "concept"          # Abstract concepts
    EXPERIENCE = "experience"    # Personal experiences
    SKILL = "skill"              # Learned abilities
    REFLECTION = "reflection"     # Metacognitive insights
    PATTERN = "pattern"          # Recognized patterns
    RELATIONSHIP = "relationship" # Relationships between concepts


@dataclass
class MemoryNode:
    """Node in hierarchical memory structure."""

    id: str
    content: str
    level: MemoryLevel
    memory_type: MemoryType
    metadata: MemoryMetadata
    embedding: Optional[List[float]] = None
    children: List[str] = field(default_factory=list)
    parent: Optional[str] = None
    connections: Dict[str, float] = field(default_factory=dict)  # connection_id -> strength
    consolidation_score: float = 0.0
    access_frequency: float = 0.0
    last_accessed: datetime = field(default_factory=datetime.now)
    created_at: datetime = field(default_factory=datetime.now)


@dataclass
class ConsolidationConfig:
    """Configuration for memory consolidation."""

    consolidation_interval: timedelta = timedelta(hours=1)
    consolidation_threshold: float = 0.7
    max_working_memory_size: int = 100
    max_episodic_memory_size: int = 1000
    semantic_consolidation_interval: timedelta = timedelta(days=1)
    long_term_consolidation_interval: timedelta = timedelta(weeks=1)

    # Forgetting parameters
    decay_rate: float = 0.1
    importance_threshold: float = 0.3
    rehearsal_boost: float = 0.2


class HierarchicalMemory(BaseMemory):
    """Hierarchical memory system with multiple levels."""

    def __init__(
        self,
        embedding_provider: Optional[AdvancedEmbeddingProvider] = None,
        consolidation_config: Optional[ConsolidationConfig] = None,
        **kwargs,
    ):
        super().__init__(**kwargs)
        self.embedding_provider = embedding_provider
        self.config = consolidation_config or ConsolidationConfig()

        # Memory storage by level
        self.memory_levels: Dict[MemoryLevel, Dict[str, MemoryNode]] = {
            level: {} for level in MemoryLevel
        }

        # Memory graph for relationships
        self.memory_graph = nx.DiGraph()

        # Consolidation state
        self.last_consolidation = datetime.now()
        self.consolidation_queue: List[str] = []

        # Access patterns
        self.access_patterns: Dict[str, List[datetime]] = {}

        # Statistics
        self.stats = {
            "total_memories": 0,
            "memories_by_level": {level.value: 0 for level in MemoryLevel},
            "consolidations": 0,
            "forgotten_memories": 0,
        }

    async def initialize(self) -> None:
        """Initialize the hierarchical memory system."""
        if self.embedding_provider:
            await self.embedding_provider.initialize()

    async def add(
        self,
        content: str,
        level: MemoryLevel = MemoryLevel.WORKING,
        memory_type: MemoryType = MemoryType.FACT,
        metadata: Optional[Dict[str, Any]] = None,
        parent_id: Optional[str] = None,
        connections: Optional[Dict[str, float]] = None,
    ) -> str:
        """Add a memory entry to the hierarchical system."""
        try:
            # Generate unique ID
            memory_id = str(uuid.uuid4())

            # Create metadata
            memory_metadata = MemoryMetadata(
                source="hierarchical_memory",
                category=memory_type.value,
                tags=metadata.get("tags", []) if metadata else [],
                access_level=metadata.get("access_level", "standard") if metadata else "standard",
                quality_score=metadata.get("quality_score", 1.0) if metadata else 1.0,
            )

            # Generate embedding
            embedding = None
            if self.embedding_provider:
                embedding = await self.embedding_provider.embed(
                    content,
                    metadata=metadata or {}
                )

            # Create memory node
            memory_node = MemoryNode(
                id=memory_id,
                content=content,
                level=level,
                memory_type=memory_type,
                metadata=memory_metadata,
                embedding=embedding,
                parent=parent_id,
                connections=connections or {},
                created_at=datetime.now(),
            )

            # Store in appropriate level
            self.memory_levels[level][memory_id] = memory_node

            # Update graph
            self.memory_graph.add_node(memory_id, **memory_node.__dict__)

            # Add parent relationship
            if parent_id:
                self.memory_graph.add_edge(parent_id, memory_id)
                if parent_id in self.memory_levels[level]:
                    self.memory_levels[level][parent_id].children.append(memory_id)

            # Add connections
            if connections:
                for conn_id, strength in connections.items():
                    self.memory_graph.add_edge(memory_id, conn_id, weight=strength)
                    memory_node.connections[conn_id] = strength

            # Update access patterns
            self.access_patterns[memory_id] = [datetime.now()]

            # Update statistics
            self.stats["total_memories"] += 1
            self.stats["memories_by_level"][level.value] += 1

            # Check if consolidation is needed
            await self._check_consolidation(level)

            return memory_id

        except Exception as e:
            raise MemoryError(f"Failed to add memory: {e}") from e

    async def get(self, memory_id: str) -> Optional[MemoryNode]:
        """Get a memory node by ID."""
        for level_memories in self.memory_levels.values():
            if memory_id in level_memories:
                memory_node = level_memories[memory_id]

                # Update access
                memory_node.last_accessed = datetime.now()
                memory_node.access_frequency += 0.1

                if memory_id in self.access_patterns:
                    self.access_patterns[memory_id].append(datetime.now())
                    # Keep only recent access patterns
                    self.access_patterns[memory_id] = self.access_patterns[memory_id][-100:]
                else:
                    self.access_patterns[memory_id] = [datetime.now()]

                return memory_node

        return None

    async def update(self, memory_id: str, updates: Dict[str, Any]) -> bool:
        """Update a memory entry."""
        memory_node = await self.get(memory_id)
        if not memory_node:
            return False

        try:
            # Update fields
            for field, value in updates.items():
                if hasattr(memory_node, field):
                    setattr(memory_node, field, value)

            # Regenerate embedding if content changed
            if "content" in updates and self.embedding_provider:
                memory_node.embedding = await self.embedding_provider.embed(
                    memory_node.content,
                    metadata=memory_node.metadata.__dict__
                )

            # Update graph
            for attr, value in memory_node.__dict__.items():
                if not attr.startswith('_'):
                    self.memory_graph.nodes[memory_id][attr] = value

            return True

        except Exception as e:
            raise MemoryError(f"Failed to update memory {memory_id}: {e}") from e

    async def delete(self, memory_id: str) -> bool:
        """Delete a memory entry."""
        for level, level_memories in self.memory_levels.items():
            if memory_id in level_memories:
                memory_node = level_memories[memory_id]

                # Remove from parent's children
                if memory_node.parent:
                    parent_node = await self.get(memory_node.parent)
                    if parent_node and memory_id in parent_node.children:
                        parent_node.children.remove(memory_id)

                # Remove children connections
                for child_id in memory_node.children:
                    child_node = await self.get(child_id)
                    if child_node:
                        child_node.parent = None

                # Remove from graph
                if memory_id in self.memory_graph:
                    self.memory_graph.remove_node(memory_id)

                # Remove from storage
                del level_memories[memory_id]

                # Update statistics
                self.stats["total_memories"] -= 1
                self.stats["memories_by_level"][level.value] -= 1

                # Clean up access patterns
                if memory_id in self.access_patterns:
                    del self.access_patterns[memory_id]

                return True

        return False

    async def query(self, query: MemoryQuery) -> MemoryResult:
        """Query the hierarchical memory system."""
        start_time = asyncio.get_event_loop().time()
        all_matches = []

        try:
            # Determine which levels to search
            levels_to_search = self._get_search_levels(query)

            # Search each level
            for level in levels_to_search:
                level_matches = await self._search_level(level, query)
                all_matches.extend(level_matches)

            # Apply global ranking and filtering
            ranked_matches = await self._rank_results(all_matches, query)

            # Convert to MemoryEntry format
            entries = []
            for memory_node in ranked_matches:
                entry = MemoryEntry(
                    id=memory_node.id,
                    content=memory_node.content,
                    memory_type=memory_node.memory_type.value,
                    metadata=memory_node.metadata,
                    embedding=memory_node.embedding,
                    created_at=memory_node.created_at,
                    updated_at=memory_node.last_accessed,
                    access_count=len(self.access_patterns.get(memory_node.id, [])),
                )
                entry.metadata.relevance = memory_node.access_frequency
                entries.append(entry)

            # Create result
            result = MemoryResult(
                query=query.query,
                entries=entries[:query.limit],
                total_count=len(entries),
                returned_count=min(len(entries), query.limit),
                query_time=asyncio.get_event_loop().time() - start_time,
            )

            # Calculate quality metrics
            result.calculate_quality_metrics()

            return result

        except Exception as e:
            raise MemoryError(f"Memory query failed: {e}") from e

    async def _get_search_levels(self, query: MemoryQuery) -> List[MemoryLevel]:
        """Determine which levels to search based on query."""
        levels = []

        # Always search working memory for immediate context
        levels.append(MemoryLevel.WORKING)

        # Add other levels based on query characteristics
        if query.query_type == "recent" or query.metadata.get("temporal"):
            levels.append(MemoryLevel.EPISODIC)

        if query.query_type == "knowledge" or query.query_type == "concept":
            levels.extend([MemoryLevel.SEMANTIC, MemoryLevel.LONG_TERM])

        if query.query_type == "procedure" or query.query_type == "skill":
            levels.append(MemoryLevel.PROCEDURAL)

        # Default to all levels if no specific type
        if not levels or query.metadata.get("comprehensive"):
            levels = list(MemoryLevel)

        return levels

    async def _search_level(self, level: MemoryLevel, query: MemoryQuery) -> List[MemoryNode]:
        """Search a specific memory level."""
        level_memories = self.memory_levels[level]
        matches = []

        # Text-based matching
        for memory_node in level_memories.values():
            if self._matches_query(memory_node, query):
                matches.append(memory_node)

        # Semantic search if embeddings available
        if self.embedding_provider and query.query:
            query_embedding = await self.embedding_provider.embed(query.query)

            semantic_matches = []
            for memory_node in level_memories.values():
                if memory_node.embedding:
                    similarity = self._cosine_similarity(query_embedding, memory_node.embedding)
                    if similarity >= 0.5:  # Threshold for semantic similarity
                        memory_node.metadata.relevance = similarity
                        semantic_matches.append(memory_node)

            # Merge text and semantic matches
            all_matches = list({node.id: node for node in matches + semantic_matches}.values())
        else:
            all_matches = matches

        return all_matches

    def _matches_query(self, memory_node: MemoryNode, query: MemoryQuery) -> bool:
        """Check if memory node matches query criteria."""
        # Text matching
        if query.query and query.query.lower() in memory_node.content.lower():
            return True

        # Memory type matching
        if query.query_type and query.query_type == memory_node.memory_type.value:
            return True

        # Tag matching
        if query.tags and any(tag in memory_node.metadata.tags for tag in query.tags):
            return True

        # Category matching
        if query.categories and memory_node.metadata.category in query.categories:
            return True

        return False

    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Calculate cosine similarity between two vectors."""
        if not vec1 or not vec2 or len(vec1) != len(vec2):
            return 0.0

        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        magnitude1 = sum(a * a for a in vec1) ** 0.5
        magnitude2 = sum(b * b for b in vec2) ** 0.5

        if magnitude1 == 0 or magnitude2 == 0:
            return 0.0

        return dot_product / (magnitude1 * magnitude2)

    async def _rank_results(self, matches: List[MemoryNode], query: MemoryQuery) -> List[MemoryNode]:
        """Rank search results by relevance."""
        if not matches:
            return matches

        # Calculate relevance scores
        for match in matches:
            score = 0.0

            # Access frequency score
            score += match.access_frequency * 0.3

            # Recency score
            days_old = (datetime.now() - match.last_accessed).days
            recency_score = max(0, 1.0 - days_old / 30)  # 30-day decay
            score += recency_score * 0.2

            # Level priority score
            level_scores = {
                MemoryLevel.WORKING: 1.0,
                MemoryLevel.EPISODIC: 0.8,
                MemoryLevel.SEMANTIC: 0.6,
                MemoryLevel.PROCEDURAL: 0.7,
                MemoryLevel.LONG_TERM: 0.5,
            }
            score += level_scores.get(match.level, 0.5) * 0.2

            # Quality score
            score += (match.metadata.quality_score or 0.5) * 0.2

            # Connection strength score
            if match.connections:
                avg_connection_strength = sum(match.connections.values()) / len(match.connections)
                score += avg_connection_strength * 0.1

            match.metadata.relevance = score

        # Sort by relevance
        matches.sort(key=lambda x: x.metadata.relevance, reverse=True)

        return matches

    async def _check_consolidation(self, level: MemoryLevel) -> None:
        """Check if consolidation is needed for a level."""
        now = datetime.now()

        # Time-based consolidation
        if level == MemoryLevel.WORKING:
            if len(self.memory_levels[level]) > self.config.max_working_memory_size:
                await self._consolidate_working_memory()
        elif level == MemoryLevel.EPISODIC:
            if (now - self.last_consolidation) > self.config.consolidation_interval:
                await self._consolidate_episodic_memory()
        elif level == MemoryLevel.SEMANTIC:
            if (now - self.last_consolidation) > self.config.semantic_consolidation_interval:
                await self._consolidate_semantic_memory()

    async def _consolidate_working_memory(self) -> None:
        """Consolidate working memory to episodic level."""
        working_memories = list(self.memory_levels[MemoryLevel.WORKING].values())

        # Sort by consolidation score
        for memory in working_memories:
            memory.consolidation_score = await self._calculate_consolidation_score(memory)

        working_memories.sort(key=lambda x: x.consolidation_score, reverse=True)

        # Move top memories to episodic
        to_consolidate = working_memories[:self.config.max_working_memory_size // 2]

        for memory in to_consolidate:
            await self._promote_memory(memory, MemoryLevel.EPISODIC)

        # Remove excess working memories
        excess_count = len(self.memory_levels[MemoryLevel.WORKING]) - self.config.max_working_memory_size
        if excess_count > 0:
            await self._forget_excess_memories(MemoryLevel.WORKING, excess_count)

        self.stats["consolidations"] += 1

    async def _consolidate_episodic_memory(self) -> None:
        """Consolidate episodic memory to semantic level."""
        episodic_memories = list(self.memory_levels[MemoryLevel.EPISODIC].values())

        # Group related memories
        memory_groups = await self._group_related_memories(episodic_memories)

        # Create semantic memories from groups
        for group in memory_groups:
            if len(group) > 1:  # Only consolidate groups with multiple memories
                await self._create_semantic_memory(group)

        self.stats["consolidations"] += 1

    async def _consolidate_semantic_memory(self) -> None:
        """Consolidate semantic memory to long-term level."""
        semantic_memories = list(self.memory_levels[MemoryLevel.SEMANTIC].values())

        # Promote important semantic memories to long-term
        for memory in semantic_memories:
            importance = await self._calculate_importance(memory)
            if importance >= self.config.importance_threshold:
                await self._promote_memory(memory, MemoryLevel.LONG_TERM)

        self.stats["consolidations"] += 1

    async def _calculate_consolidation_score(self, memory: MemoryNode) -> float:
        """Calculate consolidation score for a memory."""
        score = 0.0

        # Access frequency
        score += memory.access_frequency * 0.4

        # Recency
        days_old = (datetime.now() - memory.last_accessed).days
        recency_score = max(0, 1.0 - days_old / 7)  # 7-day window
        score += recency_score * 0.3

        # Quality
        score += (memory.metadata.quality_score or 0.5) * 0.2

        # Connections
        if memory.connections:
            avg_connection_strength = sum(memory.connections.values()) / len(memory.connections)
            score += avg_connection_strength * 0.1

        return score

    async def _calculate_importance(self, memory: MemoryNode) -> float:
        """Calculate importance score for long-term storage."""
        importance = 0.0

        # Long-term access pattern
        if memory.id in self.access_patterns:
            access_times = self.access_patterns[memory.id]
            if len(access_times) > 1:
                # Calculate access frequency over time
                time_span = (access_times[-1] - access_times[0]).days
                if time_span > 0:
                    access_frequency = len(access_times) / time_span
                    importance += min(access_frequency / 10, 1.0) * 0.4

        # Quality score
        importance += (memory.metadata.quality_score or 0.5) * 0.3

        # Network centrality
        if memory.id in self.memory_graph:
            centrality = nx.degree_centrality(self.memory_graph)
            importance += centrality.get(memory.id, 0) * 0.2

        # Content length (longer memories might be more important)
        content_score = min(len(memory.content) / 1000, 1.0)
        importance += content_score * 0.1

        return importance

    async def _promote_memory(self, memory: MemoryNode, target_level: MemoryLevel) -> None:
        """Promote memory to higher level."""
        # Remove from current level
        current_level = memory.level
        if memory.id in self.memory_levels[current_level]:
            del self.memory_levels[current_level][memory.id]

        # Update memory level
        memory.level = target_level
        memory.consolidation_score = 0.0

        # Add to target level
        self.memory_levels[target_level][memory.id] = memory

        # Update statistics
        self.stats["memories_by_level"][current_level.value] -= 1
        self.stats["memories_by_level"][target_level.value] += 1

    async def _group_related_memories(self, memories: List[MemoryNode]) -> List[List[MemoryNode]]:
        """Group related memories for consolidation."""
        groups = []
        ungrouped = memories.copy()

        while ungrouped:
            # Start a new group with the first ungrouped memory
            current_group = [ungrouped.pop(0)]

            # Find related memories
            related = []
            for memory in ungrouped[:]:
                if await self._are_related(current_group[0], memory):
                    related.append(memory)
                    ungrouped.remove(memory)

            current_group.extend(related)

            if len(current_group) > 1:
                groups.append(current_group)

        return groups

    async def _are_related(self, memory1: MemoryNode, memory2: MemoryNode) -> bool:
        """Check if two memories are related."""
        # Check direct connections
        if memory2.id in memory1.connections or memory1.id in memory2.connections:
            return True

        # Check semantic similarity
        if memory1.embedding and memory2.embedding:
            similarity = self._cosine_similarity(memory1.embedding, memory2.embedding)
            if similarity > 0.7:
                return True

        # Check tag overlap
        if memory1.metadata.tags and memory2.metadata.tags:
            common_tags = set(memory1.metadata.tags) & set(memory2.metadata.tags)
            if len(common_tags) > 0:
                return True

        # Check content similarity
        content_similarity = self._content_similarity(memory1.content, memory2.content)
        if content_similarity > 0.6:
            return True

        return False

    def _content_similarity(self, content1: str, content2: str) -> float:
        """Calculate content similarity using simple overlap."""
        words1 = set(content1.lower().split())
        words2 = set(content2.lower().split())

        if not words1 or not words2:
            return 0.0

        intersection = words1 & words2
        union = words1 | words2

        return len(intersection) / len(union)

    async def _create_semantic_memory(self, memory_group: List[MemoryNode]) -> None:
        """Create a semantic memory from a group of related memories."""
        # Combine content from group
        combined_content = "\n\n".join([memory.content for memory in memory_group])

        # Create semantic memory
        semantic_id = await self.add(
            content=combined_content,
            level=MemoryLevel.SEMANTIC,
            memory_type=MemoryType.CONCEPT,
            metadata={
                "source": "consolidation",
                "source_memories": [memory.id for memory in memory_group],
                "consolidation_date": datetime.now().isoformat(),
            }
        )

        # Link to source memories
        semantic_memory = await self.get(semantic_id)
        if semantic_memory:
            for memory in memory_group:
                semantic_memory.connections[memory.id] = 0.8
                memory.connections[semantic_id] = 0.8

    async def _forget_excess_memories(self, level: MemoryLevel, count: int) -> None:
        """Forget excess memories from a level."""
        level_memories = list(self.memory_levels[level].values())

        # Sort by consolidation score (lowest first)
        level_memories.sort(key=lambda x: x.consolidation_score)

        # Forget the lowest scoring memories
        for memory in level_memories[:count]:
            await self.delete(memory.id)
            self.stats["forgotten_memories"] += 1

    async def reinforce_memory(self, memory_id: str, boost: float = 0.1) -> bool:
        """Reinforce a memory to prevent forgetting."""
        memory_node = await self.get(memory_id)
        if not memory_node:
            return False

        # Boost access frequency and consolidation score
        memory_node.access_frequency += boost
        memory_node.consolidation_score += boost

        # Boost connected memories
        for conn_id in memory_node.connections:
            conn_memory = await self.get(conn_id)
            if conn_memory:
                conn_memory.consolidation_score += boost * 0.5

        return True

    async def get_memory_path(self, memory_id: str) -> List[str]:
        """Get the hierarchical path to a memory."""
        path = []
        current_id = memory_id

        while current_id:
            current_memory = await self.get(current_id)
            if not current_memory:
                break

            path.append(current_id)
            current_id = current_memory.parent

        return list(reversed(path))

    async def get_related_memories(self, memory_id: str, max_depth: int = 2) -> List[MemoryNode]:
        """Get memories related to a given memory."""
        memory_node = await self.get(memory_id)
        if not memory_node:
            return []

        related = set()
        queue = [(memory_id, 0)]

        while queue:
            current_id, depth = queue.pop(0)

            if depth >= max_depth:
                continue

            current_memory = await self.get(current_id)
            if not current_memory:
                continue

            # Add connected memories
            for conn_id in current_memory.connections:
                if conn_id not in related:
                    related.add(conn_id)
                    queue.append((conn_id, depth + 1))

            # Add children
            for child_id in current_memory.children:
                if child_id not in related:
                    related.add(child_id)
                    queue.append((child_id, depth + 1))

            # Add parent
            if current_memory.parent and current_memory.parent not in related:
                related.add(current_memory.parent)
                queue.append((current_memory.parent, depth + 1))

        # Convert to MemoryNode list
        result = []
        for mem_id in related:
            memory = await self.get(mem_id)
            if memory:
                result.append(memory)

        return result

    def get_statistics(self) -> Dict[str, Any]:
        """Get memory system statistics."""
        stats = self.stats.copy()

        # Calculate memory distribution
        total_memories = sum(
            len(memories) for memories in self.memory_levels.values()
        )
        stats["memory_distribution"] = {
            level.value: len(memories) / total_memories if total_memories > 0 else 0
            for level, memories in self.memory_levels.items()
        }

        # Graph statistics
        if self.memory_graph.number_of_nodes() > 0:
            stats["graph_stats"] = {
                "nodes": self.memory_graph.number_of_nodes(),
                "edges": self.memory_graph.number_of_edges(),
                "density": nx.density(self.memory_graph),
                "avg_degree": sum(dict(self.memory_graph.degree()).values()) / self.memory_graph.number_of_nodes(),
            }

        # Consolidation stats
        stats["last_consolidation"] = self.last_consolidation.isoformat()

        return stats

    async def export_memory(self, format: str = "json") -> str:
        """Export memory data."""
        export_data = {
            "metadata": {
                "export_date": datetime.now().isoformat(),
                "total_memories": self.stats["total_memories"],
                "version": "1.0",
            },
            "memories": []
        }

        for level, memories in self.memory_levels.items():
            for memory_node in memories.values():
                memory_data = {
                    "id": memory_node.id,
                    "content": memory_node.content,
                    "level": memory_node.level.value,
                    "memory_type": memory_node.memory_type.value,
                    "metadata": memory_node.metadata.__dict__,
                    "parent": memory_node.parent,
                    "children": memory_node.children,
                    "connections": memory_node.connections,
                    "access_frequency": memory_node.access_frequency,
                    "consolidation_score": memory_node.consolidation_score,
                    "created_at": memory_node.created_at.isoformat(),
                    "last_accessed": memory_node.last_accessed.isoformat(),
                }
                export_data["memories"].append(memory_data)

        if format == "json":
            return json.dumps(export_data, indent=2)
        else:
            raise ValueError(f"Unsupported export format: {format}")

    async def import_memory(self, data: str, format: str = "json") -> int:
        """Import memory data."""
        if format == "json":
            import_data = json.loads(data)
        else:
            raise ValueError(f"Unsupported import format: {format}")

        imported_count = 0

        for memory_data in import_data.get("memories", []):
            try:
                # Convert data back to objects
                level = MemoryLevel(memory_data["level"])
                memory_type = MemoryType(memory_data["memory_type"])
                metadata = MemoryMetadata(**memory_data["metadata"])

                memory_node = MemoryNode(
                    id=memory_data["id"],
                    content=memory_data["content"],
                    level=level,
                    memory_type=memory_type,
                    metadata=metadata,
                    parent=memory_data.get("parent"),
                    children=memory_data.get("children", []),
                    connections=memory_data.get("connections", {}),
                    access_frequency=memory_data.get("access_frequency", 0.0),
                    consolidation_score=memory_data.get("consolidation_score", 0.0),
                    created_at=datetime.fromisoformat(memory_data["created_at"]),
                    last_accessed=datetime.fromisoformat(memory_data["last_accessed"]),
                )

                # Store in appropriate level
                self.memory_levels[level][memory_node.id] = memory_node

                # Update graph
                self.memory_graph.add_node(memory_node.id, **memory_node.__dict__)

                imported_count += 1

            except Exception as e:
                print(f"Failed to import memory {memory_data.get('id', 'unknown')}: {e}")

        # Update statistics
        self.stats["total_memories"] += imported_count
        for level in MemoryLevel:
            self.stats["memories_by_level"][level.value] = len(self.memory_levels[level])

        return imported_count

    async def list_entries(self, limit: int = 100, level: Optional[MemoryLevel] = None) -> List[MemoryNode]:
        """List memory entries."""
        entries = []

        if level:
            level_memories = self.memory_levels[level]
            entries = list(level_memories.values())
        else:
            for level_memories in self.memory_levels.values():
                entries.extend(level_memories.values())

        # Sort by last accessed
        entries.sort(key=lambda x: x.last_accessed, reverse=True)

        return entries[:limit]

    async def search_by_metadata(self, filters: Dict[str, Any], limit: int = 100) -> List[MemoryNode]:
        """Search memories by metadata filters."""
        matches = []

        for level_memories in self.memory_levels.values():
            for memory_node in level_memories.values():
                if self._matches_metadata_filters(memory_node, filters):
                    matches.append(memory_node)

        # Sort by relevance
        matches.sort(key=lambda x: x.metadata.relevance or 0, reverse=True)

        return matches[:limit]

    def _matches_metadata_filters(self, memory_node: MemoryNode, filters: Dict[str, Any]) -> bool:
        """Check if memory node matches metadata filters."""
        for key, value in filters.items():
            if hasattr(memory_node.metadata, key):
                metadata_value = getattr(memory_node.metadata, key)
                if metadata_value != value:
                    return False
            elif hasattr(memory_node, key):
                node_value = getattr(memory_node, key)
                if node_value != value:
                    return False

        return True