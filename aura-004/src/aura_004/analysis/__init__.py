"""
Code analysis components for AURA-004.

This module provides comprehensive code analysis capabilities including:
- Tree-sitter based parsing
- AST extraction and processing
- Code chunking strategies
- Multi-language support
- Semantic analysis
"""

from aura_004.analysis.base import BaseAnalyzer
from aura_004.analysis.tree_sitter_analyzer import TreeSitterAnalyzer
from aura_004.analysis.chunking import (
    CodeChunker,
    SemanticChunker,
    SyntacticChunker,
)
from aura_004.analysis.ast import (
    ASTExtractor,
    ASTNode,
    PythonASTExtractor,
    JavaScriptASTExtractor,
)
from aura_004.analysis.metrics import (
    CodeMetrics,
    ComplexityAnalyzer,
    StyleAnalyzer,
)

__all__ = [
    # Base components
    "BaseAnalyzer",

    # Analyzer implementations
    "TreeSitterAnalyzer",

    # Chunking strategies
    "CodeChunker",
    "SemanticChunker",
    "SyntacticChunker",

    # AST processing
    "ASTExtractor",
    "ASTNode",
    "PythonASTExtractor",
    "JavaScriptASTExtractor",

    # Metrics and analysis
    "CodeMetrics",
    "ComplexityAnalyzer",
    "StyleAnalyzer",
]