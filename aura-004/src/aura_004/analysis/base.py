"""
Base analyzer implementation for AURA-004.

This module provides the abstract base class for all code analyzers,
defining the common interface and core functionality.
"""

import asyncio
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, Union
from pathlib import Path

from pydantic import BaseModel, Field

from aura_004.core.base import BaseAnalyzer as BaseAnalyzerComponent
from aura_004.core.exceptions import AnalysisError


class AnalysisResult(BaseModel):
    """Schema for analysis results."""

    file_path: Optional[str] = None
    language: str
    content: str
    ast: Optional[Dict[str, Any]] = None
    chunks: List[str] = Field(default_factory=list)
    metrics: Dict[str, Any] = Field(default_factory=dict)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    errors: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    analysis_time: float = Field(default=0.0)

    class Config:
        extra = "allow"


class CodeStructure(BaseModel):
    """Schema for code structure information."""

    functions: List[Dict[str, Any]] = Field(default_factory=list)
    classes: List[Dict[str, Any]] = Field(default_factory=list)
    imports: List[str] = Field(default_factory=list)
    exports: List[str] = Field(default_factory=list)
    variables: List[str] = Field(default_factory=list)
    constants: List[str] = Field(default_factory=list)

    class Config:
        extra = "allow"


class CodeMetrics(BaseModel):
    """Schema for code metrics."""

    lines_of_code: int = Field(default=0)
    lines_of_comments: int = Field(default=0)
    lines_of_blank: int = Field(default=0)
    total_lines: int = Field(default=0)
    complexity: float = Field(default=0.0)
    maintainability_index: float = Field(default=100.0)
    halstead_metrics: Dict[str, float] = Field(default_factory=dict)
    cognitive_complexity: float = Field(default=0.0)

    class Config:
        extra = "allow"


