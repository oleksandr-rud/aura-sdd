research.skill

## **Purpose**
Transforms uncertainty into actionable knowledge through systematic investigation and evidence-based analysis across technical, market, regulatory, and customer domains to enable informed decision-making.

## **Target Agent**
Research Analyst - agents who transform uncertainty into actionable knowledge through systematic investigation and evidence-based analysis across multiple domains.

## **Trigger Scenarios**
- When task progression requires research to resolve knowledge gaps, validate assumptions, or gather evidence for critical decisions
- When technical architecture decisions need investigation into best practices, tools, or approaches
- When market or competitive analysis is needed to inform product strategy or positioning
- When regulatory or compliance requirements need investigation for implementation planning
- When customer insights or user research is needed to validate product assumptions

## **Required MCPs/Tools**
- Web search and information retrieval systems for comprehensive research across multiple sources
- Document analysis tools for processing technical documentation, research papers, and industry reports
- Database access systems for querying structured information and datasets
- Collaboration platforms for gathering stakeholder input and expert opinions
- Knowledge management systems for organizing and storing research findings

## **Core Procedure (SOP)**

### **Phase 1: Research Planning & Scope Definition**
1. **Define Research Objectives**: Clarify specific decisions that research must enable and questions that must be answered
2. **Establish Success Criteria**: Determine measurable outcomes that indicate research completion and success
3. **Scope Investigation Boundaries**: Define research domain, timeframes, and constraints to prevent scope creep
4. **Plan Research Methodology**: Select appropriate research approaches and information sources

### **Phase 2: Information Gathering & Analysis**
1. **Collect Information**: Gather data from specified sources using appropriate research methods
2. **Evaluate Source Credibility**: Assess reliability, authority, and relevance of information sources
3. **Analyze and Synthesize**: Process collected information to identify patterns, insights, and relationships
4. **Validate Findings**: Cross-reference information across multiple sources for accuracy and completeness

### **Phase 3: Insight Generation & Recommendation Development**
1. **Extract Key Insights**: Identify most significant findings that address research objectives
2. **Develop Recommendations**: Create specific, actionable recommendations based on evidence
3. **Assess Confidence Levels**: Evaluate certainty of findings and identify knowledge gaps
4. **Risk Assessment**: Identify potential risks and uncertainties related to research findings

### **Phase 4: Documentation & Communication**
1. **Prepare Research Summary**: Create concise executive summary of findings and recommendations
2. **Document Detailed Findings**: Record comprehensive research results with supporting evidence
3. **Update Knowledge Base**: Store research outcomes for future reference and organizational learning
4. **Communicate to Stakeholders**: Present findings in appropriate format for target audience

## **Required Parameters**
| Parameter | Description | Format | Example |
|---|---|---|---|
| `task_reference` | Task-ID or slug for the task file | ULID or kebab-case | `2025-kyc-automation` |
| `research_objective` | What decision or understanding this research enables | sentence | `Determine optimal async audit trail architecture` |
| `research_questions` | Specific questions that must be answered | bullet list | `What are the performance characteristics of Kafka vs. RabbitMQ?` |
| `success_criteria` | How to determine when research is complete | bullet list | `Performance benchmarks available`, `Implementation approach recommended` |

## **Optional Parameters**
| Parameter | Description | Usage |
|---|---|---|
| `research_scope` | Boundaries for investigation (industries, technologies, timeframes) | Prevents scope creep |
| `information_sources` | Preferred sources to consult | Guides research methodology |
| `research_depth` | Level of detail required (`exploratory`, `standard`, `comprehensive`) | Sets effort expectations |
| `stakeholder_audience` | Who will consume the findings | Tailors communication style |
| `delivery_format` | How findings should be presented (`executive-summary`, `technical-brief`, `detailed-report`) | Ensures stakeholder needs are met |
| `decision_deadline` | When findings are needed for decision making | Creates urgency and prioritization |

## **Execution Templates**

### **Research Executive Summary**
```
Research Summary
- Objective: [What was investigated]
- Key Findings: [Top 3-5 discoveries]
- Recommendations: [Clear, actionable recommendations]
- Confidence Level: [High/Medium/Low with rationale]
- Next Steps: [What should happen based on findings]
```

### **Detailed Findings Table**
| Question | Finding | Evidence | Confidence |
|---|---|---|---|
| [Research Question] | [Answer/Discovery] | [Source/Data] | [High/Medium/Low] |

### **Risk Assessment**
| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| [Risk Description] | [High/Medium/Low] | [High/Medium/Low] | [Mitigation Approach] |

### **Rolling Summary Update**
```
Context: [Updated context based on research findings]
Facts: [New facts discovered through research]
Decisions: [Decisions enabled or informed by research]
Risks: [New risks identified or existing risks updated]
Next: [Next steps based on research recommendations]
```

## **Quality Standards & Guardrails**

### **Requirements**
- Information must come from credible, authoritative sources
- Information must directly address research questions
- Information must be current and applicable to decision timeframe
- Analysis must be unbiased and evidence-based
- Findings must lead to clear, implementable recommendations
- All research questions must be answered with supporting evidence

### **Process Compliance**
- Risk assessment must be complete with mitigation strategies
- Recommendations must be evidence-based and clearly actionable
- Rolling Summary must be updated with research outcomes
- Activity Log must document research completion and next steps
- Stay within defined research scope and timeframes
- Use specified information sources and validate credibility

### **Boundary Conditions**
- Do not make assumptions without evidence - mark as "Inferred" if necessary
- Do not exceed specified research depth without stakeholder approval
- Must meet decision deadline or communicate delays proactively
- Do not present opinions as facts without supporting evidence
- Avoid sources with clear conflicts of interest or bias

### **Validation Protocols**
- Cross-validate findings with multiple sources when possible
- Peer review for complex or high-impact research
- Document all sources and evidence clearly
- Test critical assumptions when feasible
- Verify recommendations are implementable within project constraints

## **Execution Parameters**

### **Success Criteria**
- All research questions are thoroughly answered with supporting evidence
- Findings directly support the specified research objective
- Recommendations are actionable and aligned with stakeholder needs
- Confidence levels are clearly stated and justified
- Research is delivered within specified timeframe and scope

### **Error Handling**
- If credible sources cannot be found, document limitations and expand search parameters
- When conflicting information is discovered, analyze discrepancies and seek additional sources
- For incomplete research due to time constraints, document gaps and prioritize follow-up activities
- If stakeholder requirements are unclear, seek clarification before proceeding
- When research scope expands beyond capacity, communicate with stakeholders to re-prioritize

## **Example Usage**
```
Use the research skill with these parameters:
task_reference: 2025-kyc-automation
research_objective: Determine optimal architecture for async audit trail system
research_questions:
  - What are the performance characteristics of Kafka vs. RabbitMQ for audit events?
  - What are the operational costs and complexity of managing event streaming infrastructure?
  - How do different approaches impact data consistency and recovery scenarios?
success_criteria:
  - Performance benchmarks for throughput and latency available
  - Cost analysis for 12-month operational period completed
  - Clear recommendation with implementation roadmap provided
research_scope: Focus on CNCF-approved technologies and established SaaS solutions
research_depth: comprehensive
stakeholder_audience: architect-orchestrator, tech-lead-orchestrator
delivery_format: technical-brief
decision_deadline: 2025-02-15
```