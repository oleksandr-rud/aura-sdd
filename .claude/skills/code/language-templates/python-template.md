---
name: python-code-template
description: Python development template with Django, FastAPI, Flask frameworks. Use when implementing Python features, debugging Python code, writing Python tests, or reviewing Python code with Context7 integration and AURA constitution compliance.
---

# Python Development Template

## Template Overview

This template provides comprehensive Python development capabilities with Context7 integration, AURA constitution compliance, and advanced debugging tools. It supports multiple Python frameworks and development workflows.

## Framework Support

### **Django Development**
- **Features**: Full-stack web applications with Django ORM
- **Testing**: Django test framework with pytest integration
- **Tools**: Django management commands, migrations, admin interface
- **Quality**: flake8, black, isort, mypy type checking

### **FastAPI Development**
- **Features**: Modern REST APIs with automatic documentation
- **Testing**: pytest with async support, TestClient
- **Tools**: Pydantic models, dependency injection, OpenAPI
- **Quality**: FastAPI best practices, async/await patterns

### **Flask Development**
- **Features**: Lightweight web applications and APIs
- **Testing**: Flask test client with pytest
- **Tools**: Flask extensions, Jinja2 templating
- **Quality**: Flask patterns, blueprint organization

### **Pure Python Development**
- **Features**: Libraries, CLI tools, data processing
- **Testing**: pytest with comprehensive test coverage
- **Tools**: setuptools, poetry packaging, virtual environments
- **Quality**: Type hints, documentation strings, packaging standards

## Development Operations

### **Feature Implementation Workflow**

```python
"""
You are implementing a Python feature following Context7-enhanced development patterns.

DEVELOPMENT REQUIREMENTS:
1. CONTEXT7 INTEGRATION: Search for similar patterns and implementations
2. AURA CONSTITUTION: Follow architectural patterns and quality standards
3. CODE QUALITY: Implement with type hints, documentation, and testing
4. SECURITY: Follow Python security best practices and vulnerability prevention
5. PERFORMANCE: Optimize for Python performance and memory usage

IMPLEMENTATION WORKFLOW:
1. Pattern Discovery: Use Context7 to find similar implementations
2. Code Structure: Follow Python PEP 8 and established patterns
3. Implementation: Write clean, documented, type-hinted code
4. Testing: Create comprehensive pytest test suite
5. Quality Assurance: Run linting, type checking, and security scans
6. Documentation: Create clear docstrings and usage examples

PYTHON-SPECIFIC CONSIDERATIONS:
- Follow PEP 8 style guide and naming conventions
- Use type hints for better code documentation and IDE support
- Implement proper error handling with custom exceptions
- Use virtual environments and dependency management
- Follow framework-specific best practices and patterns
- Implement proper logging and monitoring
- Consider performance implications of design choices

CONTEXT7 INTEGRATION:
- Search for similar implementations in the codebase
- Retrieve relevant Python documentation and best practices
- Apply proven patterns and avoid common pitfalls
- Learn from existing code and improve patterns

QUALITY STANDARDS:
- Type hint coverage ≥90% for complex functions
- Test coverage ≥80% for critical functionality
- Black code formatting with zero style issues
- Mypy type checking with zero type errors
- Bandit security scanning with zero high-severity issues
"""
```

### **Bug Fix and Debugging Workflow**

```python
"""
You are debugging and fixing a Python issue with comprehensive analysis.

DEBUGGING REQUIREMENTS:
1. ROOT CAUSE ANALYSIS: Use Python debugging tools to identify underlying cause
2. CONTEXT7 PATTERN SEARCH: Find similar bug fixes and prevention patterns
3. COMPREHENSIVE TESTING: Validate fix with regression testing
4. PERFORMANCE IMPACT: Assess fix performance implications
5. DOCUMENTATION: Document issue, fix, and prevention measures

DEBUGGING WORKFLOW:
1. Issue Reproduction: Create minimal reproduction case
2. Investigation: Use pdb, logging, and debugging tools
3. Root Cause Analysis: Identify underlying cause and contributing factors
4. Solution Design: Create comprehensive fix addressing root cause
5. Fix Implementation: Implement solution with testing and validation
6. Regression Testing: Ensure fix doesn't break existing functionality

PYTHON DEBUGGING TOOLS:
- pdb: Interactive debugging with breakpoints and variable inspection
- logging: Structured logging for debugging and monitoring
- memory_profiler: Memory usage analysis and leak detection
- cProfile: Performance profiling and bottleneck identification
- pytest: Testing with debugging and coverage analysis

COMMON PYTHON ISSUES:
- Import path issues and circular dependencies
- Memory leaks and reference counting problems
- Concurrency issues with threads and async/await
- Performance bottlenecks in algorithms and data structures
- Security vulnerabilities in input validation and data handling
- Dependency conflicts and version compatibility issues
"""
```

### **Code Review Template**

