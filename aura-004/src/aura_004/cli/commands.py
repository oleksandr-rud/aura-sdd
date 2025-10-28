"""
CLI command modules for AURA-004.

This module contains the command-line interface commands organized
by functional area: analysis, memory, agents, configuration, and server.
"""

import asyncio
import json
from pathlib import Path
from typing import Optional, List

import typer
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, TaskProgressColumn
from rich.syntax import Syntax

from aura_004.core.config import get_settings
from aura_004.analysis.tree_sitter_analyzer import TreeSitterAnalyzer
from aura_004.memory.chroma_memory import ChromaMemory
from aura_004.memory.embeddings import EmbeddingProviderFactory
from aura_004.core.exceptions import AuraError, AnalysisError, MemoryError

console = Console()

# Analysis commands
analyze_app = typer.Typer(name="analyze", help="Code analysis commands")

@analyze_app.command()
def file(
    path: str = typer.Argument(..., help="Path to file to analyze"),
    language: Optional[str] = typer.Option(None, "--lang", "-l", help="Programming language"),
    output: Optional[str] = typer.Option(None, "--output", "-o", help="Output file (JSON)"),
    chunk_size: int = typer.Option(1000, "--chunk-size", help="Code chunk size"),
    overlap: int = typer.Option(200, "--overlap", help="Chunk overlap"),
):
    """Analyze a single code file."""
    async def analyze_file():
        try:
            analyzer = TreeSitterAnalyzer()
            await analyzer.initialize()

            console.print(f"[blue]Analyzing file: {path}[/blue]")

            with Progress(
                SpinnerColumn(),
                TextColumn("[progress.description]{task.description}"),
                console=console,
            ) as progress:
                task = progress.add_task("Analyzing code...", total=None)

                result = await analyzer.analyze_file(
                    path, language, chunk_size=chunk_size, overlap=overlap
                )

                progress.update(task, description="✓ Analysis complete")

            # Display results
            _display_analysis_result(result)

            # Save to file if requested
            if output:
                with open(output, 'w') as f:
                    json.dump(result.model_dump(), f, indent=2, default=str)
                console.print(f"\n[green]Results saved to: {output}[/green]")

        except Exception as e:
            console.print(f"[red]Analysis failed: {e}[/red]")
            raise typer.Exit(1)

    asyncio.run(analyze_file())

@analyze_app.command()
def directory(
    path: str = typer.Argument(..., help="Path to directory to analyze"),
    pattern: str = typer.Option("**/*", "--pattern", "-p", help="File pattern"),
    recursive: bool = typer.Option(True, "--recursive/--no-recursive", help="Recursive analysis"),
    output: Optional[str] = typer.Option(None, "--output", "-o", help="Output file (JSON)"),
):
    """Analyze all files in a directory."""
    async def analyze_directory():
        try:
            analyzer = TreeSitterAnalyzer()
            await analyzer.initialize()

            console.print(f"[blue]Analyzing directory: {path}[/blue]")
            console.print(f"Pattern: {pattern}, Recursive: {recursive}")

            with Progress(
                SpinnerColumn(),
                TextColumn("[progress.description]{task.description}"),
                BarColumn(),
                TaskProgressColumn(),
                console=console,
            ) as progress:
                task = progress.add_task("Scanning files...", total=None)

                results = await analyzer.analyze_directory(
                    path, pattern, recursive=recursive
                )

                progress.update(task, description="✓ Analysis complete", total=len(results))

            # Display summary
            _display_directory_summary(results)

            # Save to file if requested
            if output:
                output_data = {
                    "total_files": len(results),
                    "results": [result.model_dump() for result in results]
                }
                with open(output, 'w') as f:
                    json.dump(output_data, f, indent=2, default=str)
                console.print(f"\n[green]Results saved to: {output}[/green]")

        except Exception as e:
            console.print(f"[red]Analysis failed: {e}[/red]")
            raise typer.Exit(1)

    asyncio.run(analyze_directory())

