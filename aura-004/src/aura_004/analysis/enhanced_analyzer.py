"""
Enhanced code analyzer for AURA-004.

This module provides advanced code analysis capabilities including
security vulnerability scanning, performance bottleneck detection,
code quality assessment, and architectural pattern recognition.
"""

import asyncio
import re
import ast
import json
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, Tuple, Union, Set
from pathlib import Path
from dataclasses import dataclass
from enum import Enum
from datetime import datetime

from aura_004.analysis.base import BaseAnalyzer, AnalysisResult, CodeStructure, CodeMetrics
from aura_004.analysis.tree_sitter_analyzer import TreeSitterAnalyzer
from aura_004.core.exceptions import AnalysisError


class VulnerabilitySeverity(Enum):
    """Security vulnerability severity levels."""

    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"


class PerformanceIssueType(Enum):
    """Types of performance issues."""

    MEMORY_LEAK = "memory_leak"
    INEFFICIENT_ALGORITHM = "inefficient_algorithm"
    DATABASE_N_PLUS_1 = "database_n_plus_1"
    SYNC_BLOCKING = "sync_blocking"
    LARGE_DATA_TRANSFER = "large_data_transfer"
    CACHE_MISS = "cache_miss"
    UNNECESSARY_COMPUTATION = "unnecessary_computation"
    RESOURCE_WASTE = "resource_waste"


@dataclass
class SecurityVulnerability:
    """Security vulnerability information."""

    type: str
    severity: VulnerabilitySeverity
    line: int
    column: int
    code_snippet: str
    description: str
    recommendation: str
    cwe_id: Optional[str] = None
    cvss_score: Optional[float] = None


@dataclass
class PerformanceIssue:
    """Performance issue information."""

    type: PerformanceIssueType
    severity: str
    line: int
    column: int
    code_snippet: str
    description: str
    recommendation: str
    estimated_impact: str


@dataclass
class CodeQualityMetric:
    """Code quality metric."""

    name: str
    value: float
    threshold: float
    status: str  # "good", "warning", "critical"
    description: str


@dataclass
class ArchitecturalPattern:
    """Architectural pattern information."""

    pattern_name: str
    pattern_type: str
    line: int
    confidence: float
    description: str
    related_components: List[str]


