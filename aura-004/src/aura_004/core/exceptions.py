"""
Custom exceptions for the AURA-004 system.

This module defines a hierarchy of custom exceptions that provide specific
error handling and debugging capabilities for different components of the system.
"""

from typing import Any, Dict, Optional


class AuraError(Exception):
    """Base exception for all AURA-004 errors."""

    def __init__(
        self,
        message: str,
        error_code: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None,
        cause: Optional[Exception] = None,
    ):
        super().__init__(message)
        self.message = message
        self.error_code = error_code
        self.context = context or {}
        self.cause = cause

    def __str__(self) -> str:
        error_str = self.message
        if self.error_code:
            error_str = f"[{self.error_code}] {error_str}"
        if self.context:
            error_str += f" | Context: {self.context}"
        return error_str

    def to_dict(self) -> Dict[str, Any]:
        """Convert exception to dictionary for serialization."""
        return {
            "error_type": self.__class__.__name__,
            "message": self.message,
            "error_code": self.error_code,
            "context": self.context,
            "cause": str(self.cause) if self.cause else None,
        }


class StateError(AuraError):
    """Raised when there are issues with state management."""

    def __init__(
        self,
        message: str,
        state_type: Optional[str] = None,
        state_id: Optional[str] = None,
        **kwargs,
    ):
        context = kwargs.get("context", {})
        if state_type:
            context["state_type"] = state_type
        if state_id:
            context["state_id"] = state_id
        kwargs["context"] = context
        kwargs["error_code"] = "STATE_ERROR"
        super().__init__(message, **kwargs)


class GraphError(AuraError):
    """Raised when there are issues with graph operations."""

    def __init__(
        self,
        message: str,
        graph_id: Optional[str] = None,
        node_id: Optional[str] = None,
        **kwargs,
    ):
        context = kwargs.get("context", {})
        if graph_id:
            context["graph_id"] = graph_id
        if node_id:
            context["node_id"] = node_id
        kwargs["context"] = context
        kwargs["error_code"] = "GRAPH_ERROR"
        super().__init__(message, **kwargs)


class ConfigurationError(AuraError):
    """Raised when there are configuration issues."""

    def __init__(
        self,
        message: str,
        config_key: Optional[str] = None,
        config_file: Optional[str] = None,
        **kwargs,
    ):
        context = kwargs.get("context", {})
        if config_key:
            context["config_key"] = config_key
        if config_file:
            context["config_file"] = config_file
        kwargs["context"] = context
        kwargs["error_code"] = "CONFIG_ERROR"
        super().__init__(message, **kwargs)


class MemoryError(AuraError):
    """Raised when there are memory/storage issues."""

    def __init__(
        self,
        message: str,
        memory_type: Optional[str] = None,
        collection_name: Optional[str] = None,
        **kwargs,
    ):
        context = kwargs.get("context", {})
        if memory_type:
            context["memory_type"] = memory_type
        if collection_name:
            context["collection_name"] = collection_name
        kwargs["context"] = context
        kwargs["error_code"] = "MEMORY_ERROR"
        super().__init__(message, **kwargs)


class AnalysisError(AuraError):
    """Raised when there are code analysis issues."""

    def __init__(
        self,
        message: str,
        file_path: Optional[str] = None,
        language: Optional[str] = None,
        **kwargs,
    ):
        context = kwargs.get("context", {})
        if file_path:
            context["file_path"] = file_path
        if language:
            context["language"] = language
        kwargs["context"] = context
        kwargs["error_code"] = "ANALYSIS_ERROR"
        super().__init__(message, **kwargs)


class AgentError(AuraError):
    """Raised when there are agent execution issues."""

    def __init__(
        self,
        message: str,
        agent_name: Optional[str] = None,
        agent_type: Optional[str] = None,
        **kwargs,
    ):
        context = kwargs.get("context", {})
        if agent_name:
            context["agent_name"] = agent_name
        if agent_type:
            context["agent_type"] = agent_type
        kwargs["context"] = context
        kwargs["error_code"] = "AGENT_ERROR"
        super().__init__(message, **kwargs)


class ValidationError(AuraError):
    """Raised when data validation fails."""

    def __init__(
        self,
        message: str,
        field_name: Optional[str] = None,
        validation_type: Optional[str] = None,
        **kwargs,
    ):
        context = kwargs.get("context", {})
        if field_name:
            context["field_name"] = field_name
        if validation_type:
            context["validation_type"] = validation_type
        kwargs["context"] = context
        kwargs["error_code"] = "VALIDATION_ERROR"
        super().__init__(message, **kwargs)


class TimeoutError(AuraError):
    """Raised when operations timeout."""

    def __init__(
        self,
        message: str,
        timeout_duration: Optional[float] = None,
        operation: Optional[str] = None,
        **kwargs,
    ):
        context = kwargs.get("context", {})
        if timeout_duration:
            context["timeout_duration"] = timeout_duration
        if operation:
            context["operation"] = operation
        kwargs["context"] = context
        kwargs["error_code"] = "TIMEOUT_ERROR"
        super().__init__(message, **kwargs)


class ResourceError(AuraError):
    """Raised when there are resource allocation issues."""

    def __init__(
        self,
        message: str,
        resource_type: Optional[str] = None,
        resource_id: Optional[str] = None,
        **kwargs,
    ):
        context = kwargs.get("context", {})
        if resource_type:
            context["resource_type"] = resource_type
        if resource_id:
            context["resource_id"] = resource_id
        kwargs["context"] = context
        kwargs["error_code"] = "RESOURCE_ERROR"
        super().__init__(message, **kwargs)


# Error mapping for serialization
ERROR_MAP: Dict[str, type] = {
    "AuraError": AuraError,
    "StateError": StateError,
    "GraphError": GraphError,
    "ConfigurationError": ConfigurationError,
    "MemoryError": MemoryError,
    "AnalysisError": AnalysisError,
    "AgentError": AgentError,
    "ValidationError": ValidationError,
    "TimeoutError": TimeoutError,
    "ResourceError": ResourceError,
}


def serialize_error(error: Exception) -> Dict[str, Any]:
    """Serialize an exception to a dictionary."""
    if isinstance(error, AuraError):
        return error.to_dict()
    else:
        return {
            "error_type": error.__class__.__name__,
            "message": str(error),
            "error_code": None,
            "context": {},
            "cause": None,
        }


def deserialize_error(error_data: Dict[str, Any]) -> Exception:
    """Deserialize an exception from a dictionary."""
    error_type = error_data.get("error_type", "AuraError")
    error_class = ERROR_MAP.get(error_type, AuraError)

    return error_class(
        message=error_data.get("message", "Unknown error"),
        error_code=error_data.get("error_code"),
        context=error_data.get("context"),
    )