"""
Utility functions and helpers for AURA-004.

This module provides various utility functions including:
- Logging configuration
- Performance monitoring
- Async utilities
- File I/O helpers
- Data validation
- Error handling
"""

from aura_004.utils.logging import setup_logging, get_logger
from aura_004.utils.performance import PerformanceMonitor, Timer
from aura_004.utils.async_utils import (
    async_retry,
    batch_process,
    gather_with_concurrency,
)
from aura_004.utils.file_utils import (
    read_file_safe,
    write_file_safe,
    ensure_directory,
    get_file_hash,
)
from aura_004.utils.validation import (
    validate_config,
    validate_file_path,
    validate_memory_entry,
)
from aura_004.utils.error_handling import (
    handle_errors,
    ErrorContext,
    retry_on_failure,
)

__all__ = [
    # Logging
    "setup_logging",
    "get_logger",

    # Performance
    "PerformanceMonitor",
    "Timer",

    # Async utilities
    "async_retry",
    "batch_process",
    "gather_with_concurrency",

    # File utilities
    "read_file_safe",
    "write_file_safe",
    "ensure_directory",
    "get_file_hash",

    # Validation
    "validate_config",
    "validate_file_path",
    "validate_memory_entry",

    # Error handling
    "handle_errors",
    "ErrorContext",
    "retry_on_failure",
]