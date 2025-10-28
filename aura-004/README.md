# AURA-004: Advanced Coding Agent with LangGraph Integration

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Alpha-yellow.svg)](https://github.com/aura-ai/aura-004)

AURA-004 is a sophisticated AI agent system for code analysis, generation, and optimization built on LangGraph with vector database memory and advanced code understanding capabilities.

## ✨ Features

- **🧠 Advanced Memory System**: ChromaDB-based vector storage with semantic search
- **🔍 Code Analysis**: Tree-sitter powered multi-language parsing and analysis
- **🤖 LangGraph Integration**: Sophisticated agent orchestration and state management
- **💻 Multi-Language Support**: Python, JavaScript, TypeScript, Java, Go, Rust, C++, and more
- **📊 Performance Monitoring**: Built-in metrics and performance tracking
- **🔧 Extensible Architecture**: Modular design with easy customization
- **🖥️ Rich CLI**: Comprehensive command-line interface with beautiful output
- **⚡ Async Operations**: Full async/await support for high performance

## 🚀 Quick Start

### Installation

```bash
# Install from PyPI (coming soon)
pip install aura-004

# Install from source
git clone https://github.com/aura-ai/aura-004.git
cd aura-004
pip install -e .
```

### Basic Usage

```python
import asyncio
from aura_004 import AgentGraph, TreeSitterAnalyzer, ChromaMemory

async def main():
    # Initialize components
    memory = ChromaMemory()
    await memory.initialize()

    analyzer = TreeSitterAnalyzer()
    await analyzer.initialize()

    # Analyze code
    result = await analyzer.analyze_file("example.py")
    print(f"Analyzed {result.metrics['total_lines']} lines")

    # Store in memory
    await memory.store("example_analysis", result.model_dump())

    # Search memory
    results = await memory.retrieve("Python function analysis")
    print(f"Found {len(results)} related entries")

asyncio.run(main())
```

### CLI Usage

```bash
# Initialize AURA-004
aura-004 init

# Analyze a file
aura-004 analyze file example.py --lang python

# Analyze a directory
aura-004 analyze directory ./src --pattern "**/*.py"

# Initialize memory
aura-004 memory init --collection my_collection

# Store content in memory
aura-004 memory store "my_key" "My content to remember"

# Search memory
aura-004 memory search "my query" --limit 5

# Show system status
aura-004 status

# Run diagnostics
aura-004 doctor
```

## 📖 Documentation

### Architecture Overview

AURA-004 is built on a modular architecture with the following core components:

- **Core System**: State management, configuration, and base classes
- **Agents**: LangGraph-based agent orchestration with specialized roles
- **Memory**: Vector database storage with semantic search capabilities
- **Analysis**: Tree-sitter powered code analysis and chunking
- **CLI**: Rich command-line interface for system interaction

### Core Components

#### State Management

```python
from aura_004.core.state import ConversationState, AgentState, MessageState

# Create conversation state
conversation = ConversationState()

# Add messages
from aura_004.core.state import MessageState, MessageRole
message = MessageState(role=MessageRole.USER, content="Hello, AURA-004!")
conversation.add_message(message)
```

#### Agent System

```python
from aura_004.core.graph import AgentGraph, GraphBuilder

# Build agent graph
builder = GraphBuilder("coding_agent")
builder.add_agent("analyzer", TreeSitterAnalyzer())
builder.add_agent("memory", ChromaMemory())
builder.add_edge("analyzer", "memory")

graph = builder.build()

# Execute graph
result = await graph.execute({
    "code": "def hello(): print('Hello, World!')",
    "language": "python"
})
```

#### Memory System

```python
from aura_004.memory import ChromaMemory
from aura_004.memory.schemas import MemoryEntry

# Initialize memory
memory = ChromaMemory(collection_name="code_analysis")
await memory.initialize()

# Store entries
entry = MemoryEntry(
    id="func_1",
    content="def hello_world(): print('Hello, World!')",
    metadata={"language": "python", "type": "function"}
)
await memory.store_entry(entry)

# Search with advanced queries
from aura_004.memory.schemas import MemoryQuery
query = MemoryQuery(
    query="python hello world function",
    threshold=0.8,
    tags=["python", "function"]
)
results = await memory.query(query)
```

#### Code Analysis

```python
from aura_004.analysis import TreeSitterAnalyzer
from aura_004.analysis.chunking import SemanticChunker

# Initialize analyzer
analyzer = TreeSitterAnalyzer()
await analyzer.initialize()

# Analyze code
result = await analyzer.analyze("""
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
""", language="python")

# Get metrics
print(f"Complexity: {result.metrics['complexity']}")
print(f"Lines: {result.metrics['lines_of_code']}")

# Get structure
if "structure" in result.metadata:
    structure = result.metadata["structure"]
    print(f"Functions: {len(structure['functions'])}")
```

## 🎯 Use Cases

### Code Review Assistant

```python
async def review_code(code_path: str):
    analyzer = TreeSitterAnalyzer()
    await analyzer.initialize()

    result = await analyzer.analyze_file(code_path)

    # Check for issues
    issues = result.metadata.get("issues", [])
    if issues:
        print("Found potential issues:")
        for issue in issues:
            print(f"  • {issue['message']} (line {issue['line']})")

    return result
```

### Knowledge Base Builder

```python
from aura_004.memory import KnowledgeBase

async def build_knowledge_base():
    # Initialize knowledge base
    kb = KnowledgeBase(
        name="programming_concepts",
        memory=ChromaMemory(),
        retriever=VectorRetriever(memory)
    )

    # Add entries
    await kb.add_entry(
        title="Recursion",
        content="Recursion is a programming technique where a function calls itself...",
        domain="programming",
        topic="algorithms",
        difficulty_level=3
    )

    # Search and retrieve
    entries = await kb.search("recursive algorithms")
    return entries
```

### Multi-Agent Code Processing

```python
from aura_004.core.graph import create_parallel_graph

async def process_code_pipeline(code: str):
    # Create parallel processing agents
    analyzer = TreeSitterAnalyzer()
    memory = ChromaMemory()
    embedder = EmbeddingProvider()

    # Build parallel graph
    graph = create_parallel_graph(
        "code_processing",
        entry_agent=analyzer,
        parallel_agents=[memory, embedder],
    )

    # Execute pipeline
    result = await graph.execute({"code": code})
    return result
```

## 🔧 Configuration

Create a configuration file (`aura-004.yaml`):

```yaml
# Basic configuration
environment: development
debug: false
data_dir: "./data"

# Vector database
vector_db:
  type: chromadb
  path: "./data/vector_db"
  collection_name: aura_memory
  embedding_model: all-MiniLM-L6-v2

# Code analysis
analysis:
  max_file_size: 10485760  # 10MB
  chunk_size: 1000
  chunk_overlap: 200
  supported_languages:
    - python
    - javascript
    - typescript
    - java
    - go
    - rust
    - cpp

# Agent configuration
agents:
  model: gpt-4o-mini
  temperature: 0.1
  max_tokens: 4096
  max_iterations: 10
  timeout: 300

# Logging
logging:
  level: INFO
  format: "{time:YYYY-MM-DD HH:mm:ss} | {level} | {name}:{function}:{line} | {message}"
  rotation: "1 day"
  retention: "30 days"
```

## 📊 Performance

AURA-004 is optimized for performance with:

- **Async Operations**: Full async/await support for concurrent processing
- **Vector Search**: Efficient similarity search with ChromaDB
- **Caching**: Built-in caching for frequently accessed data
- **Batch Processing**: Support for processing multiple items concurrently
- **Memory Management**: Optimized memory usage with garbage collection

### Benchmarks

- **Code Analysis**: ~100ms per 1000 lines of Python code
- **Memory Search**: ~50ms for vector similarity search in 10K entries
- **Embedding Generation**: ~10ms per text snippet with SentenceTransformers
- **File Processing**: ~500ms per 1MB file with chunking and analysis

## 🧪 Testing

Run the test suite:

```bash
# Install test dependencies
pip install -e ".[test]"

# Run tests
pytest

# Run tests with coverage
pytest --cov=aura_004 --cov-report=html

# Run specific tests
pytest tests/test_memory.py
pytest tests/test_analysis.py
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone repository
git clone https://github.com/aura-ai/aura-004.git
cd aura-004

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install in development mode
pip install -e ".[dev]"

# Install pre-commit hooks
pre-commit install

# Run tests
pytest
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [LangGraph](https://github.com/langchain-ai/langgraph) for agent orchestration
- [ChromaDB](https://github.com/chroma-core/chroma) for vector database
- [Tree-sitter](https://github.com/tree-sitter/tree-sitter) for code parsing
- [Sentence Transformers](https://github.com/UKPLab/sentence-transformers) for embeddings

## 📞 Support

- **Documentation**: [https://aura-004.readthedocs.io](https://aura-004.readthedocs.io)
- **Issues**: [GitHub Issues](https://github.com/aura-ai/aura-004/issues)
- **Discussions**: [GitHub Discussions](https://github.com/aura-ai/aura-004/discussions)
- **Email**: team@aura.ai

---

**AURA-004** - Empowering AI-driven code analysis and understanding.