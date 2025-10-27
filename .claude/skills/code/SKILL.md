---
name: aura-code-development
description: Comprehensive code development skill supporting multiple languages, templates, and advanced debugging. Use when implementing features, fixing bugs, writing tests, reviewing code, or debugging web apps, APIs, and browsers. Integrates with Context7, memory search, and AURA constitution for intelligent development workflows.
---

# AURA Code Development Skill

## Segment: Identity

- **Skill ID**: code-development
- **Version**: 3.0
- **Last Updated**: 2025-10-27
- **Target Agent**: {{actor}} (primarily tech-lead, accessible to all agents)

## Segment: Purpose

### Core Purpose
Provide comprehensive code development capabilities across multiple languages and frameworks with intelligent debugging, testing, and quality assurance. Integrate advanced tools for web development, API development, browser debugging, and memory-enhanced code search with Context7 integration.

### Success Criteria
- Code implemented with 100% requirement compliance and quality standards
- Bug fixes validated with comprehensive testing and regression prevention
- Unit tests achieving 80%+ coverage with meaningful test cases
- Code reviews following architectural patterns and security best practices
- Debugging solutions with root cause analysis and prevention strategies
- Integration with AURA constitution and Context7 for intelligent development

### Trigger Scenarios
- **Feature Implementation**: New functionality development across multiple languages
- **Bug Resolution**: Issue identification, root cause analysis, and fix implementation
- **Test Development**: Unit test creation, integration testing, and test coverage optimization
- **Code Review**: Quality assurance, architecture compliance, and security validation
- **Debugging**: Web applications, APIs, browser issues, and performance optimization
- **Code Search**: Memory-enhanced code discovery with Context7 integration
- **Refactoring**: Code improvement, optimization, and technical debt reduction

## Segment: Required MCPs/Tools

### MCP Dependencies
- **FileSystem**: File operations, code management, and project structure navigation
- **Read**: Code analysis, documentation review, and configuration file parsing
- **Write**: Code creation, modification, and documentation generation
- **Bash**: Command execution, build processes, and development tool integration
- **Context7**: Intelligent code search and documentation retrieval
- **WebSearch**: Research, problem-solving, and external resource discovery
- **WebFetch**: Documentation access, API reference retrieval, and external resource integration

### Browser Development Tools
- **Chrome DevTools**: Web application debugging, performance analysis, and browser automation
- **Playwright**: Cross-browser testing, web automation, and end-to-end testing
- **Network Analysis**: API debugging, performance monitoring, and network optimization

### Code Quality Tools
- **Linting and Formatting**: Code style enforcement and quality assurance
- **Static Analysis**: Security scanning, vulnerability detection, and code quality assessment
- **Testing Frameworks**: Unit testing, integration testing, and test coverage analysis
- **Build Tools**: Compilation, bundling, and deployment automation

### Prerequisites
- **Development Environment**: Configured development tools and runtime environments
- **Project Structure**: Clear project organization and build configuration
- **Requirements Specification**: Detailed functional and non-functional requirements
- **Code Standards**: Established coding standards, style guides, and quality gates

## Segment: Orientation

### Orientation Checks
- **Constitution Review**: Confirm ../../../.aura/constitution.md for development standards and architectural patterns
- **AURA Integration**: Verify AURA State Machine compliance and workflow integration
- **Language Support**: Identify target languages, frameworks, and development tools
- **Quality Standards**: Review coding standards, testing requirements, and quality gates

### Pre-execution Validation
- **Agent Authorization**: Verify agent has code development authorization
- **Tool Availability**: Confirm all required development tools and frameworks are accessible
- **Context Loading**: Load project context, requirements, and existing codebase
- **Environment Setup**: Validate development environment configuration and dependencies

## Segment: Execution Algorithm

### Advanced Development Framework

#### Phase 1: Intelligent Context Analysis
1. **Requirements Analysis with Context7 Integration**
   - Use Context7 to search for relevant code patterns and documentation
   - Analyze existing codebase for similar implementations and best practices
   - Review AURA constitution for architectural compliance and development standards
   - Validate requirements against existing system architecture and constraints