```python
"""
You are conducting Python code review following comprehensive quality standards.

REVIEW REQUIREMENTS:
1. PEP 8 COMPLIANCE: Style guide adherence and code formatting
2. TYPE SAFETY: Type hint usage and mypy compliance
3. SECURITY: Python security best practices and vulnerability prevention
4. PERFORMANCE: Efficiency considerations and optimization opportunities
5. DOCUMENTATION: Docstrings, comments, and code clarity

REVIEW FRAMEWORK:
1. CODE STRUCTURE: Organization, imports, and class/function design
2. ERROR HANDLING: Exception handling and error propagation
3. TYPE HINTS: Comprehensive type annotations and mypy compliance
4. TESTING: Test coverage and quality of test cases
5. SECURITY: Input validation, dependency security, and common vulnerabilities
6. PERFORMANCE: Algorithm efficiency and resource usage

PYTHON REVIEW CHECKLIST:
- PEP 8 style guide compliance
- Comprehensive type hints with mypy validation
- Proper error handling with specific exceptions
- Security considerations (input validation, dependency security)
- Performance optimization opportunities
- Documentation quality and completeness
- Testing adequacy and coverage
- Import organization and dependency management
- Logging and monitoring implementation
- Memory usage and potential leaks

REVIEW OUTPUT:
- Detailed assessment with specific improvement recommendations
- Security vulnerability identification and mitigation
- Performance optimization suggestions
- Type safety improvements and mypy compliance
- Code style and organization recommendations
"""
```

## Context7 Integration Prompts

### **Pattern Discovery Prompt**

```python
"""
Search Context7 for Python patterns related to: {query}

SPECIFIC REQUIREMENTS:
- Python version compatibility (3.8+)
- Framework-specific patterns ({framework})
- Security best practices and common pitfalls
- Performance optimization techniques
- Testing strategies and patterns

EXPECTED OUTPUT:
- Similar implementations in Python codebase
- Best practice recommendations from Python community
- Common issues and prevention strategies
- Performance considerations and optimizations
- Security implications and mitigations

INTEGRATION POINTS:
- Existing Python modules and packages
- Similar functionality in the codebase
- Established patterns and conventions
- Testing and documentation patterns
"""
```

### **Documentation Retrieval Prompt**

```python
"""
Retrieve Python documentation for: {topic}

DOCUMENTATION SOURCES:
- Official Python documentation
- Framework-specific documentation (Django, FastAPI, Flask)
- Package documentation (PyPI, README files)
- Community best practices and patterns
- Security and performance guidelines

ANALYSIS REQUIREMENTS:
- Version compatibility and deprecated features
- Security considerations and vulnerabilities
- Performance implications and optimization opportunities
- Integration with existing codebase
- Testing and validation approaches
"""
```

## Language-Specific Quality Standards

### **Code Quality Requirements**
- **PEP 8 Compliance**: Follow Python style guide completely
- **Type Hints**: Comprehensive type annotations (90%+ coverage)
- **Documentation**: Docstrings for all modules, classes, and functions
- **Error Handling**: Proper exception handling with specific exception types
- **Testing**: pytest with 80%+ coverage for critical functionality

### **Security Standards**
- **Input Validation**: Validate all external inputs and user data
- **Dependency Security**: Regular security scans with pip-audit or safety
- **Secrets Management**: Use environment variables or secret management
- **SQL Injection**: Use parameterized queries and ORM properly
- **XSS Prevention**: Proper output escaping and content security policies

### **Performance Standards**
- **Algorithm Efficiency**: O(n log n) or better for common operations
- **Memory Usage**: Efficient memory management and leak prevention
- **Async/Await**: Proper async patterns for I/O-bound operations
- **Caching**: Implement appropriate caching strategies
- **Profiling**: Profile critical paths and optimize bottlenecks

## Framework-Specific Templates

### **Django Development Template**

```python
"""
Django Feature Implementation with Context7 Integration

DJANGO-SPECIFIC REQUIREMENTS:
1. MODEL DESIGN: Proper Django models with relationships and constraints
2. VIEWS/VIEWSETS: Django views or Django REST framework viewsets
3. URLS: URL configuration with proper routing and parameters
4. TEMPLATES: Django templates or API responses
5. MIGRATIONS: Database migrations and data migrations
6. ADMIN: Django admin interface configuration

IMPLEMENTATION WORKFLOW:
1. Model Definition: Create Django models with proper fields and relationships
2. View Implementation: Create views or viewsets with proper error handling
3. URL Configuration: Set up URL patterns with proper routing
4. Template/API Response: Create templates or API response formats
5. Form/Validation: Implement Django forms or DRF serializers
6. Testing: Create Django tests or DRF test cases
7. Migration: Create and apply database migrations

DJANGO BEST PRACTICES:
- Use Django models and migrations properly
- Implement proper validation in forms/serializers
- Use Django signals appropriately
- Follow Django security best practices
- Implement proper database queries with select_related/prefetch_related
- Use Django settings and environment variables properly

CONTEXT7 INTEGRATION:
- Search for similar Django implementations
- Apply Django patterns and conventions
- Retrieve Django documentation and best practices
- Learn from existing Django code in the project
"""
```

