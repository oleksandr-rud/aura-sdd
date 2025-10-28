"""
AURA-004: Advanced Coding Agent with LangGraph Integration

A sophisticated AI agent system for code analysis, generation, and optimization
built on LangGraph with vector database memory and advanced code understanding
capabilities.
"""

__version__ = "0.1.0"
__author__ = "AURA Team"
__email__ = "team@aura.ai"

from aura_004.core.state import AgentState, ConversationState
from aura_004.core.graph import AgentGraph
from aura_004.core.config import Settings, get_settings
from aura_004.memory.base import BaseMemory
from aura_004.memory.chroma_memory import ChromaMemory
from aura_004.analysis.base import BaseAnalyzer
from aura_004.analysis.tree_sitter_analyzer import TreeSitterAnalyzer

# Core exports
__all__ = [
    # Version info
    "__version__",
    "__author__",
    "__email__",

    # Core components
    "AgentState",
    "ConversationState",
    "AgentGraph",
    "Settings",
    "get_settings",

    # Memory system
    "BaseMemory",
    "ChromaMemory",

    # Analysis system
    "BaseAnalyzer",
    "TreeSitterAnalyzer",
]

# Package metadata
PACKAGE_INFO = {
    "name": "aura-004",
    "version": __version__,
    "description": "Advanced Coding Agent with LangGraph Integration",
    "author": __author__,
    "email": __email__,
    "license": "MIT",
    "python_requires": ">=3.11",
}

# Default configuration
DEFAULT_CONFIG = {
    "log_level": "INFO",
    "max_workers": 4,
    "timeout": 30,
    "vector_db": {
        "type": "chromadb",
        "path": "./data/vector_db",
        "collection_name": "aura_memory",
    },
    "analysis": {
        "max_file_size": 10 * 1024 * 1024,  # 10MB
        "chunk_size": 1000,
        "chunk_overlap": 200,
    },
    "agents": {
        "max_iterations": 10,
        "timeout": 300,
    },
}