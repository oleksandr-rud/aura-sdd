---
name: aura-quality-assurance
description: Comprehensive QA skill with Playwright MCP integration for web automation, API testing, and contract validation. Use when writing automated tests, debugging applications, testing APIs, validating contracts, or ensuring quality standards. Supports web testing, API testing, OpenAPI/GraphQL contract testing, and intelligent context interpretation.
---

# AURA Quality Assurance Skill

## Segment: Identity

- **Skill ID**: quality-assurance
- **Version**: 3.0
- **Last Updated**: 2025-10-27
- **Target Agent**: {{actor}} (primarily qa, accessible to all agents)

## Segment: Purpose

### Core Purpose
Provide comprehensive quality assurance capabilities including web automation, API testing, contract validation, and intelligent test execution. Integrate Playwright MCP for browser automation, HTTP request testing for APIs, and contract testing for OpenAPI and GraphQL specifications with intelligent context interpretation.

### Success Criteria
- Test suites achieve 100% requirement coverage and quality standards
- Web applications validated across multiple browsers and devices
- API endpoints tested with comprehensive contract validation
- Contract testing ensures specification compliance
- Test execution optimized with intelligent context interpretation
- Quality gates met with measurable validation criteria

### Trigger Scenarios
- **Web Application Testing**: End-to-end testing of web applications across browsers
- **API Testing**: RESTful API and GraphQL endpoint validation and testing
- **Contract Testing**: OpenAPI specification and GraphQL schema validation
- **Regression Testing**: Comprehensive test execution for existing functionality
- **Performance Testing**: Load testing and performance validation
- **Quality Gate Validation**: Go/No-Go decisions based on test results
- **Bug Validation**: Bug reproduction and fix verification testing

## Segment: Required MCPs/Tools

### MCP Dependencies
- **FileSystem**: Test file management, test data organization, and report generation
- **Read**: Test code analysis, specification review, and documentation access
- **Write**: Test creation, report generation, and test documentation
- **Bash**: Test execution, environment setup, and CI/CD integration
- **Playwright MCP**: Browser automation, web testing, and cross-browser validation
- **WebSearch**: Testing research, best practices, and tool documentation
- **WebFetch**: Documentation access, specification retrieval, and external resources

### Testing Tools and Frameworks
- **Playwright**: Cross-browser web automation and end-to-end testing
- **HTTP Request Libraries**: API testing with HTTP/HTTPS protocols
- **Contract Testing Tools**: OpenAPI and GraphQL schema validation
- **Testing Frameworks**: Test organization, execution, and reporting
- **Performance Testing**: Load testing and performance monitoring

### Prerequisites
- **Test Environment**: Configured testing environments and browsers
- **Application Access**: Deployed applications or staging environments
- **Test Data**: Comprehensive test data and scenarios
- **Specifications**: API specifications, requirements documentation, and user stories
- **Quality Standards**: Defined acceptance criteria and quality gates

## Segment: Orientation

### Orientation Checks
- **Constitution Review**: Confirm ../../../.aura/constitution.md for QA standards and quality gates
- **Testing Standards**: Review established testing methodologies and quality criteria
- **Tool Availability**: Validate Playwright MCP and testing tools accessibility
- **Environment Setup**: Confirm testing environments and application availability

### Pre-execution Validation
- **Agent Authorization**: Verify agent has QA testing authorization
- **Tool Availability**: Confirm Playwright MCP and required tools accessible
- **Test Environment**: Validate testing environments and application accessibility
- **Specification Access**: Ensure test requirements and specifications available

## Segment: Execution Algorithm

### Advanced QA Testing Framework

#### Phase 1: Intelligent Context Analysis and Test Planning

1. **Context Interpretation with AI Analysis**
   - Analyze requirements specifications and user stories
   - Identify critical user journeys and edge cases
   - Map application architecture to testing requirements
   - Analyze risk factors and critical testing areas

2. **Test Strategy Development**
   - Create comprehensive test plan with coverage requirements
   - Define test scope, objectives, and success criteria
   - Identify test types: functional, performance, security, accessibility
   - Plan cross-browser and device testing requirements

3. **Resource and Environment Planning**
   - Identify required testing environments and configurations
   - Plan test data requirements and management
   - Schedule test execution timeline and resource allocation
   - Define integration points with CI/CD pipeline

