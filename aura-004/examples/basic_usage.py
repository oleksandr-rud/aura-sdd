#!/usr/bin/env python3
"""
Basic usage examples for AURA-004.

This script demonstrates fundamental operations including:
- Code analysis
- Memory operations
- Agent execution
- CLI usage patterns
"""

import asyncio
import sys
from pathlib import Path

# Add the src directory to the path for development
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from aura_004 import (
    TreeSitterAnalyzer,
    ChromaMemory,
    AgentGraph,
    Settings,
)
from aura_004.core.state import ConversationState, MessageState, MessageRole
from aura_004.core.graph import GraphBuilder
from aura_004.memory.schemas import MemoryEntry, MemoryMetadata
from aura_004.analysis.chunking import SemanticChunker


async def example_code_analysis():
    """Example: Basic code analysis."""
    print("=" * 60)
    print("EXAMPLE 1: Code Analysis")
    print("=" * 60)

    # Sample Python code
    sample_code = '''
def fibonacci(n):
    """Calculate the nth Fibonacci number."""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

def factorial(n):
    """Calculate the factorial of n."""
    if n <= 1:
        return 1
    return n * factorial(n-1)

class Calculator:
    """Simple calculator class."""

    def __init__(self):
        self.history = []

    def add(self, a, b):
        result = a + b
        self.history.append(f"{a} + {b} = {result}")
        return result

    def multiply(self, a, b):
        result = a * b
        self.history.append(f"{a} * {b} = {result}")
        return result
'''

    # Initialize analyzer
    analyzer = TreeSitterAnalyzer()
    await analyzer.initialize()

    print("🔍 Analyzing Python code...")
    result = await analyzer.analyze(sample_code, language="python")

    # Display results
    print(f"✅ Analysis complete!")
    print(f"   Lines of code: {result.metrics['lines_of_code']}")
    print(f"   Complexity: {result.metrics['complexity']:.1f}")
    print(f"   Functions found: {len(result.metadata.get('structure', {}).get('functions', []))}")
    print(f"   Classes found: {len(result.metadata.get('structure', {}).get('classes', []))}")
    print(f"   Chunks generated: {len(result.chunks)}")

    # Show structure
    if "structure" in result.metadata:
        structure = result.metadata["structure"]
        print("\n📋 Code Structure:")
        for func in structure.get("functions", []):
            print(f"   Function: {func.get('name', 'unnamed')} (line {func.get('line', '?')})")
        for cls in structure.get("classes", []):
            print(f"   Class: {cls.get('name', 'unnamed')} (line {cls.get('line', '?')})")

    return result


async def example_memory_operations():
    """Example: Memory storage and retrieval."""
    print("\n" + "=" * 60)
    print("EXAMPLE 2: Memory Operations")
    print("=" * 60)

    # Initialize memory
    memory = ChromaMemory(collection_name="example_collection")
    await memory.initialize()

    print("🧠 Initializing memory system...")

    # Store some entries
    entries_to_store = [
        {
            "content": "Python is a high-level, interpreted programming language.",
            "metadata": {"topic": "programming", "language": "python", "type": "definition"}
        },
        {
            "content": "Fibonacci sequence is a series of numbers where each number is the sum of the two preceding ones.",
            "metadata": {"topic": "mathematics", "concept": "fibonacci", "type": "definition"}
        },
        {
            "content": "def fibonacci(n): return n if n <= 1 else fibonacci(n-1) + fibonacci(n-2)",
            "metadata": {"topic": "programming", "language": "python", "concept": "fibonacci", "type": "code"}
        }
    ]

    print(f"💾 Storing {len(entries_to_store)} entries in memory...")
    for i, entry_data in enumerate(entries_to_store):
        entry = MemoryEntry(
            id=f"entry_{i}",
            content=entry_data["content"],
            metadata=MemoryMetadata(**entry_data["metadata"])
        )
        success = await memory.store_entry(entry)
        print(f"   {'✅' if success else '❌'} Stored entry {i+1}")

    # Search memory
    print("\n🔍 Searching memory...")
    search_queries = [
        "Python programming language",
        "Fibonacci sequence",
        "recursive function implementation"
    ]

    for query in search_queries:
        print(f"\n   Query: '{query}'")
        results = await memory.retrieve(query, limit=3)
        print(f"   Found {len(results)} results:")
        for i, result in enumerate(results, 1):
            print(f"      {i}. {result[:100]}..." if len(result) > 100 else f"      {i}. {result}")

    # Get memory statistics
    stats = await memory.get_stats()
    print(f"\n📊 Memory Statistics:")
    print(f"   Total entries: {stats['total_entries']}")
    print(f"   Total queries: {stats['total_queries']}")
    print(f"   Average query time: {stats['avg_query_time']:.3f}s")

    return memory


