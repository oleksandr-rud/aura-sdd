agile-plan.skill

## **Purpose**
Transforms delivery intentions into structured agile plans, enabling coordinated sprint execution and capacity management across development teams within existing Task Packages.

## **Target Agent**
Product Operations agents who transform delivery intentions into structured agile plans, enabling coordinated sprint execution and capacity management across development teams.

## **Trigger Scenarios**
- When new initiatives require sprint planning and backlog prioritization within existing Task Packages
- When existing delivery plans need updating due to scope changes, capacity adjustments, or timeline shifts
- When team capacity or velocity changes require roadmap rebalancing and sprint re-sequencing
- When dependencies or risks impact delivery timelines and require plan adjustments
- When stakeholder priorities change and backlog ordering needs to be updated

## **Required MCPs/Tools**
- Project management systems (Jira, Azure DevOps, Trello) for sprint tracking and backlog management
- Capacity planning tools (Velocity calculators, resource allocation spreadsheets) for team workload management
- Roadmap visualization tools (Productboard, Roadmunk) for timeline and milestone tracking
- Dependency mapping tools (Dependency graphs, cross-functional team matrices) for identifying delivery blockers
- Risk assessment frameworks (Risk registers, mitigation tracking) for proactive delivery risk management

## **Core Procedure (SOP)**

### **Phase 1: Requirements Analysis & Scope Definition**
1. **Define Delivery Goal**: Clarify the specific outcome that upcoming sprints must achieve, including success criteria and stakeholder expectations
2. **Identify Core Epics**: Break down delivery goals into major epics or themes that represent significant deliverable chunks
3. **Assess Time Constraints**: Define sprint windows, milestone dates, and any external deadlines that constrain delivery
4. **Map Team Capabilities**: Document available teams, roles, skills, and any capacity constraints or limitations

### **Phase 2: Capacity & Resource Planning**
1. **Calculate Team Velocity**: Use historical data or team estimates to determine realistic sprint capacity in story points or person-weeks
2. **Map Dependencies**: Identify external teams, systems, or approvals that could block delivery and plan accordingly
3. **Assess Quality Gates**: Define testing, compliance, or sign-off checkpoints that must be incorporated into the plan
4. **Identify Risks**: Document known delivery risks with probability assessments and mitigation strategies

### **Phase 3: Sprint Sequencing & Backlog Prioritization**
1. **Sequence Epics Across Sprints**: Distribute core epics across available sprint capacity based on dependencies and business value
2. **Prioritize User Stories**: Order backlog items by business value, technical dependencies, and delivery risk considerations
3. **Define Sprint Goals**: Create clear, measurable objectives for each sprint that align with overall delivery goals
4. **Buffer for Uncertainty**: Allocate contingency capacity for unexpected issues or scope adjustments

### **Phase 4: Plan Documentation & Validation**
1. **Document Roadmap**: Create sprint-by-sprint timeline with key deliverables and milestone dates
2. **Update Risk Register**: Document identified risks with mitigation plans, owners, and monitoring approaches
3. **Validate Feasibility**: Review plan with technical leads and team members to confirm achievability
4. **Update Task Package**: Record plan details in relevant sections and update Activity Log with planning decisions

## **Required Parameters**
| Parameter | Description | Format | Example |
|---|---|---|---|
| `task_reference` | Task-ID or slug linking to existing Task Package | ULID or kebab-case | `20251013-onboarding-funnel` |
| `delivery_goal` | Desired outcome from upcoming sprints/iterations | Sentence | `Ship KYC uplift MVP before Q1 close` |
| `sprint_window` | Timebox for the plan (sprints or date range) | ISO dates or count | `2025-11-03 -> 2026-01-26 (4 sprints)` |
| `epics_or_themes` | Core epics/themes that must be delivered | List | `KYC UX`, `Document processing`, `Notifications` |
| `team_setup` | Teams or roles delivering the work | List or table | `Growth Squad (PM, TL, 4 FE, 2 BE)` |

## **Optional Parameters**
| Parameter | Description | Usage |
|---|---|---|
| `capacity` | Velocity, story points, or staffing constraints | Feeds sprint sizing and risk management |
| `dependencies` | External teams, systems, or approvals blocking delivery | Drives risk register and DoR notes |
| `quality_gates` | Testing, compliance, or sign-off checkpoints | Informs QA planning and DoD updates |
| `risks` | Known delivery risks with probability/impact | Populates risk register and mitigation plan |
| `backlog_seed` | Initial user stories with effort/value hints | Seeds backlog ordering |
| `release_plan` | Target release milestones or launch phases | Shapes roadmap milestones |
| `update_scope` | Sections to refresh (`Roadmap`, `Backlog`, `Capacity`) | Focuses downstream edits |

