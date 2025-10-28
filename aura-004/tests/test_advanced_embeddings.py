"""
Tests for advanced embeddings module.
"""

import pytest
import asyncio
from unittest.mock import Mock, patch, AsyncMock
from datetime import datetime

from aura_004.memory.advanced_embeddings import (
    AdvancedEmbeddingProvider,
    EmbeddingStrategy,
    EmbeddingConfig,
)


class TestAdvancedEmbeddingProvider:
    """Test cases for AdvancedEmbeddingProvider."""

    @pytest.fixture
    def embedding_config(self):
        """Create test embedding configuration."""
        return EmbeddingConfig(
            strategy=EmbeddingStrategy.HYBRID,
            model_name="all-MiniLM-L6-v2",
            batch_size=4,
            cache_embeddings=True,
        )

    @pytest.fixture
    def provider(self, embedding_config):
        """Create embedding provider for testing."""
        return AdvancedEmbeddingProvider(embedding_config)

    def test_provider_initialization(self, embedding_config):
        """Test provider initialization."""
        provider = AdvancedEmbeddingProvider(embedding_config)
        assert provider.config == embedding_config
        assert provider._embedding_cache == {}
        assert provider._embedding_stats["total_embeddings"] == 0

    @pytest.mark.asyncio
    async def test_initialize_base_model(self, provider):
        """Test base model initialization."""
        with patch('sentence_transformers.SentenceTransformer') as mock_model:
            mock_model.return_value = Mock()
            mock_model.return_value.to = Mock()

            await provider._load_base_model()

            assert "base" in provider.models
            mock_model.assert_called_once_with(provider.config.model_name)

    @pytest.mark.asyncio
    async def test_simple_embedding(self, provider):
        """Test simple embedding generation."""
        # Mock the base model
        provider.models["base"] = Mock()
        provider.models["base"].encode.return_value = [0.1, 0.2, 0.3, 0.4]

        result = await provider._simple_embed("test text", {"language": "python"})

        assert isinstance(result, list)
        assert len(result) == 4
        assert all(isinstance(x, float) for x in result)

    @pytest.mark.asyncio
    async def test_hierarchical_embedding(self, provider):
        """Test hierarchical embedding."""
        # Mock the simple embed method
        provider._simple_embed = AsyncMock(side_effect=[
            [0.1, 0.2, 0.3],
            [0.4, 0.5, 0.6],
            [0.7, 0.8, 0.9],
        ])

        result = await provider._hierarchical_embed("test text", {})

        assert isinstance(result, list)
        assert len(result) > 0

    @pytest.mark.asyncio
    async def test_context_aware_embedding(self, provider):
        """Test context-aware embedding."""
        provider._simple_embed = AsyncMock(side_effect=[
            [0.1, 0.2, 0.3],
            [0.4, 0.5, 0.6],
        ])

        context = {"language": "python", "function_name": "test"}
        result = await provider._context_aware_embed("test code", context)

        assert isinstance(result, list)
        assert len(result) > 0

    @pytest.mark.asyncio
    async def test_hybrid_embedding(self, provider):
        """Test hybrid embedding strategy."""
        provider._simple_embed = AsyncMock(return_value=[0.1, 0.2, 0.3])
        provider._context_aware_embed = AsyncMock(return_value=[0.4, 0.5, 0.6])

        result = await provider._hybrid_embed("test text", {})

        assert isinstance(result, list)
        assert len(result) > 0

    @pytest.mark.asyncio
    async def test_code_specific_embedding(self, provider):
        """Test code-specific embedding."""
        provider._simple_embed = AsyncMock(return_value=[0.1, 0.2, 0.3])
        provider._generate_codebert_embedding = AsyncMock(return_value=[0.4, 0.5, 0.6])

        result = await provider._code_specific_embed("test code", {"language": "python"})

        assert isinstance(result, list)
        assert len(result) > 0

    @pytest.mark.asyncio
    async def test_batch_embedding(self, provider):
        """Test batch embedding generation."""
        provider._simple_embed = AsyncMock(return_value=[0.1, 0.2, 0.3])

        texts = ["text1", "text2", "text3"]
        results = await provider.batch_embed(texts)

        assert len(results) == 3
        assert all(isinstance(r, list) for r in results)

    def test_cache_operations(self, provider):
        """Test caching operations."""
        # Test cache key generation
        cache_key = provider._get_cache_key("test", EmbeddingStrategy.SIMPLE, {"tag": "test"})
        assert isinstance(cache_key, str)
        assert len(cache_key) == 32  # MD5 hash length

        # Test cache storage and retrieval
        test_embedding = [0.1, 0.2, 0.3]
        asyncio.run(provider._cache_embedding("test_key", test_embedding))

        cached_result = asyncio.run(provider._get_cached_embedding("test_key"))
        assert cached_result == test_embedding

    def test_preprocessing(self, provider):
        """Test text preprocessing."""
        # Test normal text
        result = provider._preprocess_text("  Test   text  ")
        assert result == "Test text"

        # Test text with excessive whitespace
        long_text = "test " * 1000
        result = provider._preprocess_text(long_text)
        assert len(result) < len(long_text)

    def test_statistics(self, provider):
        """Test statistics tracking."""
        initial_stats = provider.get_stats()
        assert initial_stats["total_embeddings"] == 0
        assert initial_stats["cache_hit_rate"] == 0.0

        # Simulate some operations
        provider._embedding_stats["total_embeddings"] = 10
        provider._embedding_stats["cache_hits"] = 3

        updated_stats = provider.get_stats()
        assert updated_stats["total_embeddings"] == 10
        assert updated_stats["cache_hit_rate"] == 0.3

    @pytest.mark.asyncio
    async def test_error_handling(self, provider):
        """Test error handling in embedding operations."""
        # Test with invalid model
        provider.models = {}

        with pytest.raises(Exception):
            await provider._simple_embed("test text", {})

    @pytest.mark.asyncio
    async def test_embedding_strategies(self, provider):
        """Test different embedding strategies."""
        provider._simple_embed = AsyncMock(return_value=[0.1, 0.2, 0.3])

        strategies = [
            EmbeddingStrategy.SIMPLE,
            EmbeddingStrategy.CONTEXT_AWARE,
            EmbeddingStrategy.HYBRID,
            EmbeddingStrategy.PERFORMANCE_OPTIMIZED,
        ]

        for strategy in strategies:
            result = await provider.embed("test text", strategy)
            assert isinstance(result, list)
            assert len(result) > 0

    @pytest.mark.asyncio
    async def test_multimodal_embedding(self, provider):
        """Test multimodal embedding."""
        provider._simple_embed = AsyncMock(return_value=[0.1, 0.2, 0.3])
        provider._generate_code_embedding = AsyncMock(return_value=[0.4, 0.5, 0.6])
        provider._generate_structural_embedding = AsyncMock(return_value=[0.7, 0.8, 0.9])

        metadata = {
            "language": "python",
            "ast": {"type": "function", "name": "test"},
        }

        result = await provider._multimodal_embed("test code", metadata)

        assert isinstance(result, list)
        assert len(result) > 0

    def test_config_validation(self):
        """Test configuration validation."""
        # Test default config
        config = EmbeddingConfig()
        assert config.strategy == EmbeddingStrategy.HYBRID
        assert config.batch_size == 32
        assert config.cache_embeddings == True

        # Test custom config
        custom_config = EmbeddingConfig(
            strategy=EmbeddingStrategy.SIMPLE,
            batch_size=16,
            cache_embeddings=False,
        )
        assert custom_config.strategy == EmbeddingStrategy.SIMPLE
        assert custom_config.batch_size == 16
        assert custom_config.cache_embeddings == False

    @pytest.mark.asyncio
    async def test_cache_size_limit(self, provider):
        """Test cache size limiting."""
        # Fill cache beyond limit
        for i in range(15000):  # More than the 10000 limit
            await provider._cache_embedding(f"key_{i}", [i * 0.1])

        # Check that cache size is limited
        assert len(provider._embedding_cache) <= 10000

    def test_embedding_combination(self, provider):
        """Test embedding combination methods."""
        embeddings = [
            [0.1, 0.2, 0.3],
            [0.4, 0.5, 0.6],
            [0.7, 0.8, 0.9],
        ]

        # Test equal weights
        combined = provider._combine_embeddings(embeddings)
        assert len(combined) == 3
        assert combined[0] == pytest.approx(0.4)  # (0.1 + 0.4 + 0.7) / 3

        # Test custom weights
        weights = [0.5, 0.3, 0.2]
        combined = provider._combine_embeddings(embeddings, weights)
        assert len(combined) == 3
        assert combined[0] == pytest.approx(0.28)  # (0.1*0.5 + 0.4*0.3 + 0.7*0.2)

    @pytest.mark.asyncio
    async def test_semantic_chunk_embedding(self, provider):
        """Test semantic chunk embedding."""
        provider._simple_embed = AsyncMock(return_value=[0.1, 0.2, 0.3])

        # Mock semantic chunking
        provider._semantic_chunk = Mock(return_value=["chunk1", "chunk2", "chunk3"])
        provider._aggregate_chunk_embeddings = Mock(return_value=[0.5, 0.6, 0.7])

        result = await provider._semantic_chunk_embed("long text document", {})

        assert isinstance(result, list)
        assert len(result) == 3

    def test_enhance_code_text(self, provider):
        """Test code text enhancement."""
        # Test Python enhancement
        enhanced = provider._enhance_code_text("def test(): pass", "python")
        assert "Code in python:" in enhanced
        assert "def" in enhanced

        # Test JavaScript enhancement
        enhanced = provider._enhance_code_text("function test() {}", "javascript")
        assert "Code in javascript:" in enhanced
        assert "function" in enhanced

        # Test unknown language
        enhanced = provider._enhance_code_text("some code", "unknown")
        assert "Code in unknown:" in enhanced

    def test_optimize_text_for_embedding(self, provider):
        """Test text optimization for embedding."""
        # Test normal text
        result = provider._optimize_text_for_embedding("Test text with normal content")
        assert "Test text with normal content" in result

        # Test text with excessive whitespace
        text_with_whitespace = "Test    text    with    \n\n    whitespace"
        result = provider._optimize_text_for_embedding(text_with_whitespace)
        assert "    " not in result  # No multiple spaces
        assert "\n\n" not in result  # No multiple newlines

        # Test very long text
        long_text = "word " * 1000
        result = provider._optimize_text_for_embedding(long_text)
        assert len(result) <= len(long_text)


if __name__ == "__main__":
    pytest.main([__file__])