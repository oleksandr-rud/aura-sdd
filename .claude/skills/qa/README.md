# AURA Quality Assurance Skill

## Overview

The AURA Quality Assurance skill provides comprehensive testing capabilities including web automation with Playwright MCP, API testing with HTTP requests, and contract validation for OpenAPI and GraphQL specifications. It features intelligent context interpretation for complex testing scenarios and AURA constitution integration for quality gate compliance.

## Key Features

### 🎭 **Playwright MCP Integration**
- **Cross-Browser Testing**: Chrome, Firefox, Safari, Edge automation
- **Web Application Testing**: End-to-end testing, user journey validation
- **Visual Regression Testing**: UI consistency and design validation
- **Performance Testing**: Load time, interaction response time, resource usage
- **Accessibility Testing**: WCAG compliance and screen reader testing

### 🔌 **Advanced API Testing**
- **RESTful API Testing**: Complete HTTP request/response validation
- **GraphQL Testing**: Query, mutation, and subscription testing
- **Contract Testing**: OpenAPI and GraphQL specification compliance
- **Authentication Testing**: JWT, OAuth, and security scheme validation
- **Performance Testing**: API throughput and response time testing

### 📋 **Contract Testing Framework**
- **OpenAPI Validation**: Specification compliance and schema validation
- **GraphQL Testing**: Schema validation and resolver testing
- **Request/Response Validation**: Format, type, and constraint checking
- **Security Testing**: Authentication and authorization validation
- **Error Handling**: Error response format compliance testing

### 🧠 **Intelligent Context Interpretation**
- **AI-Enhanced Test Planning**: Context-aware test selection and prioritization
- **Risk-Based Testing**: Intelligent risk assessment and test prioritization
- **Pattern Recognition**: Automated bug detection and failure analysis
- **Performance Analysis**: Intelligent performance regression detection

## Quick Start

### Basic Usage
```bash
# Web application testing with Playwright
exec story=WEB-001 skill=quality-assurance operation_type=web_test \
  browsers=[chrome,firefox] test_type=e2e

# API testing with contract validation
exec story=API-001 skill=quality-assurance operation_type=api_test \
  spec_type=openapi spec_file=api/openapi.yaml

# GraphQL contract testing
exec story=GQL-001 skill=quality-assurance operation_type=contract_test \
  spec_type=graphql schema_file=schema.graphql
```

### Advanced Usage with Context Interpretation
```bash
# Intelligent testing with context analysis
exec story=E2E-001 skill=quality-assurance operation_type=intelligent_test \
  context_analysis=true risk_assessment=true \
  browsers=[chrome,firefox,safari] test_scope=comprehensive

# API testing with contract validation and performance
exec story=API-002 skill=quality-assurance operation_type=comprehensive_api_test \
  spec_type=openapi contract_validation=true performance_testing=true \
  load_test_concurrent=100
```

## Directory Structure

```
qa-skill-example/
├── SKILL.md                           # Main skill with comprehensive capabilities
├── README.md                          # This overview file
├── templates/                         # Testing operation templates
│   ├── web-testing-template.md
│   ├── api-testing-template.md
│   ├── contract-testing-template.md
│   └── intelligent-testing-template.md
├── frameworks/                        # Testing framework implementations
│   ├── playwright-framework/
│   ├── api-testing-framework/
│   ├── contract-testing-framework/
│   └── performance-testing-framework/
├── examples/                          # Real-world usage examples
│   ├── web-testing-example.md
│   ├── api-testing-example.md
│   ├── contract-testing-example.md
│   └── intelligent-testing-example.md
├── tools/                            # Testing utilities and automation
│   ├── playwright-helper.py
│   ├── api-tester.py
│   ├── contract-validator.py
│   ├── performance-analyzer.py
│   └── context-analyzer.py
├── docs/                             # Additional documentation
│   ├── playwright-integration.md
│   ├── api-testing-guide.md
│   ├── contract-testing-guide.md
│   ├── context-interpretation.md
│   └── quality-gates.md
```

## Testing Operations

### 1. Web Application Testing
**Purpose**: End-to-end testing of web applications across multiple browsers
**Features**:
- Cross-browser testing with Chrome, Firefox, Safari, Edge
- Mobile device emulation and responsive design testing
- Visual regression testing and UI consistency validation
- Performance monitoring and optimization
- Accessibility testing and WCAG compliance

