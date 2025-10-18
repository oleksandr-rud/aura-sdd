# Agent Template

## **Abstract Structure & Format**

### **Filename Convention**
`agentname.agent.md`

### **Core Structure (Sequential Order)**

```markdown
# [Agent Name]

## **Purpose**
[1-2 sentences describing what the agent does and transforms]

## **Target Agent**
[Specific agent identifier]

## **Core Responsibilities**
- [Primary responsibility 1]
- [Primary responsibility 2]
- [Primary responsibility 3]
- [Primary responsibility 4]

## **Skill Portfolio**

### **[Category 1]**
- `skill-name` – [brief description of skill purpose]
- `skill-name` – [brief description of skill purpose]

### **[Category 2]**
- `skill-name` – [brief description of skill purpose]
- `skill-name` – [brief description of skill purpose]

### **[Category 3]**
- `skill-name` – [brief description of skill purpose]
- `skill-name` – [brief description of skill purpose]

### **[Context Management]**
- `context-compact` – Activity Log management to maintain task file usability while preserving audit trail
- Run `context-compact` before adding extensive [agent-specific content] to task file

### **[Additional Category] (as needed)**
- `skill-name` – [brief description of skill purpose]

## **Core Workflow**

### **Phase 1: [Phase Name]**
1. [Step description]
2. [Step description]
3. [Step description]

### **Phase 2: [Phase Name]**
1. [Step description]
2. [Step description]
3. [Step description]

### **Phase 3: [Phase Name]**
1. [Step description]
2. [Step description]
3. [Step description]

### **Phase 4: [Phase Name]**
1. [Step description]
2. [Step description]
3. [Step description]

## **Quality Standards**

### **[Category] Quality**
- [Quality requirement 1]
- [Quality requirement 2]
- [Quality requirement 3]

### **Process Compliance**
- [Process requirement 1]
- [Process requirement 2]
- [Process requirement 3]

### **Communication Standards**
- [Communication requirement 1]
- [Communication requirement 2]
- [Communication requirement 3]

## **System Prompt**
> You are the [Agent Name]. Use skill payloads ([comma-separated skill list]) to update `.spec/tasks/<task_reference>/task.md`. Run `context-compact` before adding extensive [agent-specific content]. [Additional instructions for maintaining task file sections], refresh Rolling Summary (`Context | Facts | Decisions | Risks | Next`), tag assumptions `- Inferred`, and log each run with single Activity line (`YYYY-MM-DDTHH:MM:SS+03:00 - [agent-id] - summary`).
```

---

## **Style Guidelines**

### **Markdown Format**
- Use `## **Section Name**` for main sections
- Use `### **Subsection**` for sub-sections
- Use `**bold**` for emphasis
- Use `> **System:** ` for system prompts
- Use bullet points for lists and responsibilities

### **Writing Style**
- Active voice: "Converts architectural intent" vs "Architectural intent is converted"
- Concise sentences: Keep descriptions under 15 words when possible
- Action-oriented: Focus on what the agent *does* rather than what it *is*
- Specific examples: Reference concrete task file paths and formats

### **Section Organization**
- **Purpose**: High-level mission statement (1-2 sentences)
- **Target Agent**: Technical identifier for the agent
- **Core Responsibilities**: 3-4 primary duties
- **Skill Portfolio**: Organized by functional categories
- **Core Workflow**: 4 phases, 3 steps each (maintainable)
- **Quality Standards**: Implementation, Process, Communication categories
- **System Prompt**: Complete, actionable instruction set

### **Skill Categorization**
- Group related skills by function (Code Quality, Planning, QA, etc.)
- Use consistent descriptive naming for categories
- Always include Context Management section
- Mark optional categories with "(as needed)"

### **Workflow Structure**
- 4 phases maximum for maintainability
- 3 steps per phase maximum for clarity
- Action-oriented phase names: "Planning & Execution" vs "Planning Phase"
- Logical flow: Context → Planning → Execution → Documentation

### **Quality Requirements**
- Each requirement should be measurable/verifiable
- Process compliance should be enforceable
- Communication standards should have clear formats
- All requirements should relate to agent's core responsibilities

### **System Prompt Format**
- Start with agent identity and role
- List all relevant skills in parentheses
- Include context-compact requirement
- Specify task file maintenance requirements
- Include Activity Log format with timestamp pattern
- Keep under 150 words for conciseness

### **Best Practices**
- Remove redundant explanations and verbose descriptions
- Focus on actionable instructions and concrete outcomes
- Use consistent terminology across all sections
- Reference specific file paths and formats
- Maintain clear separation between structure and content