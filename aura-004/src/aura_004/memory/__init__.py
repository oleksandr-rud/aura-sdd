"""
Memory management components for AURA-004.

This module provides memory and storage capabilities including:
- Vector database integration
- ChromaDB implementation
- Memory schemas and retrieval
- Knowledge base management
"""

from aura_004.memory.base import BaseMemory
from aura_004.memory.chroma_memory import ChromaMemory
from aura_004.memory.schemas import (
    MemoryEntry,
    MemoryQuery,
    MemoryResult,
    MemoryMetadata,
)
from aura_004.memory.embeddings import (
    EmbeddingProvider,
    SentenceTransformerProvider,
    OpenAIEmbeddingProvider,
)
from aura_004.memory.retrieval import (
    MemoryRetriever,
    VectorRetriever,
    HybridRetriever,
)
from aura_004.memory.knowledge_base import KnowledgeBase

__all__ = [
    # Base components
    "BaseMemory",

    # Memory implementations
    "ChromaMemory",

    # Schemas
    "MemoryEntry",
    "MemoryQuery",
    "MemoryResult",
    "MemoryMetadata",

    # Embeddings
    "EmbeddingProvider",
    "SentenceTransformerProvider",
    "OpenAIEmbeddingProvider",

    # Retrieval
    "MemoryRetriever",
    "VectorRetriever",
    "HybridRetriever",

    # Knowledge base
    "KnowledgeBase",
]