class BaseAnalyzer(BaseAnalyzerComponent):
    """Enhanced base class for code analyzers."""

    def __init__(
        self,
        supported_languages: Optional[List[str]] = None,
        max_file_size: int = 10 * 1024 * 1024,  # 10MB
        **kwargs,
    ):
        super().__init__(**kwargs)
        self.supported_languages = supported_languages or []
        self.max_file_size = max_file_size
        self._analysis_stats = {
            "total_files_analyzed": 0,
            "total_analysis_time": 0.0,
            "total_lines_processed": 0,
            "total_chunks_generated": 0,
            "error_count": 0,
        }

    @abstractmethod
    async def extract_ast(
        self,
        code: str,
        language: str,
    ) -> Dict[str, Any]:
        """Extract AST from code."""
        pass

    @abstractmethod
    async def get_code_structure(
        self,
        ast: Dict[str, Any],
        language: str,
    ) -> CodeStructure:
        """Extract code structure from AST."""
        pass

    @abstractmethod
    async def calculate_metrics(
        self,
        code: str,
        ast: Optional[Dict[str, Any]] = None,
        language: str = "",
    ) -> CodeMetrics:
        """Calculate code metrics."""
        pass

    @abstractmethod
    async def detect_issues(
        self,
        code: str,
        ast: Optional[Dict[str, Any]] = None,
        language: str = "",
    ) -> List[Dict[str, Any]]:
        """Detect code issues and smells."""
        pass

    async def analyze(
        self,
        code: str,
        language: str,
        file_path: Optional[str] = None,
        **kwargs,
    ) -> AnalysisResult:
        """Analyze code and return comprehensive results."""
        start_time = asyncio.get_event_loop().time()

        try:
            # Validate inputs
            self._validate_inputs(code, language, file_path)

            # Initialize if needed
            await self.ensure_initialized()

            result = AnalysisResult(
                file_path=file_path,
                language=language,
                content=code,
            )

            # Extract AST
            try:
                result.ast = await self.extract_ast(code, language)
            except Exception as e:
                result.errors.append(f"AST extraction failed: {e}")

            # Extract code structure
            if result.ast:
                try:
                    structure = await self.get_code_structure(result.ast, language)
                    result.metadata["structure"] = structure.model_dump()
                except Exception as e:
                    result.warnings.append(f"Structure extraction failed: {e}")

            # Calculate metrics
            try:
                result.metrics = (
                    await self.calculate_metrics(code, result.ast, language)
                ).model_dump()
            except Exception as e:
                result.warnings.append(f"Metrics calculation failed: {e}")

            # Detect issues
            try:
                issues = await self.detect_issues(code, result.ast, language)
                result.metadata["issues"] = issues
                if issues:
                    result.warnings.extend([f"Issue detected: {issue}" for issue in issues])
            except Exception as e:
                result.warnings.append(f"Issue detection failed: {e}")

            # Generate chunks
            try:
                chunk_size = kwargs.get("chunk_size", 1000)
                overlap = kwargs.get("overlap", 200)
                result.chunks = await self.chunk_code(code, chunk_size, overlap)
            except Exception as e:
                result.warnings.append(f"Code chunking failed: {e}")

            # Calculate analysis time
            result.analysis_time = asyncio.get_event_loop().time() - start_time

            # Update stats
            self._update_stats(result)

            return result

        except Exception as e:
            analysis_time = asyncio.get_event_loop().time() - start_time
            self._stats["error_count"] += 1
            raise AnalysisError(f"Analysis failed: {e}") from e

    async def analyze_file(
        self,
        file_path: Union[str, Path],
        language: Optional[str] = None,
        **kwargs,
    ) -> AnalysisResult:
        """Analyze a code file."""
        file_path = Path(file_path)

        # Check file exists
        if not file_path.exists():
            raise AnalysisError(f"File not found: {file_path}")

        # Check file size
        if file_path.stat().st_size > self.max_file_size:
            raise AnalysisError(
                f"File too large: {file_path} "
                f"({file_path.stat().st_size} > {self.max_file_size})"
            )

        # Detect language if not provided
        if language is None:
            language = self._detect_language(file_path)

        if not self.supports_language(language):
            raise AnalysisError(f"Unsupported language: {language}")

        # Read file content
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                code = f.read()
        except UnicodeDecodeError:
            # Try different encodings
            encodings = ['utf-8-sig', 'latin-1', 'cp1252']
            for encoding in encodings:
                try:
                    with open(file_path, 'r', encoding=encoding) as f:
                        code = f.read()
                    break
                except UnicodeDecodeError:
                    continue
            else:
                raise AnalysisError(f"Could not decode file: {file_path}")

        return await self.analyze(
            code=code,
            language=language,
            file_path=str(file_path),
            **kwargs,
        )

    async def analyze_directory(
        self,
        directory_path: Union[str, Path],
        pattern: str = "**/*",
        recursive: bool = True,
        **kwargs,
    ) -> List[AnalysisResult]:
        """Analyze all files in a directory."""
        directory_path = Path(directory_path)

        if not directory_path.exists():
            raise AnalysisError(f"Directory not found: {directory_path}")

        if not directory_path.is_dir():
            raise AnalysisError(f"Path is not a directory: {directory_path}")

        # Find files
        if recursive:
            files = list(directory_path.glob(pattern))
        else:
            files = list(directory_path.glob(pattern))

        # Filter to supported files
        supported_files = []
        for file_path in files:
            if file_path.is_file():
                language = self._detect_language(file_path)
                if self.supports_language(language):
                    supported_files.append((file_path, language))

        # Analyze files concurrently
        tasks = []
        for file_path, language in supported_files:
            task = self.analyze_file(file_path, language, **kwargs)
            tasks.append(task)

        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Process results
        analysis_results = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                analysis_results.append(
                    AnalysisResult(
                        file_path=str(supported_files[i][0]),
                        language=supported_files[i][1],
                        content="",
                        errors=[str(result)],
                    )
                )
            else:
                analysis_results.append(result)

        return analysis_results

    def _validate_inputs(
        self,
        code: str,
        language: str,
        file_path: Optional[str],
    ) -> None:
        """Validate analysis inputs."""
        if not code.strip():
            raise AnalysisError("Code content cannot be empty")

        if not language:
            raise AnalysisError("Language must be specified")

        if not self.supports_language(language):
            raise AnalysisError(f"Unsupported language: {language}")

        if len(code) > self.max_file_size:
            raise AnalysisError(
                f"Code too large: {len(code)} > {self.max_file_size}"
            )

    def _detect_language(self, file_path: Path) -> str:
        """Detect programming language from file extension."""
        extension_map = {
            '.py': 'python',
            '.js': 'javascript',
            '.ts': 'typescript',
            '.jsx': 'javascript',
            '.tsx': 'typescript',
            '.java': 'java',
            '.go': 'go',
            '.rs': 'rust',
            '.cpp': 'cpp',
            '.cc': 'cpp',
            '.cxx': 'cpp',
            '.c': 'c',
            '.h': 'c',
            '.hpp': 'cpp',
            '.cs': 'csharp',
            '.php': 'php',
            '.rb': 'ruby',
            '.swift': 'swift',
            '.kt': 'kotlin',
            '.scala': 'scala',
            '.sh': 'bash',
            '.bash': 'bash',
            '.zsh': 'bash',
            '.sql': 'sql',
            '.html': 'html',
            '.css': 'css',
            '.scss': 'scss',
            '.less': 'less',
            '.json': 'json',
            '.yaml': 'yaml',
            '.yml': 'yaml',
            '.xml': 'xml',
            '.md': 'markdown',
        }

        suffix = file_path.suffix.lower()
        return extension_map.get(suffix, 'unknown')

    def _update_stats(self, result: AnalysisResult) -> None:
        """Update analysis statistics."""
        self._stats["total_files_analyzed"] += 1
        self._stats["total_analysis_time"] += result.analysis_time
        self._stats["total_lines_processed"] += result.metrics.get("total_lines", 0)
        self._stats["total_chunks_generated"] += len(result.chunks)

    async def get_stats(self) -> Dict[str, Any]:
        """Get analysis statistics."""
        return {
            **self._stats,
            "supported_languages": self.supported_languages.copy(),
            "max_file_size": self.max_file_size,
            "is_initialized": self._is_initialized,
            "avg_analysis_time": (
                self._stats["total_analysis_time"] / self._stats["total_files_analyzed"]
                if self._stats["total_files_analyzed"] > 0 else 0.0
            ),
        }

    async def reset_stats(self) -> None:
        """Reset analysis statistics."""
        self._stats = {
            "total_files_analyzed": 0,
            "total_analysis_time": 0.0,
            "total_lines_processed": 0,
            "total_chunks_generated": 0,
            "error_count": 0,
        }