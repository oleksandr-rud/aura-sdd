#!/usr/bin/env python3
"""
Advanced agent workflow examples for AURA-004.

This script demonstrates complex agent workflows including:
- Multi-agent collaboration
- Graph-based orchestration
- State management
- Memory-enhanced processing
"""

import asyncio
import sys
from pathlib import Path

# Add the src directory to the path for development
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from aura_004 import AgentGraph, TreeSitterAnalyzer, ChromaMemory
from aura_004.core.graph import GraphBuilder, create_parallel_graph, create_conditional_graph
from aura_004.core.state import ConversationState, AgentState, TaskState, TaskStatus, AgentRole
from aura_004.core.base import BaseAgent
from aura_004.memory.schemas import MemoryQuery
from aura_004.analysis.chunking import SemanticChunker


class CodeAnalyzerAgent(BaseAgent):
    """Agent specialized in code analysis."""

    def __init__(self):
        super().__init__(
            name="code_analyzer",
            role=AgentRole.ANALYSIS,
            capabilities=["code_analysis", "parsing", "metrics"]
        )
        self.analyzer = TreeSitterAnalyzer()

    async def initialize(self):
        """Initialize the agent."""
        await self.analyzer.initialize()

    async def process(self, input_data, context=None):
        """Process code analysis request."""
        code = input_data.get("code", "")
        language = input_data.get("language", "python")

        # Analyze the code
        result = await self.analyzer.analyze(code, language)

        # Extract key insights
        insights = {
            "lines_of_code": result.metrics.get("lines_of_code", 0),
            "complexity": result.metrics.get("complexity", 0),
            "functions": len(result.metadata.get("structure", {}).get("functions", [])),
            "classes": len(result.metadata.get("structure", {}).get("classes", [])),
            "issues": len(result.errors) + len(result.warnings),
            "chunks": result.chunks,
        }

        return {
            "analysis": result.model_dump(),
            "insights": insights,
            "recommendations": self._generate_recommendations(insights),
        }

    def _generate_recommendations(self, insights):
        """Generate recommendations based on insights."""
        recommendations = []

        if insights["complexity"] > 10:
            recommendations.append("Consider reducing complexity by breaking down large functions")

        if insights["issues"] > 0:
            recommendations.append("Address code issues and warnings to improve quality")

        if insights["lines_of_code"] > 500:
            recommendations.append("Consider splitting large files into smaller modules")

        return recommendations

    def get_capabilities(self):
        return self.capabilities

    def validate_input(self, input_data):
        return "code" in input_data and isinstance(input_data["code"], str)


class MemoryAgent(BaseAgent):
    """Agent specialized in memory operations."""

    def __init__(self, memory):
        super().__init__(
            name="memory_agent",
            role=AgentRole.COORDINATION,
            capabilities=["storage", "retrieval", "search"]
        )
        self.memory = memory

    async def process(self, input_data, context=None):
        """Process memory operations."""
        operation = input_data.get("operation", "store")
        data = input_data.get("data", {})

        if operation == "store":
            # Store analysis results
            key = f"analysis_{data.get('language', 'unknown')}_{hash(data.get('code', ''))}"
            success = await self.memory.store(key, data)
            return {"success": success, "key": key, "operation": "store"}

        elif operation == "search":
            # Search for similar analyses
            query = data.get("query", "")
            results = await self.memory.retrieve(query, limit=data.get("limit", 5))
            return {"results": results, "operation": "search"}

        elif operation == "find_similar":
            # Find similar code patterns
            code = data.get("code", "")
            results = await self.memory.retrieve(code, limit=3)
            return {"similar_code": results, "operation": "find_similar"}

        return {"error": "Unknown operation", "operation": operation}

    def get_capabilities(self):
        return self.capabilities

    def validate_input(self, input_data):
        return "operation" in input_data and "data" in input_data


