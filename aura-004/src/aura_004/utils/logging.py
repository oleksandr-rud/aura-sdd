"""
Logging configuration and utilities for AURA-004.

This module provides centralized logging setup with structured logging,
performance monitoring, and debug capabilities.
"""

import sys
import logging
import json
from pathlib import Path
from typing import Any, Dict, Optional, Union
from datetime import datetime

import structlog
from loguru import logger as loguru_logger

from aura_004.core.config import get_settings


def setup_logging(
    level: str = "INFO",
    log_file: Optional[Union[str, Path]] = None,
    structured: bool = False,
    **kwargs,
) -> None:
    """Setup logging configuration for AURA-004."""
    try:
        settings = get_settings()
        log_level = level or settings.logging.level
        log_format = kwargs.get("format", settings.logging.format)

        # Remove default handlers
        loguru_logger.remove()

        # Add console handler
        if structured:
            # Structured logging (JSON)
            loguru_logger.add(
                sys.stderr,
                format="{message}",
                level=log_level,
                serialize=True,
                enqueue=True,
            )
        else:
            # Human-readable logging
            loguru_logger.add(
                sys.stderr,
                format=log_format,
                level=log_level,
                colorize=True,
                enqueue=True,
            )

        # Add file handler if specified
        if log_file:
            log_path = Path(log_file)
            log_path.parent.mkdir(parents=True, exist_ok=True)

            loguru_logger.add(
                log_path,
                format=log_format,
                level=log_level,
                rotation=settings.logging.rotation,
                retention=settings.logging.retention,
                compression=settings.logging.compression,
                serialize=structured,
                enqueue=True,
            )

        # Setup structlog for structured logging
        if structured:
            structlog.configure(
                processors=[
                    structlog.stdlib.filter_by_level,
                    structlog.stdlib.add_logger_name,
                    structlog.stdlib.add_log_level,
                    structlog.stdlib.PositionalArgumentsFormatter(),
                    structlog.processors.TimeStamper(fmt="iso"),
                    structlog.processors.StackInfoRenderer(),
                    structlog.processors.format_exc_info,
                    structlog.processors.UnicodeDecoder(),
                    structlog.processors.JSONRenderer(),
                ],
                context_class=dict,
                logger_factory=structlog.stdlib.LoggerFactory(),
                wrapper_class=structlog.stdlib.BoundLogger,
                cache_logger_on_first_use=True,
            )

    except Exception as e:
        # Fallback to basic logging if setup fails
        logging.basicConfig(
            level=getattr(logging, log_level.upper()),
            format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        )
        print(f"Warning: Failed to setup advanced logging: {e}")


def get_logger(name: str) -> Union[structlog.stdlib.BoundLogger, logging.Logger]:
    """Get a logger instance."""
    try:
        # Try to get structlog logger first
        return structlog.get_logger(name)
    except Exception:
        # Fallback to standard logging
        return logging.getLogger(name)


class LoggerMixin:
    """Mixin class to add logging capabilities."""

    @property
    def logger(self) -> Union[structlog.stdlib.BoundLogger, logging.Logger]:
        """Get logger for this class."""
        return get_logger(self.__class__.__name__)


class PerformanceLogger:
    """Logger for performance metrics."""

    def __init__(self, name: str = "performance"):
        self.logger = get_logger(name)
        self.metrics: Dict[str, Any] = {}

    def log_timing(self, operation: str, duration: float, **metadata) -> None:
        """Log timing information."""
        self.logger.info(
            "performance.timing",
            operation=operation,
            duration=duration,
            **metadata,
        )

    def log_memory_usage(self, operation: str, memory_mb: float, **metadata) -> None:
        """Log memory usage information."""
        self.logger.info(
            "performance.memory",
            operation=operation,
            memory_mb=memory_mb,
            **metadata,
        )

    def log_throughput(self, operation: str, items_count: int, duration: float, **metadata) -> None:
        """Log throughput information."""
        throughput = items_count / duration if duration > 0 else 0
        self.logger.info(
            "performance.throughput",
            operation=operation,
            items_count=items_count,
            duration=duration,
            throughput=throughput,
            throughput_unit="items/second",
            **metadata,
        )

    def log_error(self, operation: str, error: Exception, **metadata) -> None:
        """Log error information."""
        self.logger.error(
            "performance.error",
            operation=operation,
            error_type=type(error).__name__,
            error_message=str(error),
            **metadata,
        )


