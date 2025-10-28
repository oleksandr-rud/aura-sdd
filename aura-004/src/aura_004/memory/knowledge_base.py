"""
Knowledge base management for AURA-004.

This module provides knowledge base functionality including storage,
organization, and retrieval of structured knowledge.
"""

import asyncio
from typing import Any, Dict, List, Optional, Union, Set
from uuid import UUID, uuid4
from datetime import datetime, timedelta

from pydantic import BaseModel, Field

from aura_004.memory.base import BaseMemory
from aura_004.memory.schemas import KnowledgeBaseEntry, MemoryQuery, MemoryResult
from aura_004.memory.retrieval import MemoryRetriever, VectorRetriever
from aura_004.core.exceptions import MemoryError


class KnowledgeGraph(BaseModel):
    """Schema for knowledge graph relationships."""

    nodes: Dict[str, Dict[str, Any]] = Field(default_factory=dict)
    edges: List[Dict[str, Any]] = Field(default_factory=list)
    last_updated: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat(),
        }

    def add_node(self, node_id: str, node_data: Dict[str, Any]) -> None:
        """Add a node to the graph."""
        self.nodes[node_id] = {
            **node_data,
            "added_at": datetime.utcnow().isoformat(),
        }
        self.last_updated = datetime.utcnow()

    def add_edge(self, from_node: str, to_node: str, relationship: str, weight: float = 1.0) -> None:
        """Add an edge to the graph."""
        edge = {
            "from": from_node,
            "to": to_node,
            "relationship": relationship,
            "weight": weight,
            "added_at": datetime.utcnow().isoformat(),
        }
        self.edges.append(edge)
        self.last_updated = datetime.utcnow()

    def get_related_nodes(self, node_id: str, relationship: Optional[str] = None) -> List[str]:
        """Get nodes related to a given node."""
        related = []
        for edge in self.edges:
            if edge["from"] == node_id:
                if relationship is None or edge["relationship"] == relationship:
                    related.append(edge["to"])
        return related

    def get_shortest_path(self, from_node: str, to_node: str) -> Optional[List[str]]:
        """Find shortest path between two nodes."""
        if from_node not in self.nodes or to_node not in self.nodes:
            return None

        # Simple BFS implementation
        queue = [(from_node, [from_node])]
        visited = {from_node}

        while queue:
            current, path = queue.pop(0)

            if current == to_node:
                return path

            for edge in self.edges:
                if edge["from"] == current and edge["to"] not in visited:
                    visited.add(edge["to"])
                    queue.append((edge["to"], path + [edge["to"]]))

        return None