#### Phase 2: Web Application Testing with Playwright

##### **End-to-End Testing Framework**
1. **Cross-Browser Testing Automation**
   - Chrome, Firefox, Safari, Edge browser testing
   - Mobile device emulation and responsive design testing
   - Browser-specific functionality and compatibility validation
   - Performance testing across different browsers

2. **User Journey Testing**
   - Critical user workflows and customer journeys
   - Multi-step processes with data validation
   - Form submission and validation testing
   - Navigation and interaction testing

3. **Visual Regression Testing**
   - UI consistency validation across browsers
   - Visual element positioning and styling validation
   - Responsive design testing on different viewports
   - Component integration and layout testing

##### **Advanced Playwright Testing**
```python
"""
Playwright Testing Framework with AI Context Interpretation

TESTING REQUIREMENTS:
1. CROSS-BROWSER COVERAGE: Chrome, Firefox, Safari, Edge testing
2. RESPONSIVE DESIGN: Mobile, tablet, desktop viewport testing
3. PERFORMANCE METRICS: Load time, interaction response time, resource loading
4. ACCESSIBILITY TESTING: WCAG compliance and screen reader testing
5. INTELLIGENT SELECTORS: AI-powered element identification and selection

TESTING WORKFLOW:
1. Test Environment Setup: Configure browsers and test environments
2. Test Data Preparation: Create comprehensive test data sets
3. Test Execution: Run tests across browsers and devices
4. Result Validation: Validate expected outcomes and performance
5. Report Generation: Create comprehensive test reports
6. Issue Identification: Document bugs and improvement opportunities

PLAYWRIGHT ADVANCED FEATURES:
- Page Object Model for maintainable test code
- Network interception and API testing
- Performance monitoring and metrics collection
- Accessibility testing and compliance validation
- Visual regression testing and comparison
"""
```

#### Phase 3: API Testing and Contract Validation

##### **RESTful API Testing Framework**
1. **HTTP Request Testing**
   - GET, POST, PUT, DELETE, PATCH method testing
   - Request header, parameter, and body validation
   - Response status code, header, and body validation
   - Error handling and edge case testing

2. **Contract Testing with OpenAPI**
   - OpenAPI specification compliance validation
   - Request/response schema validation
   - Parameter type and format validation
   - Authentication and authorization testing

3. **API Integration Testing**
   - Multi-endpoint workflow testing
   - Database integration and data validation
   - Third-party service integration testing
   - Error propagation and handling validation

##### **GraphQL Testing Framework**
1. **Query and Mutation Testing**
   - GraphQL query execution and response validation
   - Mutation testing with data modification validation
   - Subscription testing for real-time updates
   - Schema compliance and type validation

2. **GraphQL Contract Testing**
   - GraphQL schema specification validation
   - Type system and resolver validation
   - Query complexity and performance testing
   - Security testing and authorization validation

#### Phase 4: Intelligent Test Execution and Context Interpretation

##### **AI-Enhanced Test Analysis**
1. **Context-Aware Test Selection**
   - Analyze code changes and identify affected test scenarios
   - Prioritize tests based on risk and impact analysis
   - Optimize test execution order and parallelization
   - Adapt test scope based on deployment context

2. **Intelligent Bug Detection**
   - Pattern recognition for common bug types
   - Automated visual regression detection
   - Performance anomaly identification
   - Security vulnerability detection

3. **Test Result Analysis**
   - Automated test result interpretation and categorization
   - Failure pattern analysis and root cause identification
   - Performance regression detection and analysis
   - Quality metrics calculation and trend analysis

##### **Advanced Context Interpretation**
```python
"""
AI Context Interpretation for Complex Testing Scenarios

CONTEXT ANALYSIS REQUIREMENTS:
1. REQUIREMENT MAPPING: Map test scenarios to business requirements
2. RISK ASSESSMENT: Identify high-risk areas and critical paths
3. USER BEHAVIOR ANALYSIS: Simulate realistic user behavior patterns
4. EDGE CASE IDENTIFICATION: Identify boundary conditions and unusual scenarios
5. PERFORMANCE CONTEXT: Understand performance requirements and expectations

INTERPRETATION WORKFLOW:
1. Context Analysis: Analyze requirements, specifications, and user stories
2. Scenario Identification: Identify critical test scenarios and edge cases
3. Test Strategy Development: Create intelligent test approach based on context
4. Execution Planning: Optimize test execution based on risk and priority
5. Result Interpretation: Analyze results in business context and impact

INTELLIGENT FEATURES:
- Automated test case generation from requirements
- Dynamic test prioritization based on risk analysis
- Contextual failure analysis and root cause identification
- Performance impact assessment and optimization recommendations
"""
```

