context-compact.skill

## **Purpose**
Maintains task file usability by managing Activity Log growth while preserving audit trail and essential information to ensure task files remain navigable, focused, and compliant with audit requirements.

## **Target Agent**
Context Manager - agents who maintain task file usability by managing Activity Log growth while preserving audit trail and essential information.

## **Trigger Scenarios**
- When Activity Logs become unwieldy (50+ entries, extensive historical context, or verbose entries)
- When task file navigation becomes difficult due to excessive log volume
- When audit compliance requires systematic log management while preserving critical information
- When performance issues arise from large task files due to extensive Activity Logs
- When stakeholders need focused views of current status without losing historical context

## **Required MCPs/Tools**
- File system operations for moving, archiving, and organizing log files
- Text processing tools for content analysis, summarization, and formatting
- Archive management systems for storing and retrieving compacted log entries
- Metadata tracking systems for maintaining audit trail references and links
- Document management tools for ensuring proper version control and access permissions

## **Core Procedure (SOP)**

### **Phase 1: Assessment & Planning**
1. **Analyze Log State**: Evaluate current Activity Log size, entry count, and complexity to determine compaction needs
2. **Define Retention Policy**: Establish clear criteria for which entries to preserve, compact, or archive based on importance and relevance
3. **Select Compaction Approach**: Choose appropriate strategy (replace-all, segment-compact, smart-append) based on log characteristics and usage patterns
4. **Plan Archive Structure**: Design organized storage system for compacted entries with clear indexing and retrieval mechanisms

### **Phase 2: Content Analysis & Classification**
1. **Categorize Log Entries**: Classify entries by type (decisions, risks, milestones, status updates, etc.) and importance level
2. **Identify Critical Items**: Flag entries that must always be preserved (decisions, risks, ownership changes, state transitions)
3. **Group Related Entries**: Cluster related activities and updates for potential summarization
4. **Assess Temporal Relevance**: Determine which recent entries should remain active vs. which can be archived

### **Phase 3: Compaction Execution**
1. **Archive Selected Entries**: Move identified entries to archive storage with proper metadata and indexing
2. **Create Summaries**: Generate concise summaries of compacted activities while preserving key information
3. **Update Active Log**: Restructure remaining entries for improved readability and navigation
4. **Maintain References**: Ensure proper links and references between active log and archived content

### **Phase 4: Validation & Documentation**
1. **Verify Audit Trail**: Confirm all critical information is preserved and accessible through archive references
2. **Test Archive Access**: Validate that archived content can be retrieved and referenced as needed
3. **Update Documentation**: Record compaction actions, metadata, and archive locations for future reference
4. **Communicate Changes**: Notify stakeholders of log management activities and provide guidance on accessing historical information

## **Required Parameters**
| Parameter | Description | Format | Example |
|---|---|---|---|
| `task_reference` | Task-ID or slug for the task file | ULID or kebab-case | `2025-kyc-automation` |
| `log_management_approach` | Strategy for Activity Log compaction | choice | `replace-all`, `segment-compact`, `smart-append` |
| `retention_policy` | What determines which entries to keep or compact | bullet list | `Keep all decision entries`, `Keep last 30 days` |
| `archive_destination` | Where to store compacted content (bottom of file or separate archive) | path | `bottom of task file` or `.spec/tasks/archive/` |

## **Optional Parameters**
| Parameter | Description | Usage |
|---|---|---|
| `time_cutoff` | Date threshold for what to keep vs archive | ISO date or relative period |
| `summary_level` | Detail level for compacted entries | `minimal`, `standard`, `detailed` |
| `segment_size` | Maximum number of entries to keep in active log | Number |
| `transition_markers` | Key events that should always be preserved | List of decision or milestone types |
| `stakeholder_notification` | Who needs to know about log compaction | List of agents or roles |

## **Execution Templates**

### **Compaction Summary**
```
Activity Log Compaction Summary
- Approach: [replace-all/segment-compact/smart-append]
- Before: [Number of entries, size estimate]
- After: [Number of entries, size estimate]
- Preserved: [Types of entries preserved]
- Archived: [Number and types of entries archived]
- Archive Location: [Path to archived content]
```

### **Rolling Summary Update**
```
Context: [Updated context reflecting current state]
Facts: [Key facts from recent activities]
Decisions: [Current decision status and recent outcomes]
Risks: [Active risks and recent mitigation activities]
Next: [Immediate next actions with current owners]
```

### **Archive Index**
| Period | Entry Count | Archive File | Summary |
|---|---|---|---|
| 2024-Q4 | 84 | `activity-log-2024-q4.md` | Architecture decision, testing completion, risk mitigation |

## **Quality Standards & Guardrails**

### **Requirements**
- All critical decisions, risks, and milestones must be preserved in audit trail
- Archived content must remain accessible and properly referenced
- Compacted logs must be clear and navigable for current work
- Must meet audit and regulatory requirements for record keeping
- Apply consistent formatting and organization across all compaction activities

### **Process Compliance**
- Always preserve decision entries, risk entries, milestone entries, ownership changes, state transitions
- Never archive entries without clear summary, archive location reference, and retention justification
- Must maintain chronological flow, clear attribution, decision context, risk status
- Validate archive links are functional before completing compaction
- Document compaction metadata for future reference

### **Boundary Conditions**
- Do not compact entries newer than specified time cutoff without explicit approval
- Do not archive entries without creating accessible reference links
- Do not modify content of preserved entries - only relocate or summarize
- Do not remove entries that are referenced in other task file sections
- Must validate archive links are functional before completing compaction

### **Validation Protocols**
- Verify all critical entries are preserved according to retention policy
- Test archive links and ensure accessibility
- Confirm Rolling Summary accurately reflects current state
- Validate compaction follows specified approach and rules
- Document compaction metadata for future reference

## **Execution Parameters**

### **Success Criteria**
- Activity Log is manageable and navigable while preserving all critical information
- Audit trail integrity is maintained with proper documentation and references
- Archive structure is organized and searchable for historical research
- Stakeholder access to historical information is preserved through proper indexing
- Compaction process is documented and repeatable for future log management

### **Error Handling**
- If critical entries are accidentally compacted, restore from archive or backups
- When archive links become broken, update references and verify accessibility
- For unclear retention policy decisions, consult stakeholders and document rationale
- If archive storage becomes full, establish additional storage locations and update references
- When stakeholder feedback indicates important information is missing, adjust retention criteria

## **Log Management Approaches**

### **Replace All (`replace-all`)**
- **State Transition**: Verbose log → Streamlined comprehensive summary
- **Process**: Archive complete log, create new summary with key entries only
- **Use Case**: When logs become extremely unwieldy (100+ entries) and need complete reset

### **Segment Compact (`segment-compact`)**
- **State Transition**: Bloated log → Optimized log with preserved recent history
- **Process**: Keep recent N entries, summarize older ones, maintain chronological flow
- **Use Case**: Regular maintenance to keep logs manageable while preserving recent detail

### **Smart Append (`smart-append`)**
- **State Transition**: Growing log → Managed log with intelligent compaction
- **Process**: Add summary layers, preserve recent history, insert transition markers
- **Use Case**: Ongoing log management without disrupting current workflow

## **Example Usage**
```
Use the context-compact skill with these parameters:
task_reference: 2025-kyc-automation
log_management_approach: segment-compact
retention_policy:
  - Keep most recent 50 entries
  - Always preserve decision and risk entries
  - Summarize routine status updates
segment_size: 50
time_cutoff: 2025-01-01
archive_destination: bottom of task file
summary_level: standard
```