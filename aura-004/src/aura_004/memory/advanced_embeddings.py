"""
Advanced embedding strategies for AURA-004.

This module provides sophisticated embedding generation strategies including
multi-modal embeddings, hierarchical embeddings, context-aware embeddings,
and performance-optimized batch processing.
"""

import asyncio
import hashlib
import json
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, Tuple, Union
from datetime import datetime
from dataclasses import dataclass
from enum import Enum

import numpy as np
from sentence_transformers import SentenceTransformer
import torch
from transformers import AutoTokenizer, AutoModel

from aura_004.memory.embeddings import EmbeddingProvider, cosine_similarity
from aura_004.core.exceptions import EmbeddingError
from aura_004.core.config import get_settings


class EmbeddingStrategy(Enum):
    """Enumeration of available embedding strategies."""

    SIMPLE = "simple"
    HIERARCHICAL = "hierarchical"
    CONTEXT_AWARE = "context_aware"
    MULTI_MODAL = "multi_modal"
    HYBRID = "hybrid"
    CODE_SPECIFIC = "code_specific"
    SEMANTIC_CHUNK = "semantic_chunk"
    PERFORMANCE_OPTIMIZED = "performance_optimized"


@dataclass
class EmbeddingConfig:
    """Configuration for embedding generation."""

    strategy: EmbeddingStrategy = EmbeddingStrategy.HYBRID
    model_name: str = "all-MiniLM-L6-v2"
    max_length: int = 512
    batch_size: int = 32
    cache_embeddings: bool = True
    normalize_embeddings: bool = True
    use_gpu: bool = False

    # Code-specific settings
    include_syntax_info: bool = True
    include_ast_info: bool = True
    include_metadata: bool = True

    # Performance settings
    chunk_overlap_ratio: float = 0.1
    min_chunk_size: int = 100
    max_chunk_size: int = 2000

    # Quality settings
    quality_threshold: float = 0.7
    diversity_penalty: float = 0.1
    relevance_boost: float = 1.2