### **FastAPI Development Template**

```python
"""
FastAPI Feature Implementation with Context7 Integration

FASTAPI-SPECIFIC REQUIREMENTS:
1. PYDANTIC MODELS: Proper data models with validation
2. API ENDPOINTS: FastAPI route handlers with proper HTTP methods
3. DEPENDENCY INJECTION: FastAPI dependency system usage
4. AUTHENTICATION: JWT, OAuth, or other authentication methods
5. DOCUMENTATION: OpenAPI documentation and examples

IMPLEMENTATION WORKFLOW:
1. Pydantic Models: Create data models with validation and serialization
2. API Endpoints: Implement FastAPI routes with proper HTTP methods
3. Dependencies: Use FastAPI dependency injection system
4. Error Handling: Implement proper HTTP exception handling
5. Authentication: Add authentication and authorization
6. Testing: Create TestClient tests with comprehensive coverage
7. Documentation: Ensure OpenAPI documentation is complete

FASTAPI BEST PRACTICES:
- Use Pydantic models for data validation
- Implement proper async/await patterns
- Use FastAPI dependency injection effectively
- Implement proper error handling with HTTP exceptions
- Follow REST API design principles
- Use background tasks for long-running operations

CONTEXT7 INTEGRATION:
- Search for FastAPI patterns and implementations
- Apply FastAPI best practices and conventions
- Retrieve FastAPI documentation and examples
- Learn from existing FastAPI code in the project
"""
```

## Testing Framework Integration

### **pytest Configuration**

```python
"""
pytest configuration for Python projects

TESTING REQUIREMENTS:
1. UNIT TESTS: Individual component testing with mocking
2. INTEGRATION TESTS: Component interaction testing
3. END-TO-END TESTS: Complete workflow testing
4. COVERAGE: Test coverage analysis and reporting
5. FIXTURES: Reusable test fixtures and setup

PYTEST BEST PRACTICES:
- Use descriptive test names with test_ prefix
- Implement proper test isolation and cleanup
- Use fixtures for reusable test setup
- Mock external dependencies appropriately
- Test both happy path and edge cases
- Implement parameterized tests for multiple scenarios
"""
```

## Debugging Tools Integration

### **Python Debugging Tools**

```python
"""
Python debugging tools and techniques

DEBUGGING TOOLS:
1. pdb: Interactive Python debugger
2. logging: Structured logging for debugging
3. memory_profiler: Memory usage analysis
4. cProfile: Performance profiling
5. unittest.mock: Mocking and patching for testing

DEBUGGING WORKFLOW:
1. Issue Reproduction: Create minimal reproduction case
2. pdb Debugging: Use breakpoints and variable inspection
3. Logging Analysis: Add structured logging for debugging
4. Performance Analysis: Profile bottlenecks and optimize
5. Memory Analysis: Identify memory leaks and optimization

COMMON DEBUGGING SCENARIOS:
- Import errors and circular dependencies
- Memory leaks and reference cycles
- Performance bottlenecks in algorithms
- Concurrency issues with threads and async
- Integration issues with external services
"""
```

## Integration with AURA Constitution

### **Constitution Compliance**

```python
"""
AURA Constitution compliance for Python development

CONSTITUTION REQUIREMENTS:
1. ARCHITECTURAL PATTERNS: Follow established architectural patterns
2. CODE STANDARDS: Maintain high code quality and consistency
3. SECURITY STANDARDS: Follow security best practices and guidelines
4. TESTING STANDARDS: Implement comprehensive testing strategies
5. DOCUMENTATION STANDARDS: Maintain clear and comprehensive documentation

COMPLIANCE WORKFLOW:
1. Pattern Review: Ensure alignment with architectural patterns
2. Code Review: Validate code quality and standards compliance
3. Security Review: Assess security implications and vulnerabilities
4. Testing Review: Validate testing coverage and quality
5. Documentation Review: Ensure documentation completeness and clarity

QUALITY GATES:
- Code passes all automated quality checks
- Tests achieve required coverage thresholds
- Security scans pass with zero high-severity issues
- Documentation is complete and accurate
- Integration with existing systems is validated
"""
```

## Progressive Disclosure Integration

This Python template supports progressive disclosure through:

### **Level 1: Basic Python Development**
- Essential Python patterns and best practices
- Standard library usage and common frameworks
- Basic testing and debugging techniques

### **Level 2: Advanced Python Features**
- Context7 integration for pattern discovery
- Advanced debugging and profiling tools
- Comprehensive testing strategies
- Performance optimization techniques

### **Level 3: Specialized Development**
- Framework-specific implementations (Django, FastAPI, Flask)
- Domain-specific patterns and solutions
- Integration with external systems and APIs
- Advanced security and performance considerations

---

*Python development template providing comprehensive development capabilities with Context7 integration, AURA constitution compliance, and advanced debugging tools for intelligent Python development workflows.*