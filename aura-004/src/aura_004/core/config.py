"""
Configuration management for AURA-004.

This module provides centralized configuration management using Pydantic settings
with support for environment variables, config files, and runtime overrides.
"""

import os
import yaml
from pathlib import Path
from typing import Any, Dict, List, Optional, Union

from pydantic import BaseModel, Field, validator
from pydantic_settings import BaseSettings, SettingsConfigDict

from aura_004.core.exceptions import ConfigurationError


class VectorDBConfig(BaseModel):
    """Configuration for vector database settings."""

    type: str = Field(default="chromadb", description="Type of vector database")
    path: str = Field(default="./data/vector_db", description="Path to vector database")
    collection_name: str = Field(default="aura_memory", description="Collection name")
    embedding_model: str = Field(default="all-MiniLM-L6-v2", description="Embedding model")
    dimension: int = Field(default=384, description="Embedding dimension")

    class Config:
        extra = "allow"


class AnalysisConfig(BaseModel):
    """Configuration for code analysis settings."""

    max_file_size: int = Field(default=10*1024*1024, description="Maximum file size in bytes")
    chunk_size: int = Field(default=1000, description="Chunk size for code analysis")
    chunk_overlap: int = Field(default=200, description="Chunk overlap for code analysis")
    supported_languages: List[str] = Field(
        default=["python", "javascript", "typescript", "java", "go", "rust", "cpp"],
        description="Supported programming languages"
    )
    max_concurrent_files: int = Field(default=10, description="Maximum concurrent file analysis")

    @validator("chunk_overlap")
    def validate_chunk_overlap(cls, v, values):
        """Ensure chunk overlap is less than chunk size."""
        if "chunk_size" in values and v >= values["chunk_size"]:
            raise ValueError("Chunk overlap must be less than chunk size")
        return v


class AgentConfig(BaseModel):
    """Configuration for agent settings."""

    max_iterations: int = Field(default=10, description="Maximum iterations per agent")
    timeout: int = Field(default=300, description="Timeout in seconds")
    max_concurrent_agents: int = Field(default=4, description="Maximum concurrent agents")

    # LLM settings
    model: str = Field(default="gpt-4o-mini", description="LLM model")
    temperature: float = Field(default=0.1, description="Temperature for generation")
    max_tokens: int = Field(default=4096, description="Maximum tokens per response")

    class Config:
        extra = "allow"


class LoggingConfig(BaseModel):
    """Configuration for logging settings."""

    level: str = Field(default="INFO", description="Log level")
    format: str = Field(
        default="{time:YYYY-MM-DD HH:mm:ss} | {level} | {name}:{function}:{line} | {message}",
        description="Log format"
    )
    rotation: str = Field(default="1 day", description="Log rotation")
    retention: str = Field(default="30 days", description="Log retention")
    compression: str = Field(default="gz", description="Log compression")

    @validator("level")
    def validate_log_level(cls, v):
        """Validate log level."""
        valid_levels = ["TRACE", "DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
        if v.upper() not in valid_levels:
            raise ValueError(f"Log level must be one of {valid_levels}")
        return v.upper()


class MonitoringConfig(BaseModel):
    """Configuration for monitoring and metrics."""

    enabled: bool = Field(default=False, description="Enable monitoring")
    prometheus_port: int = Field(default=8000, description="Prometheus metrics port")
    trace_enabled: bool = Field(default=False, description="Enable distributed tracing")
    metrics_prefix: str = Field(default="aura_004", description="Metrics prefix")

    class Config:
        extra = "allow"


class Settings(BaseSettings):
    """Main settings class for AURA-004."""

    model_config = SettingsConfigDict(
        env_prefix="AURA_004_",
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Core settings
    debug: bool = Field(default=False, description="Enable debug mode")
    environment: str = Field(default="development", description="Environment name")
    data_dir: str = Field(default="./data", description="Data directory path")

    # Component configurations
    vector_db: VectorDBConfig = Field(default_factory=VectorDBConfig)
    analysis: AnalysisConfig = Field(default_factory=AnalysisConfig)
    agents: AgentConfig = Field(default_factory=AgentConfig)
    logging: LoggingConfig = Field(default_factory=LoggingConfig)
    monitoring: MonitoringConfig = Field(default_factory=MonitoringConfig)

    # Performance settings
    max_workers: int = Field(default=4, description="Maximum worker threads")
    timeout: int = Field(default=30, description="Default timeout in seconds")

    # Security settings
    api_keys: Dict[str, str] = Field(default_factory=dict, description="API keys for services")

    @validator("environment")
    def validate_environment(cls, v):
        """Validate environment name."""
        valid_envs = ["development", "staging", "production", "testing"]
        if v.lower() not in valid_envs:
            raise ValueError(f"Environment must be one of {valid_envs}")
        return v.lower()

    @validator("data_dir")
    def validate_data_dir(cls, v):
        """Ensure data directory exists or can be created."""
        path = Path(v)
        try:
            path.mkdir(parents=True, exist_ok=True)
        except OSError as e:
            raise ValueError(f"Cannot create data directory {v}: {e}")
        return str(path.absolute())

    def get_vector_db_path(self) -> Path:
        """Get the full path to the vector database."""
        return Path(self.data_dir) / "vector_db"

    def get_log_path(self) -> Path:
        """Get the full path to the log directory."""
        return Path(self.data_dir) / "logs"

    def get_cache_path(self) -> Path:
        """Get the full path to the cache directory."""
        return Path(self.data_dir) / "cache"


# Global settings instance
_settings: Optional[Settings] = None


def get_settings() -> Settings:
    """Get the global settings instance."""
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings


def load_config(config_path: Union[str, Path]) -> Settings:
    """Load settings from a configuration file."""
    config_path = Path(config_path)

    if not config_path.exists():
        raise ConfigurationError(f"Configuration file not found: {config_path}")

    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            if config_path.suffix.lower() in ['.yaml', '.yml']:
                config_data = yaml.safe_load(f)
            elif config_path.suffix.lower() == '.json':
                import json
                config_data = json.load(f)
            else:
                raise ConfigurationError(f"Unsupported config file format: {config_path.suffix}")

        # Merge with environment variables
        settings = Settings(**config_data)
        global _settings
        _settings = settings
        return settings

    except Exception as e:
        raise ConfigurationError(f"Failed to load configuration from {config_path}: {e}")


def save_config(settings: Settings, config_path: Union[str, Path]) -> None:
    """Save settings to a configuration file."""
    config_path = Path(config_path)
    config_path.parent.mkdir(parents=True, exist_ok=True)

    try:
        config_data = settings.model_dump(exclude_unset=True)

        with open(config_path, 'w', encoding='utf-8') as f:
            if config_path.suffix.lower() in ['.yaml', '.yml']:
                yaml.dump(config_data, f, default_flow_style=False, indent=2)
            elif config_path.suffix.lower() == '.json':
                import json
                json.dump(config_data, f, indent=2)
            else:
                raise ConfigurationError(f"Unsupported config file format: {config_path.suffix}")

    except Exception as e:
        raise ConfigurationError(f"Failed to save configuration to {config_path}: {e}")


def create_default_config(config_path: Union[str, Path]) -> None:
    """Create a default configuration file."""
    settings = Settings()
    save_config(settings, config_path)