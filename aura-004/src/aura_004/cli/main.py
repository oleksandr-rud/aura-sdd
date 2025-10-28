"""
Main CLI entry point for AURA-004.

This module provides the primary command-line interface using Typer,
with rich output formatting and comprehensive command structure.
"""

import asyncio
import sys
from pathlib import Path
from typing import Optional

import typer
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich import print as rprint

from aura_004.core.config import get_settings, load_config, create_default_config
from aura_004.core.exceptions import AuraError
from aura_004.cli.commands import (
    analyze_app,
    memory_app,
    agents_app,
    config_app,
    serve_app,
)

# Initialize Typer app
app = typer.Typer(
    name="aura-004",
    help="AURA-004: Advanced Coding Agent with LangGraph Integration",
    no_args_is_help=True,
    rich_markup_mode="rich",
)

# Initialize console
console = Console()

# Add sub-apps
app.add_typer(analyze_app, name="analyze", help="Code analysis commands")
app.add_typer(memory_app, name="memory", help="Memory management commands")
app.add_typer(agents_app, name="agents", help="Agent management commands")
app.add_typer(config_app, name="config", help="Configuration commands")
app.add_typer(serve_app, name="serve", help="Server commands")

# Version option
@app.callback()
def main(
    version: Optional[bool] = typer.Option(
        None, "--version", "-v", help="Show version and exit"
    ),
    config_file: Optional[str] = typer.Option(
        None, "--config", "-c", help="Path to configuration file"
    ),
    debug: Optional[bool] = typer.Option(
        None, "--debug", help="Enable debug mode"
    ),
):
    """AURA-004: Advanced Coding Agent with LangGraph Integration."""
    if version:
        from aura_004 import __version__
        rprint(f"AURA-004 version: [bold green]{__version__}[/bold green]")
        raise typer.Exit()

    # Load configuration if provided
    if config_file:
        try:
            load_config(config_file)
        except Exception as e:
            console.print(f"[red]Error loading config: {e}[/red]")
            raise typer.Exit(1)

    # Set debug mode if provided
    if debug:
        import loguru
        loguru.logger.remove()
        loguru.logger.add(sys.stderr, level="DEBUG")


@app.command()
def init(
    path: str = typer.Option(".", "--path", "-p", help="Directory to initialize"),
    force: bool = typer.Option(False, "--force", "-f", help="Force overwrite existing config"),
):
    """Initialize AURA-004 in the current directory."""
    try:
        init_path = Path(path)
        config_file = init_path / "aura-004.yaml"

        # Check if config already exists
        if config_file.exists() and not force:
            console.print(
                f"[yellow]Configuration file already exists: {config_file}[/yellow]"
            )
            console.print("Use --force to overwrite")
            raise typer.Exit(1)

        # Create directories
        (init_path / "data").mkdir(exist_ok=True)
        (init_path / "logs").mkdir(exist_ok=True)
        (init_path / "cache").mkdir(exist_ok=True)

        # Create default config
        create_default_config(config_file)

        console.print(
            Panel(
                f"[green]✓[/green] AURA-004 initialized in [bold]{init_path.absolute()}[/bold]\n\n"
                f"Configuration: {config_file}\n"
                f"Data directory: {init_path / 'data'}\n"
                f"Logs directory: {init_path / 'logs'}",
                title="Initialization Complete",
                border_style="green",
            )
        )

    except Exception as e:
        console.print(f"[red]Error initializing AURA-004: {e}[/red]")
        raise typer.Exit(1)


@app.command()
def status():
    """Show AURA-004 system status."""
    try:
        settings = get_settings()

        # Create status table
        table = Table(title="AURA-004 System Status", show_header=True, header_style="bold magenta")
        table.add_column("Component", style="cyan", no_wrap=True)
        table.add_column("Status", style="green")
        table.add_column("Details", style="white")

        # Core status
        table.add_row("Core", "✓ Active", f"Environment: {settings.environment}")
        table.add_row("Data Directory", "✓ Available", str(settings.get_data_path()))
        table.add_row("Log Directory", "✓ Available", str(settings.get_log_path()))
        table.add_row("Cache Directory", "✓ Available", str(settings.get_cache_path()))

        # Vector DB status
        table.add_row(
            "Vector DB",
            "✓ Configured",
            f"{settings.vector_db.type} @ {settings.vector_db.path}"
        )

        # Analysis status
        table.add_row(
            "Code Analysis",
            "✓ Ready",
            f"Languages: {len(settings.analysis.supported_languages)}"
        )

        # Agent status
        table.add_row(
            "Agents",
            "✓ Ready",
            f"Model: {settings.agents.model}"
        )

        console.print(table)

    except Exception as e:
        console.print(f"[red]Error getting status: {e}[/red]")
        raise typer.Exit(1)


