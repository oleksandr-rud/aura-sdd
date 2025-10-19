# Agent Template

## **Quick Start Guide**

**For New Agents**: Follow this template structure exactly. All sections are required for complete agent definitions.

**Interactive Guidance**: This template includes helpful notes and examples to guide your agent creation.

**Template Variables**: You can use variables like `{{agent-name}}`, `{{agent-type}}`, and `{{specialization}}` to personalize content.

## **Abstract Structure & Format**

### **Filename Convention**
`agentname.agent.md`
*💡 **Tip**: Use descriptive names that clearly indicate the agent's role and specialization.*

### **Core Structure (Sequential Order)**

```markdown
# [Agent Name]

## **Purpose**
*[1-2 sentences describing what the agent does and transforms]*
*Focus on the agent's unique value and transformation capabilities*

## **Target Agent**
*[Specific agent identifier - this should match the filename]*
*Example: tech-lead-orchestrator, product-ops-orchestrator, architect-orchestrator, qa-orchestrator*

## **Core Responsibilities**
*[What are the agent's primary duties? Keep it focused and actionable]*
- [Primary responsibility 1]
- [Primary responsibility 2]
- [Primary responsibility 3]

## **Skill Portfolio**
*[What skills does this agent have access to? Group by function]*
*Include context-compact in every agent for Activity Log management*

### **[Category 1]**
- `skill-name` – [brief description of skill purpose]
- `skill-name` – [brief description of skill purpose]

### **[Context Management]**
- `context-compact` – Activity Log management to maintain task file usability while preserving audit trail
- Run `context-compact` before adding extensive {{agent-type}} content to task file

### **[Additional Categories]**
*Add categories as needed for the agent's specialization*

*🎯 **Guidance**: Think about the agent's workflow and what skills they need at each phase.*

## **Core Workflow**
*The agent's standard operating procedure - how they work through tasks*
*Design this to match the agent's specialization and typical work patterns*

### **Phase 1: [Phase Name]**
*What's the first thing this agent should do when starting a task?*
1. [Step description - specific action the agent should take]
2. [Step description]
3. [Step description]

### **Phase 2: [Phase Name]**
*What's the main work phase for this agent?*
1. [Step description]
2. [Step description]
3. [Step description]

### **Phase 3: [Phase Name]**
*How does the agent validate and review their work?*
1. [Step description]
2. [Step description]
3. [Step description]

### **Phase 4: [Phase Name]**
*How does the agent wrap up and hand off to others?*
1. [Step description]
2. [Step description]
3. [Step description]

*🔄 **Workflow Guidance**:
- Design phases that match the agent's typical task lifecycle
- Include documentation and communication responsibilities
- Consider how this agent coordinates with other agents
- Include quality validation and handoff procedures*

## **Quality Standards**

### **[Category] Quality**
*What quality standards must this agent maintain?*
- [Quality requirement 1]
- [Quality requirement 2]
- [Quality requirement 3]

### **Process Compliance**
*What processes must this agent follow?*
- [Process requirement 1]
- [Process requirement 2]
- [Process requirement 3]

### **Communication Standards**
*How should this agent communicate and document?*
- [Communication requirement 1]
- [Communication requirement 2]
- [Communication requirement 3]

*📋 **Quality Guidance**:
- Make requirements specific and measurable
- Include both technical and process standards
- Consider how quality will be validated and measured
- Think about coordination with other agents*

## **System Prompt**
> You are the [Agent Name]. Use skill payloads ([comma-separated skill list]) to update `.spec/tasks/<PROJECT-XXX>.md` (using project tag + ID format). Run `context-compact` before adding extensive {{agent-type}} content. [Additional instructions for maintaining task file sections], refresh Rolling Summary (`Context | Facts | Decisions | Risks | Next`), tag assumptions `- Inferred`, embed all evidence directly in task file, and log each run with single Activity line (`YYYY-MM-DDTHH:MM:SS+03:00 - {{agent-id}} - summary`). **CRITICAL: Never modify existing Activity Log entries from other agents - only append new entries.** Update task status in Header when appropriate.

*🤖 **System Prompt Guidance**:
- Keep it under 150 words for conciseness
- Include all relevant skills
- Specify project file format (PROJECT-XXX)
- Emphasize single-file documentation approach
- Include Activity Log append-only rule
- Specify Rolling Summary format
```

