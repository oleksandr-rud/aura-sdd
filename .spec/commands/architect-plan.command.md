# Architect Plan Command - System Instructions

> **Filename:** `./spec/commands/architect-plan.command.md`  
> **Purpose:** Capture the inputs the Architect Orchestrator needs to shape or refine technical solutions inside the shared Task Package. Use this command when architectural exploration, decision proposals, risk posture updates, or validation planning is required for an existing initiative.

---

## Command Intent

- Scenario: the user requests architectural guidance (solution options, component design, risk assessment, validation approach) tied to a known Task Package.
- Outcome: provide structured context so the Architect agent updates architecture sections without spawning separate documents.
- This command records intent; execution occurs via the Architect Orchestrator interpreting the payload, honoring `task_reference`, and appending Activity Log entries.

## Required Fields

| Field | Description | Format | Required | Example |
|---|---|---|---|---|
| `task_reference` | Task-ID or slug for the existing Task Package | ULID or kebab-case | yes | `20251013-onboarding-funnel` |
| `architecture_goal` | What the architecture work must enable or decide | sentence | yes | `Select a resilient KYC document processing pipeline` |
| `constraints` | Key technical or business constraints | bullet list | yes | `GDPR storage, <200ms p95, vendor SLA 1s` |
| `quality_targets` | Performance, reliability, security, or scalability targets | list or table | yes | `p95 < 150ms, 99.9% availability` |
| `update_scope` | Sections to refresh (`Architecture Overview`, `Decision Log`, `Validation & Experiments`, etc.) | list | yes | `Architecture Overview`, `Decision Log`, `Validation & Experiments` |

If a required field is missing, the Architect infers cautiously, tags the assumption with `- Inferred`, and records an `Open Question`.

## Optional Enhancers

| Field | Description | Usage |
|---|---|---|
| `decision_hypotheses` | Hypotheses or questions under evaluation | Seeds Decision Log and experiments |
| `current_state` | Description of existing architecture/process | Provides baseline for comparison |
| `candidate_approaches` | Options already considered or desired | Guides trade-off analysis |
| `risk_register` | List of risks with severity/likelihood | Feeds Architecture Overview and mitigations |
| `mitigation_plan` | Actions, owners, timelines for risks | Aligns with Implementation Guidance |
| `validation_plan` | Planned experiments, owners, target metrics | Populates Validation & Experiments |
| `validation_results` | Outcomes from prototypes or benchmarks | Updates Validation & Experiments and Decision Log |
| `dependencies` | Teams, systems, approvals involved | Aligns with Product Ops/Tech Lead planning |
| `prototype_requests` | Desired spikes or proof-of-concepts | Directs collaboration with code-implement |
| `integration_points` | Systems or APIs that must be incorporated | Shapes module boundaries |
| `artifacts` | Diagrams, previous ADRs, references | Added to Task Package `Artifacts` section |
| `open_questions` | Outstanding questions or data needs | Captured for follow-up in Task Package |
| `rolling_summary_delta` | Compact snippet using `Context, Facts, Decisions, Risks, Next` | Keeps the Rolling Summary aligned with architectural decisions |

## Tone & Structure

- Be concise; prefer tables and short bullet lists.
- Quantify targets, risks, and validation metrics (latency, availability, error budgets, costs).
- Label unresolved items as `Open Question: ...` and identify which decision they block.
- Reference internal systems by logical name only; do not include secrets or sensitive URLs.
- When revising previous guidance, note the delta (`Updated: lowered p95 target to 130ms`) to support clear Activity Log entries.
- Provide a Rolling Summary update whenever critical architecture facts, risks, or next steps change.

## Structured Output Requirements

- Responses should append:
  ```
  Rolling Summary Update
  Context: ...
  Facts: ...
  Decisions: ...
  Risks: ...
  Next: ...
  ```
- Use precise identifiers (ARCH- IDs, service names, SLAs) and assign owners/dates for Decisions and Next.
- Link to design artifacts rather than embedding diagrams inline.

## Example Payload

```
[command](architect-plan.command.md)
task_reference: 20251013-onboarding-funnel
architecture_goal: Select resilient architecture for automated KYC document processing.
constraints:
  - GDPR-compliant storage in EU region only.
  - Vendor API SLA 99.5%, max 3 retries.
  - Latency budget p95 < 150ms end-to-end.
quality_targets:
  - p95 latency < 150ms
  - Error rate < 0.5%
  - Availability 99.9%
update_scope:
  - Architecture Overview
  - Decision Log
  - Validation & Experiments
decision_hypotheses:
  - H1: Queue-based retry reduces failure rate by 40%.
  - H2: Streaming pipeline improves latency but adds complexity.
current_state: Manual review workflow with synchronous vendor calls; no retries.
candidate_approaches:
  - Queue + worker retry
  - Streaming pipeline with backpressure
risk_register:
  - Vendor throttling under spikes (Severity High, Likelihood Medium).
  - Increased operational load for monitoring queues (Severity Medium, Likelihood Medium).
mitigation_plan:
  - Implement autoscaling for retry workers (Owner: Tech Lead, due 2025-11-15).
  - Add vendor status cache with circuit breaker (Owner: Architect, due 2025-11-10).
validation_plan:
  - Load test vendor failure scenarios (Owner: Engineer, target p95 < 150ms).
validation_results:
  - Prototype retry flow shows p95 142ms; retry success 93%; memory usage +12%.
dependencies:
  - Ops team for alerting integration.
  - Data Engineering for event schema updates.
prototype_requests:
  - Spike: simulate vendor failure rates with queue retry logic.
open_questions:
  - Confirm if we can cache vendor responses for 24h within compliance.
rolling_summary_delta:
  Context: KYC automation architecture with GDPR storage limitations and vendor SLA.
  Facts: Baseline latency 210ms p95; retry success target 90%; autoscaling required.
  Decisions: Prefer queue + worker retry pattern (Owner: Architect, review 2025-11-10).
  Risks: Vendor throttling (High/Medium) mitigated via autoscaling + circuit breaker.
  Next: Engineer → 2025-10-25 deliver load test results; PM → 2025-10-22 confirm compliance cache policy.
```

## Downstream Expectations

- Architect agent consumes this payload, updates the specified sections (Architecture Overview, Decision Log, Validation & Experiments), and logs changes (e.g., `2025-10-14T16:05:00+03:00 - Updated architecture overview; added ARCH-002 decision`).
- Product Ops Orchestrator references the architectural outputs when adjusting PRD/Agile sections to keep a single source of truth.
- Engineering and Tech Lead agents rely on the documented decisions, risks, and validation notes to scope implementation tasks and spikes via `code-implement`.

---

**End of command spec.**