class RecommendationAgent(BaseAgent):
    """Agent specialized in generating recommendations."""

    def __init__(self):
        super().__init__(
            name="recommendation_agent",
            role=AgentRole.TECH_LEAD,
            capabilities=["recommendations", "best_practices", "optimization"]
        )

    async def process(self, input_data, context=None):
        """Generate code recommendations."""
        analysis = input_data.get("analysis", {})
        insights = input_data.get("insights", {})
        similar_code = input_data.get("similar_code", [])

        recommendations = []

        # Based on analysis
        if insights.get("complexity", 0) > 15:
            recommendations.append({
                "type": "refactoring",
                "priority": "high",
                "message": "High complexity detected. Consider breaking down into smaller functions.",
                "suggestion": "Extract complex logic into separate methods with clear responsibilities."
            })

        # Based on similar code patterns
        if similar_code:
            recommendations.append({
                "type": "pattern",
                "priority": "medium",
                "message": "Found similar code patterns in memory.",
                "suggestion": "Consider consolidating similar patterns into reusable functions."
            })

        # Best practices
        language = input_data.get("language", "python")
        if language == "python":
            recommendations.extend(self._python_best_practices(analysis))

        return {
            "recommendations": recommendations,
            "priority_actions": self._get_priority_actions(recommendations),
            "confidence": self._calculate_confidence(recommendations)
        }

    def _python_best_practices(self, analysis):
        """Generate Python-specific best practice recommendations."""
        recommendations = []

        # Check for docstrings
        structure = analysis.get("metadata", {}).get("structure", {})
        functions = structure.get("functions", [])
        classes = structure.get("classes", [])

        for func in functions:
            if not func.get("has_docstring", True):
                recommendations.append({
                    "type": "documentation",
                    "priority": "medium",
                    "message": f"Function '{func.get('name')}' missing docstring.",
                    "suggestion": "Add a clear docstring explaining the function's purpose and parameters."
                })

        return recommendations

    def _get_priority_actions(self, recommendations):
        """Get high-priority actions."""
        return [rec for rec in recommendations if rec.get("priority") == "high"]

    def _calculate_confidence(self, recommendations):
        """Calculate confidence in recommendations."""
        if not recommendations:
            return 0.0
        # Simple confidence based on number and types of recommendations
        base_confidence = 0.8
        type_bonus = len(set(rec["type"] for rec in recommendations)) * 0.05
        return min(1.0, base_confidence + type_bonus)

    def get_capabilities(self):
        return self.capabilities

    def validate_input(self, input_data):
        return "analysis" in input_data


async def example_sequential_workflow():
    """Example: Sequential agent workflow."""
    print("=" * 60)
    print("EXAMPLE 1: Sequential Agent Workflow")
    print("=" * 60)

    # Initialize components
    memory = ChromaMemory(collection_name="workflow_example")
    await memory.initialize()

    # Create agents
    analyzer = CodeAnalyzerAgent()
    memory_agent = MemoryAgent(memory)
    recommender = RecommendationAgent()

    await analyzer.initialize()

    # Build sequential graph
    builder = GraphBuilder("code_review_workflow")
    builder.add_agent("analyzer", analyzer)
    builder.add_agent("memory", memory_agent)
    builder.add_agent("recommender", recommender)

    builder.add_edge("analyzer", "memory")
    builder.add_edge("memory", "recommender")

    graph = builder.build()

    print("🔄 Running sequential workflow...")

    # Sample code to analyze
    sample_code = '''
def process_data(data_list):
    result = []
    for item in data_list:
        if item > 0:
            result.append(item * 2)
        else:
            result.append(item / 2)
    return result

class DataProcessor:
    def __init__(self):
        self.cache = {}

    def process(self, key, data):
        if key in self.cache:
            return self.cache[key]
        result = process_data(data)
        self.cache[key] = result
        return result
'''

    # Execute workflow
    input_data = {
        "code": sample_code,
        "language": "python"
    }

    print("📝 Analyzing code...")
    result = await graph.execute(input_data)

    print("✅ Workflow completed!")
    print(f"   Analysis insights: {result.get('insights', {})}")
    print(f"   Memory storage: {'✅' if result.get('success') else '❌'}")
    print(f"   Recommendations: {len(result.get('recommendations', []))}")

    # Display recommendations
    recommendations = result.get("recommendations", [])
    if recommendations:
        print("\n💡 Recommendations:")
        for i, rec in enumerate(recommendations, 1):
            priority_icon = "🔴" if rec.get("priority") == "high" else "🟡" if rec.get("priority") == "medium" else "🟢"
            print(f"   {i}. {priority_icon} {rec.get('message', 'No message')}")


