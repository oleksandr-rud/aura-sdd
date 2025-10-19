# Skill Template

## **Quick Start Guide**

**For New Skills**: Follow this template structure exactly. All sections are required for complete skill definitions.

**Interactive Guidance**: This template includes helpful notes and examples to guide your skill creation.

**Template Variables**: You can use variables like `{{agent-name}}`, `{{skill-type}}`, and `{{context}}` to personalize content.

## **Abstract Structure & Format**

### **Filename Convention**
`skillname.skill.md`
*💡 **Tip**: Use descriptive names that clearly indicate the skill's purpose and function.*

### **Core Structure (Sequential Order)**

```markdown
skillname.skill

## **Purpose**
*[1-2 sentences describing what the skill does and transforms]*
*Focus on the transformation: What input becomes what output?*

## **Target Agent**
*[Specific agent(s) who should use this skill]*
*Example: tech-lead-orchestrator, product-ops-orchestrator, or multiple agents*

## **Trigger Scenarios**
*When should this skill be used? Be specific about the situations and contexts.*
- **[Category 1]**: [When to use this skill - specific situation]
- **[Category 2]**: [When to use this skill - specific situation]
- **[Category 3]**: [When to use this skill - specific situation]

*🎯 **Guidance**: Think about the "when" and "why" someone would need this skill.*

## **Required MCPs/Tools**
*What tools, systems, or resources does this skill need to function?*
- **[Category]**: [Tool/System 1] - [purpose]
- **[Category]**: [Tool/System 2] - [purpose]
- **[Category]**: [Tool/System 3] - [purpose]

*🔧 **Tool Categories**: File system (Read, Write, Edit), Web access (WebSearch, WebFetch), Development tools (Bash), etc.*

## **Core Procedure (SOP)**
*Standard Operating Procedure - the step-by-step process the agent follows*
*Keep it logical and actionable. Each step should be a clear, specific action.*

### **Phase 1: [Phase Name]**
*What happens in this phase? Focus on the main goal.*
1. **[Step Name]**: [Action description - what should the agent do?]
2. **[Step Name]**: [Action description]
3. **[Step Name]**: [Action description]

### **Phase 2: [Phase Name]**
*Build on Phase 1. What's the next logical step?*
1. **[Step Name]**: [Action description]
2. **[Step Name]**: [Action description]
3. **[Step Name]**: [Action description]

### **Phase 3: [Phase Name]**
*Continue the process. What's needed to complete the core work?*
1. **[Step Name]**: [Action description]
2. **[Step Name]**: [Action description]
3. **[Step Name]**: [Action description]

### **Phase 4: [Phase Name]**
*Finalization and handoff. How does the agent wrap up and document?*
1. **[Step Name]**: [Action description]
2. **[Step Name]**: [Action description]
3. **[Step Name]**: [Action description]

*📋 **SOP Guidance**:
- Use action-oriented step names: "Analyze Requirements" vs "Analysis"
- Keep steps focused and single-purpose
- Include the agent's documentation/logging responsibilities
- Consider error handling and validation steps*

## **Required Parameters**
*What parameters must be provided for this skill to work?*
| Parameter | Description | Format | Example |
|---|---|---|---|
| `task_reference` | [Clear description of what this parameter controls] | [Format: string/number/object] | `[Realistic example]` |
| `parameter_name` | [Description] | [Format type] | `[Example value]` |
| `parameter_name` | [Description] | [Format type] | `[Example value]` |

*📝 **Parameter Guidelines**:
- Use descriptive names that clearly indicate purpose
- Include realistic examples that match actual use cases
- Specify exact format requirements (ULID, kebab-case, JSON, etc.)*

## **Optional Parameters**
*What additional parameters can enhance the skill's functionality?*
| Parameter | Description | Usage |
|---|---|---|
| `parameter_name` | [Description] | [How it's used and what value it provides] |
| `parameter_name` | [Description] | [How it's used and what value it provides] |

*💡 **Optional Parameters**: These enhance the skill but aren't required for basic functionality.*

## **Execution Templates**

*These templates help agents apply the skill consistently and document their work.*

### **Activity Log Entry Template**
```
YYYY-MM-DDTHH:MM:SS+TZ:TZ - {{agent-name}} - [Brief summary of what was accomplished and outcomes achieved]
```

### **Rolling Summary Update Template**
```
Context: [Updated context based on skill execution outcomes]
Facts: [Key facts established and results achieved]
Decisions: [Important decisions made or informed by skill execution]
Risks: [Risks identified or updated during skill execution]
Next: [Immediate next steps following skill completion]
```

### **Task Update Template**
```
*Use this template when updating task files with skill results:*

**[Relevant Section Update]**:
- [Result 1]: [Description of outcome and evidence]
- [Result 2]: [Description of outcome and evidence]