### 2. API Testing
**Purpose**: Comprehensive API testing with contract validation
**Features**:
- RESTful API testing with complete HTTP method coverage
- GraphQL testing with query, mutation, and subscription validation
- Authentication and authorization testing
- Performance testing with load and stress testing
- Error handling and edge case validation

### 3. Contract Testing
**Purpose**: Specification compliance validation for APIs
**Features**:
- OpenAPI 3.0/3.1 specification compliance testing
- GraphQL schema validation and resolver testing
- Request/response format and type validation
- Security scheme and authentication validation
- Performance impact assessment of contract validation

### 4. Intelligent Context Testing
**Purpose**: AI-enhanced testing with intelligent context interpretation
**Features**:
- Context-aware test selection and prioritization
- Risk-based testing with intelligent assessment
- Automated bug detection and pattern recognition
- Performance regression detection and analysis
- Quality metrics calculation and trend analysis

## Framework Integration

### **Playwright MCP Integration**
```python
"""
Playwright Testing Framework with MCP Tools

CAPABILITIES:
- Browser automation across Chrome, Firefox, Safari, Edge
- Network interception and API testing
- Performance monitoring and metrics collection
- Visual comparison and regression testing
- Accessibility testing and compliance validation

TESTING FEATURES:
- Page Object Model for maintainable test code
- Cross-browser parallel execution
- Mobile device emulation and testing
- Screenshot and video recording
- Network request/response interception
"""
```

### **HTTP Request Testing**
```python
"""
HTTP Request Testing Framework

CAPABILITIES:
- Complete HTTP method support (GET, POST, PUT, DELETE, PATCH)
- Request/response header and body testing
- Authentication and authorization testing
- File upload/download testing
- Cookie and session management testing

TESTING FEATURES:
- API endpoint validation and testing
- Request/response schema validation
- Error handling and edge case testing
- Performance testing and monitoring
- Security testing and vulnerability scanning
"""
```

### **Contract Testing Framework**
```python
"""
Contract Testing for OpenAPI and GraphQL

OPENAPI CONTRACT TESTING:
- Specification compliance validation
- Request/response schema validation
- Parameter and header validation
- Security scheme testing
- Error response format compliance

GRAPHQL CONTRACT TESTING:
- Schema specification compliance
- Query, mutation, subscription testing
- Type system and resolver validation
- Error response format compliance
- Performance impact assessment
"""
```

## Intelligent Context Interpretation

### **AI-Enhanced Test Analysis**
The skill provides advanced AI capabilities for intelligent testing:

#### **Context-Aware Test Selection**
- Analyze code changes and identify affected test scenarios
- Prioritize tests based on risk and impact analysis
- Optimize test execution order and parallelization
- Adapt test scope based on deployment context

#### **Intelligent Bug Detection**
- Pattern recognition for common bug types
- Automated visual regression detection
- Performance anomaly identification
- Security vulnerability detection

#### **Test Result Analysis**
- Automated test result interpretation and categorization
- Failure pattern analysis and root cause identification
- Performance regression detection and analysis
- Quality metrics calculation and trend analysis

### **Risk-Based Testing**
- Automated risk assessment and test prioritization
- Critical path identification and testing focus
- Edge case identification and boundary testing
- Performance risk assessment and optimization

## Usage Examples

### **Web Application Testing Example**
```bash
# E-commerce website testing with Playwright
exec story=ECOM-001 skill=quality-assurance operation_type=web_test \
  browsers=[chrome,firefox,edge] test_type=e2e \
  test_scenarios=[user_registration,product_search,checkout_process] \
  performance_monitoring=true accessibility_testing=true
```

### **API Testing with Contract Validation**
```bash
# RESTful API testing with OpenAPI contract validation
exec story=API-001 skill=quality-assurance operation_type=api_test \
  spec_type=openapi spec_file=specs/api.yaml \
  contract_validation=true performance_testing=true \
  authentication_test=true error_handling_test=true
```