async def example_parallel_workflow():
    """Example: Parallel agent workflow."""
    print("\n" + "=" * 60)
    print("EXAMPLE 2: Parallel Agent Workflow")
    print("=" * 60)

    # Initialize memory and agents
    memory = ChromaMemory(collection_name="parallel_example")
    await memory.initialize()

    analyzer = CodeAnalyzerAgent()
    memory_agent = MemoryAgent(memory)
    await analyzer.initialize()

    # Create parallel graph
    graph = create_parallel_graph(
        "parallel_analysis",
        entry_agent=analyzer,
        parallel_agents=[memory_agent],
    )

    print("⚡ Running parallel workflow...")

    # Multiple code samples to process in parallel
    code_samples = [
        {
            "code": "def bubble_sort(arr): n = len(arr); for i in range(n): for j in range(0, n-i-1): if arr[j] > arr[j+1]: arr[j], arr[j+1] = arr[j+1], arr[j]; return arr",
            "language": "python"
        },
        {
            "code": "function quickSort(arr) { if (arr.length <= 1) return arr; const pivot = arr[0]; const left = []; const right = []; for (let i = 1; i < arr.length; i++) { if (arr[i] < pivot) left.push(arr[i]); else right.push(arr[i]); } return [...quickSort(left), pivot, ...quickSort(right)]; }",
            "language": "javascript"
        },
        {
            "code": "func binarySearch(arr []int, target int) int { left, right := 0, len(arr)-1; for left <= right { mid := left + (right-left)/2; if arr[mid] == target { return mid } else if arr[mid] < target { left = mid + 1 } else { right = mid - 1 } } return -1 }",
            "language": "go"
        }
    ]

    import time
    start_time = time.time()

    # Process in parallel
    tasks = []
    for sample in code_samples:
        task = graph.execute(sample)
        tasks.append(task)

    results = await asyncio.gather(*tasks)

    end_time = time.time()
    duration = end_time - start_time

    print(f"✅ Parallel workflow completed in {duration:.3f}s!")
    print(f"   Processed {len(code_samples)} code samples")
    print(f"   Average time per sample: {duration/len(code_samples):.3f}s")

    # Display results summary
    for i, result in enumerate(results, 1):
        insights = result.get("insights", {})
        print(f"\n   Sample {i}:")
        print(f"     Language: {code_samples[i-1]['language']}")
        print(f"     Lines: {insights.get('lines_of_code', 0)}")
        print(f"     Complexity: {insights.get('complexity', 0):.1f}")


async def example_conditional_workflow():
    """Example: Conditional agent workflow."""
    print("\n" + "=" * 60)
    print("EXAMPLE 3: Conditional Agent Workflow")
    print("=" * 60)

    # Create conditional graph
    entry_agent = CodeAnalyzerAgent()
    await entry_agent.initialize()

    # Define conditional branches
    def should_recommend_more(data):
        """Condition to determine if more recommendations are needed."""
        insights = data.get("insights", {})
        return insights.get("complexity", 0) > 10 or insights.get("issues", 0) > 0

    # Branch agents
    simple_agent = RecommendationAgent()
    detailed_agent = RecommendationAgent()  # Could be a more detailed version

    condition_branches = {
        "simple": simple_agent,
        "detailed": detailed_agent,
    }

    graph = create_conditional_graph(
        "conditional_analysis",
        entry_agent=entry_agent,
        condition_branches=condition_branches,
        condition_function=should_recommend_more,
    )

    print("🔀 Running conditional workflow...")

    # Test with different complexity levels
    test_cases = [
        {
            "name": "Simple Code",
            "code": "def hello(): return 'Hello, World!'",
            "language": "python"
        },
        {
            "name": "Complex Code",
            "code": '''
def complex_function(data, options=None):
    if options is None:
        options = {}
    result = []
    for i, item in enumerate(data):
        if item > 0:
            if options.get('double', False):
                result.append(item * 2)
            else:
                result.append(item ** 2)
        else:
            if options.get('include_negative', True):
                result.append(item / 2)
        if i % 10 == 0 and options.get('log_progress', False):
            print(f"Processed {i} items")
    return sorted(result, reverse=options.get('reverse', False))
''',
            "language": "python"
        }
    ]

    for test_case in test_cases:
        print(f"\n📋 Testing: {test_case['name']}")
        result = await graph.execute(test_case)

        # Determine which branch was taken
        if "recommendations" in result:
            rec_count = len(result.get("recommendations", []))
            branch = "detailed" if rec_count > 3 else "simple"
            print(f"   Branch taken: {branch}")
            print(f"   Recommendations: {rec_count}")


