qa-contract.skill

## **Purpose**
Validates interface compatibility across systems, ensuring contract compliance and version consistency between services, APIs, and event streams through systematic testing and verification.

## **Target Agent**
QA agents who validate interface compatibility across systems, ensuring contract compliance and version consistency between services, APIs, and event streams through systematic testing and verification.

## **Trigger Scenarios**
- When interfaces change or require regression validation to ensure compatibility
- When new consumer services are added that depend on existing contracts
- When contract versions are updated and backward compatibility must be verified
- When integration issues arise between services that share contracts
- When preparing for release and ensuring all interface contracts are stable

## **Required MCPs/Tools**
- Contract testing frameworks (Pact, Dredd, Schemathesis) for automated contract validation
- Schema definition tools (OpenAPI, protobuf, Avro) for interface specification
- API testing platforms (Postman, Insomnia) for manual contract verification
- Version control systems for tracking schema evolution and changes
- Mock service generators for simulating provider and consumer behavior

## **Core Procedure (SOP)**

### **Phase 1: Contract Analysis & Planning**
1. **Define Interface Scope**: Identify specific APIs, events, or topics that require contract testing
2. **Assess Consumer Matrix**: Document all dependent consumers and their version requirements
3. **Review Contract Version**: Analyze current schema version and identify changes from previous versions
4. **Determine Compatibility Requirements**: Define expected backward and forward compatibility posture

### **Phase 2: Test Environment Setup**
1. **Configure Test Environment**: Prepare staging or sandbox environment that mirrors production setup
2. **Setup Mock Services**: Deploy consumer and provider mocks for isolated testing scenarios
3. **Prepare Test Data**: Create sample payloads and test data covering various scenarios
4. **Configure Testing Tools**: Set up contract testing frameworks with appropriate configurations

### **Phase 3: Contract Test Execution**
1. **Run Schema Validation**: Validate all interface schemas against defined specifications
2. **Execute Consumer Tests**: Verify consumers can handle current contract format correctly
3. **Perform Provider Tests**: Confirm provider implementation satisfies contract obligations
4. **Test Edge Cases**: Validate error handling, required vs optional fields, and boundary conditions

### **Phase 4: Compatibility Assessment & Reporting**
1. **Analyze Test Results**: Review test outcomes and identify any compatibility issues
2. **Document Breaking Changes**: Record any contract changes that could impact consumers
3. **Assess Compatibility Posture**: Determine overall compatibility status (Compatible/Partial/Incompatible)
4. **Update Documentation**: Record test results, issues, and recommendations in Task Package

## **Required Parameters**
| Parameter | Description | Format | Example |
|---|---|---|---|
| `task_reference` | Task-ID or slug for the task file | ULID or kebab-case | `2025-demo` |
| `interface_name` | API/event/topic identifier | String | `audit.topic` |
| `contract_version` | Schema or version under test | String | `audit.v1` |
| `consumer_matrix` | Consumers + versions dependent on the contract | List/table | `billing v3, refunds v2` |

## **Optional Parameters**
| Parameter | Description | Usage |
|---|---|---|
| `schema_source` | Path/URL to OpenAPI, protobuf, Avro, etc. | Drives tooling |
| `change_log` | Summary of deltas from previous version | Focuses validation |
| `backward_compat` | Expected compatibility posture | Sets pass criteria |
| `test_environment` | Environment or sandbox reference | Ensures reproducibility |
| `tooling` | Test frameworks (Pact, Dredd, Schemathesis) | Aligns execution |
| `risk_hotspots` | Known fragile fields or scenarios | Prioritizes checks |
| `update_scope` | Sections to refresh (`Testing Notes`, `Risks`) | Keeps edits aligned |
| `rolling_summary_delta` | Boolean (default `true`) controlling RS update | Set `false` only if skipping |

## **Execution Templates**

