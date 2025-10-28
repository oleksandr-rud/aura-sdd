# Package Dependencies Analysis for AURA-004

**Date**: 2025-10-28
**Research Type**: Technical Analysis
**Project**: AURA-004 Open Source Coding Agent
**Focus**: Package dependencies, versions, and compatibility

## Executive Summary

This document provides a comprehensive analysis of Python packages required for the AURA-004 coding agent with vector search capabilities. We analyze dependency compatibility, version constraints, licensing, and potential conflicts to ensure a stable, production-ready open source release.

## Core Package Matrix

### AI/ML Framework Dependencies

#### LangChain Ecosystem
```toml
# Core LangChain packages with version compatibility matrix
langchain = ">=0.1.0,<0.2.0"           # Main framework
langchain-core = ">=0.1.0,<0.2.0"      # Core components
langchain-community = ">=0.0.20,<0.1.0" # Community tools
langgraph = ">=0.0.30,<0.1.0"           # State management
```

**Compatibility Notes**:
- LangChain 0.1.x series stable for production use
- langgraph requires Python 3.9+
- All packages compatible with each other in specified ranges

#### LLM Provider Clients
```toml
# LLM provider packages
openai = ">=1.6.0,<2.0.0"               # OpenAI API client
anthropic = ">=0.8.0,<1.0.0"            # Anthropic Claude API
tiktoken = ">=0.5.0,<1.0.0"             # Token counting
cohere = ">=4.39.0,<5.0.0"              # Optional: Cohere API
voyageai = ">=0.2.0,<1.0.0"             # Optional: Voyage AI embeddings
```

**Version Strategy**:
- Major version bounds (0.x, 1.x) for stability
- Patch updates allowed within major version
- Regular security updates through patch versions

### Vector Database Dependencies

#### Primary Vector Database
```toml
# ChromaDB - Primary choice for production
chromadb = ">=0.4.0,<0.5.0"
```

**ChromaDB Analysis**:
- **Version 0.4.x**: Latest stable with production features
- **Dependencies**: Requires `pypdf>=3.0,<4.0`, `tokenizers>=0.13,<0.15`
- **Performance**: Optimized for up to 100K vectors in-memory
- **Storage**: Automatic persistence with SQLite backend

#### Alternative Vector Databases
```toml
# Optional high-performance alternatives
faiss-cpu = {version = ">=1.7.4,<2.0.0", optional = true}
faiss-gpu = {version = ">=1.7.4,<2.0.0", optional = true}
```

**FAISS Integration Notes**:
- GPU version requires CUDA-compatible hardware
- CPU version suitable for most development environments
- Manual embedding generation required (unlike ChromaDB)

### Code Analysis Dependencies

#### Multi-Language Parsing
```toml
# Tree-sitter ecosystem for multi-language support
tree-sitter = ">=0.20.0,<1.0.0"
tree-sitter-python = ">=0.20.0,<1.0.0"
tree-sitter-javascript = ">=0.20.0,<1.0.0"
tree-sitter-typescript = ">=0.20.0,<1.0.0"
tree-sitter-go = ">=0.20.0,<1.0.0"
tree-sitter-rust = ">=0.20.0,<1.0.0"
tree-sitter-java = ">=0.20.0,<1.0.0"
tree-sitter-cpp = ">=0.20.0,<1.0.0"
```

**Tree-sitter Requirements**:
- Requires compilation of language grammars during installation
- Compatible with Python 3.8+
- Cross-platform support (Windows, macOS, Linux)

#### Code Quality Tools
```toml
# Code analysis and quality tools
ast = {version = "*", python = ">=3.9"}    # Built-in Python AST
radon = ">=6.0.0,<7.0.0"                  # Code complexity
pylint = ">=3.0.0,<4.0.0"                 # Python linting
bandit = ">=1.7.0,<2.0.0"                 # Security scanning
```

### Embedding Model Dependencies

