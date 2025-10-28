"""
CLI interface for AURA-004.

This module provides command-line interface functionality for interacting
with the AURA-004 system including agent management, code analysis,
and memory operations.
"""

from aura_004.cli.main import main, app
from aura_004.cli.commands import (
    analyze,
    memory,
    agents,
    config,
    serve,
)

__all__ = [
    "main",
    "app",
    "analyze",
    "memory",
    "agents",
    "config",
    "serve",
]