2. **Codebase Intelligence with Memory Search**
   - Execute intelligent code search across project memory and external resources
   - Identify reusable components, patterns, and libraries
   - Analyze code dependencies and integration points
   - Evaluate technical debt and refactoring opportunities

3. **Development Planning**
   - Create detailed implementation plan with language-specific considerations
   - Define testing strategy with coverage requirements and quality gates
   - Establish debugging and validation procedures
   - Plan integration with existing systems and workflows

#### Phase 2: Language-Specific Implementation

Based on language and framework, execute specialized development workflows:

##### **Python Development**
- **Framework Integration**: Django, Flask, FastAPI, or pure Python applications
- **Package Management**: pip, poetry, or conda dependency management
- **Testing Framework**: pytest, unittest, or nose testing implementation
- **Code Quality**: black, flake8, mypy formatting and static analysis
- **Documentation**: Sphinx, docstrings, and type hints implementation

##### **JavaScript/TypeScript Development**
- **Framework Support**: React, Vue, Angular, Node.js, or Express applications
- **Package Management**: npm, yarn, or pnpm dependency management
- **Build Tools**: Webpack, Vite, or esbuild compilation and bundling
- **Testing**: Jest, Mocha, or Cypress testing framework integration
- **TypeScript**: Type safety, interfaces, and advanced type system utilization

##### **Java Development**
- **Framework Integration**: Spring Boot, Spring MVC, or Jakarta EE applications
- **Build Tools**: Maven or Gradle build system integration
- **Testing**: JUnit, Mockito, or TestNG testing implementation
- **Code Quality**: Checkstyle, PMD, or SpotBugs static analysis
- **Documentation**: Javadoc generation and API documentation

##### **Go Development**
- **Project Structure**: Standard Go project layout and module management
- **Testing**: Go built-in testing framework and table-driven tests
- **Concurrency**: Goroutines, channels, and concurrent programming patterns
- **Performance**: Profiling, benchmarking, and optimization techniques
- **Documentation**: Go doc generation and package documentation

##### **Rust Development**
- **Memory Safety**: Ownership, borrowing, and lifetime management
- **Error Handling**: Result and Option types for robust error management
- **Testing**: Built-in testing framework and property-based testing
- **Performance**: Zero-cost abstractions and optimization techniques
- **Documentation**: Cargo doc generation and comprehensive API docs

#### Phase 3: Advanced Debugging and Testing

##### **Web Application Debugging**
1. **Browser Development Tools Integration**
   - Chrome DevTools for DOM inspection, console debugging, and network analysis
   - Performance profiling and memory leak detection
   - Cross-browser compatibility testing and debugging
   - Mobile device emulation and responsive design testing

2. **API Debugging and Testing**
   - RESTful API endpoint testing with Postman or curl
   - GraphQL query debugging and validation
   - WebSocket connection testing and real-time debugging
   - Authentication and authorization testing

3. **Frontend Debugging**
   - JavaScript debugging with browser dev tools and source maps
   - CSS debugging and layout inspection
   - Performance optimization and bundle analysis
   - Accessibility testing and compliance validation

##### **Backend Debugging**
1. **Server-Side Debugging**
   - Log analysis and error tracking with structured logging
   - Database query debugging and performance optimization
   - API endpoint debugging with request/response analysis
   - Concurrency and threading issue identification

2. **Integration Testing**
   - End-to-end testing with realistic data scenarios
   - API integration testing with mock services
   - Database integration testing with transaction management
   - Third-party service integration testing

#### Phase 4: Quality Assurance and Code Review

##### **Automated Quality Checks**
1. **Static Analysis and Security Scanning**
   - Code quality analysis with SonarQube or similar tools
   - Security vulnerability scanning with Snyk, Dependabot, or similar
   - Dependency vulnerability assessment and update management
   - Code complexity analysis and technical debt identification