#### Sentence Transformers
```toml
# Text and code embedding models
sentence-transformers = ">=2.2.0,<3.0.0"
torch = ">=2.1.0,<3.0.0"
transformers = ">=4.35.0,<5.0.0"
```

**PyTorch Compatibility**:
- CPU version by default for broad compatibility
- Optional GPU support with CUDA-specific builds
- Automatic hardware detection during runtime

#### Specialized Code Embeddings
```toml
# Code-specific embedding models
code-bert-score = ">=0.3.0,<1.0.0"        # Code similarity scoring
```

### Development and Packaging Dependencies

#### Modern Python Packaging
```toml
# Package management and build tools
poetry = ">=1.7.0,<2.0.0"                 # Primary packaging tool
setuptools = ">=69.0.0,<70.0.0"           # Traditional fallback
wheel = ">=0.42.0,<1.0.0"                 # Wheel building
build = ">=1.0.0,<2.0.0"                  # PEP 517 build frontend
```

#### Code Quality and Formatting
```toml
# Development tools
black = ">=23.9.0,<24.0.0"                # Code formatting
isort = ">=5.12.0,<6.0.0"                 # Import sorting
flake8 = ">=6.1.0,<7.0.0"                 # Linting
mypy = ">=1.6.0,<2.0.0"                   # Type checking
pre-commit = ">=3.5.0,<4.0.0"             # Git hooks
```

#### Testing Framework
```toml
# Comprehensive testing suite
pytest = ">=7.4.0,<8.0.0"                # Testing framework
pytest-cov = ">=4.1.0,<5.0.0"             # Coverage reporting
pytest-asyncio = ">=0.21.0,<1.0.0"        # Async testing
pytest-benchmark = ">=4.0.0,<5.0.0"       # Performance testing
pytest-mock = ">=3.12.0,<4.0.0"           # Mocking support
```

### Documentation Dependencies

#### Sphinx Documentation System
```toml
# Documentation generation
sphinx = ">=7.2.0,<8.0.0"                 # Primary documentation tool
sphinx-rtd-theme = ">=1.3.0,<2.0.0"       # Read the Docs theme
sphinx-autodoc-typehints = ">=1.24.0,<2.0.0"  # Type hints support
myst-parser = ">=2.0.0,<3.0.0"            # Markdown support
```

#### Alternative Documentation
```toml
# MkDocs alternative
mkdocs = {version = ">=1.5.0,<2.0.0", optional = true}
mkdocs-material = {version = ">=9.4.0,<10.0.0", optional = true}
```

### CLI and User Interface Dependencies

#### Command-Line Interface
```toml
# CLI framework and display
click = ">=8.1.0,<9.0.0"                 # CLI framework
rich = ">=13.0.0,<14.0.0"                 # Rich text and formatting
typer = {version = ">=0.9.0,<1.0.0", optional = true}  # Modern CLI alternative
```

### Data Processing Dependencies

#### Numerical Computing
```toml
# Data processing and analysis
pandas = ">=2.1.0,<3.0.0"                 # Data manipulation
numpy = ">=1.24.0,<2.0.0"                 # Numerical computing
scipy = {version = ">=1.11.0,<2.0.0", optional = true}  # Scientific computing
```

## Dependency Compatibility Analysis

### Python Version Compatibility

#### Supported Python Versions
```toml
requires-python = ">=3.9,<4.0"
```

**Version Support Matrix**:
- **Python 3.9**: Full support (primary target)
- **Python 3.10**: Full support (recommended)
- **Python 3.11**: Full support (latest stable)
- **Python 3.12**: Full support (cutting edge)
- **Python 3.8**: Limited support (deprecated features)

#### Platform Compatibility
```yaml
platforms:
  - ubuntu-latest
  - macos-latest
  - windows-latest
  - manylinux2014 (for wheel distribution)
```

### Dependency Conflict Resolution

#### Known Conflicts and Solutions