#### Phase 5: Contract Testing and Specification Validation

##### **OpenAPI Contract Testing**
1. **Specification Compliance**
   - OpenAPI 3.0/3.1 specification validation
   - Path, method, parameter compliance testing
   - Request/response schema validation
   - Security scheme and authentication testing

2. **Contract Enforcement**
   - Request/response format validation
   - Data type and constraint checking
   - Header and parameter validation
   - Error response format compliance

##### **GraphQL Contract Testing**
1. **Schema Validation**
   - GraphQL schema specification compliance
   - Type system and resolver validation
   - Query complexity and depth validation
   - Subscription protocol compliance

2. **Contract Enforcement**
   - Query structure and type validation
   - Mutation input and output validation
   - Subscription event validation
   - Error response format compliance

#### Phase 6: Performance and Quality Gate Validation

##### **Performance Testing Framework**
1. **Load Testing**
   - Concurrent user simulation and load generation
   - Response time and throughput measurement
   - Resource usage monitoring and optimization
   - Scalability testing and capacity planning

2. **Performance Monitoring**
   - Real-time performance metrics collection
   - Bottleneck identification and optimization
   - Resource usage analysis and optimization
   - Performance regression detection and prevention

##### **Quality Gate Validation**
1. **Go/No-Go Decision Framework**
   - Define quality criteria and success metrics
   - Evaluate test results against quality standards
   - Assess risk and readiness for deployment
   - Provide recommendations and improvement actions

2. **Quality Metrics and Reporting**
   - Test coverage analysis and reporting
   - Quality metrics calculation and trend analysis
   - Bug classification and impact assessment
   - Continuous improvement recommendations

## Segment: Artifact Output

### Primary Outputs
- **Comprehensive Test Suites**: Automated tests for web applications and APIs
- **Test Reports**: Detailed test execution reports with metrics and analysis
- **Contract Validation Results**: OpenAPI and GraphQL compliance validation
- **Performance Reports**: Load testing and performance analysis reports
- **Quality Gate Assessments**: Go/No-Go decisions with justification

### Evidence Requirements
- **Test Coverage**: Coverage metrics for requirements and code
- **Performance Metrics**: Response time, throughput, and resource usage data
- **Contract Compliance**: Specification compliance validation results
- **Quality Metrics**: Bug counts, test pass rates, and quality trends

## Segment: Transition Log Template

### Standard Format
```
[TRANSITION|quality-assurance] by {{actor}}
MODE: {{transition_mode}}
FROM_STATE: {{from_state}}
TO_STATE: {{to_state}}
WHY:
- {{qa_reason_1}}
- {{qa_reason_2}}
OUTPUT:
=== Quality Assurance ===
summary: {{operation_summary}} with {{testing_framework}} and {{test_type}}.
inputs: operation_type={{operation_type}} test_scope={{test_scope}} requirements={{requirements_ref}}
evidence: {{validation_type}}|result={{validation_result}}|ref={{test_report_path}}
risks: [ ]{{qa_risk}}|owner={{actor}}|mitigation={{mitigation_strategy}}
next_steps: {{next_qa_actions}}
=== END Quality Assurance ===
FOLLOW-UP:
- {{follow_up_action}} - owner={{responsible_agent}} - due={{timeline}}
```

### BLOCKED Protocol
```
BLOCKED(missing_inputs=[{{critical_inputs}}], unblock_steps=[{{resolution_steps}}])
```

## Advanced Testing Templates