2. **Testing Coverage and Quality**
   - Unit test coverage analysis with coverage thresholds
   - Integration test validation and scenario testing
   - Performance testing and load testing implementation
   - Accessibility testing and compliance validation

##### **Code Review Process**
1. **Architecture Compliance**
   - Review against AURA constitution and architectural patterns
   - Validate design patterns and SOLID principles adherence
   - Assess scalability and maintainability considerations
   - Review integration with existing systems and workflows

2. **Security and Best Practices**
   - Security vulnerability assessment and mitigation
   - Coding standards and best practices validation
   - Performance and optimization consideration
   - Documentation and maintainability assessment

#### Phase 5: Integration and Deployment

##### **AURA Constitution Integration**
1. **Workflow Integration**
   - Ensure compliance with AURA State Machine transitions
   - Validate integration with agent coordination patterns
   - Maintain audit trail and decision documentation
   - Support multi-agent collaboration and handoffs

2. **Quality Gate Validation**
   - Verify compliance with defined quality standards
   - Validate architectural decision documentation
   - Ensure testing coverage and quality thresholds met
   - Confirm integration with existing systems and workflows

## Segment: Artifact Output

### Primary Outputs
- **Production-Ready Code**: Fully implemented, tested, and documented code
- **Comprehensive Tests**: Unit tests, integration tests, and end-to-end tests
- **Debug Reports**: Detailed analysis of issues found and resolutions implemented
- **Code Review Documentation**: Quality assessment and improvement recommendations
- **Deployment Artifacts**: Built, packaged, and deployment-ready applications

### Evidence Requirements
- **Quality Metrics**: Test coverage, code quality scores, performance benchmarks
- **Security Validation**: Vulnerability scans and security assessment results
- **Compliance Documentation**: Architecture compliance and standards adherence
- **Debug Logs**: Detailed debugging sessions and root cause analysis

## Segment: Transition Log Template

### Standard Format
```
[TRANSITION|code-development] by {{actor}}
MODE: {{transition_mode}}
FROM_STATE: {{from_state}}
TO_STATE: {{to_state}}
WHY:
- {{development_reason_1}}
- {{development_reason_2}}
OUTPUT:
=== Code Development ===
summary: {{operation_summary}} with {{language/framework}} implementation.
inputs: operation_type={{operation_type}} language={{language}} requirements={{requirements_ref}}
evidence: {{validation_type}}|result={{validation_result}}|ref={{code_path}}
risks: [ ]{{development_risk}}|owner={{actor}}|mitigation={{mitigation_strategy}}
next_steps: {{next_development_actions}}
=== END Code Development ===
FOLLOW-UP:
- {{follow_up_action}} - owner={{responsible_agent}} - due={{timeline}}
```

### BLOCKED Protocol
```
BLOCKED(missing_inputs=[{{critical_inputs}}], unblock_steps=[{{resolution_steps}}])
```

## Advanced Development Templates

### Multi-Language Framework Templates

#### **Feature Implementation Template**
```
You are implementing a new feature following AURA development standards and architectural patterns.

DEVELOPMENT REQUIREMENTS:
1. ARCHITECTURAL COMPLIANCE: Follow AURA constitution and established patterns
2. CODE QUALITY: Implement with testing, documentation, and quality gates
3. SECURITY: Follow security best practices and vulnerability prevention
4. PERFORMANCE: Optimize for scalability and efficiency requirements
5. INTEGRATION: Ensure seamless integration with existing systems

IMPLEMENTATION WORKFLOW:
1. Requirements Analysis: Use Context7 to search for similar implementations
2. Design Validation: Review against architectural patterns and constraints
3. Code Implementation: Follow language-specific best practices and patterns
4. Testing Development: Create comprehensive tests with coverage requirements
5. Quality Assurance: Execute code review and validation procedures
6. Documentation: Create clear documentation and usage examples

INTEGRATION TOOLS:
- Context7 for code pattern search and documentation retrieval
- Memory search for existing code discovery and reuse
- Browser dev tools for web application debugging
- Static analysis tools for code quality and security validation

QUALITY STANDARDS:
- Code coverage ≥80% for critical functionality
- Static analysis passing with zero critical issues
- Security scan passing with zero high-severity vulnerabilities
- Performance meeting defined requirements and benchmarks
```