class EnhancedCodeAnalyzer(BaseAnalyzer):
    """Enhanced code analyzer with security and performance analysis."""

    def __init__(self, **kwargs):
        super().__init__(
            supported_languages=[
                "python", "javascript", "typescript", "java", "go", "rust",
                "cpp", "c", "bash", "html", "css", "json", "yaml", "sql"
            ],
            **kwargs,
        )

        # Initialize base analyzer
        self.tree_sitter_analyzer = TreeSitterAnalyzer(**kwargs)

        # Security analysis components
        self.security_patterns = self._load_security_patterns()
        self.vulnerability_database = self._load_vulnerability_database()

        # Performance analysis components
        self.performance_patterns = self._load_performance_patterns()
        self.complexity_analyzers = self._initialize_complexity_analyzers()

        # Code quality components
        self.quality_metrics = self._initialize_quality_metrics()
        self.style_checkers = self._initialize_style_checkers()

        # Pattern recognition components
        self.architectural_patterns = self._load_architectural_patterns()

    async def initialize(self) -> None:
        """Initialize the enhanced analyzer."""
        await self.tree_sitter_analyzer.initialize()

    async def analyze_comprehensive(
        self,
        code: str,
        language: str,
        file_path: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Perform comprehensive code analysis."""
        try:
            # Initialize analysis results
            analysis_results = {
                "file_path": file_path,
                "language": language,
                "timestamp": datetime.now().isoformat(),
                "basic_analysis": {},
                "security_analysis": {},
                "performance_analysis": {},
                "quality_analysis": {},
                "architectural_analysis": {},
                "recommendations": [],
            }

            # Basic code analysis
            basic_analysis = await self._perform_basic_analysis(code, language)
            analysis_results["basic_analysis"] = basic_analysis

            # Security vulnerability analysis
            security_analysis = await self._analyze_security(code, language, file_path)
            analysis_results["security_analysis"] = security_analysis

            # Performance analysis
            performance_analysis = await self._analyze_performance(code, language, file_path)
            analysis_results["performance_analysis"] = performance_analysis

            # Code quality analysis
            quality_analysis = await self._analyze_quality(code, language, file_path)
            analysis_results["quality_analysis"] = quality_analysis

            # Architectural pattern analysis
            architectural_analysis = await self._analyze_architecture(code, language, file_path)
            analysis_results["architectural_analysis"] = architectural_analysis

            # Generate recommendations
            recommendations = await self._generate_recommendations(analysis_results)
            analysis_results["recommendations"] = recommendations

            # Calculate overall score
            overall_score = await self._calculate_overall_score(analysis_results)
            analysis_results["overall_score"] = overall_score

            return analysis_results

        except Exception as e:
            raise AnalysisError(f"Comprehensive analysis failed: {e}") from e

    async def _perform_basic_analysis(self, code: str, language: str) -> Dict[str, Any]:
        """Perform basic code analysis."""
        try:
            # Extract AST
            ast = await self.tree_sitter_analyzer.extract_ast(code, language)

            # Get code structure
            structure = await self.tree_sitter_analyzer.get_code_structure(ast, language)

            # Calculate metrics
            metrics = await self.tree_sitter_analyzer.calculate_metrics(code, ast, language)

            # Detect basic issues
            issues = await self.tree_sitter_analyzer.detect_issues(code, ast, language)

            return {
                "structure": {
                    "functions": len(structure.functions),
                    "classes": len(structure.classes),
                    "imports": len(structure.imports),
                    "exports": len(structure.exports) if hasattr(structure, 'exports') else 0,
                },
                "metrics": {
                    "lines_of_code": metrics.lines_of_code,
                    "lines_of_comments": metrics.lines_of_comments,
                    "complexity": metrics.complexity,
                    "maintainability_index": metrics.maintainability_index,
                },
                "basic_issues": issues[:10],  # Top 10 basic issues
            }

        except Exception as e:
            return {"error": f"Basic analysis failed: {e}"}

    async def _analyze_security(
        self,
        code: str,
        language: str,
        file_path: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Analyze code for security vulnerabilities."""
        vulnerabilities = []

        try:
            # Language-specific security analysis
            if language == "python":
                vulnerabilities.extend(await self._analyze_python_security(code))
            elif language in ["javascript", "typescript"]:
                vulnerabilities.extend(await self._analyze_javascript_security(code))
            elif language == "java":
                vulnerabilities.extend(await self._analyze_java_security(code))
            elif language in ["cpp", "c"]:
                vulnerabilities.extend(await self._analyze_cpp_security(code))
            elif language == "sql":
                vulnerabilities.extend(await self._analyze_sql_security(code))

            # General security pattern analysis
            vulnerabilities.extend(await self._analyze_general_security_patterns(code, language))

            # Context-aware analysis
            if file_path:
                context_vulnerabilities = await self._analyze_security_context(code, language, file_path)
                vulnerabilities.extend(context_vulnerabilities)

            # Categorize and prioritize vulnerabilities
            categorized_vulns = self._categorize_vulnerabilities(vulnerabilities)

            return {
                "vulnerabilities": [v.__dict__ for v in vulnerabilities[:20]],  # Top 20
                "summary": {
                    "total": len(vulnerabilities),
                    "critical": len([v for v in vulnerabilities if v.severity == VulnerabilitySeverity.CRITICAL]),
                    "high": len([v for v in vulnerabilities if v.severity == VulnerabilitySeverity.HIGH]),
                    "medium": len([v for v in vulnerabilities if v.severity == VulnerabilitySeverity.MEDIUM]),
                    "low": len([v for v in vulnerabilities if v.severity == VulnerabilitySeverity.LOW]),
                },
                "categorized": categorized_vulns,
                "risk_score": self._calculate_security_risk_score(vulnerabilities),
            }

        except Exception as e:
            return {"error": f"Security analysis failed: {e}"}

    async def _analyze_python_security(self, code: str) -> List[SecurityVulnerability]:
        """Analyze Python code for security vulnerabilities."""
        vulnerabilities = []

        try:
            # Parse AST for structural analysis
            tree = ast.parse(code)

            # Check for dangerous imports
            dangerous_imports = {
                'pickle': {'cwe': 'CWE-502', 'severity': VulnerabilitySeverity.HIGH},
                'cPickle': {'cwe': 'CWE-502', 'severity': VulnerabilitySeverity.HIGH},
                'subprocess': {'cwe': 'CWE-78', 'severity': VulnerabilitySeverity.MEDIUM},
                'os': {'cwe': 'CWE-78', 'severity': VulnerabilitySeverity.MEDIUM},
                'eval': {'cwe': 'CWE-94', 'severity': VulnerabilitySeverity.CRITICAL},
                'exec': {'cwe': 'CWE-94', 'severity': VulnerabilitySeverity.CRITICAL},
                'input': {'cwe': 'CWE-20', 'severity': VulnerabilitySeverity.MEDIUM},
            }

            for node in ast.walk(tree):
                if isinstance(node, ast.Import):
                    for alias in node.names:
                        if alias.name in dangerous_imports:
                            import_info = dangerous_imports[alias.name]
                            vulnerabilities.append(SecurityVulnerability(
                                type="dangerous_import",
                                severity=import_info['severity'],
                                line=node.lineno,
                                column=node.col_offset,
                                code_snippet=f"import {alias.name}",
                                description=f"Dangerous import '{alias.name}' detected",
                                recommendation=f"Use safer alternatives or sanitize inputs carefully when using {alias.name}",
                                cwe_id=import_info['cwe'],
                            ))

                elif isinstance(node, ast.Call):
                    # Check for dangerous function calls
                    if isinstance(node.func, ast.Name):
                        func_name = node.func.id
                        if func_name in ['eval', 'exec']:
                            vulnerabilities.append(SecurityVulnerability(
                                type="code_injection",
                                severity=VulnerabilitySeverity.CRITICAL,
                                line=node.lineno,
                                column=node.col_offset,
                                code_snippet=f"{func_name}(...)",
                                description=f"Use of {func_name}() can lead to code injection",
                                recommendation="Avoid using eval/exec. Use safer alternatives like ast.literal_eval()",
                                cwe_id="CWE-94",
                            ))

                elif isinstance(node, ast.FunctionDef):
                    # Check for hardcoded secrets in function arguments
                    for arg in node.args.args:
                        if arg.arg in ['password', 'secret', 'key', 'token']:
                            # Check if default value is hardcoded
                            defaults = node.args.defaults
                            if defaults and len(defaults) == len(node.args.args):
                                for default in defaults:
                                    if isinstance(default, ast.Constant) and default.value:
                                        vulnerabilities.append(SecurityVulnerability(
                                            type="hardcoded_secret",
                                            severity=VulnerabilitySeverity.HIGH,
                                            line=node.lineno,
                                            column=node.col_offset,
                                            code_snippet=f"def {node.name}({arg.arg}: str = ...)",
                                            description=f"Hardcoded secret detected in parameter '{arg.arg}'",
                                            recommendation="Use environment variables or secure configuration management",
                                            cwe_id="CWE-798",
                                        ))

            # Check for SQL injection patterns
            sql_patterns = [
                r'execute\s*\(\s*["\'].*?\+.*?["\']',
                r'cursor\.execute\s*\(\s*["\'].*?\+.*?["\']',
                r'query\s*\(\s*["\'].*?\+.*?["\']',
            ]

            for pattern in sql_patterns:
                matches = re.finditer(pattern, code, re.IGNORECASE | re.MULTILINE)
                for match in matches:
                    line_num = code[:match.start()].count('\n') + 1
                    vulnerabilities.append(SecurityVulnerability(
                        type="sql_injection",
                        severity=VulnerabilitySeverity.HIGH,
                        line=line_num,
                        column=match.start() - code.rfind('\n', 0, match.start()) - 1,
                        code_snippet=match.group()[:100],
                        description="Potential SQL injection vulnerability",
                        recommendation="Use parameterized queries or prepared statements",
                        cwe_id="CWE-89",
                    ))

            # Check for path traversal
            path_patterns = [
                r'open\s*\(\s*["\'].*?\.\.',
                r'file\s*\(\s*["\'].*?\.\.',
                r'Path\s*\(\s*["\'].*?\.\.',
            ]

            for pattern in path_patterns:
                matches = re.finditer(pattern, code, re.IGNORECASE | re.MULTILINE)
                for match in matches:
                    line_num = code[:match.start()].count('\n') + 1
                    vulnerabilities.append(SecurityVulnerability(
                        type="path_traversal",
                        severity=VulnerabilitySeverity.MEDIUM,
                        line=line_num,
                        column=match.start() - code.rfind('\n', 0, match.start()) - 1,
                        code_snippet=match.group()[:100],
                        description="Potential path traversal vulnerability",
                        recommendation="Validate and sanitize file paths",
                        cwe_id="CWE-22",
                    ))

        except SyntaxError as e:
            vulnerabilities.append(SecurityVulnerability(
                type="syntax_error",
                severity=VulnerabilitySeverity.INFO,
                line=e.lineno or 0,
                column=e.offset or 0,
                code_snippet="",
                description=f"Syntax error prevents complete security analysis: {e}",
                recommendation="Fix syntax errors to enable complete analysis",
            ))

        return vulnerabilities

    async def _analyze_javascript_security(self, code: str) -> List[SecurityVulnerability]:
        """Analyze JavaScript/TypeScript code for security vulnerabilities."""
        vulnerabilities = []

        # Check for eval usage
        eval_pattern = r'eval\s*\('
        matches = re.finditer(eval_pattern, code, re.IGNORECASE | re.MULTILINE)
        for match in matches:
            line_num = code[:match.start()].count('\n') + 1
            vulnerabilities.append(SecurityVulnerability(
                type="code_injection",
                severity=VulnerabilitySeverity.HIGH,
                line=line_num,
                column=match.start() - code.rfind('\n', 0, match.start()) - 1,
                code_snippet=match.group(),
                description="Use of eval() can lead to code injection attacks",
                recommendation="Avoid using eval(). Use safer alternatives like JSON.parse()",
                cwe_id="CWE-94",
            ))

        # Check for innerHTML usage (XSS)
        xss_patterns = [
            r'\.innerHTML\s*=',
            r'\.outerHTML\s*=',
            r'document\.write\s*\(',
        ]

        for pattern in xss_patterns:
            matches = re.finditer(pattern, code, re.IGNORECASE | re.MULTILINE)
            for match in matches:
                line_num = code[:match.start()].count('\n') + 1
                vulnerabilities.append(SecurityVulnerability(
                    type="xss",
                    severity=VulnerabilitySeverity.HIGH,
                    line=line_num,
                    column=match.start() - code.rfind('\n', 0, match.start()) - 1,
                    code_snippet=match.group(),
                    description="Potential XSS vulnerability - direct HTML manipulation",
                    recommendation="Use textContent or sanitize HTML before insertion",
                    cwe_id="CWE-79",
                ))

        # Check for hardcoded secrets
        secret_patterns = [
            r'(password|secret|key|token)\s*[:=]\s*["\'][^"\']+["\']',
            r'(api_key|private_key)\s*[:=]\s*["\'][^"\']+["\']',
        ]

        for pattern in secret_patterns:
            matches = re.finditer(pattern, code, re.IGNORECASE | re.MULTILINE)
            for match in matches:
                line_num = code[:match.start()].count('\n') + 1
                vulnerabilities.append(SecurityVulnerability(
                    type="hardcoded_secret",
                    severity=VulnerabilitySeverity.HIGH,
                    line=line_num,
                    column=match.start() - code.rfind('\n', 0, match.start()) - 1,
                    code_snippet=match.group()[:100],
                    description="Hardcoded secret detected",
                    recommendation="Use environment variables or secure configuration management",
                    cwe_id="CWE-798",
                ))

        return vulnerabilities

    async def _analyze_java_security(self, code: str) -> List[SecurityVulnerability]:
        """Analyze Java code for security vulnerabilities."""
        vulnerabilities = []

        # Check for SQL injection in JDBC
        sql_patterns = [
            r'executeQuery\s*\(\s*["\'].*?\+.*?["\']',
            r'execute\s*\(\s*["\'].*?\+.*?["\']',
            r'executeUpdate\s*\(\s*["\'].*?\+.*?["\']',
        ]

        for pattern in sql_patterns:
            matches = re.finditer(pattern, code, re.IGNORECASE | re.MULTILINE)
            for match in matches:
                line_num = code[:match.start()].count('\n') + 1
                vulnerabilities.append(SecurityVulnerability(
                    type="sql_injection",
                    severity=VulnerabilitySeverity.HIGH,
                    line=line_num,
                    column=match.start() - code.rfind('\n', 0, match.start()) - 1,
                    code_snippet=match.group()[:100],
                    description="Potential SQL injection vulnerability",
                    recommendation="Use PreparedStatement with parameterized queries",
                    cwe_id="CWE-89",
                ))

        # Check for deserialization vulnerabilities
        deserialization_patterns = [
            r'ObjectInputStream',
            r'XMLDecoder',
            r'readObject\s*\(',
        ]

        for pattern in deserialization_patterns:
            matches = re.finditer(pattern, code, re.IGNORECASE | re.MULTILINE)
            for match in matches:
                line_num = code[:match.start()].count('\n') + 1
                vulnerabilities.append(SecurityVulnerability(
                    type="deserialization",
                    severity=VulnerabilitySeverity.HIGH,
                    line=line_num,
                    column=match.start() - code.rfind('\n', 0, match.start()) - 1,
                    code_snippet=match.group(),
                    description="Potential unsafe deserialization",
                    recommendation="Validate input and use safe deserialization practices",
                    cwe_id="CWE-502",
                ))

        return vulnerabilities

    async def _analyze_cpp_security(self, code: str) -> List[SecurityVulnerability]:
        """Analyze C/C++ code for security vulnerabilities."""
        vulnerabilities = []

        # Check for buffer overflow vulnerabilities
        unsafe_functions = [
            'strcpy', 'strcat', 'sprintf', 'vsprintf', 'gets', 'scanf',
            'strncpy', 'strncat', 'snprintf', 'fgets'
        ]

        for func in unsafe_functions:
            pattern = rf'\b{func}\s*\('
            matches = re.finditer(pattern, code, re.MULTILINE)
            for match in matches:
                line_num = code[:match.start()].count('\n') + 1
                severity = VulnerabilitySeverity.HIGH if func in ['strcpy', 'strcat', 'gets'] else VulnerabilitySeverity.MEDIUM
                vulnerabilities.append(SecurityVulnerability(
                    type="buffer_overflow",
                    severity=severity,
                    line=line_num,
                    column=match.start() - code.rfind('\n', 0, match.start()) - 1,
                    code_snippet=match.group(),
                    description=f"Potentially unsafe function '{func}' usage",
                    recommendation=f"Use safer alternatives like {func.replace('str', 'strn').replace('cpy', 'cpy_s')}",
                    cwe_id="CWE-120",
                ))

        # Check for format string vulnerabilities
        format_patterns = [
            r'printf\s*\(\s*[^,]*\+',
            r'sprintf\s*\(\s*[^,]*\+',
            r'fprintf\s*\(\s*[^,]*\+',
        ]

        for pattern in format_patterns:
            matches = re.finditer(pattern, code, re.MULTILINE)
            for match in matches:
                line_num = code[:match.start()].count('\n') + 1
                vulnerabilities.append(SecurityVulnerability(
                    type="format_string",
                    severity=VulnerabilitySeverity.HIGH,
                    line=line_num,
                    column=match.start() - code.rfind('\n', 0, match.start()) - 1,
                    code_snippet=match.group(),
                    description="Potential format string vulnerability",
                    recommendation="Use format string specifiers and validate input",
                    cwe_id="CWE-134",
                ))

        return vulnerabilities

    async def _analyze_sql_security(self, code: str) -> List[SecurityVulnerability]:
        """Analyze SQL code for security vulnerabilities."""
        vulnerabilities = []

        # Check for SQL injection patterns in dynamic SQL
        dynamic_patterns = [
            r'EXEC\s*\(\s*@.*?\+',
            r'EXECUTE\s*\(\s*@.*?\+',
            r'sp_executesql\s*.*?\+',
        ]

        for pattern in dynamic_patterns:
            matches = re.finditer(pattern, code, re.IGNORECASE | re.MULTILINE)
            for match in matches:
                line_num = code[:match.start()].count('\n') + 1
                vulnerabilities.append(SecurityVulnerability(
                    type="sql_injection",
                    severity=VulnerabilitySeverity.HIGH,
                    line=line_num,
                    column=match.start() - code.rfind('\n', 0, match.start()) - 1,
                    code_snippet=match.group()[:100],
                    description="Dynamic SQL construction vulnerable to injection",
                    recommendation="Use parameterized queries or sp_executesql with parameters",
                    cwe_id="CWE-89",
                ))

        return vulnerabilities

    async def _analyze_general_security_patterns(self, code: str, language: str) -> List[SecurityVulnerability]:
        """Analyze general security patterns applicable to all languages."""
        vulnerabilities = []

        # Check for hardcoded credentials
        credential_patterns = [
            r'(password|passwd|pwd)\s*[:=]\s*["\'][^"\']{6,}["\']',
            r'(secret|key|token)\s*[:=]\s*["\'][^"\']{10,}["\']',
            r'(api_key|apikey)\s*[:=]\s*["\'][^"\']{15,}["\']',
        ]

        for pattern in credential_patterns:
            matches = re.finditer(pattern, code, re.IGNORECASE | re.MULTILINE)
            for match in matches:
                # Skip if it looks like a placeholder or example
                matched_text = match.group().lower()
                if any(placeholder in matched_text for placeholder in ['example', 'test', 'dummy', 'xxx', '...']):
                    continue

                line_num = code[:match.start()].count('\n') + 1
                vulnerabilities.append(SecurityVulnerability(
                    type="hardcoded_credentials",
                    severity=VulnerabilitySeverity.HIGH,
                    line=line_num,
                    column=match.start() - code.rfind('\n', 0, match.start()) - 1,
                    code_snippet=match.group()[:100],
                    description="Hardcoded credentials detected",
                    recommendation="Use environment variables or secure credential management",
                    cwe_id="CWE-798",
                ))

        # Check for weak cryptographic practices
        weak_crypto_patterns = [
            r'md5\s*\(',
            r'sha1\s*\(',
            r'des_encrypt\s*\(',
            r'rc4_encrypt\s*\(',
        ]

        for pattern in weak_crypto_patterns:
            matches = re.finditer(pattern, code, re.IGNORECASE | re.MULTILINE)
            for match in matches:
                line_num = code[:match.start()].count('\n') + 1
                vulnerabilities.append(SecurityVulnerability(
                    type="weak_cryptography",
                    severity=VulnerabilitySeverity.MEDIUM,
                    line=line_num,
                    column=match.start() - code.rfind('\n', 0, match.start()) - 1,
                    code_snippet=match.group(),
                    description="Weak cryptographic algorithm detected",
                    recommendation="Use strong cryptographic algorithms like SHA-256 or AES-256",
                    cwe_id="CWE-327",
                ))

        return vulnerabilities

    async def _analyze_security_context(
        self,
        code: str,
        language: str,
        file_path: str,
    ) -> List[SecurityVulnerability]:
        """Analyze security based on file context."""
        vulnerabilities = []

        file_path = Path(file_path)
        file_name = file_path.name.lower()

        # Check for sensitive file patterns
        sensitive_patterns = {
            'config': ['config', 'settings', 'env'],
            'auth': ['auth', 'login', 'password'],
            'database': ['database', 'db', 'migration'],
            'crypto': ['crypto', 'encrypt', 'decrypt', 'hash'],
        }

        for category, patterns in sensitive_patterns.items():
            if any(pattern in file_name for pattern in patterns):
                # Apply category-specific security checks
                if category == 'config':
                    vulnerabilities.extend(await self._check_config_security(code))
                elif category == 'auth':
                    vulnerabilities.extend(await self._check_auth_security(code))
                elif category == 'database':
                    vulnerabilities.extend(await self._check_database_security(code))
                elif category == 'crypto':
                    vulnerabilities.extend(await self._check_crypto_security(code))

        return vulnerabilities

    async def _check_config_security(self, code: str) -> List[SecurityVulnerability]:
        """Check configuration files for security issues."""
        vulnerabilities = []

        # Check for exposed database credentials
        db_patterns = [
            r'(database|db)_url\s*[:=]\s*["\'][^"\']*://[^:]+:[^@]+@[^"\']+["\']',
            r'(username|user)\s*[:=]\s*["\'][^"\']+["\']',
            r'(password|pass)\s*[:=]\s*["\'][^"\']+["\']',
        ]

        for pattern in db_patterns:
            matches = re.finditer(pattern, code, re.IGNORECASE | re.MULTILINE)
            for match in matches:
                line_num = code[:match.start()].count('\n') + 1
                vulnerabilities.append(SecurityVulnerability(
                    type="exposed_database_credentials",
                    severity=VulnerabilitySeverity.HIGH,
                    line=line_num,
                    column=match.start() - code.rfind('\n', 0, match.start()) - 1,
                    code_snippet=match.group()[:100],
                    description="Database credentials exposed in configuration",
                    recommendation="Use environment variables or secure credential storage",
                    cwe_id="CWE-798",
                ))

        return vulnerabilities

    async def _check_auth_security(self, code: str) -> List[SecurityVulnerability]:
        """Check authentication code for security issues."""
        vulnerabilities = []

        # Check for hardcoded authentication tokens
        token_patterns = [
            r'(jwt|token)\s*[:=]\s*["\'][A-Za-z0-9+/=]{20,}["\']',
            r'(bearer|basic)\s+["\'][A-Za-z0-9+/=]{10,}["\']',
        ]

        for pattern in token_patterns:
            matches = re.finditer(pattern, code, re.IGNORECASE | re.MULTILINE)
            for match in matches:
                line_num = code[:match.start()].count('\n') + 1
                vulnerabilities.append(SecurityVulnerability(
                    type="hardcoded_auth_token",
                    severity=VulnerabilitySeverity.HIGH,
                    line=line_num,
                    column=match.start() - code.rfind('\n', 0, match.start()) - 1,
                    code_snippet=match.group()[:100],
                    description="Hardcoded authentication token detected",
                    recommendation="Use secure token generation and storage mechanisms",
                    cwe_id="CWE-798",
                ))

        return vulnerabilities

    async def _check_database_security(self, code: str) -> List[SecurityVulnerability]:
        """Check database code for security issues."""
        # This would contain database-specific security checks
        return []

    async def _check_crypto_security(self, code: str) -> List[SecurityVulnerability]:
        """Check cryptographic code for security issues."""
        # This would contain crypto-specific security checks
        return []

    def _categorize_vulnerabilities(self, vulnerabilities: List[SecurityVulnerability]) -> Dict[str, List[SecurityVulnerability]]:
        """Categorize vulnerabilities by type."""
        categories = {}
        for vuln in vulnerabilities:
            if vuln.type not in categories:
                categories[vuln.type] = []
            categories[vuln.type].append(vuln)
        return categories

    def _calculate_security_risk_score(self, vulnerabilities: List[SecurityVulnerability]) -> float:
        """Calculate overall security risk score."""
        if not vulnerabilities:
            return 0.0

        severity_weights = {
            VulnerabilitySeverity.CRITICAL: 10.0,
            VulnerabilitySeverity.HIGH: 7.0,
            VulnerabilitySeverity.MEDIUM: 4.0,
            VulnerabilitySeverity.LOW: 1.0,
            VulnerabilitySeverity.INFO: 0.1,
        }

        total_score = sum(severity_weights[vuln.severity] for vuln in vulnerabilities)
        max_possible_score = len(vulnerabilities) * 10.0

        # Normalize to 0-100 scale
        normalized_score = (total_score / max_possible_score) * 100 if max_possible_score > 0 else 0.0

        return min(normalized_score, 100.0)

    async def _analyze_performance(
        self,
        code: str,
        language: str,
        file_path: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Analyze code for performance issues."""
        performance_issues = []

        try:
            # Language-specific performance analysis
            if language == "python":
                performance_issues.extend(await self._analyze_python_performance(code))
            elif language in ["javascript", "typescript"]:
                performance_issues.extend(await self._analyze_javascript_performance(code))
            elif language == "java":
                performance_issues.extend(await self._analyze_java_performance(code))
            elif language in ["cpp", "c"]:
                performance_issues.extend(await self._analyze_cpp_performance(code))

            # General performance pattern analysis
            performance_issues.extend(await self._analyze_general_performance_patterns(code, language))

            # Algorithmic complexity analysis
            complexity_issues = await self._analyze_algorithmic_complexity(code, language)
            performance_issues.extend(complexity_issues)

            # Categorize performance issues
            categorized_issues = self._categorize_performance_issues(performance_issues)

            return {
                "performance_issues": [issue.__dict__ for issue in performance_issues[:15]],  # Top 15
                "summary": {
                    "total": len(performance_issues),
                    "critical": len([i for i in performance_issues if i.severity == "critical"]),
                    "high": len([i for i in performance_issues if i.severity == "high"]),
                    "medium": len([i for i in performance_issues if i.severity == "medium"]),
                    "low": len([i for i in performance_issues if i.severity == "low"]),
                },
                "categorized": categorized_issues,
                "performance_score": self._calculate_performance_score(performance_issues),
            }

        except Exception as e:
            return {"error": f"Performance analysis failed: {e}"}

    async def _analyze_python_performance(self, code: str) -> List[PerformanceIssue]:
        """Analyze Python code for performance issues."""
        issues = []

        # Check for inefficient loops
        loop_patterns = [
            r'for\s+\w+\s+in\s+range\(len\(',
            r'for\s+\w+\s+in\s+\w+\.keys\(\)',
            r'for\s+\w+\s+in\s+\w+\.values\(\)',
        ]

        for pattern in loop_patterns:
            matches = re.finditer(pattern, code, re.MULTILINE)
            for match in matches:
                line_num = code[:match.start()].count('\n') + 1
                issues.append(PerformanceIssue(
                    type=PerformanceIssueType.INEFFICIENT_ALGORITHM,
                    severity="medium",
                    line=line_num,
                    column=match.start() - code.rfind('\n', 0, match.start()) - 1,
                    code_snippet=match.group(),
                    description="Inefficient loop pattern detected",
                    recommendation="Use more efficient iteration methods or list comprehensions",
                    estimated_impact="Medium - O(n) vs O(1) access patterns",
                ))

        # Check for string concatenation in loops
        string_concat_pattern = r'(\w+)\s*\+=\s*["\']'
        in_loop = False
        lines = code.split('\n')
        for i, line in enumerate(lines):
            if re.search(r'\bfor\b|\bwhile\b', line):
                in_loop = True
            elif line.strip() == '' or not line.startswith(' '):
                in_loop = False

            if in_loop and re.search(string_concat_pattern, line):
                issues.append(PerformanceIssue(
                    type=PerformanceIssueType.INEFFICIENT_ALGORITHM,
                    severity="medium",
                    line=i + 1,
                    column=0,
                    code_snippet=line.strip(),
                    description="String concatenation in loop detected",
                    recommendation="Use list and join() or StringIO for efficient string building",
                    estimated_impact="Medium - O(n²) complexity",
                ))

        # Check for global variable usage in functions
        global_pattern = r'global\s+\w+'
        matches = re.finditer(global_pattern, code, re.MULTILINE)
        for match in matches:
            line_num = code[:match.start()].count('\n') + 1
            issues.append(PerformanceIssue(
                type=PerformanceIssueType.INEFFICIENT_ALGORITHM,
                severity="low",
                line=line_num,
                column=match.start() - code.rfind('\n', 0, match.start()) - 1,
                code_snippet=match.group(),
                description="Global variable usage detected",
                recommendation="Minimize global variable usage for better performance",
                estimated_impact="Low - Potential cache misses",
            ))

        return issues

    async def _analyze_javascript_performance(self, code: str) -> List[PerformanceIssue]:
        """Analyze JavaScript/TypeScript code for performance issues."""
        issues = []

        # Check for synchronous I/O operations
        sync_patterns = [
            r'readFileSync\s*\(',
            r'writeFileSync\s*\(',
            r'execSync\s*\(',
        ]

        for pattern in sync_patterns:
            matches = re.finditer(pattern, code, re.MULTILINE)
            for match in matches:
                line_num = code[:match.start()].count('\n') + 1
                issues.append(PerformanceIssue(
                    type=PerformanceIssueType.SYNC_BLOCKING,
                    severity="high",
                    line=line_num,
                    column=match.start() - code.rfind('\n', 0, match.start()) - 1,
                    code_snippet=match.group(),
                    description="Synchronous I/O operation detected",
                    recommendation="Use asynchronous alternatives (fs.promises or async/await)",
                    estimated_impact="High - Blocks event loop",
                ))

        # Check for DOM manipulation in loops
        dom_patterns = [
            r'\.appendChild\s*\(',
            r'\.innerHTML\s*=',
            r'\.createElement\s*\(',
        ]

        lines = code.split('\n')
        for i, line in enumerate(lines):
            if re.search(r'\bfor\b|\bwhile\b', line):
                # Check next few lines for DOM operations
                for j in range(i + 1, min(i + 5, len(lines))):
                    for pattern in dom_patterns:
                        if re.search(pattern, lines[j]):
                            issues.append(PerformanceIssue(
                                type=PerformanceIssueType.INEFFICIENT_ALGORITHM,
                                severity="high",
                                line=j + 1,
                                column=0,
                                code_snippet=lines[j].strip(),
                                description="DOM manipulation inside loop detected",
                                recommendation="Batch DOM operations or use DocumentFragment",
                                estimated_impact="High - Expensive reflows/repaints",
                            ))
                            break

        return issues

    async def _analyze_java_performance(self, code: str) -> List[PerformanceIssue]:
        """Analyze Java code for performance issues."""
        issues = []

        # Check for inefficient string concatenation
        string_concat_pattern = r'\bString\s+\w+\s*=\s*\w+\s*\+.*?;'
        matches = re.finditer(string_concat_pattern, code, re.MULTILINE)
        for match in matches:
            line_num = code[:match.start()].count('\n') + 1
            issues.append(PerformanceIssue(
                type=PerformanceIssueType.INEFFICIENT_ALGORITHM,
                severity="medium",
                line=line_num,
                column=match.start() - code.rfind('\n', 0, match.start()) - 1,
                code_snippet=match.group(),
                description="Inefficient string concatenation detected",
                recommendation="Use StringBuilder for string concatenation",
                estimated_impact="Medium - Creates multiple String objects",
            ))

        return issues

    async def _analyze_cpp_performance(self, code: str) -> List[PerformanceIssue]:
        """Analyze C/C++ code for performance issues."""
        issues = []

        # Check for unnecessary memory allocations
        malloc_patterns = [
            r'malloc\s*\(\s*[^)]+\s*\)',
            r'new\s+\w+',
        ]

        for pattern in malloc_patterns:
            matches = re.finditer(pattern, code, re.MULTILINE)
            for match in matches:
                line_num = code[:match.start()].count('\n') + 1
                issues.append(PerformanceIssue(
                    type=PerformanceIssueType.RESOURCE_WASTE,
                    severity="medium",
                    line=line_num,
                    column=match.start() - code.rfind('\n', 0, match.start()) - 1,
                    code_snippet=match.group(),
                    description="Dynamic memory allocation detected",
                    recommendation="Consider stack allocation or memory pooling",
                    estimated_impact="Medium - Heap allocation overhead",
                ))

        return issues

    async def _analyze_general_performance_patterns(self, code: str, language: str) -> List[PerformanceIssue]:
        """Analyze general performance patterns."""
        issues = []

        # Check for deep nesting
        lines = code.split('\n')
        max_depth = 0
        current_depth = 0

        for i, line in enumerate(lines):
            # Count opening and closing braces/keywords
            open_count = line.count('{') + line.count('(') + sum(1 for kw in ['if', 'for', 'while', 'try'] if kw in line)
            close_count = line.count('}') + line.count(')')

            current_depth += open_count - close_count
            max_depth = max(max_depth, current_depth)

            if max_depth > 5:
                issues.append(PerformanceIssue(
                    type=PerformanceIssueType.INEFFICIENT_ALGORITHM,
                    severity="low",
                    line=i + 1,
                    column=0,
                    code_snippet=line.strip(),
                    description=f"Deep nesting detected (depth: {max_depth})",
                    recommendation="Consider refactoring to reduce nesting complexity",
                    estimated_impact="Low - Reduced code readability and maintainability",
                ))

        return issues

    async def _analyze_algorithmic_complexity(self, code: str, language: str) -> List[PerformanceIssue]:
        """Analyze algorithmic complexity issues."""
        issues = []

        # Look for nested loops (potential O(n²) complexity)
        nested_loop_pattern = r'for\s*.*?\n.*?for\s*'
        matches = re.finditer(nested_loop_pattern, code, re.MULTILINE | re.DOTALL)
        for match in matches:
            line_num = code[:match.start()].count('\n') + 1
            issues.append(PerformanceIssue(
                type=PerformanceIssueType.INEFFICIENT_ALGORITHM,
                severity="medium",
                line=line_num,
                column=0,
                code_snippet=match.group()[:100],
                description="Nested loops detected - potential O(n²) complexity",
                recommendation="Consider optimizing algorithm or using more efficient data structures",
                estimated_impact="Medium - Quadratic time complexity",
            ))

        return issues

    def _categorize_performance_issues(self, issues: List[PerformanceIssue]) -> Dict[str, List[PerformanceIssue]]:
        """Categorize performance issues by type."""
        categories = {}
        for issue in issues:
            if issue.type.value not in categories:
                categories[issue.type.value] = []
            categories[issue.type.value].append(issue)
        return categories

    def _calculate_performance_score(self, issues: List[PerformanceIssue]) -> float:
        """Calculate overall performance score."""
        if not issues:
            return 100.0

        severity_weights = {
            "critical": 20.0,
            "high": 15.0,
            "medium": 10.0,
            "low": 5.0,
        }

        total_penalty = sum(severity_weights.get(issue.severity, 5.0) for issue in issues)
        score = max(0.0, 100.0 - total_penalty)

        return score

    async def _analyze_quality(
        self,
        code: str,
        language: str,
        file_path: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Analyze code quality metrics."""
        quality_metrics = []

        try:
            # Calculate basic metrics
            lines = code.split('\n')
            total_lines = len(lines)
            non_empty_lines = len([line for line in lines if line.strip()])
            comment_lines = len([line for line in lines if line.strip().startswith('#') or
                               line.strip().startswith('//') or
                               line.strip().startswith('/*') or
                               line.strip().startswith('*')])

            # Comment ratio
            comment_ratio = comment_lines / non_empty_lines if non_empty_lines > 0 else 0
            quality_metrics.append(CodeQualityMetric(
                name="comment_ratio",
                value=comment_ratio,
                threshold=0.15,
                status="good" if comment_ratio >= 0.15 else "warning" if comment_ratio >= 0.10 else "critical",
                description="Ratio of comment lines to code lines"
            ))

            # Function length analysis (simplified)
            if language == "python":
                func_lengths = []
                current_func_lines = 0
                in_function = False

                for line in lines:
                    if re.search(r'def\s+\w+', line):
                        in_function = True
                        current_func_lines = 1
                    elif in_function:
                        if line.strip() and not line.startswith(' '):
                            in_function = False
                            if current_func_lines > 0:
                                func_lengths.append(current_func_lines)
                        else:
                            current_func_lines += 1

                if func_lengths:
                    avg_func_length = sum(func_lengths) / len(func_lengths)
                    max_func_length = max(func_lengths)

                    quality_metrics.append(CodeQualityMetric(
                        name="average_function_length",
                        value=avg_func_length,
                        threshold=30.0,
                        status="good" if avg_func_length <= 30 else "warning" if avg_func_length <= 50 else "critical",
                        description="Average number of lines per function"
                    ))

                    quality_metrics.append(CodeQualityMetric(
                        name="max_function_length",
                        value=max_func_length,
                        threshold=100.0,
                        status="good" if max_func_length <= 100 else "warning" if max_func_length <= 200 else "critical",
                        description="Maximum function length"
                    ))

            # Calculate overall quality score
            overall_score = self._calculate_quality_score(quality_metrics)

            return {
                "metrics": [metric.__dict__ for metric in quality_metrics],
                "overall_score": overall_score,
                "summary": {
                    "total_metrics": len(quality_metrics),
                    "critical_issues": len([m for m in quality_metrics if m.status == "critical"]),
                    "warnings": len([m for m in quality_metrics if m.status == "warning"]),
                    "good_metrics": len([m for m in quality_metrics if m.status == "good"]),
                }
            }

        except Exception as e:
            return {"error": f"Quality analysis failed: {e}"}

    def _calculate_quality_score(self, metrics: List[CodeQualityMetric]) -> float:
        """Calculate overall quality score."""
        if not metrics:
            return 100.0

        total_score = 0.0
        for metric in metrics:
            if metric.status == "good":
                total_score += 100.0
            elif metric.status == "warning":
                total_score += 70.0
            elif metric.status == "critical":
                total_score += 30.0

        return total_score / len(metrics)

    async def _analyze_architecture(
        self,
        code: str,
        language: str,
        file_path: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Analyze architectural patterns."""
        patterns = []

        try:
            # Detect design patterns (simplified)
            if language == "python":
                patterns.extend(await self._detect_python_patterns(code))
            elif language == "java":
                patterns.extend(await self._detect_java_patterns(code))

            return {
                "patterns": [pattern.__dict__ for pattern in patterns],
                "summary": {
                    "total_patterns": len(patterns),
                    "pattern_types": list(set(p.pattern_type for p in patterns)),
                }
            }

        except Exception as e:
            return {"error": f"Architectural analysis failed: {e}"}

    async def _detect_python_patterns(self, code: str) -> List[ArchitecturalPattern]:
        """Detect Python design patterns."""
        patterns = []

        # Singleton pattern detection
        if re.search(r'class\s+\w+.*?:.*?_instance\s*=.*?def\s+__new__', code, re.DOTALL):
            patterns.append(ArchitecturalPattern(
                pattern_name="Singleton",
                pattern_type="Creational",
                line=code.find('class'),
                confidence=0.8,
                description="Singleton design pattern detected",
                related_components=[]
            ))

        # Factory pattern detection
        if re.search(r'create_\w+|get_\w+.*?return\s+\w+\(\)', code):
            patterns.append(ArchitecturalPattern(
                pattern_name="Factory",
                pattern_type="Creational",
                line=code.find('create_') if 'create_' in code else code.find('get_'),
                confidence=0.6,
                description="Factory-like method detected",
                related_components=[]
            ))

        return patterns

    async def _detect_java_patterns(self, code: str) -> List[ArchitecturalPattern]:
        """Detect Java design patterns."""
        patterns = []

        # Singleton pattern detection
        if re.search(r'private\s+static\s+\w+\s+instance.*?private\s+\w+\(\)', code, re.DOTALL):
            patterns.append(ArchitecturalPattern(
                pattern_name="Singleton",
                pattern_type="Creational",
                line=code.find('private static'),
                confidence=0.9,
                description="Singleton design pattern detected",
                related_components=[]
            ))

        return patterns

    async def _generate_recommendations(self, analysis_results: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate improvement recommendations."""
        recommendations = []

        # Security recommendations
        security_analysis = analysis_results.get("security_analysis", {})
        if isinstance(security_analysis, dict) and "summary" in security_analysis:
            summary = security_analysis["summary"]
            if summary.get("critical", 0) > 0 or summary.get("high", 0) > 0:
                recommendations.append({
                    "type": "security",
                    "priority": "high",
                    "title": "Address Security Vulnerabilities",
                    "description": f"Found {summary.get('critical', 0)} critical and {summary.get('high', 0)} high severity security issues",
                    "actions": [
                        "Review and fix all critical and high severity vulnerabilities",
                        "Implement secure coding practices",
                        "Add security testing to CI/CD pipeline",
                        "Conduct regular security audits"
                    ]
                })

        # Performance recommendations
        performance_analysis = analysis_results.get("performance_analysis", {})
        if isinstance(performance_analysis, dict) and "summary" in performance_analysis:
            summary = performance_analysis["summary"]
            if summary.get("critical", 0) > 0 or summary.get("high", 0) > 0:
                recommendations.append({
                    "type": "performance",
                    "priority": "medium",
                    "title": "Optimize Performance Issues",
                    "description": f"Found {summary.get('total', 0)} performance issues",
                    "actions": [
                        "Profile the application to identify bottlenecks",
                        "Optimize critical path algorithms",
                        "Implement caching where appropriate",
                        "Consider asynchronous processing for I/O operations"
                    ]
                })

        # Quality recommendations
        quality_analysis = analysis_results.get("quality_analysis", {})
        if isinstance(quality_analysis, dict) and "overall_score" in quality_analysis:
            score = quality_analysis["overall_score"]
            if score < 70:
                recommendations.append({
                    "type": "quality",
                    "priority": "medium",
                    "title": "Improve Code Quality",
                    "description": f"Code quality score is {score:.1f}/100",
                    "actions": [
                        "Add more comments and documentation",
                        "Refactor long functions",
                        "Improve naming conventions",
                        "Add unit tests"
                    ]
                })

        return recommendations

    async def _calculate_overall_score(self, analysis_results: Dict[str, Any]) -> float:
        """Calculate overall code analysis score."""
        scores = []

        # Security score (inverted - lower risk is better)
        security_analysis = analysis_results.get("security_analysis", {})
        if isinstance(security_analysis, dict) and "risk_score" in security_analysis:
            security_score = max(0, 100 - security_analysis["risk_score"])
            scores.append(("security", security_score, 0.3))

        # Performance score
        performance_analysis = analysis_results.get("performance_analysis", {})
        if isinstance(performance_analysis, dict) and "performance_score" in performance_analysis:
            performance_score = performance_analysis["performance_score"]
            scores.append(("performance", performance_score, 0.3))

        # Quality score
        quality_analysis = analysis_results.get("quality_analysis", {})
        if isinstance(quality_analysis, dict) and "overall_score" in quality_analysis:
            quality_score = quality_analysis["overall_score"]
            scores.append(("quality", quality_score, 0.2))

        # Basic metrics score
        basic_analysis = analysis_results.get("basic_analysis", {})
        if isinstance(basic_analysis, dict) and "metrics" in basic_analysis:
            metrics = basic_analysis["metrics"]
            maintainability = metrics.get("maintainability_index", 50)
            basic_score = min(100, maintainability)
            scores.append(("basic", basic_score, 0.2))

        # Calculate weighted average
        if scores:
            weighted_score = sum(score * weight for _, score, weight in scores)
            return round(weighted_score, 1)
        else:
            return 50.0  # Default score

    def _load_security_patterns(self) -> Dict[str, Any]:
        """Load security vulnerability patterns."""
        # This would load from a comprehensive pattern database
        return {}

    def _load_vulnerability_database(self) -> Dict[str, Any]:
        """Load vulnerability database."""
        # This would load from a comprehensive vulnerability database
        return {}

    def _load_performance_patterns(self) -> Dict[str, Any]:
        """Load performance issue patterns."""
        # This would load from a comprehensive performance pattern database
        return {}

    def _initialize_complexity_analyzers(self) -> Dict[str, Any]:
        """Initialize complexity analyzers."""
        return {}

    def _initialize_quality_metrics(self) -> Dict[str, Any]:
        """Initialize quality metrics."""
        return {}

    def _initialize_style_checkers(self) -> Dict[str, Any]:
        """Initialize style checkers."""
        return {}

    def _load_architectural_patterns(self) -> Dict[str, Any]:
        """Load architectural pattern definitions."""
        return {}