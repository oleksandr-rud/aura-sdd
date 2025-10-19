# product-prd.skill

**Target Agent**: product-ops-orchestrator
**Purpose**: Transforms business problems into structured Product Requirements Documents.

**When to Use**:
- New initiatives requiring product specification
- PRD updates and modifications
- Success metrics definition and timeline planning

**Required Parameters**:
| Parameter | Description | Example |
|---|---|---|
| `task_reference` | Task ID or slug | `20251013-onboarding-funnel` |
| `title` | Initiative name | `Onboarding friction fix` |
| `problem` | Problem statement | `New EU users abandon during KYC review` |
| `goal` | Business outcome with target | `Raise D1 activation to 45%` |
| `audience` | Target segments | `New EU consumer accounts` |
| `success_metrics` | KPIs tied to goal | `Activation rate (P1)` |
| `deadline_or_window` | Launch date or timeframe | `2025-11-30` |

**Optional Parameters**:
- `constraints` - Legal/technical/operational limits
- `dependencies` - Teams/systems/approvals needed
- `alignment` - Strategy/OKR/roadmap links
- `update_scope` - Sections to refresh

**Procedure**:
1. **Problem Definition**: Articulate business problem and user impact
2. **Solution Specification**: Define requirements, success metrics, timeline
3. **Risk Analysis**: Identify constraints, dependencies, mitigation strategies
4. **Integration**: Align with task package structure and stakeholders

**Output Format**:
```
Title: [Initiative name]
Problem: [Problem statement with user impact]
Goal: [Measurable business outcome]
Target Audience: [User segments]
Deadline: [Launch date]

Success Metrics:
- [KPI] → [Target] (Measurement: [tracking])

Key Requirements:
- [Functional/non-functional requirements]

Constraints & Dependencies:
- [Constraints]: [Impact]
- [Dependencies]: [Owner, Timeline]

Acceptance Criteria:
- [Success criteria with clear definitions]
```

**Quality Standards**:
- Use clear, concise language with measurable targets
- Focus on what, not how (avoid implementation details)
- Ensure problem statement articulates user impact
- Provide measurable success criteria with tracking mechanisms

**Example Usage**:
```
task_reference: 20251013-onboarding-funnel
title: KYC flow uplift
problem: EU consumers abandon during document upload causing 32% drop in activation
goal: Lift activation from 38% to 48% by Q1 2026
audience: New EU consumer accounts
success_metrics: [Activation rate (P1) → 48% weekly]
deadline_or_window: 2026-03-31
```