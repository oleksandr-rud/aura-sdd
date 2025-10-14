# QA Contract Command - System Instructions

> **Filename:** `./spec/commands/qa-contract.command.md`  
> **Purpose:** Standardise contract testing briefs so QA can validate interface compatibility, log results, and update the task file with clear pass/fail evidence.

---

## Command Intent

- Use when interfaces (REST, GraphQL, gRPC, event streams) change or require regression validation.
- Describe contract version, consumers, and tooling so QA can run suites and capture compatibility risks.
- Ensure results feed into Testing Notes, Risks, and the Activity Log.

## Required Fields

| Field | Description | Format | Example |
| --- | --- | --- | --- |
| `task_reference` | Task-ID or slug for the task file | ULID or kebab-case | `2025-demo` |
| `interface_name` | API/event/topic identifier | string | `audit.topic` |
| `contract_version` | Schema or version under test | string | `audit.v1` |
| `consumer_matrix` | Consumers + versions dependent on the contract | list/table | `billing v3, refunds v2` |

Missing fields require logging an `Open Question:` with owner + due date; assumptions are marked `- Inferred`.

## Optional Enhancers

| Field | Description | Usage |
| --- | --- | --- |
| `schema_source` | Path/URL to OpenAPI, protobuf, Avro, etc. | Drives tooling |
| `change_log` | Summary of deltas from previous version | Focuses validation |
| `backward_compat` | Expected compatibility posture | Sets pass criteria |
| `test_environment` | Environment or sandbox reference | Ensures reproducibility |
| `tooling` | Test frameworks (Pact, Dredd, Schemathesis) | Aligns execution |
| `risk_hotspots` | Known fragile fields or scenarios | Prioritises checks |
| `update_scope` | Sections to refresh (`Testing Notes`, `Risks`) | Keeps edits aligned |
| `rolling_summary_delta` | Boolean (default `true`) controlling RS update | Set `false` only if skipping |

## Tone & Structure

- Be explicit about required vs optional fields, default values, and error codes.
- Identify negative scenarios (invalid payloads, schema drift) that must pass.
- Reference commands or scripts used for reproducibility.
- When failures occur, include sample payloads or logs stored under `artifacts/qa/contract/`.

## Structured Output Requirements

1. **Contract Test Summary**
   - Scope (endpoints/events, consumers, environment)
   - Results (pass/fail counts, key evidence)
   - Risks (compatibility issues with RAG + mitigation)
   - Next Actions (owner + due date)
2. **Rolling Summary Update** (unless `rolling_summary_delta: false`) using standard schema.

## Example Payload

```yaml
[command](qa-contract.command.md)
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

## Downstream Expectations

- QA executes contract suites, updates Testing Notes and Risks, stores artifacts under `.spec/tasks/<task_reference>/artifacts/qa/contract/`, and logs outcomes (`YYYY-MM-DDTHH:MM:SS+03:00 - qa-orchestrator - Contract audit.v1 passed`).
- Any breaking issues trigger Risk updates and assignments to Tech Lead/Product Ops for remediation.
- Once compatibility is confirmed, link schema versions and Pact/diff artifacts in Metrics & Evidence.

---

**End of command spec.**