## **Execution Templates**

### **Agile Plan Update**
```
Delivery Goal: [Clear objective]
Sprint Window: [Timebox with dates/sprint count]
Team Setup: [Teams and roles]
Epics/Themes: [Core delivery items]

Roadmap:
- Sprint 1 ([dates]): [Key deliverables]
- Sprint 2 ([dates]): [Key deliverables]
- Sprint 3+ ([dates]): [Key deliverables]

Backlog Priorities:
1. [User story/epic] (Effort: X, Value: High)
2. [User story/epic] (Effort: Y, Value: Medium)

Capacity Notes:
- [Team/Resource]: [Velocity or capacity details]

Risk Register:
- [Risk]: [Impact/Probability] - [Mitigation approach]

Next Steps:
- [Action] (Owner: [Name], Due: [Date])
```

### **Rolling Summary Update**
```
Context: [Updated context based on delivery planning]
Facts: [Sprint windows, velocities, key backlog IDs, team assignments]
Decisions: [Sprint prioritization, resource allocation, scope decisions]
Risks: [Delivery risks with RAG status and mitigation ownership]
Next: [Immediate next steps for plan execution]
```

## **Quality Standards & Guardrails**

### **Requirements**
- Use consistent units for effort (story points, person-weeks) and note the unit clearly
- Quantify capacity, dates, and deliverables with specific targets
- Mark assumptions clearly with `- Inferred` tag when parameters are missing
- Provide clear RAG status for all identified risks
- Reference existing Task Package using task_reference parameter

### **Process Compliance**
- Tag unresolved items as `Open Question: ...` with affected components
- Call out changes explicitly when revising existing plans
- Update Activity Log with timestamp and nature of changes
- Maintain audit trail of plan evolution and decision rationale
- Ensure stakeholder alignment on delivery goals and constraints

### **Boundary Conditions**
- Do not assign specific work items to individual developers
- Do not create separate documents or artifacts outside Task Package
- Do not override existing sprint commitments without explicit change notes
- Avoid PII; refer to teams by role or squad name only
- Do not commit to deliverables that exceed calculated team capacity

### **Validation Protocols**
- Verify sprint capacity aligns with team historical velocity
- Confirm dependencies have clear owners and resolution timelines
- Validate quality gates have measurable acceptance criteria
- Ensure risk mitigation plans have specific owners and due dates
- Test roadmap feasibility against technical constraints and dependencies

## **Execution Parameters**

### **Success Criteria**
- Sprint capacity is realistically allocated based on team velocity and availability
- All identified dependencies have clear owners and resolution timelines
- Risk register is comprehensive with mitigation strategies and monitoring plans
- Backlog prioritization aligns with business value and delivery constraints
- Stakeholder alignment achieved on delivery goals and sprint sequencing

### **Error Handling**
- If capacity calculations seem unrealistic, adjust based on team feedback and historical data
- When dependencies lack clear owners, escalate to appropriate stakeholders for resolution
- For risks without mitigation strategies, develop contingency plans and monitoring approaches
- If sprint sequencing creates conflicts, re-prioritize based on business impact and dependencies
- When quality gates are undefined, work with QA team to establish clear acceptance criteria

## **Example Usage**
```
Use the agile-plan skill with these parameters:
task_reference: 20251013-onboarding-funnel
delivery_goal: Ship KYC flow uplift MVP before Q1 close with monitored rollout
sprint_window: 2025-11-03 -> 2026-01-26 (4 sprints)
epics_or_themes:
  - KYC UX rewrite
  - Document automation service
  - Notifications and recovery paths
team_setup:
  - Growth Squad: PM, Tech Lead, 3 FE, 2 BE, 1 DS
capacity:
  - Growth Squad velocity: 32 SP / sprint (Updated from 28 SP)
dependencies:
  - Compliance review (Sprint 2 gate)
  - Data Engineering event audit (Sprint 1 support)
quality_gates:
  - QA regression suite before Sprint 3 end
  - Legal retention approval prior to launch
risks:
  - Document vendor SLA variability (High impact / Medium probability)
backlog_seed:
  - US-401 Document capture redesign (13 SP, Value High)
  - US-402 Identity verification tracking (8 SP, Value Medium)
update_scope:
  - Roadmap
  - Backlog
  - Risk Register
```