async def example_memory_enhanced_workflow():
    """Example: Memory-enhanced agent workflow."""
    print("\n" + "=" * 60)
    print("EXAMPLE 4: Memory-Enhanced Workflow")
    print("=" * 60)

    # Initialize memory with some existing data
    memory = ChromaMemory(collection_name="enhanced_workflow")
    await memory.initialize()

    # Pre-populate memory with some code patterns
    patterns = [
        "def factorial(n): return 1 if n <= 1 else n * factorial(n-1)",
        "def fibonacci(n): return n if n <= 1 else fibonacci(n-1) + fibonacci(n-2)",
        "def gcd(a, b): return a if b == 0 else gcd(b, a % b)",
    ]

    print("💾 Pre-populating memory with code patterns...")
    for pattern in patterns:
        await memory.store(f"pattern_{hash(pattern)}", pattern)

    # Create agents
    analyzer = CodeAnalyzerAgent()
    memory_agent = MemoryAgent(memory)
    recommender = RecommendationAgent()

    await analyzer.initialize()

    # Build enhanced workflow
    builder = GraphBuilder("memory_enhanced_workflow")
    builder.add_agent("analyzer", analyzer)
    builder.add_agent("memory_search", memory_agent)
    builder.add_agent("recommender", recommender)

    builder.add_edge("analyzer", "memory_search")
    builder.add_edge("memory_search", "recommender")

    graph = builder.build()

    print("🧠 Running memory-enhanced workflow...")

    # Test with code that might have similar patterns
    test_code = '''
def calculate_factorial(n):
    if n <= 1:
        return 1
    else:
        return n * calculate_factorial(n - 1)
'''

    # Enhanced workflow input
    input_data = {
        "code": test_code,
        "language": "python"
    }

    result = await graph.execute(input_data)

    print("✅ Memory-enhanced workflow completed!")

    # Show memory search results
    if "similar_code" in result:
        similar = result.get("similar_code", [])
        print(f"   Found {len(similar)} similar patterns in memory")
        for i, pattern in enumerate(similar[:2], 1):
            preview = pattern[:80] + "..." if len(pattern) > 80 else pattern
            print(f"     {i}. {preview}")

    # Show enhanced recommendations
    recommendations = result.get("recommendations", [])
    print(f"   Enhanced recommendations: {len(recommendations)}")
    for rec in recommendations[:3]:
        print(f"     • {rec.get('message', 'No message')}")


async def example_stateful_conversation():
    """Example: Stateful conversation with agents."""
    print("\n" + "=" * 60)
    print("EXAMPLE 5: Stateful Conversation")
    print("=" * 60)

    # Create conversation state
    conversation = ConversationState()
    conversation.title = "Code Review Session"

    # Initialize agents
    analyzer = CodeAnalyzerAgent()
    await analyzer.initialize()

    print("💬 Starting stateful conversation...")

    # Simulate conversation
    messages = [
        ("user", "I have this Python function. Can you analyze it?"),
        ("user", "def process_items(items):\n    results = []\n    for item in items:\n        if item % 2 == 0:\n            results.append(item * 2)\n    return results"),
    ]

    for role, content in messages:
        from aura_004.core.state import MessageState, MessageRole
        message = MessageState(role=MessageRole.USER, content=content)
        conversation.add_message(message)

    # Process the latest request
    last_message = conversation.get_last_message()
    if "def process_items" in last_message.content:
        print("🔍 Processing code analysis request...")

        # Extract code from message
        code_lines = []
        in_code_block = False
        for line in last_message.content.split('\n'):
            if 'def ' in line:
                in_code_block = True
            if in_code_block:
                code_lines.append(line)
            elif in_code_block and not line.strip():
                break

        code = '\n'.join(code_lines)

        # Analyze with agent
        result = await analyzer.process({"code": code, "language": "python"})

        # Create assistant response
        response_content = f"""
I've analyzed your `process_items` function. Here are my findings:

📊 **Analysis Results:**
- Lines of code: {result['insights']['lines_of_code']}
- Complexity: {result['insights']['complexity']:.1f}

💡 **Recommendations:**
{chr(10).join(f"• {rec}" for rec in result['recommendations'][:3])}

The function looks good overall! It processes even numbers and doubles them.
"""

        # Add response to conversation
        response_message = MessageState(
            role=MessageRole.ASSISTANT,
            content=response_content.strip(),
            metadata={"agent": "code_analyzer", "analysis": result}
        )
        conversation.add_message(response_message)

        print("✅ Added analysis response to conversation")

    # Display conversation summary
    print(f"\n📋 Conversation Summary:")
    print(f"   Messages: {conversation.message_count}")
    print(f"   Duration: {(conversation.updated_at - conversation.created_at).total_seconds():.1f}s")
    print(f"   Last interaction: {conversation.get_last_message().role}")


async def main():
    """Run all agent workflow examples."""
    print("🤖 AURA-004 Agent Workflow Examples")
    print("=" * 60)

    try:
        await example_sequential_workflow()
        await example_parallel_workflow()
        await example_conditional_workflow()
        await example_memory_enhanced_workflow()
        await example_stateful_conversation()

        print("\n" + "=" * 60)
        print("✅ All agent workflow examples completed successfully!")
        print("=" * 60)

    except Exception as e:
        print(f"\n❌ Error running examples: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    # Run the examples
    asyncio.run(main())