def _display_analysis_result(result):
    """Display analysis results in a formatted way."""
    console.print("\n[bold]Analysis Results[/bold]")

    # Basic info table
    table = Table(title="File Information", show_header=False)
    table.add_column("Property", style="cyan")
    table.add_column("Value", style="white")

    table.add_row("File", result.file_path or "N/A")
    table.add_row("Language", result.language)
    table.add_row("Lines", str(result.metrics.get("total_lines", 0)))
    table.add_row("Complexity", f"{result.metrics.get('complexity', 0):.1f}")
    table.add_row("Analysis Time", f"{result.analysis_time:.3f}s")

    console.print(table)

    # Structure information
    if "structure" in result.metadata:
        structure = result.metadata["structure"]
        console.print("\n[bold]Code Structure[/bold]")

        if structure.get("functions"):
            console.print(f"Functions: {len(structure['functions'])}")
            for func in structure["functions"][:5]:  # Show first 5
                console.print(f"  • {func.get('name', 'unnamed')} (line {func.get('line', '?')})")

        if structure.get("classes"):
            console.print(f"Classes: {len(structure['classes'])}")
            for cls in structure["classes"][:5]:  # Show first 5
                console.print(f"  • {cls.get('name', 'unnamed')} (line {cls.get('line', '?')})")

    # Issues and warnings
    if result.errors:
        console.print(f"\n[red]Errors ({len(result.errors)}):[/red]")
        for error in result.errors[:5]:
            console.print(f"  • {error}")

    if result.warnings:
        console.print(f"\n[yellow]Warnings ({len(result.warnings)}):[/yellow]")
        for warning in result.warnings[:5]:
            console.print(f"  • {warning}")

    # Chunks information
    if result.chunks:
        console.print(f"\n[bold]Code Chunks[/bold]")
        console.print(f"Generated {len(result.chunks)} chunks")
        console.print(f"First chunk preview:")

        if result.chunks[0]:
            preview = result.chunks[0][:200] + "..." if len(result.chunks[0]) > 200 else result.chunks[0]
            console.print(Panel(preview, title="Chunk 1 Preview", border_style="blue"))

def _display_directory_summary(results):
    """Display directory analysis summary."""
    console.print("\n[bold]Directory Analysis Summary[/bold]")

    # Statistics table
    table = Table(title="Analysis Statistics")
    table.add_column("Metric", style="cyan")
    table.add_column("Value", style="white")

    total_files = len(results)
    total_lines = sum(r.metrics.get("total_lines", 0) for r in results)
    total_complexity = sum(r.metrics.get("complexity", 0) for r in results)
    languages = {}

    for result in results:
        lang = result.language
        languages[lang] = languages.get(lang, 0) + 1

    table.add_row("Total Files", str(total_files))
    table.add_row("Total Lines", str(total_lines))
    table.add_row("Avg Complexity", f"{total_complexity / total_files:.1f}" if total_files > 0 else "0")
    table.add_row("Languages", str(len(languages)))

    console.print(table)

    # Languages breakdown
    if languages:
        console.print("\n[bold]Languages[/bold]")
        lang_table = Table()
        lang_table.add_column("Language", style="cyan")
        lang_table.add_column("Files", style="white")
        lang_table.add_column("Percentage", style="green")

        for lang, count in sorted(languages.items(), key=lambda x: x[1], reverse=True):
            percentage = (count / total_files) * 100
            lang_table.add_row(lang, str(count), f"{percentage:.1f}%")

        console.print(lang_table)

    # Top issues
    all_issues = []
    for result in results:
        all_issues.extend(result.errors)
        all_issues.extend(result.warnings)

    if all_issues:
        console.print(f"\n[bold]Top Issues[/bold]")
        issue_counts = {}
        for issue in all_issues:
            # Extract issue type
            issue_type = issue.split(':')[0] if ':' in issue else 'general'
            issue_counts[issue_type] = issue_counts.get(issue_type, 0) + 1

        issue_table = Table()
        issue_table.add_column("Issue Type", style="cyan")
        issue_table.add_column("Count", style="white")

        for issue_type, count in sorted(issue_counts.items(), key=lambda x: x[1], reverse=True)[:10]:
            issue_table.add_row(issue_type, str(count))

        console.print(issue_table)