### **Web Testing with Playwright Template**
```python
"""
Comprehensive Web Testing with Playwright MCP Integration

WEB TESTING REQUIREMENTS:
1. CROSS-BROWSER TESTING: Chrome, Firefox, Safari, Edge compatibility
2. RESPONSIVE DESIGN: Mobile, tablet, desktop viewport testing
3. USER JOURNEY TESTING: Critical user workflows and scenarios
4. VISUAL REGRESSION: UI consistency and design validation
5. PERFORMANCE TESTING: Load time and interaction response time

PLAYWRIGHT INTEGRATION:
- Browser automation with MCP tools
- Network interception and API testing
- Performance monitoring and metrics collection
- Visual comparison and regression testing
- Accessibility testing and compliance validation

TESTING WORKFLOW:
1. Environment Setup: Configure browsers and test environments
2. Test Data Preparation: Create comprehensive test data sets
3. Test Execution: Run tests across browsers and devices
4. Result Validation: Validate functionality and performance
5. Report Generation: Create detailed test reports with metrics
"""
```

### **API Testing Template**
```python
"""
Comprehensive API Testing with HTTP Requests and Contract Validation

API TESTING REQUIREMENTS:
1. ENDPOINT TESTING: GET, POST, PUT, DELETE, PATCH method testing
2. CONTRACT VALIDATION: OpenAPI and GraphQL specification compliance
3. DATA VALIDATION: Request/response schema and type validation
4. ERROR HANDLING: Error response and exception testing
5. PERFORMANCE TESTING: API response time and throughput testing

HTTP REQUEST INTEGRATION:
- HTTP/HTTPS protocol support
- Request/response header and body testing
- Authentication and authorization testing
- File upload/download testing
- Cookie and session management testing

CONTRACT TESTING:
- OpenAPI specification compliance validation
- GraphQL schema and resolver testing
- Request/response format validation
- Type system and constraint checking
"""
```

### **Contract Testing Template**
```python
"""
Contract Testing for OpenAPI and GraphQL Specifications

CONTRACT TESTING REQUIREMENTS:
1. SPECIFICATION COMPLIANCE: OpenAPI 3.0/3.1 and GraphQL validation
2. REQUEST/RESPONSE VALIDATION: Format, type, and constraint checking
3. AUTHENTICATION TESTING: Security scheme validation
4. ERROR HANDLING: Error response format compliance
5. PERFORMANCE TESTING: Contract compliance performance impact

OPENAPI CONTRACT TESTING:
- Path, method, parameter compliance testing
- Request/response schema validation
- Header and parameter validation
- Security scheme and authentication testing

GRAPHQL CONTRACT TESTING:
- Schema specification compliance
- Query, mutation, subscription testing
- Type system and resolver validation
- Error response format compliance
"""
```

## Intelligent Context Interpretation

### **AI-Enhanced Test Analysis**
The skill includes advanced AI capabilities for intelligent test planning and execution:

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

## Integration Features

### **AURA Constitution Integration**
- **Quality Gate Compliance**: Follow AURA quality standards and validation criteria
- **Workflow Integration**: Seamless integration with AURA State Machine transitions
- **Agent Coordination**: Support multi-agent collaboration for testing workflows
- **Audit Trail**: Complete testing documentation and decision tracking

### **CI/CD Integration**
- **Automated Test Execution**: Integration with continuous integration pipelines
- **Quality Gate Enforcement**: Automated quality validation and gate enforcement
- **Report Generation**: Automated test report generation and distribution
- **Feedback Loops**: Integration with development feedback and improvement cycles

## Additional Resources

- [AURA Constitution](../../../.aura/constitution.md) - Quality standards and validation criteria
- [AURA Glossary](../../../.aura/glossary.md) - Testing terminology and definitions
- [Testing Templates](templates/) - Test case templates and examples
- [Testing Tools](tools/) - Testing utilities and automation scripts
- [Best Practices](docs/) - Testing methodologies and quality guidelines

## Guardrails

- Follow AURA constitution quality standards and validation criteria
- Implement comprehensive test coverage for critical functionality
- Use Playwright MCP tools responsibly and efficiently
- Validate contracts against specifications and requirements
- Ensure test environments are properly configured and maintained
- Document test results and quality metrics thoroughly
- Follow security best practices for testing sensitive data
- Maintain test data privacy and confidentiality

---

*Advanced Quality Assurance skill providing comprehensive web and API testing capabilities with Playwright MCP integration, contract validation, and intelligent context interpretation for ensuring quality standards across complex testing scenarios.*