async def example_code_chunking():
    """Example: Code chunking strategies."""
    print("\n" + "=" * 60)
    print("EXAMPLE 3: Code Chunking")
    print("=" * 60)

    # Sample larger code
    sample_code = '''
import requests
import json
from typing import Dict, List, Optional

class APIClient:
    """A simple API client for making HTTP requests."""

    def __init__(self, base_url: str, timeout: int = 30):
        self.base_url = base_url.rstrip('/')
        self.timeout = timeout
        self.session = requests.Session()

    def get(self, endpoint: str, params: Optional[Dict] = None) -> Dict:
        """Make a GET request to the API."""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        response = self.session.get(url, params=params, timeout=self.timeout)
        response.raise_for_status()
        return response.json()

    def post(self, endpoint: str, data: Optional[Dict] = None) -> Dict:
        """Make a POST request to the API."""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        response = self.session.post(url, json=data, timeout=self.timeout)
        response.raise_for_status()
        return response.json()

    def put(self, endpoint: str, data: Optional[Dict] = None) -> Dict:
        """Make a PUT request to the API."""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        response = self.session.put(url, json=data, timeout=self.timeout)
        response.raise_for_status()
        return response.json()

    def delete(self, endpoint: str) -> Dict:
        """Make a DELETE request to the API."""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        response = self.session.delete(url, timeout=self.timeout)
        response.raise_for_status()
        return response.json()

class DataManager:
    """Manages data storage and retrieval."""

    def __init__(self, storage_path: str):
        self.storage_path = storage_path
        self.data = {}

    def save_data(self, key: str, value: any) -> bool:
        """Save data with a key."""
        try:
            self.data[key] = value
            return True
        except Exception:
            return False

    def load_data(self, key: str) -> Optional[any]:
        """Load data by key."""
        return self.data.get(key)

    def delete_data(self, key: str) -> bool:
        """Delete data by key."""
        if key in self.data:
            del self.data[key]
            return True
        return False
'''

    print("✂️  Demonstrating different chunking strategies...")

    # Try different chunkers
    from aura_004.analysis.chunking import (
        SemanticChunker,
        SyntacticChunker,
        FixedSizeChunker,
        get_chunk_stats
    )

    chunkers = {
        "Semantic": SemanticChunker(),
        "Syntactic": SyntacticChunker(),
        "Fixed Size": FixedSizeChunker()
    }

    for chunker_name, chunker in chunkers.items():
        print(f"\n📦 {chunker_name} Chunker:")
        chunks = await chunker.chunk_code(sample_code, chunk_size=300, overlap=50)
        stats = get_chunk_stats(chunks)

        print(f"   Chunks: {stats['count']}")
        print(f"   Avg size: {stats['avg_size']:.0f} characters")
        print(f"   Size range: {stats['min_size']} - {stats['max_size']} characters")
        print(f"   Total tokens: ~{stats['total_tokens']}")

        # Show first chunk preview
        if chunks:
            preview = chunks[0][:150] + "..." if len(chunks[0]) > 150 else chunks[0]
            print(f"   First chunk preview:\n      {preview}")


