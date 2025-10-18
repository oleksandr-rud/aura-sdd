product-prd.skill

## **Purpose**
Transforms business problems and user needs into structured Product Requirements Documents within existing Task Packages, enabling coordinated development, testing, and delivery across technical teams.

## **Target Agent**
product-ops-orchestrator

## **Trigger Scenarios**
- **New Initiative**: When business problems require structured product specification
- **PRD Updates**: When existing product requirements need modification or enhancement
- **Metrics Definition**: When success criteria need to be quantified and tracked
- **Timeline Planning**: When delivery milestones and launch dates need coordination
- **Stakeholder Alignment**: When product decisions require documentation and buy-in

## **Required MCPs/Tools**
- **Documentation Systems**: Task Package access, PRD template application
- **Analytics Platforms**: Market research data, user analytics, performance metrics
- **Project Management**: Timeline tracking, milestone planning, dependency management
- **Communication**: Stakeholder coordination, feedback collection, approval workflows
- **Research Tools**: User interviews, competitive analysis, market research

## **Core Procedure (SOP)**

### **Phase 1: Problem Definition**
1. **Problem Articulation**: Clearly define the business problem and user impact
2. **User Identification**: Specify target audiences, personas, and use cases
3. **Context Analysis**: Document market conditions, competitive landscape, and strategic alignment
4. **Opportunity Assessment**: Evaluate potential impact and business value

### **Phase 2: Solution Specification**
1. **Requirements Definition**: Articulate functional and non-functional requirements
2. **Success Metrics**: Establish measurable KPIs and success criteria
3. **Acceptance Criteria**: Define specific conditions for solution success
4. **Timeline Planning**: Set realistic delivery milestones and launch dates

### **Phase 3: Risk & Constraint Analysis**
1. **Risk Identification**: Catalog potential delivery and adoption risks
2. **Constraint Documentation**: Document technical, business, and regulatory limitations
3. **Dependency Mapping**: Identify required resources, approvals, and cross-team coordination
4. **Mitigation Planning**: Develop strategies to address identified risks and constraints

### **Phase 4: Integration & Validation**
1. **Task Package Integration**: Ensure PRD aligns with existing Task Package structure
2. **Stakeholder Review**: Collect feedback and obtain necessary approvals
3. **Cross-Team Coordination**: Align development, QA, and architecture teams
4. **Documentation Updates**: Update all relevant Task Package sections

## **Required Parameters**
| Parameter | Description | Format | Example |
|---|---|---|---|
| `task_reference` | Existing Task-ID or slug for integration | ULID or kebab-case | `20251013-onboarding-funnel` |
| `title` | Short initiative name | Plain text | `Onboarding friction fix` |
| `problem` | Primary problem statement (who/what/where) | Paragraph | `New EU users abandon during KYC review` |
| `goal` | Business outcome with measurable target | Sentence | `Raise D1 activation to 45%` |
| `audience` | Target segments or personas | List or sentence | `New EU consumer accounts` |
| `success_metrics` | KPIs tied to the goal | Bullets or mini-table | `Activation rate (P1)` |
| `deadline_or_window` | Desired launch date or timebox | ISO date or month | `2025-11-30` |

## **Optional Parameters**
| Parameter | Description | Usage |
|---|---|---|
| `constraints` | Legal, technical, or operational limits | Sets guardrails for PRD scope and delivery risks |
| `alignment` | Strategy, OKR, or roadmap links | Guides prioritization and stakeholder messaging |
| `hypotheses` | Existing hypotheses or insights | Seeds Analytics & Research before PRD drafting |
| `competitive_refs` | Competitor benchmarks, screenshots | Supports design and positioning decisions |
| `dependencies` | Teams, systems, or approvals needed | Feeds agile plan, risk register, and staffing |
| `artifacts` | Links to decks, dashboards, docs | Land in Task Package Section 4 (Artifacts) |
| `update_scope` | Sections to refresh (e.g., `2.PRD`, `3.Agile Plan`) | Directs agents to target their edits |

## **Format**

### **PRD Update**
```
Title: [Initiative name]
Problem: [Clear problem statement with user impact]
Goal: [Measurable business outcome]
Target Audience: [User segments/personas]
Deadline: [Launch date or timeframe]

Success Metrics:
- [Primary KPI] → [Target] (Measurement: [How tracked])
- [Secondary KPI] → [Target] (Measurement: [How tracked])

Key Requirements:
- [Functional requirement 1]
- [Functional requirement 2]
- [Non-functional requirement if applicable]

Constraints & Dependencies:
- [Constraint 1]: [Impact]
- [Dependency 1]: [Owner, Timeline]

Acceptance Criteria:
- [Criterion 1]: [Success definition]
- [Criterion 2]: [Success definition]
```

### **Rolling Summary Update**
```
Context: [Updated context based on PRD scope]
Facts: [Problem scope, success metrics, target audience, deadline]
Decisions: [Scope decisions, priority trade-offs, timeline commitments]
Risks: [Delivery risks with RAG status and mitigation ownership]
Next: [Immediate next steps for PRD execution]
```

## **Guardrails**

### **Quality Standards**
- Quantify targets, cohorts, sample sizes, and budgets wherever possible
- Use plain English with concise sentences and executive-ready bullets
- Provide measurable success criteria with clear tracking mechanisms
- Ensure problem statement clearly articulates user impact and business relevance

### **Process Requirements**
- Reference existing Task Package using task_reference parameter
- Tag known unknowns as `Open Question: ...` with affected sections
- Call out deltas when revising existing targets or metrics
- Maintain Activity Log entries with timestamps for all changes

### **Boundaries & Constraints**
- Do not create separate PRD documents outside Task Package
- Do not include secret URLs, tokens, or sensitive credentials
- Do not override existing stakeholder decisions without explicit change notes
- Avoid implementation details; focus on what, not how

### **Validation Requirements**
- Verify success metrics are measurable and time-bound
- Confirm target audience is specific enough to guide development
- Validate constraints have clear ownership and impact assessment
- Ensure dependencies have identifiable owners and resolution paths

## **State Transitions**
- **Product Idea → Structured PRD**: Transforms business concepts into defined requirements with clear success metrics and acceptance criteria
- **Existing PRD → Updated PRD**: Modifies existing product specifications with new requirements, metrics, or timeline adjustments

## **Example Usage**
```
Use the product-prd skill with these parameters:
task_reference: 20251013-onboarding-funnel
title: KYC flow uplift
problem: EU consumers abandon during document upload causing 32% drop in activation
goal: Lift activation from 38% to 48% by Q1 2026
audience: New EU consumer accounts
success_metrics:
  - Activation rate (P1) → 48% weekly (Updated from 45%)
  - KYC completion rate (P1) → 75%
deadline_or_window: 2026-03-31
constraints:
  - Must comply with GDPR and local KYC retention policies
  - No SMS fallback in DE market
dependencies:
  - Compliance sign-off
  - Data Engineering for event audit
update_scope:
  - 2.PRD
  - 3.Agile Plan backlog
```