# Memory commands
memory_app = typer.Typer(name="memory", help="Memory management commands")

@memory_app.command()
def init(
    collection: str = typer.Option("aura_memory", "--collection", "-c", help="Collection name"),
    persist: Optional[str] = typer.Option(None, "--persist", "-p", help="Persistence directory"),
):
    """Initialize memory system."""
    async def init_memory():
        try:
            console.print("[blue]Initializing memory system...[/blue]")

            memory = ChromaMemory(
                collection_name=collection,
                persist_directory=persist,
            )

            with Progress(
                SpinnerColumn(),
                TextColumn("[progress.description]{task.description}"),
                console=console,
            ) as progress:
                task = progress.add_task("Initializing ChromaDB...", total=None)
                await memory.initialize()
                progress.update(task, description="✓ Memory system ready")

            # Get collection info
            info = await memory.get_collection_info()
            console.print(f"\n[green]Memory system initialized[/green]")
            console.print(f"Collection: {info['name']}")
            console.print(f"Entries: {info['count']}")
            console.print(f"Dimension: {info['embedding_dim']}")

        except Exception as e:
            console.print(f"[red]Memory initialization failed: {e}[/red]")
            raise typer.Exit(1)

    asyncio.run(init_memory())

@memory_app.command()
def store(
    key: str = typer.Argument(..., help="Storage key"),
    content: str = typer.Argument(..., help="Content to store"),
    metadata: Optional[str] = typer.Option(None, "--metadata", "-m", help="JSON metadata"),
):
    """Store content in memory."""
    async def store_content():
        try:
            memory = ChromaMemory()
            await memory.initialize()

            # Parse metadata if provided
            meta_dict = {}
            if metadata:
                meta_dict = json.loads(metadata)

            console.print(f"[blue]Storing content with key: {key}[/blue]")

            success = await memory.store(key, content, meta_dict)

            if success:
                console.print(f"[green]✓ Content stored successfully[/green]")
            else:
                console.print(f"[red]✗ Failed to store content[/red]")

        except Exception as e:
            console.print(f"[red]Storage failed: {e}[/red]")
            raise typer.Exit(1)

    asyncio.run(store_content())

@memory_app.command()
def search(
    query: str = typer.Argument(..., help="Search query"),
    limit: int = typer.Option(10, "--limit", "-l", help="Result limit"),
    threshold: float = typer.Option(0.7, "--threshold", "-t", help="Similarity threshold"),
):
    """Search memory for content."""
    async def search_memory():
        try:
            memory = ChromaMemory()
            await memory.initialize()

            console.print(f"[blue]Searching for: {query}[/blue]")

            from aura_004.memory.schemas import MemoryQuery
            memory_query = MemoryQuery(
                query=query,
                limit=limit,
                threshold=threshold,
            )

            with Progress(
                SpinnerColumn(),
                TextColumn("[progress.description]{task.description}"),
                console=console,
            ) as progress:
                task = progress.add_task("Searching memory...", total=None)
                result = await memory.query(memory_query)
                progress.update(task, description="✓ Search complete")

            # Display results
            console.print(f"\n[bold]Search Results[/bold]")
            console.print(f"Found {len(result.entries)} entries (query time: {result.query_time:.3f}s)")

            if result.entries:
                for i, entry in enumerate(result.entries, 1):
                    console.print(f"\n[cyan]{i}. {entry.id}[/cyan]")
                    console.print(f"Relevance: {entry.relevance_score:.3f}")
                    console.print(f"Created: {entry.created_at}")

                    # Show content preview
                    preview = entry.content[:200] + "..." if len(entry.content) > 200 else entry.content
                    console.print(Panel(preview, title="Content Preview", border_style="blue"))
            else:
                console.print("[yellow]No results found[/yellow]")

        except Exception as e:
            console.print(f"[red]Search failed: {e}[/red]")
            raise typer.Exit(1)

    asyncio.run(search_memory())

# Agents commands
agents_app = typer.Typer(name="agents", help="Agent management commands")