async def example_conversation():
    """Example: Conversation state management."""
    print("\n" + "=" * 60)
    print("EXAMPLE 4: Conversation Management")
    print("=" * 60)

    # Create conversation state
    conversation = ConversationState()
    conversation.title = "Code Analysis Session"

    print("💬 Creating conversation...")

    # Add messages
    messages = [
        ("user", "Can you analyze this Python code for me?"),
        ("assistant", "I'd be happy to help analyze your Python code. Please share the code you'd like me to examine."),
        ("user", "Here's a simple function: def hello(): print('Hello, World!')"),
        ("assistant", "I can see this is a simple Python function that prints 'Hello, World!'. This is a basic example of a function definition in Python.")
    ]

    for role, content in messages:
        message_role = MessageRole.USER if role == "user" else MessageRole.ASSISTANT
        message = MessageState(role=message_role, content=content)
        conversation.add_message(message)
        print(f"   Added {role} message")

    # Display conversation info
    print(f"\n📊 Conversation Info:")
    print(f"   Title: {conversation.title}")
    print(f"   Messages: {conversation.message_count}")
    print(f"   Duration: {(conversation.updated_at - conversation.created_at).total_seconds():.1f}s")
    print(f"   Last message: {conversation.get_last_message().content[:50]}...")

    # Get messages by role
    user_messages = conversation.get_messages_by_role(MessageRole.USER)
    assistant_messages = conversation.get_messages_by_role(MessageRole.ASSISTANT)

    print(f"   User messages: {len(user_messages)}")
    print(f"   Assistant messages: {len(assistant_messages)}")

    return conversation


async def example_performance_monitoring():
    """Example: Performance monitoring."""
    print("\n" + "=" * 60)
    print("EXAMPLE 5: Performance Monitoring")
    print("=" * 60)

    from aura_004.utils.performance import PerformanceMonitor, Timer
    import time

    monitor = PerformanceMonitor()
    print("⏱️  Monitoring performance...")

    # Monitor code analysis
    with Timer("code_analysis") as timer:
        analyzer = TreeSitterAnalyzer()
        await analyzer.initialize()

        # Analyze multiple files worth of code
        code_samples = [
            "def func1(): return 1",
            "def func2(): return 2",
            "class MyClass: pass",
            "for i in range(10): print(i)",
        ]

        for i, code in enumerate(code_samples):
            result = await analyzer.analyze(code, language="python")
            monitor.log_operation(
                "analysis_single_file",
                duration=0.1,  # Simulated
                metadata={"sample_index": i, "lines": result.metrics['total_lines']}
            )

    print(f"   Code analysis completed in {timer.duration:.3f}s")

    # Monitor memory operations
    with Timer("memory_operations") as timer:
        memory = ChromaMemory()
        await memory.initialize()

        # Batch store operations
        for i in range(10):
            entry = MemoryEntry(
                id=f"perf_test_{i}",
                content=f"Test entry {i} content",
                metadata={"test": True, "index": i}
            )
            await memory.store_entry(entry)

        # Batch search operations
        for i in range(5):
            await memory.retrieve(f"test entry {i}")

    print(f"   Memory operations completed in {timer.duration:.3f}s")

    # Get performance summary
    summary = monitor.get_summary()
    print(f"\n📈 Performance Summary:")
    for operation, stats in summary.items():
        print(f"   {operation}:")
        print(f"     Calls: {stats['count']}")
        print(f"     Total time: {stats['total_time']:.3f}s")
        print(f"     Avg time: {stats['avg_time']:.3f}s")


async def main():
    """Run all examples."""
    print("🚀 AURA-004 Basic Usage Examples")
    print("=" * 60)

    try:
        # Run examples
        await example_code_analysis()
        await example_memory_operations()
        await example_code_chunking()
        await example_conversation()
        await example_performance_monitoring()

        print("\n" + "=" * 60)
        print("✅ All examples completed successfully!")
        print("=" * 60)

    except Exception as e:
        print(f"\n❌ Error running examples: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    # Run the examples
    asyncio.run(main())