@app.command()
def doctor():
    """Run diagnostic checks on AURA-004 installation."""
    console.print("[bold blue]Running AURA-004 diagnostics...[/bold blue]\n")

    issues = []

    # Check dependencies
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console,
    ) as progress:
        # Check core dependencies
        task = progress.add_task("Checking core dependencies...", total=None)
        try:
            import langgraph
            import langchain
            import chromadb
            import tree_sitter
            progress.update(task, description="✓ Core dependencies OK")
        except ImportError as e:
            issues.append(f"Missing core dependency: {e}")
            progress.update(task, description="✗ Core dependency missing")

        # Check optional dependencies
        task = progress.add_task("Checking optional dependencies...", total=None)
        optional_deps = {
            "sentence-transformers": "Embeddings",
            "openai": "OpenAI integration",
            "pytest": "Testing framework",
        }
        missing_optional = []
        for dep, description in optional_deps.items():
            try:
                __import__(dep.replace("-", "_"))
            except ImportError:
                missing_optional.append(f"{dep} ({description})")

        if missing_optional:
            issues.append(f"Missing optional dependencies: {', '.join(missing_optional)}")
            progress.update(task, description=f"✗ {len(missing_optional)} optional dependencies missing")
        else:
            progress.update(task, description="✓ All optional dependencies OK")

        # Check configuration
        task = progress.add_task("Checking configuration...", total=None)
        try:
            settings = get_settings()
            progress.update(task, description="✓ Configuration OK")
        except Exception as e:
            issues.append(f"Configuration error: {e}")
            progress.update(task, description="✗ Configuration error")

        # Check data directories
        task = progress.add_task("Checking data directories...", total=None)
        try:
            settings = get_settings()
            data_path = settings.get_data_path()
            if not data_path.exists():
                issues.append(f"Data directory does not exist: {data_path}")
                progress.update(task, description="✗ Data directory missing")
            else:
                progress.update(task, description="✓ Data directories OK")
        except Exception as e:
            issues.append(f"Data directory check failed: {e}")
            progress.update(task, description="✗ Data directory check failed")

    # Report results
    console.print()
    if not issues:
        console.print(
            Panel(
                "[green]✓ All systems operational![/green]\n\n"
                "AURA-004 is ready to use.",
                title="Diagnostics Complete",
                border_style="green",
            )
        )
    else:
        console.print(
            Panel(
                f"[yellow]⚠ {len(issues)} issues found[/yellow]\n\n"
                + "\n".join(f"• {issue}" for issue in issues),
                title="Diagnostics Complete",
                border_style="yellow",
            )
        )


@app.command()
def info():
    """Show detailed AURA-004 information."""
    from aura_004 import __version__, PACKAGE_INFO

    # Create info panel
    info_text = f"""
[bold]AURA-004[/bold]
Version: {__version__}
Description: {PACKAGE_INFO['description']}

[bold]System Information[/bold]
Python: {sys.version}
Platform: {sys.platform}

[bold]Installation Path[/bold]
{Path(__file__).parent.parent}

[bold]Support[/bold]
Documentation: https://aura-004.readthedocs.io
Issues: https://github.com/aura-ai/aura-004/issues
"""

    console.print(Panel(info_text.strip(), title="AURA-004 Information", border_style="blue"))


def handle_exception(func):
    """Decorator to handle exceptions in CLI commands."""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except AuraError as e:
            console.print(f"[red]AURA Error: {e}[/red]")
            raise typer.Exit(1)
        except KeyboardInterrupt:
            console.print("\n[yellow]Operation cancelled by user[/yellow]")
            raise typer.Exit(1)
        except Exception as e:
            console.print(f"[red]Unexpected error: {e}[/red]")
            if "--debug" in sys.argv:
                import traceback
                console.print(traceback.format_exc())
            raise typer.Exit(1)
    return wrapper


# Apply exception handling to main app
app.command()(handle_exception(main))


if __name__ == "__main__":
    app()