@agents_app.command()
def list():
    """List available agents."""
    from aura_004.core.state import AgentRole

    console.print("[bold]Available Agents[/bold]")

    table = Table()
    table.add_column("Agent", style="cyan")
    table.add_column("Role", style="white")
    table.add_column("Description", style="white")

    agents = [
        ("architect", "System architecture and technical guidance"),
        ("product_ops", "Product lifecycle and requirements management"),
        ("tech_lead", "Engineering execution and code quality"),
        ("qa", "Quality assurance and testing strategy"),
        ("coding", "Code implementation and development"),
        ("analysis", "Code analysis and optimization"),
        ("coordination", "Project coordination and management"),
    ]

    for agent, description in agents:
        table.add_row(agent, agent.replace("_", " ").title(), description)

    console.print(table)

@agents_app.command()
def info(
    agent: str = typer.Argument(..., help="Agent name"),
):
    """Show detailed information about an agent."""
    # This would typically load agent-specific information
    console.print(f"[bold]Agent Information: {agent}[/bold]")
    console.print("This feature is under development.")

# Configuration commands
config_app = typer.Typer(name="config", help="Configuration commands")

@config_app.command()
def show():
    """Show current configuration."""
    try:
        settings = get_settings()

        console.print("[bold]Current Configuration[/bold]")

        # Create configuration table
        table = Table(show_header=True, header_style="bold magenta")
        table.add_column("Setting", style="cyan")
        table.add_column("Value", style="white")
        table.add_column("Default", style="dim")

        # Display key settings
        config_items = [
            ("Environment", settings.environment, "development"),
            ("Debug Mode", settings.debug, "False"),
            ("Data Directory", settings.data_dir, "./data"),
            ("Max Workers", settings.max_workers, "4"),
            ("Timeout", settings.timeout, "30"),
            ("Vector DB Type", settings.vector_db.type, "chromadb"),
            ("Vector DB Path", settings.vector_db.path, "./data/vector_db"),
            ("Analysis Max File Size", f"{settings.analysis.max_file_size // (1024*1024)}MB", "10MB"),
            ("Agent Model", settings.agents.model, "gpt-4o-mini"),
            ("Agent Max Iterations", settings.agents.max_iterations, "10"),
        ]

        for key, value, default in config_items:
            is_default = str(value) == str(default)
            value_style = "white" if not is_default else "dim"
            table.add_row(key, str(value), default, style=value_style)

        console.print(table)

    except Exception as e:
        console.print(f"[red]Failed to show configuration: {e}[/red]")
        raise typer.Exit(1)

@config_app.command()
def create(
    path: str = typer.Option("aura-004.yaml", "--path", "-p", help="Configuration file path"),
    force: bool = typer.Option(False, "--force", "-f", help="Force overwrite"),
):
    """Create a default configuration file."""
    try:
        config_path = Path(path)

        if config_path.exists() and not force:
            console.print(f"[yellow]Configuration file already exists: {config_path}[/yellow]")
            console.print("Use --force to overwrite")
            raise typer.Exit(1)

        from aura_004.core.config import create_default_config
        create_default_config(config_path)

        console.print(f"[green]✓ Configuration created: {config_path}[/green]")

    except Exception as e:
        console.print(f"[red]Failed to create configuration: {e}[/red]")
        raise typer.Exit(1)

# Server commands
serve_app = typer.Typer(name="serve", help="Server commands")

@serve_app.command()
def start(
    host: str = typer.Option("localhost", "--host", "-h", help="Host address"),
    port: int = typer.Option(8000, "--port", "-p", help="Port number"),
    reload: bool = typer.Option(False, "--reload", "-r", help="Enable auto-reload"),
):
    """Start the AURA-004 server."""
    console.print("[blue]Starting AURA-004 server...[/blue]")
    console.print(f"Host: {host}")
    console.print(f"Port: {port}")
    console.print(f"Reload: {reload}")
    console.print("\n[yellow]Server functionality is under development[/yellow]")
    console.print("This will be implemented in a future version.")

# Export the apps for main module
__all__ = [
    "analyze_app",
    "memory_app",
    "agents_app",
    "config_app",
    "serve_app",
]