#### **Bug Fix Template**
```
You are resolving a bug with comprehensive debugging and root cause analysis.

DEBUGGING REQUIREMENTS:
1. ROOT CAUSE ANALYSIS: Identify underlying cause, not just symptoms
2. COMPREHENSIVE TESTING: Validate fix with regression testing
3. PREVENTION STRATEGIES: Implement measures to prevent similar issues
4. DOCUMENTATION: Document issue, resolution, and prevention measures
5. QUALITY ASSURANCE: Ensure fix doesn't introduce new issues

DEBUGGING WORKFLOW:
1. Issue Analysis: Reproduce issue and gather detailed symptoms
2. Root Cause Investigation: Use debugging tools to identify underlying cause
3. Solution Design: Create comprehensive fix addressing root cause
4. Fix Implementation: Implement solution with testing and validation
5. Regression Testing: Ensure fix doesn't break existing functionality
6. Prevention Measures: Implement safeguards to prevent recurrence

DEBUGGING TOOLS:
- Browser dev tools for frontend issues and network analysis
- Debuggers for server-side code execution and variable inspection
- Log analysis for error tracking and performance monitoring
- Memory profiling for leak detection and optimization

FIX VALIDATION:
- Issue reproduction and confirmation of resolution
- Comprehensive testing including edge cases and boundary conditions
- Performance impact assessment and optimization
- Security vulnerability assessment and mitigation
```

#### **Code Review Template**
```
You are conducting comprehensive code review following AURA quality standards.

REVIEW REQUIREMENTS:
1. ARCHITECTURAL COMPLIANCE: Validate against AURA constitution and patterns
2. CODE QUALITY: Assess readability, maintainability, and best practices
3. SECURITY VALIDATION: Identify security vulnerabilities and risks
4. PERFORMANCE ASSESSMENT: Evaluate efficiency and scalability considerations
5. TESTING ADEQUACY: Validate test coverage and quality of test cases

REVIEW FRAMEWORK:
1. FUNCTIONAL CORRECTNESS: Code implements requirements accurately
2. ARCHITECTURAL ALIGNMENT: Follows established patterns and conventions
3. CODE QUALITY: Readable, maintainable, and well-documented code
4. SECURITY STANDARDS: No vulnerabilities and follows security best practices
5. PERFORMANCE CONSIDERATIONS: Efficient algorithms and resource usage
6. TESTING QUALITY: Comprehensive tests with good coverage and edge cases

REVIEW CHECKLISTS:
- Code structure and organization following established patterns
- Error handling and edge case consideration
- Documentation and comments clarity and completeness
- Security vulnerabilities and best practices adherence
- Performance optimization and efficiency considerations
- Test coverage adequacy and test case quality

REVIEW OUTPUT:
- Detailed assessment with specific improvement recommendations
- Security vulnerability identification and mitigation strategies
- Performance optimization suggestions and implementation guidance
- Quality metrics and compliance assessment
- Approval decision with conditions or requirements
```

## Language-Specific Capabilities

### **Python Development**
- **Frameworks**: Django, Flask, FastAPI, SQLAlchemy, Celery
- **Testing**: pytest, unittest, mock, coverage analysis
- **Tools**: black, flake8, mypy, bandit security scanning
- **Debugging**: pdb, ipdb, logging, performance profiling

### **JavaScript/TypeScript Development**
- **Frameworks**: React, Vue, Angular, Node.js, Express
- **Testing**: Jest, Mocha, Cypress, Playwright, testing-library
- **Tools**: ESLint, Prettier, TypeScript compiler, Webpack, Vite
- **Debugging**: Chrome DevTools, Node.js debugger, console logging

