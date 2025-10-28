"""
Embedding providers for AURA-004 memory system.

This module provides various embedding providers for generating
vector representations of text content.
"""

import asyncio
from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
import numpy as np

from aura_004.core.exceptions import MemoryError


class EmbeddingProvider(ABC):
    """Abstract base class for embedding providers."""

    def __init__(
        self,
        model_name: str,
        embedding_dim: int,
        **kwargs,
    ):
        self.model_name = model_name
        self.embedding_dim = embedding_dim
        self._is_initialized = False

    @abstractmethod
    async def initialize(self) -> None:
        """Initialize the embedding provider."""
        pass

    @abstractmethod
    async def embed(self, text: str) -> List[float]:
        """Generate embedding for a single text."""
        pass

    @abstractmethod
    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts."""
        pass

    @abstractmethod
    async def embed_documents(self, documents: List[str]) -> List[List[float]]:
        """Generate embeddings for documents (optimized for longer texts)."""
        pass

    @abstractmethod
    async def embed_query(self, query: str) -> List[float]:
        """Generate embedding for a query (optimized for short texts)."""
        pass

    def is_initialized(self) -> bool:
        """Check if provider is initialized."""
        return self._is_initialized

    async def ensure_initialized(self) -> None:
        """Ensure provider is initialized."""
        if not self._is_initialized:
            await self.initialize()

    def normalize_embeddings(self, embeddings: List[List[float]]) -> List[List[float]]:
        """Normalize embeddings to unit length."""
        normalized = []
        for embedding in embeddings:
            embedding_array = np.array(embedding)
            norm = np.linalg.norm(embedding_array)
            if norm > 0:
                normalized.append((embedding_array / norm).tolist())
            else:
                normalized.append(embedding)
        return normalized

    def __str__(self) -> str:
        return f"{self.__class__.__name__}(model={self.model_name}, dim={self.embedding_dim})"

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(model={self.model_name}, dim={self.embedding_dim}, initialized={self._is_initialized})"


class SentenceTransformerProvider(EmbeddingProvider):
    """Sentence Transformers embedding provider."""

    def __init__(
        self,
        model_name: str = "all-MiniLM-L6-v2",
        device: str = "cpu",
        **kwargs,
    ):
        super().__init__(
            model_name=model_name,
            embedding_dim=384,  # Default for MiniLM
            **kwargs,
        )
        self.device = device
        self._model = None
        self._lock = asyncio.Lock()

    async def initialize(self) -> None:
        """Initialize the sentence transformer model."""
        async with self._lock:
            if self._is_initialized:
                return

            try:
                # Import here to avoid import errors if not installed
                from sentence_transformers import SentenceTransformer

                # Load model in thread pool to avoid blocking
                loop = asyncio.get_event_loop()
                self._model = await loop.run_in_executor(
                    None,
                    lambda: SentenceTransformer(self.model_name, device=self.device)
                )

                # Update embedding dimension based on actual model
                self.embedding_dim = self._model.get_sentence_embedding_dimension()
                self._is_initialized = True

            except ImportError:
                raise MemoryError(
                    "sentence-transformers not installed. "
                    "Install with: pip install sentence-transformers"
                )
            except Exception as e:
                raise MemoryError(f"Failed to initialize SentenceTransformer: {e}") from e

    async def embed(self, text: str) -> List[float]:
        """Generate embedding for a single text."""
        await self.ensure_initialized()
        return await self.embed_batch([text])[0]

    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts."""
        await self.ensure_initialized()

        if not texts:
            return []

        try:
            loop = asyncio.get_event_loop()
            embeddings = await loop.run_in_executor(
                None,
                lambda: self._model.encode(texts, convert_to_numpy=True)
            )
            return embeddings.tolist()

        except Exception as e:
            raise MemoryError(f"Failed to generate embeddings: {e}") from e

    async def embed_documents(self, documents: List[str]) -> List[List[float]]:
        """Generate embeddings for documents."""
        return await self.embed_batch(documents)

    async def embed_query(self, query: str) -> List[float]:
        """Generate embedding for a query."""
        return await self.embed(query)