---

## **Agent Creation Guide**

### 🚀 **Quick Start Steps**
1. **Define the Purpose**: What unique value does this agent provide?
2. **Identify the Target**: Who will use this agent and how?
3. **Map Responsibilities**: What are the agent's primary duties?
4. **Select Skills**: What capabilities does this agent need?
5. **Design Workflow**: How should the agent work through tasks?
6. **Set Quality Standards**: How do we ensure the agent works correctly?

### 📝 **Agent Creation Best Practices**

#### **Purpose Definition**
- Focus on transformation and value creation
- Keep it concise (1-2 sentences maximum)
- Use action verbs: "Converts", "Coordinates", "Validates", "Creates"
- Be specific about the agent's unique capabilities

#### **Target Agent Specification**
- Use consistent naming: `[role]-orchestrator`
- Match the filename exactly
- Consider agent specialization and scope
- Think about handoff patterns with other agents

#### **Core Responsibilities**
- Focus on 3-4 primary duties maximum
- Make responsibilities actionable and measurable
- Consider the agent's role in the overall workflow
- Include documentation and communication responsibilities

#### **Skill Portfolio Design**
- Group skills by functional categories
- Always include context-compact for Activity Log management
- Consider the agent's workflow and skill dependencies
- Include skills that support the agent's core responsibilities

#### **Workflow Design**
- Use logical phases that match the agent's work pattern
- Include context gathering, execution, validation, and handoff
- Consider coordination with other agents
- Include documentation and quality assurance steps

#### **Quality Standards Definition**
- Include implementation, process, and communication standards
- Make requirements specific and measurable
- Consider how quality will be validated
- Think about coordination and handoff quality

### 🎯 **Agent Specialization Patterns**

#### **Tech Lead Orchestrator**
- **Focus**: Technical implementation, code quality, engineering coordination
- **Core Skills**: code-review, code-unit, qa-contract, qa-e2e, architect-plan
- **Workflow**: Analysis → Implementation → Testing → Documentation

#### **Product Ops Orchestrator**
- **Focus**: Product lifecycle, requirements, stakeholder communication
- **Core Skills**: product-prd, analytics-research, agile-plan, pm-sync
- **Workflow**: Requirements → Planning → Coordination → Handoff

#### **Architect Orchestrator**
- **Focus**: System design, technical decisions, architecture validation
- **Core Skills**: architect-plan, analytics-research, research
- **Workflow**: Analysis → Design → Validation → Documentation

#### **QA Orchestrator**
- **Focus**: Quality assurance, testing coordination, validation
- **Core Skills**: qa-contract, qa-e2e, qa-stress, code-review
- **Workflow**: Planning → Testing → Validation → Reporting

### 🔧 **Template Variables for Agents**
You can use these variables to personalize agent content:
- `{{agent-name}}` - Name of the agent
- `{{agent-type}}` - Type of agent (orchestrator, specialist, etc.)
- `{{specialization}}` - Agent's area of expertise
- `{{workflow-phase}}` - Current workflow phase
- `{{skill-category}}` - Category of skills being used

### ✅ **Validation Checklist**
Before finalizing your agent, ensure:
- [ ] Purpose clearly defined and actionable
- [ ] Target agent matches filename exactly
- [ ] Core responsibilities focused and measurable
- [ ] Skill portfolio comprehensive and well-organized
- [ ] Workflow logical and complete
- [ ] Quality standards specific and measurable
- [ ] System prompt complete and actionable
- [ ] All sections follow template structure
- [ ] Language clear and consistent
- [ ] Agent provides unique value in the ecosystem

### 🔄 **Agent Coordination Patterns**

#### **Handoff Procedures**
- Clear criteria for when to hand off to other agents
- Standardized handoff communication format
- Context preservation during handoffs
- Quality validation before handoffs

#### **Collaboration Standards**
- How to work with other agents on shared tasks
- Conflict resolution procedures
- Communication protocols and formats
- Shared responsibility for task success

#### **Quality Assurance**
- How to validate work before completion
- Peer review and coordination processes
- Integration testing with other agent work
- Final validation and acceptance criteria

---

*Agent template enhanced with BMAD-inspired interactive guidance and improved workflow integration while maintaining full backward compatibility.*