### **GraphQL Contract Testing**
```bash
# GraphQL API testing with schema validation
exec story=GQL-001 skill=quality-assurance operation_type=contract_test \
  spec_type=graphql schema_file=schema.graphql \
  subscription_testing=true performance_testing=true \
  security_testing=true error_handling_test=true
```

### **Intelligent Testing with Context Analysis**
```bash
# Intelligent testing with AI context interpretation
exec story=INTELLIGENT-001 skill=quality-assurance operation_type=intelligent_test \
  context_analysis=true risk_assessment=true \
  test_optimization=true parallel_execution=true \
  quality_gates=go_no_go performance_monitoring=true
```

## Quality Assurance Framework

### **Automated Quality Gates**
- **Test Coverage**: Minimum 90% requirement coverage
- **Performance Standards**: Response time and throughput benchmarks
- **Security Standards**: Authentication, authorization, and vulnerability prevention
- **Accessibility Standards**: WCAG 2.1 AA compliance
- **Contract Compliance**: 100% specification compliance

### **Testing Strategy**
- **Unit Testing**: Component-level testing with mocking
- **Integration Testing**: System integration and component interaction
- **End-to-End Testing**: Complete user workflow validation
- **Contract Testing**: API specification compliance validation
- **Performance Testing**: Load testing and performance optimization

### **Quality Metrics**
- **Test Pass Rate**: Percentage of tests passing consistently
- **Defect Density**: Number of defects per test case
- **Mean Time to Detection**: Time to identify defects
- **Test Execution Time**: Efficiency of test execution
- **Coverage Metrics**: Requirement and code coverage analysis

## Progressive Disclosure Architecture

### Level 1: Basic Testing (always loaded)
- Essential testing concepts and methodologies
- Basic web and API testing capabilities
- Fundamental quality assurance principles
- Standard testing tools and frameworks

### Level 2: Advanced Testing (loaded when triggered)
- Playwright MCP integration and advanced features
- Contract testing and specification validation
- Performance testing and optimization
- Security testing and vulnerability assessment

### Level 3: Intelligent Testing (as needed)
- AI-enhanced context interpretation and analysis
- Risk-based testing and intelligent prioritization
- Advanced pattern recognition and bug detection
- Comprehensive quality metrics and reporting

## AURA Constitution Integration

### **Quality Gate Compliance**
- **Architectural Compliance**: Follow established patterns and conventions
- **Quality Standards**: Maintain high quality and consistency
- **Security Standards**: Follow security best practices and guidelines
- **Testing Standards**: Implement comprehensive testing strategies
- **Documentation Standards**: Maintain clear and comprehensive documentation

### **Workflow Integration**
- **State Machine Integration**: Seamless workflow transitions
- **Agent Coordination**: Multi-agent collaboration support
- **Audit Trail**: Complete testing documentation and decisions
- **Quality Reporting**: Comprehensive test results and metrics

## Requirements

- AURA system with agent access
- FileSystem, Read, Write, Bash, WebSearch, WebFetch MCP tools
- Playwright MCP tools for browser automation
- Configured testing environments and browsers
- Application deployment or staging environments
- API specifications and documentation
- Clear testing requirements and acceptance criteria

## Best Practices

### **Web Testing Best Practices**
- Use Page Object Model for maintainable test code
- Implement cross-browser parallel execution
- Include mobile device emulation and responsive testing
- Add performance monitoring and optimization
- Ensure accessibility testing and WCAG compliance

### **API Testing Best Practices**
- Validate contracts against specifications
- Test authentication and authorization mechanisms
- Include performance testing and load testing
- Test error handling and edge cases
- Ensure comprehensive request/response validation

### **Contract Testing Best Practices**
- Validate against current specifications
- Include negative testing scenarios
- Test security schemes and authentication
- Monitor performance impact of contract validation
- Maintain contract test suite with API changes

### **Quality Assurance Best Practices**
- Implement risk-based testing approaches
- Use automated testing in CI/CD pipelines
- Maintain comprehensive test documentation
- Monitor quality metrics and trends
- Continuously improve testing processes and tools

This comprehensive QA skill transforms quality assurance from manual testing into an intelligent, automated process that leverages advanced tools, AI interpretation, and comprehensive coverage to ensure exceptional quality across web applications, APIs, and contracts while maintaining full AURA constitution compliance.