class KnowledgeBase(BaseModel):
    """Main knowledge base implementation."""

    name: str
    description: Optional[str] = None
    memory: BaseMemory
    retriever: MemoryRetriever

    # Knowledge graph
    graph: KnowledgeGraph = Field(default_factory=KnowledgeGraph)

    # Categories and domains
    domains: Dict[str, Set[str]] = Field(default_factory=dict)
    categories: Set[str] = Field(default_factory=set)

    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    entry_count: int = Field(default=0)

    # Settings
    auto_categorize: bool = Field(default=True)
    verify_entries: bool = Field(default=True)
    similarity_threshold: float = Field(default=0.8)

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            set: lambda v: list(v),
        }

    async def initialize(self) -> None:
        """Initialize the knowledge base."""
        await self.memory.initialize()

    async def add_entry(
        self,
        title: str,
        content: str,
        domain: str,
        topic: str,
        subtopic: Optional[str] = None,
        difficulty_level: int = 1,
        **kwargs,
    ) -> KnowledgeBaseEntry:
        """Add a new entry to the knowledge base."""
        # Create entry
        entry = KnowledgeBaseEntry(
            title=title,
            content=content,
            summary=kwargs.get("summary", self._generate_summary(content)),
            domain=domain,
            topic=topic,
            subtopic=subtopic,
            difficulty_level=difficulty_level,
            **kwargs,
        )

        # Store in memory
        memory_entry = await self._store_knowledge_entry(entry)
        entry.id = memory_entry.id

        # Update knowledge graph
        await self._update_knowledge_graph(entry)

        # Update categories and domains
        self._update_categories(entry)

        # Update metadata
        self.entry_count += 1
        self.updated_at = datetime.utcnow()

        # Auto-categorize if enabled
        if self.auto_categorize:
            await self._auto_categorize_entry(entry)

        return entry

    async def get_entry(self, entry_id: Union[str, UUID]) -> Optional[KnowledgeBaseEntry]:
        """Get an entry by ID."""
        memory_entry = await self.memory.get_entry(str(entry_id))
        if memory_entry:
            return self._memory_to_knowledge_entry(memory_entry)
        return None

    async def search(
        self,
        query: str,
        domain: Optional[str] = None,
        topic: Optional[str] = None,
        category: Optional[str] = None,
        limit: int = 10,
        **kwargs,
    ) -> List[KnowledgeBaseEntry]:
        """Search the knowledge base."""
        # Build query filters
        filters = {}
        if domain:
            filters["domain"] = domain
        if topic:
            filters["topic"] = topic
        if category:
            filters["category"] = category

        # Create memory query
        memory_query = MemoryQuery(
            query=query,
            filters=filters,
            limit=limit,
            **kwargs,
        )

        # Search using retriever
        result = await self.retriever.retrieve(memory_query)

        # Convert to knowledge entries
        knowledge_entries = [
            self._memory_to_knowledge_entry(entry)
            for entry in result.entries
        ]

        return knowledge_entries

    async def get_related_entries(
        self,
        entry_id: Union[str, UUID],
        relationship_types: Optional[List[str]] = None,
        max_depth: int = 2,
        limit: int = 10,
    ) -> List[KnowledgeBaseEntry]:
        """Get entries related to a given entry."""
        entry_id_str = str(entry_id)

        # Get related nodes from knowledge graph
        related_node_ids = set()
        queue = [(entry_id_str, 0)]
        visited = {entry_id_str}

        while queue and len(related_node_ids) < limit * 2:
            current_id, depth = queue.pop(0)

            if depth >= max_depth:
                continue

            for edge in self.graph.edges:
                if edge["from"] == current_id and edge["to"] not in visited:
                    if relationship_types is None or edge["relationship"] in relationship_types:
                        related_node_ids.add(edge["to"])
                        visited.add(edge["to"])
                        queue.append((edge["to"], depth + 1))

        # Get entries for related nodes
        related_entries = []
        for node_id in list(related_node_ids)[:limit]:
            entry = await self.get_entry(node_id)
            if entry:
                related_entries.append(entry)

        return related_entries

    async def get_learning_path(
        self,
        from_topic: str,
        to_topic: str,
        domain: Optional[str] = None,
    ) -> Optional[List[KnowledgeBaseEntry]]:
        """Get a learning path from one topic to another."""
        # Find entries for topics
        from_entries = await self.search(from_topic, domain=domain)
        to_entries = await self.search(to_topic, domain=domain)

        if not from_entries or not to_entries:
            return None

        # Find shortest path in knowledge graph
        from_node = str(from_entries[0].id)
        to_node = str(to_entries[0].id)

        path_node_ids = self.graph.get_shortest_path(from_node, to_node)
        if not path_node_ids:
            return None

        # Get entries for path
        path_entries = []
        for node_id in path_node_ids:
            entry = await self.get_entry(node_id)
            if entry:
                path_entries.append(entry)

        return path_entries

    async def update_entry(
        self,
        entry_id: Union[str, UUID],
        **updates,
    ) -> bool:
        """Update an existing entry."""
        entry = await self.get_entry(entry_id)
        if not entry:
            return False

        # Update fields
        for field, value in updates.items():
            if hasattr(entry, field):
                setattr(entry, field, value)

        # Update content and summary if provided
        if "content" in updates:
            entry.summary = self._generate_summary(updates["content"])

        # Store updated entry
        await self._store_knowledge_entry(entry)

        # Update knowledge graph
        await self._update_knowledge_graph(entry)

        self.updated_at = datetime.utcnow()
        return True

    async def delete_entry(self, entry_id: Union[str, UUID]) -> bool:
        """Delete an entry from the knowledge base."""
        success = await self.memory.delete_entry(str(entry_id))
        if success:
            self.entry_count = max(0, self.entry_count - 1)
            self.updated_at = datetime.utcnow()

            # Remove from knowledge graph
            entry_id_str = str(entry_id)
            if entry_id_str in self.graph.nodes:
                del self.graph.nodes[entry_id_str]

            # Remove related edges
            self.graph.edges = [
                edge for edge in self.graph.edges
                if edge["from"] != entry_id_str and edge["to"] != entry_id_str
            ]

        return success

    async def get_statistics(self) -> Dict[str, Any]:
        """Get knowledge base statistics."""
        memory_stats = await self.memory.get_stats()

        return {
            "name": self.name,
            "entry_count": self.entry_count,
            "domain_count": len(self.domains),
            "category_count": len(self.categories),
            "graph_nodes": len(self.graph.nodes),
            "graph_edges": len(self.graph.edges),
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "memory_stats": memory_stats,
        }

    async def get_domain_structure(self) -> Dict[str, Any]:
        """Get the domain structure of the knowledge base."""
        structure = {}
        for domain, topics in self.domains.items():
            structure[domain] = {
                "topics": list(topics),
                "topic_count": len(topics),
            }
        return structure

    async def verify_knowledge(self) -> Dict[str, Any]:
        """Verify knowledge base consistency and quality."""
        verification_results = {
            "verified_entries": 0,
            "unverified_entries": 0,
            "orphaned_entries": 0,
            "duplicate_entries": 0,
            "low_quality_entries": 0,
            "issues": [],
        }

        # Get all entries
        all_entries = await self.search("", limit=1000)  # Adjust as needed

        # Check verification status
        for entry in all_entries:
            if entry.verified:
                verification_results["verified_entries"] += 1
            else:
                verification_results["unverified_entries"] += 1

            # Check quality
            if entry.confidence_score < 0.5:
                verification_results["low_quality_entries"] += 1
                verification_results["issues"].append(
                    f"Low quality entry: {entry.title} (score: {entry.confidence_score})"
                )

        # Check for orphaned entries
        connected_nodes = set()
        for edge in self.graph.edges:
            connected_nodes.add(edge["from"])
            connected_nodes.add(edge["to"])

        for entry in all_entries:
            if str(entry.id) not in connected_nodes:
                verification_results["orphaned_entries"] += 1
                verification_results["issues"].append(f"Orphaned entry: {entry.title}")

        return verification_results

    def _generate_summary(self, content: str, max_length: int = 200) -> str:
        """Generate a summary for content."""
        # Simple summarization - take first few sentences
        sentences = content.split('. ')
        summary = '. '.join(sentences[:3])  # First 3 sentences
        if len(summary) > max_length:
            summary = summary[:max_length-3] + "..."
        return summary

    async def _store_knowledge_entry(self, entry: KnowledgeBaseEntry) -> Any:
        """Store a knowledge entry in memory."""
        from aura_004.memory.schemas import MemoryEntry, MemoryMetadata

        # Create memory entry
        memory_entry = MemoryEntry(
            id=str(entry.id),
            content=entry.content,
            memory_type="semantic",
            metadata=MemoryMetadata(
                source="knowledge_base",
                category=f"{entry.domain}/{entry.topic}",
                tags=[entry.domain, entry.topic],
                custom_fields={
                    "title": entry.title,
                    "summary": entry.summary,
                    "domain": entry.domain,
                    "topic": entry.topic,
                    "subtopic": entry.subtopic,
                    "difficulty_level": entry.difficulty_level,
                    "verified": entry.verified,
                    "confidence_score": entry.confidence_score,
                },
            ),
        )

        # Store in memory
        await self.memory.store_entry(memory_entry)
        return memory_entry

    def _memory_to_knowledge_entry(self, memory_entry) -> KnowledgeBaseEntry:
        """Convert memory entry to knowledge base entry."""
        custom_fields = memory_entry.metadata.custom_fields or {}

        return KnowledgeBaseEntry(
            id=memory_entry.id,
            title=custom_fields.get("title", "Untitled"),
            content=memory_entry.content,
            summary=custom_fields.get("summary", ""),
            domain=custom_fields.get("domain", "unknown"),
            topic=custom_fields.get("topic", "unknown"),
            subtopic=custom_fields.get("subtopic"),
            difficulty_level=custom_fields.get("difficulty_level", 1),
            verified=custom_fields.get("verified", False),
            confidence_score=custom_fields.get("confidence_score", 1.0),
            created_at=memory_entry.created_at,
            updated_at=memory_entry.updated_at,
        )

    async def _update_knowledge_graph(self, entry: KnowledgeBaseEntry) -> None:
        """Update the knowledge graph with entry relationships."""
        # Add node
        self.graph.add_node(str(entry.id), {
            "title": entry.title,
            "domain": entry.domain,
            "topic": entry.topic,
            "type": "knowledge_entry",
        })

        # Find and add relationships to existing entries
        related_entries = await self.search(entry.title, limit=5)
        for related_entry in related_entries:
            if related_entry.id != entry.id:
                # Add bidirectional edges
                self.graph.add_edge(str(entry.id), str(related_entry.id), "similar")
                self.graph.add_edge(str(related_entry.id), str(entry.id), "similar")

        # Add prerequisite relationships
        if entry.prerequisites:
            for prereq_id in entry.prerequisites:
                self.graph.add_edge(str(prereq_id), str(entry.id), "prerequisite")

    def _update_categories(self, entry: KnowledgeBaseEntry) -> None:
        """Update categories and domains."""
        # Add domain
        if entry.domain not in self.domains:
            self.domains[entry.domain] = set()
        self.domains[entry.domain].add(entry.topic)

        # Add category
        category = f"{entry.domain}/{entry.topic}"
        self.categories.add(category)

    async def _auto_categorize_entry(self, entry: KnowledgeBaseEntry) -> None:
        """Automatically categorize an entry based on content."""
        # This is a placeholder for more sophisticated categorization
        # In practice, you might use NLP techniques to analyze content
        # and suggest better categories or topics

        # Simple keyword-based categorization
        content_lower = entry.content.lower()

        # Look for domain indicators
        domain_keywords = {
            "programming": ["code", "function", "class", "algorithm", "programming"],
            "mathematics": ["equation", "theorem", "proof", "calculate", "formula"],
            "science": ["experiment", "hypothesis", "theory", "observation", "analysis"],
            "history": ["historical", "ancient", "century", "period", "era"],
        }

        for domain, keywords in domain_keywords.items():
            if any(keyword in content_lower for keyword in keywords):
                if entry.domain != domain:
                    entry.domain = domain
                    # Update memory entry
                    await self._store_knowledge_entry(entry)
                break