### **Contract Test Summary**
```
Interface: [API/event/topic identifier]
Contract Version: [Version under test]
Test Environment: [Target environment]
Consumer Matrix: [List of dependent consumers and versions]

Test Results:
- [Endpoint/Event 1]: [Pass/Fail] ([X] tests, [Y]s duration)
- [Endpoint/Event 2]: [Pass/Fail] ([X] tests, [Y]s duration)

Compatibility Assessment:
- Backward Compatibility: [Compatible/Partial/Incompatible]
- Forward Compatibility: [Compatible/Partial/Incompatible]
- Breaking Changes: [None/Minor/Major]

Schema Validation:
- [Schema Element 1]: [Valid/Invalid] - [Issue description]
- [Schema Element 2]: [Valid/Invalid] - [Issue description]

Consumer Compatibility:
- [Consumer 1]: [Compatible/Incompatible] - [Issue details]
- [Consumer 2]: [Compatible/Incompatible] - [Issue details]

Next Actions:
- [Action 1] (Owner: [Name], Due: [Date])
- [Action 2] (Owner: [Name], Due: [Date])
```

### **Rolling Summary Update**
```
Context: [Updated context based on contract testing outcomes]
Facts: [Interface tested, version, consumer compatibility status]
Decisions: [Compatibility decisions, version release determinations]
Risks: [Interface compatibility risks with RAG status and mitigation]
Next: [Immediate next steps for addressing contract issues]
```

## **Quality Standards & Guardrails**

### **Requirements**
- Be explicit about required vs optional parameters, default values, and error codes
- Identify negative scenarios (invalid payloads, schema drift) that must pass
- Reference skills or scripts used for reproducibility
- Include sample payloads or logs stored under `artifacts/qa/contract/`
- Reference existing Task Package using task_reference parameter

### **Process Compliance**
- Tag unresolved items as `Open Question:` with owner + due date
- Store test artifacts under `.spec/tasks/<task_reference>/artifacts/qa/contract/`
- Update Activity Log with contract test verdicts and timestamps
- Maintain comprehensive documentation of test execution and results
- Ensure test reproducibility through proper environment and data management

### **Boundary Conditions**
- Do not modify production schemas during contract testing
- Do not test consumer implementations; focus on interface contracts
- Do not create breaking changes without explicit compatibility assessment
- Avoid testing deprecated or unsupported interface versions
- Do not bypass authentication or security controls during testing

### **Validation Protocols**
- Verify schema source is accessible and valid
- Confirm consumer matrix is comprehensive and accurate
- Validate test environment accurately reflects production setup
- Ensure tooling is compatible with interface protocols and formats
- Test all identified risk hotspots and fragile scenarios

## **Execution Parameters**

### **Success Criteria**
- All interface contracts pass schema validation and compatibility tests
- Consumer compatibility is verified for all dependent services
- No breaking changes are introduced without explicit consumer notification
- Test results are documented with clear pass/fail status and issue details
- Recommendations are provided for any identified compatibility issues

### **Error Handling**
- If schema validation fails, identify specific validation errors and required fixes
- When consumer incompatibility is discovered, document impact and mitigation strategies
- For test environment issues, resolve configuration problems and re-execute tests
- If tooling compatibility problems arise, select alternative frameworks or update configurations
- When breaking changes are unavoidable, create consumer migration plans and communication strategies

## **Example Usage**
```
Use the qa-contract skill with these parameters:
task_reference: 2025-demo
interface_name: audit.topic
contract_version: audit.v1
consumer_matrix:
  - billing service v3
  - refunds service v2
schema_source: schemas/audit.v1.avsc
change_log:
  - Added field sourceRegion (optional, default=unspecified)
  - Deprecated rawHeaders
backward_compat: Compatible with v2.0 consumers; new field optional
test_environment: staging-audit.kafka.local
tooling:
  - Dredd audit-openapi.yaml
  - Avro schema compatibility check
risk_hotspots:
  - Ensure sourceRegion default maps to `unspecified`
  - Confirm rawHeaders gracefully ignored downstream
update_scope:
  - Testing Notes
  - Risks
```