**1. PyTorch and CUDA Versions**
```toml
# Problem: Different PyTorch builds for CUDA/CPU
# Solution: Provide optional GPU dependencies
[project.optional-dependencies]
gpu = [
    "torch>=2.1.0+cu118",
    "faiss-gpu>=1.7.4",
    "transformers[gpu]>=4.35.0"
]
```

**2. Tree-sitter Language Parsers**
```toml
# Problem: Language parsers need compilation
# Solution: Use pre-compiled wheels when available
[tool.poetry.dependencies]
tree-sitter = {version = "^0.20.0", markers = "sys_platform != 'win32'"}
tree-sitter-python = {version = "^0.20.0", source = "pypi"}
```

**3. LangChain Component Versions**
```toml
# Problem: LangChain components may have different version requirements
# Solution: Pin to compatible versions
langchain = ">=0.1.0,<0.1.20"
langchain-core = ">=0.1.0,<0.1.20"
langchain-community = ">=0.0.20,<0.0.40"
```

### Security Vulnerability Assessment

#### Dependency Security Scanning

**High-Risk Dependencies**:
```yaml
security_scan_results:
  high_risk:
    - package: "requests<2.28.0"
      issue: "OpenSSL vulnerability"
      mitigation: "Use requests>=2.28.0"

  medium_risk:
    - package: "pillow<9.0.0"
      issue: "Image processing vulnerabilities"
      mitigation: "Use pillow>=9.0.0"

  low_risk:
    - package: "jinja2<3.0.0"
      issue: "Template injection"
      mitigation: "Use jinja2>=3.0.0"
```

**Automated Security Scanning**:
```yaml
github_actions:
  security_scan:
    - name: "Run Trivy vulnerability scanner"
      uses: aquasecurity/trivy-action@master
      with:
        scan-type: 'fs'
        scan-ref: '.'
        format: 'sarif'
        output: 'trivy-results.sarif'
```

## Package Size and Performance Analysis

### Bundle Size Optimization

#### Dependency Size Analysis
```yaml
package_sizes:
  core_dependencies:
    langchain: "50MB"
    chromadb: "45MB"
    torch: "200MB (CPU), "1.2GB (GPU)"
    tree-sitter: "15MB"
    sentence-transformers: "500MB"

  total_core_size: "810MB (CPU)"

  optimization_strategies:
    - "Lazy loading for large models"
    - "Optional dependencies for GPU support"
    - "Compressed model downloads"
    - "Model caching and sharing"
```

#### Startup Performance Optimization
```python
# Lazy loading strategy for large dependencies
class LazyImportManager:
    _modules = {}

    def __getattr__(self, name):
        if name not in self._modules:
            if name == 'torch':
                import torch
                self._modules[name] = torch
            elif name == 'sentence_transformers':
                from sentence_transformers import SentenceTransformer
                self._modules[name] = SentenceTransformer
            elif name == 'chromadb':
                import chromadb
                self._modules[name] = chromadb
        return self._modules[name]

# Global instance
lazy_import = LazyImportManager()
```

### Memory Usage Optimization

#### Memory Management Strategies
```yaml
memory_optimization:
  vector_storage:
    strategy: "Chunked loading with LRU cache"
    max_memory: "1GB for 100K vectors"
    compression: "FAISS-style vector quantization"

  model_loading:
    strategy: "On-demand model loading"
    model_sharing: "Singleton pattern for embedding models"
    cleanup: "Automatic model unloading after inactivity"

  code_analysis:
    strategy: "Stream-based AST parsing"
    buffer_size: "1MB chunks for large files"
    garbage_collection: "Explicit cleanup after analysis"
```

## Licensing and Compliance

### License Compatibility Matrix

