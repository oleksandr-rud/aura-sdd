"""
Tree-sitter based code analyzer for AURA-004.

This module provides a comprehensive Tree-sitter implementation for parsing
and analyzing code across multiple programming languages.
"""

import asyncio
from typing import Any, Dict, List, Optional, Set
import re
from pathlib import Path

from aura_004.analysis.base import BaseAnalyzer, AnalysisResult, CodeStructure, CodeMetrics
from aura_004.analysis.chunking import CodeChunker
from aura_004.core.exceptions import AnalysisError

# Try to import tree-sitter
try:
    import tree_sitter
    TREE_SITTER_AVAILABLE = True
except ImportError:
    TREE_SITTER_AVAILABLE = False


class TreeSitterAnalyzer(BaseAnalyzer):
    """Tree-sitter based code analyzer."""

    def __init__(
        self,
        language_parsers: Optional[Dict[str, str]] = None,
        chunker: Optional[CodeChunker] = None,
        **kwargs,
    ):
        super().__init__(
            supported_languages=[
                "python", "javascript", "typescript", "java", "go", "rust",
                "cpp", "c", "bash", "html", "css", "json", "yaml", "sql"
            ],
            **kwargs,
        )

        if not TREE_SITTER_AVAILABLE:
            raise AnalysisError(
                "tree-sitter not available. Install with: pip install tree-sitter"
            )

        self.language_parsers = language_parsers or {}
        self.chunker = chunker or CodeChunker()
        self._parsers: Dict[str, Any] = {}
        self._languages: Dict[str, Any] = {}
        self._lock = asyncio.Lock()

    async def initialize(self) -> None:
        """Initialize Tree-sitter parsers for supported languages."""
        async with self._lock:
            if self._is_initialized:
                return

            try:
                # Initialize parsers for each language
                language_configs = {
                    "python": "tree_sitter_python",
                    "javascript": "tree_sitter_javascript",
                    "typescript": "tree_sitter_typescript",
                    "java": "tree_sitter_java",
                    "go": "tree_sitter_go",
                    "rust": "tree_sitter_rust",
                    "cpp": "tree_sitter_cpp",
                    "c": "tree_sitter_c",
                    "bash": "tree_sitter_bash",
                    "html": "tree_sitter_html",
                    "css": "tree_sitter_css",
                    "json": "tree_sitter_json",
                    "yaml": "tree_sitter_yaml",
                    "sql": "tree_sitter_sql",
                }

                for language, module_name in language_configs.items():
                    try:
                        await self._init_language_parser(language, module_name)
                    except Exception as e:
                        # Log warning but continue
                        print(f"Warning: Could not initialize parser for {language}: {e}")
                        if language in self.supported_languages:
                            self.supported_languages.remove(language)

                self._is_initialized = True

            except Exception as e:
                raise AnalysisError(f"Failed to initialize TreeSitterAnalyzer: {e}") from e

    async def _init_language_parser(self, language: str, module_name: str) -> None:
        """Initialize parser for a specific language."""
        try:
            # Import language module
            language_module = __import__(module_name, fromlist=['language'])
            lang = language_module.language()

            # Create parser
            parser = tree_sitter.Parser()
            parser.set_language(lang)

            self._languages[language] = lang
            self._parsers[language] = parser

        except ImportError as e:
            # Try to use custom parser path if provided
            if language in self.language_parsers:
                parser_path = Path(self.language_parsers[language])
                if parser_path.exists():
                    Language = tree_sitter.Language(parser_path, language)
                    parser = tree_sitter.Parser()
                    parser.set_language(Language)
                    self._languages[language] = Language
                    self._parsers[language] = parser
                else:
                    raise AnalysisError(f"Parser file not found: {parser_path}") from e
            else:
                raise AnalysisError(f"Could not import {module_name}: {e}") from e

    def supports_language(self, language: str) -> bool:
        """Check if the analyzer supports a language."""
        return language in self._parsers

    async def extract_ast(
        self,
        code: str,
        language: str,
    ) -> Dict[str, Any]:
        """Extract AST from code using Tree-sitter."""
        if language not in self._parsers:
            raise AnalysisError(f"No parser available for language: {language}")

        try:
            parser = self._parsers[language]
            tree = parser.parse(bytes(code, "utf-8"))
            return self._node_to_dict(tree.root_node, code)

        except Exception as e:
            raise AnalysisError(f"AST extraction failed for {language}: {e}") from e

    def _node_to_dict(self, node: Any, source_code: str) -> Dict[str, Any]:
        """Convert Tree-sitter node to dictionary representation."""
        result = {
            "type": node.type,
            "start_byte": node.start_byte,
            "end_byte": node.end_byte,
            "start_point": {
                "row": node.start_point[0],
                "column": node.start_point[1],
            },
            "end_point": {
                "row": node.end_point[0],
                "column": node.end_point[1],
            },
            "children": [],
            "text": source_code[node.start_byte:node.end_byte] if source_code else "",
        }

        # Add named children
        for child in node.named_children:
            result["children"].append(self._node_to_dict(child, source_code))

        # Add fields for specific languages
        if hasattr(node, 'field_name_for_child'):
            for i in range(node.child_count):
                field_name = node.field_name_for_child(i)
                if field_name:
                    child = node.child(i)
                    if field_name not in result:
                        result[field_name] = []
                    result[field_name].append(self._node_to_dict(child, source_code))

        return result

    async def get_code_structure(
        self,
        ast: Dict[str, Any],
        language: str,
    ) -> CodeStructure:
        """Extract code structure from AST."""
        structure = CodeStructure()

        try:
            # Extract different structure elements based on language
            if language == "python":
                await self._extract_python_structure(ast, structure)
            elif language in ["javascript", "typescript"]:
                await self._extract_javascript_structure(ast, structure)
            elif language == "java":
                await self._extract_java_structure(ast, structure)
            elif language == "go":
                await self._extract_go_structure(ast, structure)
            elif language in ["cpp", "c"]:
                await self._extract_cpp_structure(ast, structure)
            else:
                # Generic extraction
                await self._extract_generic_structure(ast, structure)

        except Exception as e:
            raise AnalysisError(f"Structure extraction failed for {language}: {e}") from e

        return structure

    async def _extract_python_structure(self, ast: Dict[str, Any], structure: CodeStructure) -> None:
        """Extract structure from Python AST."""
        def traverse(node):
            if node["type"] == "function_definition":
                func_info = {
                    "name": self._extract_name(node),
                    "line": node["start_point"]["row"] + 1,
                    "parameters": self._extract_parameters(node),
                    "return_type": self._extract_type_annotation(node, "return_type"),
                }
                structure.functions.append(func_info)

            elif node["type"] == "class_definition":
                class_info = {
                    "name": self._extract_name(node),
                    "line": node["start_point"]["row"] + 1,
                    "base_classes": self._extract_base_classes(node),
                    "methods": [],
                }
                # Extract methods
                for child in node.get("children", []):
                    if child["type"] == "block":
                        for stmt in child.get("children", []):
                            if stmt["type"] == "function_definition":
                                method_info = {
                                    "name": self._extract_name(stmt),
                                    "line": stmt["start_point"]["row"] + 1,
                                    "parameters": self._extract_parameters(stmt),
                                }
                                class_info["methods"].append(method_info)
                structure.classes.append(class_info)

            elif node["type"] == "import_statement":
                structure.imports.extend(self._extract_imports(node))

            elif node["type"] == "import_from_statement":
                structure.imports.extend(self._extract_imports(node))

            # Recursively traverse children
            for child in node.get("children", []):
                traverse(child)

        traverse(ast)

    async def _extract_javascript_structure(self, ast: Dict[str, Any], structure: CodeStructure) -> None:
        """Extract structure from JavaScript/TypeScript AST."""
        def traverse(node):
            if node["type"] == "function_declaration":
                func_info = {
                    "name": self._extract_name(node),
                    "line": node["start_point"]["row"] + 1,
                    "parameters": self._extract_parameters(node),
                }
                structure.functions.append(func_info)

            elif node["type"] == "class_declaration":
                class_info = {
                    "name": self._extract_name(node),
                    "line": node["start_point"]["row"] + 1,
                    "methods": [],
                }
                structure.classes.append(class_info)

            elif node["type"] == "import_statement":
                structure.imports.extend(self._extract_imports(node))

            elif node["type"] == "export_statement":
                structure.exports.append(node.get("text", ""))

            # Recursively traverse children
            for child in node.get("children", []):
                traverse(child)

        traverse(ast)

    async def _extract_java_structure(self, ast: Dict[str, Any], structure: CodeStructure) -> None:
        """Extract structure from Java AST."""
        def traverse(node):
            if node["type"] == "method_declaration":
                func_info = {
                    "name": self._extract_name(node),
                    "line": node["start_point"]["row"] + 1,
                    "parameters": self._extract_parameters(node),
                    "return_type": self._extract_type(node, "type"),
                }
                structure.functions.append(func_info)

            elif node["type"] == "class_declaration":
                class_info = {
                    "name": self._extract_name(node),
                    "line": node["start_point"]["row"] + 1,
                    "methods": [],
                }
                structure.classes.append(class_info)

            elif node["type"] == "import_declaration":
                structure.imports.append(node.get("text", ""))

            # Recursively traverse children
            for child in node.get("children", []):
                traverse(child)

        traverse(ast)

    async def _extract_go_structure(self, ast: Dict[str, Any], structure: CodeStructure) -> None:
        """Extract structure from Go AST."""
        def traverse(node):
            if node["type"] == "function_declaration":
                func_info = {
                    "name": self._extract_name(node),
                    "line": node["start_point"]["row"] + 1,
                    "parameters": self._extract_parameters(node),
                    "return_type": self._extract_type(node, "result"),
                }
                structure.functions.append(func_info)

            elif node["type"] == "import_declaration":
                imports = node.get("text", "").split('\n')
                structure.imports.extend([imp.strip() for imp in imports if imp.strip()])

            # Recursively traverse children
            for child in node.get("children", []):
                traverse(child)

        traverse(ast)

    async def _extract_cpp_structure(self, ast: Dict[str, Any], structure: CodeStructure) -> None:
        """Extract structure from C++ AST."""
        def traverse(node):
            if node["type"] == "function_definition":
                func_info = {
                    "name": self._extract_name(node),
                    "line": node["start_point"]["row"] + 1,
                    "parameters": self._extract_parameters(node),
                    "return_type": self._extract_type(node, "type"),
                }
                structure.functions.append(func_info)

            elif node["type"] == "class_specifier":
                class_info = {
                    "name": self._extract_name(node),
                    "line": node["start_point"]["row"] + 1,
                    "methods": [],
                }
                structure.classes.append(class_info)

            elif node["type"] == "preproc_include":
                structure.imports.append(node.get("text", ""))

            # Recursively traverse children
            for child in node.get("children", []):
                traverse(child)

        traverse(ast)

    async def _extract_generic_structure(self, ast: Dict[str, Any], structure: CodeStructure) -> None:
        """Generic structure extraction for unknown languages."""
        def traverse(node):
            # Look for function-like nodes
            if "function" in node["type"].lower():
                func_info = {
                    "name": self._extract_name(node),
                    "line": node["start_point"]["row"] + 1,
                    "parameters": [],
                }
                structure.functions.append(func_info)

            # Look for class-like nodes
            elif "class" in node["type"].lower():
                class_info = {
                    "name": self._extract_name(node),
                    "line": node["start_point"]["row"] + 1,
                    "methods": [],
                }
                structure.classes.append(class_info)

            # Recursively traverse children
            for child in node.get("children", []):
                traverse(child)

        traverse(ast)

    async def calculate_metrics(
        self,
        code: str,
        ast: Optional[Dict[str, Any]] = None,
        language: str = "",
    ) -> CodeMetrics:
        """Calculate comprehensive code metrics."""
        lines = code.split('\n')
        total_lines = len(lines)

        # Count different types of lines
        lines_of_code = 0
        lines_of_comments = 0
        lines_of_blank = 0

        comment_patterns = {
            "python": [r'#.*$', r'""".*?"""', r"'''.*?'''"],
            "javascript": [r'//.*$', r'/\*.*?\*/'],
            "typescript": [r'//.*$', r'/\*.*?\*/'],
            "java": [r'//.*$', r'/\*.*?\*/'],
            "go": [r'//.*$', r'/\*.*?\*/'],
            "rust": [r'//.*$', r'/\*.*?\*/'],
            "cpp": [r'//.*$', r'/\*.*?\*/'],
            "c": [r'//.*$', r'/\*.*?\*/'],
            "bash": [r'#.*$'],
        }

        patterns = comment_patterns.get(language, [r'//.*$', r'/\*.*?\*/', r'#.*$'])

        for line in lines:
            stripped = line.strip()
            if not stripped:
                lines_of_blank += 1
            else:
                # Check if line is comment
                is_comment = False
                for pattern in patterns:
                    if re.search(pattern, line, re.MULTILINE | re.DOTALL):
                        is_comment = True
                        break

                if is_comment:
                    lines_of_comments += 1
                else:
                    lines_of_code += 1

        # Calculate complexity
        complexity = await self._calculate_complexity(code, language)

        # Calculate maintainability index (simplified)
        maintainability_index = max(0, 171 - 5.2 * complexity - 0.23 * total_lines - 16.2 * lines_of_comments)

        return CodeMetrics(
            lines_of_code=lines_of_code,
            lines_of_comments=lines_of_comments,
            lines_of_blank=lines_of_blank,
            total_lines=total_lines,
            complexity=complexity,
            maintainability_index=maintainability_index,
        )

    async def _calculate_complexity(self, code: str, language: str) -> float:
        """Calculate cyclomatic complexity."""
        complexity = 1  # Base complexity

        # Count decision points
        decision_patterns = {
            "python": [r'\bif\b', r'\belif\b', r'\bwhile\b', r'\bfor\b', r'\bexcept\b', r'\band\b', r'\bor\b'],
            "javascript": [r'\bif\b', r'\bwhile\b', r'\bfor\b', r'\bcatch\b', r'\bcase\b', r'\?[^:]*:'],
            "java": [r'\bif\b', r'\bwhile\b', r'\bfor\b', r'\bcatch\b', r'\bcase\b', r'&&', r'\|\|'],
            "cpp": [r'\bif\b', r'\bwhile\b', r'\bfor\b', r'\bcatch\b', r'\bcase\b', r'&&', r'\|\|'],
            "go": [r'\bif\b', r'\bwhile\b', r'\bfor\b', r'\bcase\b', r'&&', r'\|\|'],
        }

        patterns = decision_patterns.get(language, [r'\bif\b', r'\bwhile\b', r'\bfor\b', r'\bcase\b'])

        for pattern in patterns:
            matches = re.findall(pattern, code, re.IGNORECASE)
            complexity += len(matches)

        return float(complexity)

    async def detect_issues(
        self,
        code: str,
        ast: Optional[Dict[str, Any]] = None,
        language: str = "",
    ) -> List[Dict[str, Any]]:
        """Detect code issues and smells."""
        issues = []

        # Common issue patterns
        issue_patterns = [
            {
                "pattern": r'todo|fixme|hack|xxx',
                "message": "Contains TODO/FIXME comment",
                "severity": "info",
            },
            {
                "pattern": r'print\(|console\.log|System\.out\.print',
                "message": "Debug print statement found",
                "severity": "warning",
            },
            {
                "pattern": r'eval\(|exec\(',
                "message": "Use of eval/exec function",
                "severity": "error",
            },
        ]

        for issue_config in issue_patterns:
            matches = re.finditer(issue_config["pattern"], code, re.IGNORECASE | re.MULTILINE)
            for match in matches:
                line_num = code[:match.start()].count('\n') + 1
                issues.append({
                    "type": "pattern_match",
                    "message": issue_config["message"],
                    "severity": issue_config["severity"],
                    "line": line_num,
                    "column": match.start() - code.rfind('\n', 0, match.start()) - 1,
                    "text": match.group(),
                })

        # Language-specific issues
        if language == "python":
            issues.extend(await self._detect_python_issues(code))
        elif language in ["javascript", "typescript"]:
            issues.extend(await self._detect_javascript_issues(code))

        return issues

    async def _detect_python_issues(self, code: str) -> List[Dict[str, Any]]:
        """Detect Python-specific issues."""
        issues = []

        # Check for bare except
        if re.search(r'except\s*:', code):
            issues.append({
                "type": "bare_except",
                "message": "Bare except clause should specify exception type",
                "severity": "warning",
            })

        # Check for import *
        if re.search(r'from\s+\w+\s+import\s+\*', code):
            issues.append({
                "type": "star_import",
                "message": "Avoid using 'import *' statements",
                "severity": "warning",
            })

        return issues

    async def _detect_javascript_issues(self, code: str) -> List[Dict[str, Any]]:
        """Detect JavaScript-specific issues."""
        issues = []

        # Check for var usage
        if re.search(r'\bvar\s+', code):
            issues.append({
                "type": "var_usage",
                "message": "Use 'let' or 'const' instead of 'var'",
                "severity": "warning",
            })

        # Check for == instead of ===
        if re.search(r'==\s*[^=]', code):
            issues.append({
                "type": "loose_equality",
                "message": "Use '===' instead of '=='",
                "severity": "warning",
            })

        return issues

    async def chunk_code(
        self,
        code: str,
        chunk_size: int = 1000,
        overlap: int = 200,
    ) -> List[str]:
        """Chunk code using the configured chunker."""
        return await self.chunker.chunk_code(code, chunk_size, overlap)

    def _extract_name(self, node: Dict[str, Any]) -> str:
        """Extract name from a node."""
        # Look for identifier child
        for child in node.get("children", []):
            if child["type"] == "identifier":
                return child["text"]
        return ""

    def _extract_parameters(self, node: Dict[str, Any]) -> List[str]:
        """Extract parameter names from a function node."""
        parameters = []
        for child in node.get("children", []):
            if child["type"] in ["parameters", "parameter_list", "formal_parameters"]:
                for param in child.get("children", []):
                    if param["type"] == "identifier":
                        parameters.append(param["text"])
                    elif param["type"] == "parameter":
                        for param_child in param.get("children", []):
                            if param_child["type"] == "identifier":
                                parameters.append(param_child["text"])
        return parameters

    def _extract_type_annotation(self, node: Dict[str, Any], field: str) -> Optional[str]:
        """Extract type annotation from a node."""
        if field in node:
            type_node = node[field]
            return type_node.get("text", "")
        return None

    def _extract_type(self, node: Dict[str, Any], field: str) -> Optional[str]:
        """Extract type from a node."""
        if field in node:
            type_node = node[field]
            return type_node.get("text", "")
        return None

    def _extract_base_classes(self, node: Dict[str, Any]) -> List[str]:
        """Extract base class names from a class node."""
        base_classes = []
        for child in node.get("children", []):
            if child["type"] == "argument_list":
                for arg in child.get("children", []):
                    if arg["type"] == "identifier":
                        base_classes.append(arg["text"])
        return base_classes

    def _extract_imports(self, node: Dict[str, Any]) -> List[str]:
        """Extract import statements from a node."""
        imports = []
        text = node.get("text", "")
        # Clean up the import statement
        import_text = text.strip().rstrip(';')
        imports.append(import_text)
        return imports