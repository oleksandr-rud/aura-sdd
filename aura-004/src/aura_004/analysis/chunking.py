"""
Code chunking strategies for AURA-004.

This module provides various strategies for chunking code into smaller,
manageable pieces for processing and analysis.
"""

import asyncio
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional, Tuple
import re

from aura_004.core.exceptions import AnalysisError


class CodeChunker(ABC):
    """Abstract base class for code chunking strategies."""

    def __init__(self, **kwargs):
        self.min_chunk_size = kwargs.get("min_chunk_size", 100)
        self.max_chunk_size = kwargs.get("max_chunk_size", 2000)

    @abstractmethod
    async def chunk_code(
        self,
        code: str,
        chunk_size: int = 1000,
        overlap: int = 200,
    ) -> List[str]:
        """Chunk code into smaller pieces."""
        pass


class SyntacticChunker(CodeChunker):
    """Chunker that respects code syntax and structure."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.language_patterns = {
            "python": {
                "block_start": r'^(def|class|if|for|while|try|with|async def)\s',
                "block_end": r'^(def|class|if|for|while|try|with|async def|[^\s])',
                "statement_end': r'[:;]',
            },
            "javascript": {
                "block_start": r'^(function|class|if|for|while|try|catch|const|let|var)\s',
                "block_end": r'^(function|class|if|for|while|try|catch|const|let|var|[^\s])',
                "statement_end": r'[;{}]',
            },
            "java": {
                "block_start": r'^(public|private|protected|static|final|class|interface|if|for|while|try|catch)\s',
                "block_end": r'^(public|private|protected|static|final|class|interface|if|for|while|try|catch|[^\s])',
                "statement_end": r'[;{}]',
            },
        }

    async def chunk_code(
        self,
        code: str,
        chunk_size: int = 1000,
        overlap: int = 200,
        language: str = "python",
    ) -> List[str]:
        """Chunk code while preserving syntactic boundaries."""
        lines = code.split('\n')
        chunks = []
        current_chunk = []
        current_size = 0
        in_block = False
        block_indent = 0

        # Get language-specific patterns
        patterns = self.language_patterns.get(language, self.language_patterns["python"])

        i = 0
        while i < len(lines):
            line = lines[i]
            line_stripped = line.strip()

            # Skip empty lines
            if not line_stripped:
                current_chunk.append(line)
                i += 1
                continue

            # Check if this line starts a new block
            block_start_match = re.match(patterns["block_start"], line_stripped, re.IGNORECASE)
            if block_start_match and not in_block:
                # Check if current chunk is getting too large
                if current_size > chunk_size:
                    # Save current chunk
                    chunk_text = '\n'.join(current_chunk).strip()
                    if chunk_text:
                        chunks.append(chunk_text)

                    # Start new chunk with overlap
                    current_chunk = current_chunk[-overlap:] if overlap > 0 else []
                    current_size = sum(len(l) for l in current_chunk)

                current_chunk.append(line)
                current_size += len(line)
                in_block = True
                block_indent = len(line) - len(line.lstrip())
                i += 1
                continue

            # Check if we're ending a block
            if in_block:
                current_indent = len(line) - len(line.lstrip())
                if (current_indent <= block_indent and line_stripped and
                    not re.match(r'\s*#', line) and
                    not re.match(r'\s*//', line) and
                    not re.match(r'\s*/\*', line)):
                    # Block ended
                    in_block = False

            # Check if line ends a statement
            statement_end_match = re.search(patterns["statement_end"], line)
            line_complete = statement_end_match is not None

            current_chunk.append(line)
            current_size += len(line)

            # Check if we should break the chunk
            if current_size > chunk_size and line_complete and not in_block:
                # Find a good breaking point
                chunk_text = '\n'.join(current_chunk).strip()
                if chunk_text:
                    chunks.append(chunk_text)

                # Start new chunk with overlap
                overlap_lines = []
                if overlap > 0:
                    # Add previous lines for context
                    for j in range(max(0, len(current_chunk) - overlap // 50), len(current_chunk)):
                        overlap_lines.append(current_chunk[j])

                current_chunk = overlap_lines
                current_size = sum(len(l) for l in current_chunk)

            i += 1

        # Add remaining content
        if current_chunk:
            chunk_text = '\n'.join(current_chunk).strip()
            if chunk_text:
                chunks.append(chunk_text)

        return chunks


class SemanticChunker(CodeChunker):
    """Chunker that respects semantic boundaries like functions and classes."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.semantic_patterns = {
            "python": {
                "function": r'^(async\s+)?def\s+\w+\s*\(',
                "class": r'^class\s+\w+',
                "import": r'^(import|from)\s+',
                "decorator": r'^@\w+',
            },
            "javascript": {
                "function": r'^(async\s+)?function\s+\w+|=>\s*{',
                "class": r'^class\s+\w+',
                "import": r'^import\s+',
                "export": r'^export\s+',
            },
            "java": {
                "class": r'^(public\s+)?(class|interface)\s+\w+',
                "method": r'^(public|private|protected|static)?\s*\w+\s+\w+\s*\(',
                "import": r'^import\s+',
            },
        }

    async def chunk_code(
        self,
        code: str,
        chunk_size: int = 1000,
        overlap: int = 200,
        language: str = "python",
    ) -> List[str]:
        """Chunk code based on semantic units."""
        patterns = self.semantic_patterns.get(language, self.semantic_patterns["python"])
        lines = code.split('\n')
        chunks = []
        current_chunk = []
        current_size = 0
        current_unit = None

        i = 0
        while i < len(lines):
            line = lines[i]
            line_stripped = line.strip()

            # Skip empty lines and comments
            if not line_stripped or line_stripped.startswith('#') or line_stripped.startswith('//'):
                current_chunk.append(line)
                i += 1
                continue

            # Check for semantic unit boundaries
            unit_type = None
            for unit, pattern in patterns.items():
                if re.match(pattern, line_stripped, re.IGNORECASE):
                    unit_type = unit
                    break

            # If we found a new unit and current chunk is significant
            if unit_type and current_unit and current_size > self.min_chunk_size:
                # Save current chunk
                chunk_text = '\n'.join(current_chunk).strip()
                if chunk_text:
                    chunks.append(chunk_text)

                # Start new chunk with overlap
                current_chunk = current_chunk[-overlap:] if overlap > 0 else []
                current_size = sum(len(l) for l in current_chunk)

            current_unit = unit_type
            current_chunk.append(line)
            current_size += len(line)

            # Check if chunk is getting too large
            if current_size > chunk_size:
                # Try to find a good breaking point
                chunk_text = '\n'.join(current_chunk).strip()
                if chunk_text:
                    chunks.append(chunk_text)

                # Start new chunk with overlap
                current_chunk = current_chunk[-overlap:] if overlap > 0 else []
                current_size = sum(len(l) for l in current_chunk)

            i += 1

        # Add remaining content
        if current_chunk:
            chunk_text = '\n'.join(current_chunk).strip()
            if chunk_text:
                chunks.append(chunk_text)

        return chunks