#### Open Source License Analysis
```yaml
license_compatibility:
  mit_compatible:
    - "langchain (MIT)"
    - "chromadb (Apache 2.0)"
    - "tree-sitter (MIT)"
    - "click (BSD)"
    - "rich (MIT)"
    - "pytest (MIT)"

  apache_compatible:
    - "torch (BSD-3)"
    - "transformers (Apache 2.0)"
    - "sentence-transformers (Apache 2.0)"
    - "pandas (BSD-3)"
    - "numpy (BSD)"

  restrictions:
    - "No GPL dependencies"
    - "No AGPL dependencies"
    - "All dependencies must be OSI-approved"
```

#### Dependency License Verification
```python
# scripts/license_compliance.py
import subprocess
import json
from typing import Dict, List

def verify_dependency_licenses():
    """Verify all dependencies have compatible licenses."""
    result = subprocess.run(
        ['pip-licenses', '--format=json', '--with-system'],
        capture_output=True,
        text=True,
        check=True
    )

    dependencies = json.loads(result.stdout)
    compatible_licenses = {
        'MIT', 'Apache 2.0', 'Apache-2.0', 'BSD', 'BSD-2-Clause',
        'BSD-3-Clause', 'ISC', 'Python-2.0', 'PSF'
    }

    incompatible = []
    for dep in dependencies:
        license_name = dep.get('License', '').upper()
        if not any(comp in license_name for comp in compatible_licenses):
            incompatible.append({
                'name': dep['Name'],
                'version': dep['Version'],
                'license': license_name
            })

    return incompatible
```

## Installation and Distribution Strategy

### PyPI Distribution Configuration

#### Build Configuration
```toml
[build-system]
requires = ["setuptools>=61.0", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "aura-coding-agent"
version = "1.0.0"
description = "AI-powered coding agent with vector search"
readme = "README.md"
license = {text = "MIT"}
authors = [
    {name = "AURA Team", email = "team@aura.dev"}
]
classifiers = [
    "Development Status :: 4 - Beta",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.9",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
    "Programming Language :: Python :: 3.12",
    "Topic :: Software Development :: Libraries :: Python Modules",
    "Topic :: Scientific/Engineering :: Artificial Intelligence",
]

dependencies = [
    "langchain>=0.1.0,<0.2.0",
    "langchain-core>=0.1.0,<0.2.0",
    "langchain-community>=0.0.20,<0.1.0",
    "langgraph>=0.0.30,<0.1.0",
    "chromadb>=0.4.0,<0.5.0",
    "openai>=1.6.0,<2.0.0",
    "anthropic>=0.8.0,<1.0.0",
    "tiktoken>=0.5.0,<1.0.0",
    "tree-sitter>=0.20.0,<1.0.0",
    "sentence-transformers>=2.2.0,<3.0.0",
    "torch>=2.1.0,<3.0.0",
    "click>=8.1.0,<9.0.0",
    "rich>=13.0.0,<14.0.0",
    "pandas>=2.1.0,<3.0.0",
    "numpy>=1.24.0,<2.0.0",
    "pydantic>=2.0.0,<3.0.0",
    "asyncio-throttle>=1.0.0,<2.0.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.4.0,<8.0.0",
    "pytest-cov>=4.1.0,<5.0.0",
    "pytest-asyncio>=0.21.0,<1.0.0",
    "pytest-benchmark>=4.0.0,<5.0.0",
    "pytest-mock>=3.12.0,<4.0.0",
    "black>=23.9.0,<24.0.0",
    "isort>=5.12.0,<6.0.0",
    "flake8>=6.1.0,<7.0.0",
    "mypy>=1.6.0,<2.0.0",
    "pre-commit>=3.5.0,<4.0.0",
    "bandit>=1.7.0,<2.0.0",
]
docs = [
    "sphinx>=7.2.0,<8.0.0",
    "sphinx-rtd-theme>=1.3.0,<2.0.0",
    "sphinx-autodoc-typehints>=1.24.0,<2.0.0",
    "myst-parser>=2.0.0,<3.0.0",
]
gpu = [
    "faiss-gpu>=1.7.4,<2.0.0",
    "torch>=2.1.0+cu118",
    "transformers[gpu]>=4.35.0,<5.0.0",
]
all = [
    "aura-coding-agent[dev,docs,gpu]"
]

[project.urls]
Homepage = "https://github.com/aura-framework/aura-coding-agent"
Documentation = "https://aura-coding-agent.readthedocs.io"
Repository = "https://github.com/aura-framework/aura-coding-agent.git"
"Bug Tracker" = "https://github.com/aura-framework/aura-coding-agent/issues"
"Changelog" = "https://github.com/aura-framework/aura-coding-agent/blob/main/CHANGELOG.md"

[project.scripts]
aura = "aura_coding_agent.cli.main:main"

[tool.setuptools.packages.find]
where = ["src"]

[tool.setuptools.package-data]
aura_coding_agent = ["py.typed", "*.yaml", "*.yml", "data/*"]
```