class AdvancedEmbeddingProvider(EmbeddingProvider):
    """Advanced embedding provider with multiple strategies."""

    def __init__(self, config: Optional[EmbeddingConfig] = None):
        self.config = config or EmbeddingConfig()
        self.settings = get_settings()

        # Initialize models
        self.models: Dict[str, Any] = {}
        self.tokenizers: Dict[str, Any] = {}
        self._device = "cuda" if self.config.use_gpu and torch.cuda.is_available() else "cpu"

        # Embedding cache
        self._embedding_cache: Dict[str, Tuple[List[float], datetime]] = {}
        self._cache_lock = asyncio.Lock()

        # Performance metrics
        self._embedding_stats = {
            "total_embeddings": 0,
            "cache_hits": 0,
            "cache_misses": 0,
            "avg_embedding_time": 0.0,
        }

    async def initialize(self) -> None:
        """Initialize embedding models."""
        try:
            await self._load_base_model()

            if self.config.strategy in [EmbeddingStrategy.CODE_SPECIFIC, EmbeddingStrategy.HYBRID]:
                await self._load_code_models()

            if self.config.strategy == EmbeddingStrategy.MULTI_MODAL:
                await self._load_multimodal_models()

        except Exception as e:
            raise EmbeddingError(f"Failed to initialize embedding provider: {e}") from e

    async def _load_base_model(self) -> None:
        """Load the base sentence transformer model."""
        try:
            self.models["base"] = SentenceTransformer(self.config.model_name)
            self.models["base"].to(self._device)
        except Exception as e:
            raise EmbeddingError(f"Failed to load base model {self.config.model_name}: {e}") from e

    async def _load_code_models(self) -> None:
        """Load code-specific models."""
        code_models = {
            "codebert": "microsoft/codebert-base",
            "graphcodebert": "microsoft/graphcodebert-base",
            "codet5": "Salesforce/codet5-base",
        }

        for name, model_name in code_models.items():
            try:
                tokenizer = AutoTokenizer.from_pretrained(model_name)
                model = AutoModel.from_pretrained(model_name)
                model.to(self._device)

                self.tokenizers[name] = tokenizer
                self.models[name] = model
            except Exception as e:
                # Log warning but continue
                print(f"Warning: Could not load {name} model: {e}")

    async def _load_multimodal_models(self) -> None:
        """Load multi-modal models for code and text."""
        multimodal_models = {
            "clip": "openai/clip-vit-base-patch32",
        }

        for name, model_name in multimodal_models.items():
            try:
                from transformers import CLIPProcessor, CLIPModel
                model = CLIPModel.from_pretrained(model_name)
                processor = CLIPProcessor.from_pretrained(model_name)
                model.to(self._device)

                self.models[name] = model
                self.tokenizers[name] = processor
            except Exception as e:
                print(f"Warning: Could not load {name} multimodal model: {e}")

    async def embed(
        self,
        text: str,
        strategy: Optional[EmbeddingStrategy] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> List[float]:
        """Generate embedding for text using specified strategy."""
        strategy = strategy or self.config.strategy

        # Check cache first
        cache_key = self._get_cache_key(text, strategy, metadata)
        if self.config.cache_embeddings:
            cached_embedding = await self._get_cached_embedding(cache_key)
            if cached_embedding is not None:
                return cached_embedding

        # Generate embedding
        start_time = asyncio.get_event_loop().time()

        try:
            if strategy == EmbeddingStrategy.SIMPLE:
                embedding = await self._simple_embed(text, metadata)
            elif strategy == EmbeddingStrategy.HIERARCHICAL:
                embedding = await self._hierarchical_embed(text, metadata)
            elif strategy == EmbeddingStrategy.CONTEXT_AWARE:
                embedding = await self._context_aware_embed(text, metadata)
            elif strategy == EmbeddingStrategy.MULTI_MODAL:
                embedding = await self._multimodal_embed(text, metadata)
            elif strategy == EmbeddingStrategy.HYBRID:
                embedding = await self._hybrid_embed(text, metadata)
            elif strategy == EmbeddingStrategy.CODE_SPECIFIC:
                embedding = await self._code_specific_embed(text, metadata)
            elif strategy == EmbeddingStrategy.SEMANTIC_CHUNK:
                embedding = await self._semantic_chunk_embed(text, metadata)
            elif strategy == EmbeddingStrategy.PERFORMANCE_OPTIMIZED:
                embedding = await self._performance_optimized_embed(text, metadata)
            else:
                embedding = await self._simple_embed(text, metadata)

            # Update stats
            embedding_time = asyncio.get_event_loop().time() - start_time
            self._update_stats(embedding_time)

            # Cache embedding
            if self.config.cache_embeddings:
                await self._cache_embedding(cache_key, embedding)

            return embedding

        except Exception as e:
            raise EmbeddingError(f"Embedding generation failed: {e}") from e

    async def _simple_embed(self, text: str, metadata: Optional[Dict[str, Any]]) -> List[float]:
        """Simple embedding using base model."""
        if "base" not in self.models:
            raise EmbeddingError("Base model not loaded")

        # Preprocess text
        processed_text = self._preprocess_text(text)

        # Generate embedding
        with torch.no_grad():
            embedding = self.models["base"].encode(
                processed_text,
                convert_to_numpy=True,
                normalize_embeddings=self.config.normalize_embeddings,
            )

        return embedding.tolist()

    async def _hierarchical_embed(self, text: str, metadata: Optional[Dict[str, Any]]) -> List[float]:
        """Hierarchical embedding combining different levels of granularity."""
        # Split text into chunks at different levels
        chunks = self._hierarchical_chunk(text)

        embeddings = []
        for chunk in chunks:
            chunk_embedding = await self._simple_embed(chunk, metadata)
            embeddings.append(chunk_embedding)

        # Combine embeddings using weighted average
        combined_embedding = self._combine_embeddings(embeddings, weights=[0.5, 0.3, 0.2])

        return combined_embedding

    async def _context_aware_embed(self, text: str, metadata: Optional[Dict[str, Any]]) -> List[float]:
        """Context-aware embedding considering surrounding context."""
        # Extract context from metadata
        context = metadata or {}

        # Build context-enhanced text
        context_text = self._build_context_text(text, context)

        # Generate base embedding
        base_embedding = await self._simple_embed(text, metadata)

        # Generate context embedding
        context_embedding = await self._simple_embed(context_text, metadata)

        # Combine with context weighting
        combined_embedding = self._combine_embeddings(
            [base_embedding, context_embedding],
            weights=[0.7, 0.3]
        )

        return combined_embedding

    async def _multimodal_embed(self, text: str, metadata: Optional[Dict[str, Any]]) -> List[float]:
        """Multi-modal embedding combining text and code structure."""
        embeddings = []

        # Text embedding
        text_embedding = await self._simple_embed(text, metadata)
        embeddings.append(text_embedding)

        # Code-specific embeddings if available
        if metadata and metadata.get("language"):
            code_embedding = await self._generate_code_embedding(text, metadata)
            if code_embedding:
                embeddings.append(code_embedding)

        # Structural embedding
        if metadata and metadata.get("ast"):
            structural_embedding = await self._generate_structural_embedding(metadata["ast"])
            if structural_embedding:
                embeddings.append(structural_embedding)

        # Combine all embeddings
        if len(embeddings) > 1:
            combined_embedding = self._combine_embeddings(embeddings)
        else:
            combined_embedding = embeddings[0] if embeddings else await self._simple_embed(text, metadata)

        return combined_embedding

    async def _hybrid_embed(self, text: str, metadata: Optional[Dict[str, Any]]) -> List[float]:
        """Hybrid embedding combining multiple strategies."""
        strategy_embeddings = []

        # Get embeddings from different strategies
        strategies = [
            EmbeddingStrategy.SIMPLE,
            EmbeddingStrategy.CONTEXT_AWARE,
        ]

        if metadata and metadata.get("language"):
            strategies.append(EmbeddingStrategy.CODE_SPECIFIC)

        for strategy in strategies:
            try:
                embedding = await self.embed(text, strategy, metadata)
                strategy_embeddings.append(embedding)
            except Exception as e:
                print(f"Warning: Strategy {strategy} failed: {e}")
                continue

        # Combine embeddings
        if strategy_embeddings:
            combined_embedding = self._combine_embeddings(strategy_embeddings)
        else:
            combined_embedding = await self._simple_embed(text, metadata)

        return combined_embedding

    async def _code_specific_embed(self, text: str, metadata: Optional[Dict[str, Any]]) -> List[float]:
        """Code-specific embedding using specialized models."""
        if not metadata or not metadata.get("language"):
            return await self._simple_embed(text, metadata)

        language = metadata["language"]

        # Try to use code-specific model
        if language in ["python", "javascript", "java", "cpp"] and "codebert" in self.models:
            return await self._generate_codebert_embedding(text, metadata)
        elif "graphcodebert" in self.models:
            return await self._generate_graphcodebert_embedding(text, metadata)
        else:
            # Fall back to enhanced simple embedding
            enhanced_text = self._enhance_code_text(text, language)
            return await self._simple_embed(enhanced_text, metadata)

    async def _semantic_chunk_embed(self, text: str, metadata: Optional[Dict[str, Any]]) -> List[float]:
        """Semantic chunk-based embedding."""
        # Split text into semantic chunks
        chunks = self._semantic_chunk(text)

        if not chunks:
            return await self._simple_embed(text, metadata)

        # Generate embeddings for chunks
        chunk_embeddings = []
        for chunk in chunks:
            embedding = await self._simple_embed(chunk, metadata)
            chunk_embeddings.append(embedding)

        # Aggregate chunk embeddings
        aggregated_embedding = self._aggregate_chunk_embeddings(chunk_embeddings)

        return aggregated_embedding

    async def _performance_optimized_embed(self, text: str, metadata: Optional[Dict[str, Any]]) -> List[float]:
        """Performance-optimized embedding with caching and batching."""
        # Check cache first
        cache_key = self._get_cache_key(text, EmbeddingStrategy.PERFORMANCE_OPTIMIZED, metadata)
        cached_embedding = await self._get_cached_embedding(cache_key)
        if cached_embedding is not None:
            return cached_embedding

        # Use optimized preprocessing
        optimized_text = self._optimize_text_for_embedding(text)

        # Generate embedding
        embedding = await self._simple_embed(optimized_text, metadata)

        # Cache the result
        await self._cache_embedding(cache_key, embedding)

        return embedding

    async def batch_embed(
        self,
        texts: List[str],
        strategy: Optional[EmbeddingStrategy] = None,
        metadata_list: Optional[List[Dict[str, Any]]] = None,
    ) -> List[List[float]]:
        """Generate embeddings for multiple texts in batches."""
        strategy = strategy or self.config.strategy
        metadata_list = metadata_list or [None] * len(texts)

        # Process in batches
        embeddings = []
        for i in range(0, len(texts), self.config.batch_size):
            batch_texts = texts[i:i + self.config.batch_size]
            batch_metadata = metadata_list[i:i + self.config.batch_size]

            # Process batch
            batch_embeddings = await asyncio.gather(*[
                self.embed(text, strategy, metadata)
                for text, metadata in zip(batch_texts, batch_metadata)
            ])

            embeddings.extend(batch_embeddings)

        return embeddings

    def _preprocess_text(self, text: str) -> str:
        """Preprocess text for embedding."""
        # Clean and normalize text
        text = text.strip()

        # Remove excessive whitespace
        import re
        text = re.sub(r'\s+', ' ', text)

        # Truncate if too long
        if len(text) > self.config.max_length * 4:  # Rough estimate
            text = text[:self.config.max_length * 4]

        return text

    def _hierarchical_chunk(self, text: str) -> List[str]:
        """Split text into hierarchical chunks."""
        chunks = []

        # Document level
        if len(text) <= self.config.max_length:
            chunks.append(text)
        else:
            # Paragraph level
            paragraphs = text.split('\n\n')
            for paragraph in paragraphs:
                if len(paragraph) <= self.config.max_length:
                    chunks.append(paragraph)
                else:
                    # Sentence level
                    sentences = paragraph.split('. ')
                    for sentence in sentences:
                        if len(sentence) <= self.config.max_length:
                            chunks.append(sentence)
                        else:
                            # Word level - truncate
                            chunks.append(sentence[:self.config.max_length])

        return chunks[:3]  # Return top 3 chunks

    def _semantic_chunk(self, text: str) -> List[str]:
        """Split text into semantic chunks."""
        # Simple semantic chunking based on sentences and code blocks
        chunks = []

        # Split by code blocks
        import re
        code_blocks = re.findall(r'```.*?```', text, re.DOTALL)
        non_code_parts = re.split(r'```.*?```', text, flags=re.DOTALL)

        # Add code blocks as chunks
        for block in code_blocks:
            chunks.append(block)

        # Split non-code parts by sentences
        for part in non_code_parts:
            sentences = re.split(r'[.!?]+', part)
            for sentence in sentences:
                sentence = sentence.strip()
                if sentence and len(sentence) > self.config.min_chunk_size:
                    chunks.append(sentence)

        return chunks

    def _build_context_text(self, text: str, context: Dict[str, Any]) -> str:
        """Build context-enhanced text."""
        context_parts = []

        # Add file path if available
        if context.get("file_path"):
            context_parts.append(f"File: {context['file_path']}")

        # Add language if available
        if context.get("language"):
            context_parts.append(f"Language: {context['language']}")

        # Add function/class context
        if context.get("function_name"):
            context_parts.append(f"Function: {context['function_name']}")

        if context.get("class_name"):
            context_parts.append(f"Class: {context['class_name']}")

        # Combine context with original text
        if context_parts:
            context_text = " ".join(context_parts) + " " + text
        else:
            context_text = text

        return context_text

    def _enhance_code_text(self, text: str, language: str) -> str:
        """Enhance code text with language-specific information."""
        # Add language markers
        enhanced = f"Code in {language}: {text}"

        # Add common patterns for the language
        language_patterns = {
            "python": ["def ", "class ", "import ", "from "],
            "javascript": ["function ", "class ", "const ", "let "],
            "java": ["public class ", "public void ", "import "],
            "cpp": ["class ", "void ", "#include "],
        }

        patterns = language_patterns.get(language, [])
        if patterns:
            pattern_text = " ".join(patterns)
            enhanced = f"{enhanced} Keywords: {pattern_text}"

        return enhanced

    async def _generate_code_embedding(self, text: str, metadata: Dict[str, Any]) -> Optional[List[float]]:
        """Generate code-specific embedding."""
        try:
            if "codebert" in self.models:
                return await self._generate_codebert_embedding(text, metadata)
        except Exception as e:
            print(f"Warning: Code embedding generation failed: {e}")

        return None

    async def _generate_codebert_embedding(self, text: str, metadata: Dict[str, Any]) -> List[float]:
        """Generate embedding using CodeBERT."""
        if "codebert" not in self.models or "codebert" not in self.tokenizers:
            raise EmbeddingError("CodeBERT model not loaded")

        model = self.models["codebert"]
        tokenizer = self.tokenizers["codebert"]

        # Prepare input
        enhanced_text = self._enhance_code_text(text, metadata.get("language", ""))
        inputs = tokenizer(
            enhanced_text,
            return_tensors="pt",
            truncation=True,
            padding=True,
            max_length=self.config.max_length,
        ).to(self._device)

        # Generate embedding
        with torch.no_grad():
            outputs = model(**inputs)
            # Use [CLS] token embedding
            embedding = outputs.last_hidden_state[:, 0, :].cpu().numpy()
            embedding = embedding.flatten()

            if self.config.normalize_embeddings:
                embedding = embedding / np.linalg.norm(embedding)

        return embedding.tolist()

    async def _generate_graphcodebert_embedding(self, text: str, metadata: Dict[str, Any]) -> List[float]:
        """Generate embedding using GraphCodeBERT."""
        if "graphcodebert" not in self.models or "graphcodebert" not in self.tokenizers:
            raise EmbeddingError("GraphCodeBERT model not loaded")

        # Similar to CodeBERT but includes data flow information
        return await self._generate_codebert_embedding(text, metadata)

    async def _generate_structural_embedding(self, ast: Dict[str, Any]) -> Optional[List[float]]:
        """Generate embedding from AST structure."""
        try:
            # Convert AST to text representation
            ast_text = json.dumps(ast, separators=(',', ':'))

            # Use simple embedding for AST
            return await self._simple_embed(ast_text, {"type": "ast"})
        except Exception as e:
            print(f"Warning: Structural embedding generation failed: {e}")
            return None

    def _combine_embeddings(
        self,
        embeddings: List[List[float]],
        weights: Optional[List[float]] = None,
    ) -> List[float]:
        """Combine multiple embeddings using weighted average."""
        if not embeddings:
            return []

        if len(embeddings) == 1:
            return embeddings[0]

        # Convert to numpy arrays
        embedding_arrays = [np.array(emb) for emb in embeddings]

        # Use equal weights if not provided
        if weights is None:
            weights = [1.0 / len(embeddings)] * len(embeddings)

        # Normalize weights
        weights = np.array(weights)
        weights = weights / np.sum(weights)

        # Combine embeddings
        combined = np.zeros_like(embedding_arrays[0])
        for i, emb in enumerate(embedding_arrays):
            combined += weights[i] * emb

        # Normalize if needed
        if self.config.normalize_embeddings:
            combined = combined / np.linalg.norm(combined)

        return combined.tolist()

    def _aggregate_chunk_embeddings(self, chunk_embeddings: List[List[float]]) -> List[float]:
        """Aggregate embeddings from semantic chunks."""
        if not chunk_embeddings:
            return []

        # Use attention-based aggregation
        embedding_arrays = [np.array(emb) for emb in chunk_embeddings]

        # Compute attention weights based on similarity to mean
        mean_embedding = np.mean(embedding_arrays, axis=0)
        similarities = [cosine_similarity(emb.tolist(), mean_embedding.tolist()) for emb in embedding_arrays]

        # Apply softmax to similarities for attention weights
        exp_similarities = np.exp(similarities)
        attention_weights = exp_similarities / np.sum(exp_similarities)

        # Weighted aggregation
        aggregated = np.zeros_like(embedding_arrays[0])
        for i, emb in enumerate(embedding_arrays):
            aggregated += attention_weights[i] * emb

        # Normalize
        if self.config.normalize_embeddings:
            aggregated = aggregated / np.linalg.norm(aggregated)

        return aggregated.tolist()

    def _optimize_text_for_embedding(self, text: str) -> str:
        """Optimize text for faster embedding generation."""
        # Remove redundant whitespace
        import re
        text = re.sub(r'\s+', ' ', text)

        # Remove very short lines
        lines = [line.strip() for line in text.split('\n') if len(line.strip()) > 10]

        # Join and truncate
        optimized = ' '.join(lines)
        if len(optimized) > self.config.max_length * 2:
            optimized = optimized[:self.config.max_length * 2]

        return optimized

    def _get_cache_key(self, text: str, strategy: EmbeddingStrategy, metadata: Optional[Dict[str, Any]]) -> str:
        """Generate cache key for embedding."""
        # Create a hash of the input parameters
        cache_data = {
            "text": text,
            "strategy": strategy.value,
            "metadata": metadata or {},
        }

        cache_str = json.dumps(cache_data, sort_keys=True)
        return hashlib.md5(cache_str.encode()).hexdigest()

    async def _get_cached_embedding(self, cache_key: str) -> Optional[List[float]]:
        """Get embedding from cache."""
        async with self._cache_lock:
            if cache_key in self._embedding_cache:
                embedding, timestamp = self._embedding_cache[cache_key]

                # Check if cache entry is still valid (24 hours)
                if (datetime.now() - timestamp).total_seconds() < 86400:
                    self._embedding_stats["cache_hits"] += 1
                    return embedding
                else:
                    # Remove expired entry
                    del self._embedding_cache[cache_key]

        self._embedding_stats["cache_misses"] += 1
        return None

    async def _cache_embedding(self, cache_key: str, embedding: List[float]) -> None:
        """Cache embedding with timestamp."""
        async with self._cache_lock:
            # Limit cache size
            if len(self._embedding_cache) > 10000:
                # Remove oldest entries
                oldest_keys = sorted(
                    self._embedding_cache.keys(),
                    key=lambda k: self._embedding_cache[k][1]
                )[:1000]
                for key in oldest_keys:
                    del self._embedding_cache[key]

            self._embedding_cache[cache_key] = (embedding, datetime.now())

    def _update_stats(self, embedding_time: float) -> None:
        """Update embedding statistics."""
        self._embedding_stats["total_embeddings"] += 1

        # Update average embedding time
        total = self._embedding_stats["total_embeddings"]
        current_avg = self._embedding_stats["avg_embedding_time"]
        self._embedding_stats["avg_embedding_time"] = (
            (current_avg * (total - 1) + embedding_time) / total
        )

    def get_stats(self) -> Dict[str, Any]:
        """Get embedding statistics."""
        stats = self._embedding_stats.copy()

        if stats["cache_hits"] + stats["cache_misses"] > 0:
            stats["cache_hit_rate"] = stats["cache_hits"] / (stats["cache_hits"] + stats["cache_misses"])
        else:
            stats["cache_hit_rate"] = 0.0

        stats["cache_size"] = len(self._embedding_cache)
        stats["device"] = self._device

        return stats

    async def clear_cache(self) -> None:
        """Clear embedding cache."""
        async with self._cache_lock:
            self._embedding_cache.clear()

    def __del__(self):
        """Cleanup resources."""
        # Clear models to free memory
        for model in self.models.values():
            if hasattr(model, 'cpu'):
                model.cpu()

        self.models.clear()
        self.tokenizers.clear()