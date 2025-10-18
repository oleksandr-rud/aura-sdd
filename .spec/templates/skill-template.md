# Skill Template

## **Abstract Structure & Format**

### **Filename Convention**
`skillname.skill.md`

### **Core Structure (Sequential Order)**

```markdown
skillname.skill

## **Purpose**
[1-2 sentences describing what the skill does and transforms]

## **Target Agent**
[Specific agent(s) who should use this skill]

## **Trigger Scenarios**
- **[Category 1]**: [When to use this skill - specific situation]
- **[Category 2]**: [When to use this skill - specific situation]
- **[Category 3]**: [When to use this skill - specific situation]
- **[Category 4]**: [When to use this skill - specific situation]
- **[Category 5]**: [When to use this skill - specific situation]

## **Required MCPs/Tools**
- **[Category]**: [Tool/System 1] - [purpose]
- **[Category]**: [Tool/System 2] - [purpose]
- **[Category]**: [Tool/System 3] - [purpose]
- **[Category]**: [Tool/System 4] - [purpose]

## **Core Procedure (SOP)**

### **Phase 1: [Phase Name]**
1. **[Step Name]**: [Action description]
2. **[Step Name]**: [Action description]
3. **[Step Name]**: [Action description]
4. **[Step Name]**: [Action description]

### **Phase 2: [Phase Name]**
1. **[Step Name]**: [Action description]
2. **[Step Name]**: [Action description]
3. **[Step Name]**: [Action description]
4. **[Step Name]**: [Action description]

### **Phase 3: [Phase Name]**
1. **[Step Name]**: [Action description]
2. **[Step Name]**: [Action description]
3. **[Step Name]**: [Action description]
4. **[Step Name]**: [Action description]

### **Phase 4: [Phase Name]**
1. **[Step Name]**: [Action description]
2. **[Step Name]**: [Action description]
3. **[Step Name]**: [Action description]
4. **[Step Name]**: [Action description]

## **Required Parameters**
| Parameter | Description | Format | Example |
|---|---|---|---|
| `parameter_name` | [Description] | [Format type] | `[Example value]` |
| `parameter_name` | [Description] | [Format type] | `[Example value]` |
| `parameter_name` | [Description] | [Format type] | `[Example value]` |
| `parameter_name` | [Description] | [Format type] | `[Example value]` |

## **Optional Parameters**
| Parameter | Description | Usage |
|---|---|---|
| `parameter_name` | [Description] | [How it's used] |
| `parameter_name` | [Description] | [How it's used] |
| `parameter_name` | [Description] | [How it's used] |

## **Execution Templates**

### **[Template Name]**
```
[Template structure with placeholders]
```

### **Rolling Summary Update Template**
```
Context: [Updated context based on outcomes]
Facts: [Key facts and results]
Decisions: [Decisions made or informed]
Risks: [Risks identified or updated]
Next: [Immediate next steps]
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
```

---

## **Style Guidelines**

### **Markdown Format**
- Use `## **Section Name**` for main sections
- Use `### **Subsection**` for sub-sections
- Use `**bold**` for emphasis
- Use `*italic*` for secondary emphasis
- Use `code blocks` for examples and templates
- Use tables for parameters and structured data

### **Writing Style**
- Active voice: "Transforms business requirements" vs "Business requirements are transformed"
- Concise sentences: Keep descriptions under 20 words when possible
- Action-oriented: Focus on what the skill *does* rather than what it *is*
- Specific examples: Provide concrete, realistic examples in all parameters

### **Parameter Naming**
- Use snake_case: `task_reference`, `architecture_goal`
- Be descriptive: `quality_targets` vs `targets`
- Include units in descriptions when applicable: "p95 latency in milliseconds"

### **Template Placeholders**
- Use square brackets: `[Description]`, `[Example value]`
- Be specific about expected format: "ULID or kebab-case"
- Provide realistic examples that match the use case

### **SOP Structure**
- 4 phases maximum for maintainability
- 4 steps per phase maximum for clarity
- Action-oriented step names: "Extract Requirements" vs "Requirements"
- Logical flow: Analysis → Design → Implementation → Validation

### **Quality Standards**
- Each requirement should be testable/measurable
- Process compliance should be verifiable
- Boundary conditions should be absolute (never/always/do not)
- Validation protocols should have clear success criteria