### **Java Development**
- **Frameworks**: Spring Boot, Spring MVC, Jakarta EE, Hibernate
- **Testing**: JUnit, Mockito, TestNG, Selenium, Arquillian
- **Tools**: Maven, Gradle, Checkstyle, PMD, SpotBugs
- **Debugging**: IntelliJ debugger, JDB, logging frameworks, profilers

### **Go Development**
- **Frameworks**: Gin, Echo, Chi, gRPC, standard library
- **Testing**: built-in testing, testify, gomock, ginkgo
- **Tools**: go fmt, go vet, staticcheck, gosec
- **Debugging**: delve debugger, pprof profiling, race detection

### **Rust Development**
- **Frameworks**: Actix-web, Rocket, Tokio, Serde
- **Testing**: built-in testing, cargo test, tarpaulin, proptest
- **Tools**: rustfmt, clippy, cargo audit, cargo-deny
- **Debugging: rust-gdb, rust-lldb, logging, perf integration

## Advanced Integration Features

### **Context7 Integration**
- **Intelligent Code Search**: Search code patterns and implementations across project memory
- **Documentation Retrieval**: Access relevant documentation and best practices
- **Pattern Recognition**: Identify similar implementations and reusable components
- **Learning Integration**: Continuously improve code suggestions and recommendations

### **Memory Search Enhancement**
- **Cross-Project Learning**: Leverage knowledge from similar projects and implementations
- **Pattern Database**: Maintain repository of code patterns and best practices
- **Intelligent Suggestions**: Provide context-aware code recommendations
- **Knowledge Integration**: Combine internal codebase with external documentation

### **Browser Development Tools**
- **Chrome DevTools**: Complete browser debugging and development capabilities
- **Performance Analysis**: Web performance optimization and bottleneck identification
- **Network Debugging**: API debugging, network analysis, and optimization
- **Cross-Browser Testing**: Compatibility testing across different browsers

### **API Development and Debugging**
- **RESTful APIs**: Design, implementation, testing, and debugging
- **GraphQL Development**: Schema design, resolver implementation, and debugging
- **WebSocket Development**: Real-time communication implementation and testing
- **Authentication & Security**: JWT, OAuth, and security best practices

## Quality Assurance Framework

### **Automated Quality Gates**
- **Code Coverage**: Minimum 80% coverage for critical functionality
- **Static Analysis**: Zero critical issues, zero high-severity vulnerabilities
- **Performance Standards**: Response time and resource usage benchmarks
- **Security Standards**: OWASP compliance and vulnerability prevention

### **Testing Strategy**
- **Unit Testing**: Comprehensive testing of individual components
- **Integration Testing**: Component interaction and system integration
- **End-to-End Testing**: Complete user workflow validation
- **Performance Testing**: Load testing, stress testing, and optimization

### **Code Review Standards**
- **Architecture Compliance**: Adherence to AURA constitution and patterns
- **Code Quality**: Readability, maintainability, and best practices
- **Security Review**: Vulnerability assessment and mitigation
- **Documentation**: Code documentation and API documentation completeness

## Additional Resources

- [AURA Constitution](../../../.aura/constitution.md) - Development standards and architectural patterns
- [AURA Glossary](../../../.aura/glossary.md) - Development terminology and definitions
- [Language Templates](templates/) - Language-specific development templates
- [Debugging Tools](tools/) - Advanced debugging and analysis utilities
- [Quality Framework](docs/) - Quality assurance and testing procedures

## Guardrails

- Follow AURA constitution and established architectural patterns
- Implement comprehensive testing with defined coverage requirements
- Conduct security vulnerability assessment and mitigation
- Ensure performance requirements and scalability considerations
- Maintain clear documentation and code comments
- Follow language-specific best practices and coding standards
- Validate integration with existing systems and workflows
- Use Context7 and memory search for intelligent code development

---

*Advanced Code Development skill providing comprehensive development capabilities across multiple languages with intelligent debugging, testing, and quality assurance integrated with Context7, memory search, and AURA constitution for intelligent development workflows.*