class OpenAIEmbeddingProvider(EmbeddingProvider):
    """OpenAI embedding provider."""

    def __init__(
        self,
        model_name: str = "text-embedding-3-small",
        api_key: Optional[str] = None,
        **kwargs,
    ):
        super().__init__(
            model_name=model_name,
            embedding_dim=1536 if "3-small" in model_name else 3072,  # Default dimensions
            **kwargs,
        )
        self.api_key = api_key
        self._client = None

    async def initialize(self) -> None:
        """Initialize the OpenAI client."""
        if self._is_initialized:
            return

        try:
            from openai import AsyncOpenAI

            self._client = AsyncOpenAI(api_key=self.api_key)
            self._is_initialized = True

        except ImportError:
            raise MemoryError(
                "openai not installed. "
                "Install with: pip install openai"
            )
        except Exception as e:
            raise MemoryError(f"Failed to initialize OpenAI client: {e}") from e

    async def embed(self, text: str) -> List[float]:
        """Generate embedding for a single text."""
        return await self.embed_batch([text])[0]

    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts."""
        await self.ensure_initialized()

        if not texts:
            return []

        try:
            # OpenAI has rate limits, so we need to batch carefully
            max_batch_size = 100  # Conservative batch size
            results = []

            for i in range(0, len(texts), max_batch_size):
                batch = texts[i:i + max_batch_size]
                response = await self._client.embeddings.create(
                    model=self.model_name,
                    input=batch
                )
                batch_results = [item.embedding for item in response.data]
                results.extend(batch_results)

            return results

        except Exception as e:
            raise MemoryError(f"Failed to generate embeddings with OpenAI: {e}") from e

    async def embed_documents(self, documents: List[str]) -> List[List[float]]:
        """Generate embeddings for documents."""
        return await self.embed_batch(documents)

    async def embed_query(self, query: str) -> List[float]:
        """Generate embedding for a query."""
        return await self.embed(query)


class MockEmbeddingProvider(EmbeddingProvider):
    """Mock embedding provider for testing."""

    def __init__(
        self,
        model_name: str = "mock",
        embedding_dim: int = 384,
        **kwargs,
    ):
        super().__init__(
            model_name=model_name,
            embedding_dim=embedding_dim,
            **kwargs,
        )
        import random
        self._random = random.Random(42)  # Fixed seed for reproducibility

    async def initialize(self) -> None:
        """Initialize the mock provider."""
        self._is_initialized = True

    async def embed(self, text: str) -> List[float]:
        """Generate mock embedding."""
        # Generate deterministic embeddings based on text hash
        import hashlib
        hash_obj = hashlib.md5(text.encode())
        seed = int(hash_obj.hexdigest()[:8], 16)
        self._random.seed(seed)
        return [self._random.uniform(-1, 1) for _ in range(self.embedding_dim)]

    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate mock embeddings for multiple texts."""
        return [await self.embed(text) for text in texts]

    async def embed_documents(self, documents: List[str]) -> List[List[float]]:
        """Generate mock embeddings for documents."""
        return await self.embed_batch(documents)

    async def embed_query(self, query: str) -> List[float]:
        """Generate mock embedding for query."""
        return await self.embed(query)


class EmbeddingProviderFactory:
    """Factory for creating embedding providers."""

    _providers = {
        "sentence-transformers": SentenceTransformerProvider,
        "openai": OpenAIEmbeddingProvider,
        "mock": MockEmbeddingProvider,
    }

    @classmethod
    def create_provider(
        self,
        provider_type: str,
        model_name: Optional[str] = None,
        **kwargs,
    ) -> EmbeddingProvider:
        """Create an embedding provider."""
        if provider_type not in self._providers:
            raise MemoryError(f"Unknown embedding provider type: {provider_type}")

        provider_class = self._providers[provider_type]

        # Set default model names
        if model_name is None:
            if provider_type == "sentence-transformers":
                model_name = "all-MiniLM-L6-v2"
            elif provider_type == "openai":
                model_name = "text-embedding-3-small"
            elif provider_type == "mock":
                model_name = "mock"

        return provider_class(model_name=model_name, **kwargs)

    @classmethod
    def register_provider(cls, name: str, provider_class: type) -> None:
        """Register a custom embedding provider."""
        if not issubclass(provider_class, EmbeddingProvider):
            raise MemoryError(f"Provider class must inherit from EmbeddingProvider")
        cls._providers[name] = provider_class

    @classmethod
    def list_providers(cls) -> List[str]:
        """List available provider types."""
        return list(cls._providers.keys())


# Utility functions

async def create_embeddings(
    texts: List[str],
    provider_type: str = "sentence-transformers",
    model_name: Optional[str] = None,
    **kwargs,
) -> List[List[float]]:
    """Create embeddings for texts using the specified provider."""
    provider = EmbeddingProviderFactory.create_provider(
        provider_type=provider_type,
        model_name=model_name,
        **kwargs,
    )
    await provider.initialize()
    return await provider.embed_batch(texts)


def cosine_similarity(a: List[float], b: List[float]) -> float:
    """Calculate cosine similarity between two vectors."""
    a_array = np.array(a)
    b_array = np.array(b)

    dot_product = np.dot(a_array, b_array)
    norm_a = np.linalg.norm(a_array)
    norm_b = np.linalg.norm(b_array)

    if norm_a == 0 or norm_b == 0:
        return 0.0

    return dot_product / (norm_a * norm_b)


def euclidean_distance(a: List[float], b: List[float]) -> float:
    """Calculate Euclidean distance between two vectors."""
    a_array = np.array(a)
    b_array = np.array(b)
    return np.linalg.norm(a_array - b_array)