class FixedSizeChunker(CodeChunker):
    """Simple fixed-size chunker with overlap."""

    async def chunk_code(
        self,
        code: str,
        chunk_size: int = 1000,
        overlap: int = 200,
    ) -> List[str]:
        """Chunk code into fixed-size pieces with overlap."""
        if chunk_size <= overlap:
            raise AnalysisError("Chunk size must be greater than overlap")

        chunks = []
        start = 0

        while start < len(code):
            end = start + chunk_size

            # Try to break at line boundary
            if end < len(code):
                # Find the last newline before end
                last_newline = code.rfind('\n', start, end)
                if last_newline > start + (chunk_size // 2):
                    end = last_newline + 1

            chunk = code[start:end].strip()
            if chunk:
                chunks.append(chunk)

            # Move start position
            start = end - overlap
            if start < 0:
                start = 0

        return chunks


class LineBasedChunker(CodeChunker):
    """Chunker that works by counting lines."""

    async def chunk_code(
        self,
        code: str,
        chunk_size: int = 1000,
        overlap: int = 200,
    ) -> List[str]:
        """Chunk code by lines with overlap."""
        lines = code.split('\n')
        chunks = []
        lines_per_chunk = max(1, chunk_size // 50)  # Estimate 50 chars per line
        overlap_lines = max(0, overlap // 50)

        start = 0
        while start < len(lines):
            end = min(start + lines_per_chunk, len(lines))
            chunk_lines = lines[start:end]
            chunk_text = '\n'.join(chunk_lines).strip()

            if chunk_text:
                chunks.append(chunk_text)

            # Move start position
            start = end - overlap_lines
            if start < 0:
                start = 0

        return chunks


class HierarchicalChunker(CodeChunker):
    """Hierarchical chunker that combines multiple strategies."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.semantic_chunker = SemanticChunker(**kwargs)
        self.syntactic_chunker = SyntacticChunker(**kwargs)
        self.fixed_size_chunker = FixedSizeChunker(**kwargs)

    async def chunk_code(
        self,
        code: str,
        chunk_size: int = 1000,
        overlap: int = 200,
        language: str = "python",
    ) -> List[str]:
        """Apply hierarchical chunking strategy."""
        # First try semantic chunking
        semantic_chunks = await self.semantic_chunker.chunk_code(
            code, chunk_size, overlap, language
        )

        # If chunks are still too large, apply syntactic chunking
        if any(len(chunk) > chunk_size * 1.5 for chunk in semantic_chunks):
            return await self.syntactic_chunker.chunk_code(
                code, chunk_size, overlap, language
            )

        # If semantic chunks are too small, combine them
        if len(semantic_chunks) > len(code) // (chunk_size // 2):
            return await self.fixed_size_chunker.chunk_code(
                code, chunk_size, overlap
            )

        return semantic_chunks


class ChunkerFactory:
    """Factory for creating chunkers."""

    _chunkers = {
        "syntactic": SyntacticChunker,
        "semantic": SemanticChunker,
        "fixed": FixedSizeChunker,
        "line": LineBasedChunker,
        "hierarchical": HierarchicalChunker,
    }

    @classmethod
    def create_chunker(
        self,
        chunker_type: str = "hierarchical",
        **kwargs,
    ) -> CodeChunker:
        """Create a chunker instance."""
        if chunker_type not in self._chunkers:
            raise AnalysisError(f"Unknown chunker type: {chunker_type}")

        return self._chunkers[chunker_type](**kwargs)

    @classmethod
    def register_chunker(cls, name: str, chunker_class: type) -> None:
        """Register a custom chunker."""
        if not issubclass(chunker_class, CodeChunker):
            raise AnalysisError(f"Chunker class must inherit from CodeChunker")
        cls._chunkers[name] = chunker_class

    @classmethod
    def list_chunkers(cls) -> List[str]:
        """List available chunker types."""
        return list(cls._chunkers.keys())


# Utility functions

async def chunk_code(
    code: str,
    chunk_size: int = 1000,
    overlap: int = 200,
    chunker_type: str = "hierarchical",
    language: str = "python",
    **kwargs,
) -> List[str]:
    """Chunk code using the specified chunker."""
    chunker = ChunkerFactory.create_chunker(
        chunker_type=chunker_type,
        **kwargs,
    )
    return await chunker.chunk_code(code, chunk_size, overlap, language)


def estimate_token_count(text: str) -> int:
    """Estimate token count for text."""
    # Simple estimation: ~4 characters per token for code
    return len(text) // 4


def get_chunk_stats(chunks: List[str]) -> Dict[str, Any]:
    """Get statistics about chunks."""
    if not chunks:
        return {
            "count": 0,
            "min_size": 0,
            "max_size": 0,
            "avg_size": 0,
            "total_tokens": 0,
        }

    sizes = [len(chunk) for chunk in chunks]
    token_counts = [estimate_token_count(chunk) for chunk in chunks]

    return {
        "count": len(chunks),
        "min_size": min(sizes),
        "max_size": max(sizes),
        "avg_size": sum(sizes) / len(sizes),
        "total_tokens": sum(token_counts),
        "min_tokens": min(token_counts),
        "max_tokens": max(token_counts),
        "avg_tokens": sum(token_counts) / len(token_counts),
    }