class ContextLogger:
    """Logger with automatic context management."""

    def __init__(self, base_logger: Optional[Union[structlog.stdlib.BoundLogger, logging.Logger]] = None):
        self.logger = base_logger or get_logger("context")
        self.context: Dict[str, Any] = {}

    def bind(self, **kwargs) -> "ContextLogger":
        """Create a new logger with additional context."""
        new_logger = ContextLogger(self.logger)
        new_logger.context = {**self.context, **kwargs}
        return new_logger

    def debug(self, message: str, **kwargs) -> None:
        """Log debug message with context."""
        self.logger.debug(message, **{**self.context, **kwargs})

    def info(self, message: str, **kwargs) -> None:
        """Log info message with context."""
        self.logger.info(message, **{**self.context, **kwargs})

    def warning(self, message: str, **kwargs) -> None:
        """Log warning message with context."""
        self.logger.warning(message, **{**self.context, **kwargs})

    def error(self, message: str, **kwargs) -> None:
        """Log error message with context."""
        self.logger.error(message, **{**self.context, **kwargs})

    def critical(self, message: str, **kwargs) -> None:
        """Log critical message with context."""
        self.logger.critical(message, **{**self.context, **kwargs})


class RequestLogger:
    """Logger for HTTP/API requests."""

    def __init__(self, name: str = "requests"):
        self.logger = get_logger(name)

    def log_request(
        self,
        method: str,
        url: str,
        headers: Optional[Dict[str, str]] = None,
        body: Optional[str] = None,
        request_id: Optional[str] = None,
    ) -> None:
        """Log incoming request."""
        self.logger.info(
            "request.start",
            method=method,
            url=url,
            headers=headers or {},
            body=body,
            request_id=request_id,
        )

    def log_response(
        self,
        status_code: int,
        headers: Optional[Dict[str, str]] = None,
        body: Optional[str] = None,
        duration: Optional[float] = None,
        request_id: Optional[str] = None,
    ) -> None:
        """Log outgoing response."""
        self.logger.info(
            "request.complete",
            status_code=status_code,
            headers=headers or {},
            body=body,
            duration=duration,
            request_id=request_id,
        )


class AgentLogger:
    """Logger for agent operations."""

    def __init__(self, agent_name: str):
        self.agent_name = agent_name
        self.logger = get_logger(f"agent.{agent_name}")

    def log_start(self, task: str, **metadata) -> None:
        """Log agent task start."""
        self.logger.info(
            "agent.start",
            agent=self.agent_name,
            task=task,
            **metadata,
        )

    def log_complete(self, task: str, result: Any, duration: float, **metadata) -> None:
        """Log agent task completion."""
        self.logger.info(
            "agent.complete",
            agent=self.agent_name,
            task=task,
            duration=duration,
            result_type=type(result).__name__,
            **metadata,
        )

    def log_error(self, task: str, error: Exception, **metadata) -> None:
        """Log agent task error."""
        self.logger.error(
            "agent.error",
            agent=self.agent_name,
            task=task,
            error_type=type(error).__name__,
            error_message=str(error),
            **metadata,
        )

    def log_state_change(self, from_state: str, to_state: str, **metadata) -> None:
        """Log agent state change."""
        self.logger.info(
            "agent.state_change",
            agent=self.agent_name,
            from_state=from_state,
            to_state=to_state,
            **metadata,
        )


def configure_debug_logging() -> None:
    """Configure debug-level logging."""
    setup_logging(
        level="DEBUG",
        structured=False,
        format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level} | {name}:{function}:{line} | {message}",
    )


def configure_production_logging(log_file: Optional[str] = None) -> None:
    """Configure production logging."""
    settings = get_settings()
    log_path = log_file or settings.get_log_path() / "aura-004.log"

    setup_logging(
        level="INFO",
        structured=True,
        log_file=log_path,
    )


def configure_development_logging() -> None:
    """Configure development logging."""
    setup_logging(
        level="DEBUG",
        structured=False,
    )


# Log filtering utilities
class LevelFilter(logging.Filter):
    """Custom log level filter."""

    def __init__(self, level: str):
        super().__init__()
        self.level = getattr(logging, level.upper())

    def filter(self, record: logging.LogRecord) -> bool:
        return record.levelno >= self.level


class ContextFilter(logging.Filter):
    """Filter that adds context to log records."""

    def __init__(self, **context):
        super().__init__()
        self.context = context

    def filter(self, record: logging.LogRecord) -> bool:
        for key, value in self.context.items():
            setattr(record, key, value)
        return True


# Log rotation utilities
def setup_log_rotation(
    log_file: Union[str, Path],
    max_size: str = "10 MB",
    backup_count: int = 5,
) -> None:
    """Setup log rotation for a log file."""
    from logging.handlers import RotatingFileHandler

    log_path = Path(log_file)
    log_path.parent.mkdir(parents=True, exist_ok=True)

    # Parse size
    size_units = {"B": 1, "KB": 1024, "MB": 1024**2, "GB": 1024**3}
    size_value, size_unit = max_size.split()
    max_bytes = int(size_value) * size_units[size_unit]

    handler = RotatingFileHandler(
        log_path,
        maxBytes=max_bytes,
        backupCount=backup_count,
    )

    # Set format
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    handler.setFormatter(formatter)

    # Add to root logger
    logging.getLogger().addHandler(handler)