**Quality Status**: [Pass/Fail/In Progress] with supporting evidence
**Next Steps**: [What should happen next based on these results]
```

*📋 **Template Usage**: Always customize templates with specific details from your skill execution.*

## **Quality Standards & Guardrails**

### **[Category] Requirements**
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

### **Process Compliance**
- [Process requirement 1]
- [Process requirement 2]
- [Process requirement 3]

### **Boundary Conditions**
- Never [negative constraint 1]
- Always [positive constraint 1]
- Do not [prohibited action 1]

### **Validation Protocols**
- Verify [validation step 1]
- Confirm [validation step 2]
- Ensure [validation step 3]

## **Execution Parameters**

### **Success Criteria**
- [Success criteria 1]
- [Success criteria 2]
- [Success criteria 3]

### **Error Handling**
- When [error condition], [response]
- If [error condition], [response]
- For [error condition], [response]

## **Example Usage**
```
Use the skillname skill with these parameters:
parameter_name: [value]
parameter_name: [value]
```
```

## **Quality Standards & Guardrails**

### **[Category] Requirements**
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

### **Process Compliance**
- [Process requirement 1]
- [Process requirement 2]
- [Process requirement 3]

### **Boundary Conditions**
- Never [negative constraint 1]
- Always [positive constraint 1]
- Do not [prohibited action 1]

### **Validation Protocols**
- Verify [validation step 1]
- Confirm [validation step 2]
- Ensure [validation step 3]

## **Execution Parameters**

### **Success Criteria**
- [Success criteria 1]
- [Success criteria 2]
- [Success criteria 3]

### **Error Handling**
- When [error condition], [response]
- If [error condition], [response]
- For [error condition], [response]

## **Example Usage**
```
Use the skillname skill with these parameters:
parameter_name: [value]
parameter_name: [value]
```

---

## **Skill Creation Guide**

### 🚀 **Quick Start Steps**
1. **Define the Purpose**: What transformation does this skill provide?
2. **Identify the Target Agent**: Who will use this skill?
3. **Map the Trigger Scenarios**: When should this skill be used?
4. **Design the SOP**: What steps should the agent follow?
5. **Define Parameters**: What information does the skill need?
6. **Set Quality Standards**: How do we know the skill worked correctly?

### 📝 **Skill Creation Best Practices**

#### **Purpose Definition**
- Focus on transformation: What input becomes what output?
- Keep it concise (1-2 sentences maximum)
- Use action verbs: "Analyzes", "Creates", "Validates", "Transforms"
- Be specific about the value provided

#### **Target Agent Selection**
- Be specific: "tech-lead-orchestrator" vs "agents"
- Consider agent capabilities and responsibilities
- Ensure the agent has access to required tools
- Think about handoff patterns and coordination

#### **Trigger Scenarios**
- Think from the user's perspective: "When would I need this?"
- Include both proactive and reactive scenarios
- Consider the context: project type, task state, user needs
- Be specific about conditions and requirements

#### **SOP Design**
- Use logical phases: Analysis → Design → Implementation → Validation
- Keep steps actionable and specific
- Include documentation and logging responsibilities
- Consider error handling and edge cases
- Limit to 4 phases with 4 steps each for clarity

#### **Parameter Definition**
- Use descriptive, snake_case names
- Specify exact format requirements
- Provide realistic, helpful examples
- Distinguish between required and optional parameters
- Include validation requirements where needed

### 🎯 **Quality Standards for Skills**

#### **Completeness**
- [ ] Purpose clearly defined and actionable
- [ ] Target agent specified with appropriate capabilities
- [ ] Trigger scenarios comprehensive and specific
- [ ] Required MCPs/Tools clearly listed
- [ ] SOP logical and complete
- [ ] Parameters well-defined with examples
- [ ] Quality standards and guardrails established

#### **Clarity**
- [ ] Language clear and unambiguous
- [ ] Examples realistic and helpful
- [ ] Instructions actionable and specific
- [ ] Structure logical and easy to follow
- [ ] Templates provide clear guidance

#### **Usability**
- [ ] Easy for agents to understand and execute
- [ ] Templates facilitate consistent application
- [ ] Error handling guidance provided
- [ ] Success criteria clearly defined
- [ ] Integration with existing workflows smooth

### 🔧 **Template Variables for Skills**
You can use these variables to personalize skill content:
- `{{agent-name}}` - Name of the executing agent
- `{{skill-type}}` - Type of skill (analysis, creation, validation, etc.)
- `{{context}}` - Current task or project context
- `{{timestamp}}` - Current timestamp for logging
- `{{project-type}}` - Type of project (infrastructure, development, etc.)

### ✅ **Validation Checklist**
Before finalizing your skill, ensure:
- [ ] All sections are complete and filled out
- [ ] SOP steps are logical and actionable
- [ ] Parameters are clearly defined with good examples
- [ ] Quality standards are measurable
- [ ] Templates are helpful and practical
- [ ] Language is clear and consistent
- [ ] Skill provides real value to the workflow

---

*Skill template enhanced with BMAD-inspired interactive guidance and improved clarity while maintaining full backward compatibility.*