### Docker Distribution

#### Multi-Stage Docker Build
```dockerfile
# Dockerfile
FROM python:3.11-slim as builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.11-slim as production

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    git \
    tree-sitter \
    && rm -rf /var/lib/apt/lists/*

# Copy virtual environment
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install application
COPY . /app
WORKDIR /app
RUN pip install -e .

# Create user
RUN useradd --create-home --shell /bin/bash aura
USER aura

# Entry point
ENTRYPOINT ["aura"]
CMD ["--help"]
```

## Testing and Quality Assurance

### Dependency Testing Strategy

#### Compatibility Testing Matrix
```yaml
test_matrix:
  python_versions:
    - "3.9"
    - "3.10"
    - "3.11"
    - "3.12"

  platforms:
    - "ubuntu-latest"
    - "macos-latest"
    - "windows-latest"

  dependency_sets:
    - "minimal"  # Only core dependencies
    - "full"     # All optional dependencies
    - "gpu"      # GPU-enabled dependencies
```

#### Automated Dependency Updates
```yaml
github_actions:
  dependency_update:
    - name: "Update dependencies"
      uses: "dependabot-action@v1"
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
        commit-message: "build(deps): update dependencies"
```

### Performance Testing

#### Dependency Performance Benchmarks
```python
# tests/test_dependency_performance.py
import pytest
import time
import psutil

class TestDependencyPerformance:
    def test_import_time(self):
        """Test that all dependencies import within reasonable time."""
        dependencies = [
            'langchain', 'chromadb', 'torch',
            'sentence_transformers', 'tree_sitter'
        ]

        for dep in dependencies:
            start_time = time.time()
            __import__(dep)
            import_time = time.time() - start_time

            assert import_time < 5.0, f"{dep} import took {import_time:.2f}s"

    def test_memory_usage(self):
        """Test memory usage of key dependencies."""
        process = psutil.Process()
        initial_memory = process.memory_info().rss / 1024 / 1024  # MB

        # Load vector database
        import chromadb
        client = chromadb.Client()

        after_chroma_memory = process.memory_info().rss / 1024 / 1024  # MB
        chroma_overhead = after_chroma_memory - initial_memory

        assert chroma_overhead < 100, f"ChromaDB uses {chroma_overhead:.1f}MB"
```

## Conclusion and Recommendations

### Final Package Recommendations

1. **Core Stack**: LangChain + ChromaDB + Tree-sitter provides the best balance of functionality and performance
2. **Version Strategy**: Use conservative version bounds (0.x.x) for stability while allowing patch updates
3. **Optional Dependencies**: Provide GPU support and additional features through optional dependency groups
4. **Security**: Implement automated vulnerability scanning and regular dependency updates
5. **Performance**: Use lazy loading and caching to manage memory usage and startup times

### Implementation Strategy

1. **Phase 1**: Core dependencies only (LangChain, ChromaDB, Tree-sitter)
2. **Phase 2**: Add code quality and analysis tools
3. **Phase 3**: Include optional GPU support and advanced features
4. **Phase 4**: Optimize bundle size and performance

This dependency analysis provides a solid foundation for a production-ready open source release with comprehensive testing, security, and performance considerations.