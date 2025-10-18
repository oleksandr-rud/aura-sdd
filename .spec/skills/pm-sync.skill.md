pm-sync.skill

## **Purpose**
Synchronizes Task Packages with external work trackers, ensuring bidirectional consistency between internal planning artifacts and external project management systems.

## **Target Agent**
Product Managers who synchronize Task Packages with external work trackers, ensuring bidirectional consistency between internal planning artifacts and external project management systems.

## **Trigger Scenarios**
- When Task Package needs to reflect the latest tracker state from external systems
- When Task Package updates need to be broadcast back to connected external tools
- When status discrepancies exist between Task Package and external work trackers
- When external system changes impact task planning or delivery timelines
- When regular synchronization cadence is required to maintain consistency across platforms

## **Required MCPs/Tools**
- External work management system APIs (Jira REST API, Trello API, Azure DevOps API) for data retrieval and updates
- Authentication and authorization systems (OAuth, API tokens, service accounts) for secure connector access
- Data mapping and transformation tools for field translation between systems
- Rate limiting and throttling management for API call optimization
- Conflict resolution frameworks for handling discrepancies between systems

## **Core Procedure (SOP)**

### **Phase 1: Sync Configuration & Planning**
1. **Define Sync Scope**: Identify specific issues, cards, or records that require synchronization between systems
2. **Establish Field Mapping**: Create clear mappings between Task Package fields and external system fields
3. **Set Sync Direction**: Determine whether to pull from external, push to external, or perform bidirectional synchronization
4. **Configure Access Credentials**: Ensure proper authentication and authorization for external system access

### **Phase 2: Data Extraction & Validation**
1. **Retrieve External Data**: Pull current status, comments, assignments, and other relevant fields from external system
2. **Validate Data Integrity**: Check for data completeness, format consistency, and field mapping accuracy
3. **Identify Conflicts**: Detect discrepancies between Task Package and external system data
4. **Apply Filters**: Use specified query constraints to limit sync scope to relevant items

### **Phase 3: Data Reconciliation & Processing**
1. **Map Status Translations**: Apply status mapping rules to ensure consistent workflow progression
2. **Format Comments**: Transform comments and notes according to specified templates
3. **Resolve Conflicts**: Apply conflict resolution strategies for identified discrepancies
4. **Prepare Updates**: Format changes according to external system API requirements

### **Phase 4: Sync Execution & Documentation**
1. **Execute Sync Operations**: Push or pull data changes between systems following configured rules
2. **Monitor API Limits**: Track API call volume and respect rate limiting constraints
3. **Verify Sync Results**: Confirm that changes were successfully applied in target systems
4. **Document Sync Activity**: Record sync transactions, changes, and any issues in Activity Log

## **Required Parameters**
| Parameter | Description | Format | Example |
|---|---|---|---|
| `task_reference` | Task-ID or slug linking to the Task Package | ULID or kebab-case | `20251013-onboarding-funnel` |
| `connector` | External system identifier | Enum (`jira`, `trello`, `mcp`) | `jira` |
| `sync_direction` | Sync flow direction | Enum (`pull`, `push`, `two-way`) | `two-way` |
| `target_items` | Issues/cards/records to sync | List | `["PROJ-418", "PROJ-419"]` |
| `fields_to_sync` | Statuses, comments, labels to reconcile | List | `status`, `comment`, `assignee` |

## **Optional Parameters**
| Parameter | Description | Usage |
|---|---|---|
| `status_mapping` | Mapping between tracker and Task Package statuses | Keeps lifecycle states aligned |
| `comment_template` | Format for mirrored comments/notes | Ensures consistent phrasing when pushing updates |
| `include_history` | Boolean to fetch historical changes | Controls activity log granularity |
| `filters` | Query constraints (sprint, label, board) | Limits scope of pull operations |
| `rate_limit_guard` | Max API calls per minute | Prevents hitting connector throttles |
| `update_scope` | Task Package sections affected | Helps downstream agents focus reviews |

## **Execution Templates**

### **Sync Configuration**
```
Task Reference: [Task-ID/slug]
Connector: [External system]
Direction: [pull/push/two-way]
Target Items: [List of issue IDs/URLs]
Fields to Sync: [Status, comments, etc.]

Status Mapping:
- [External status] → [Task Package status]
- [External status] → [Task Package status]

Filters Applied:
- [Filter 1]: [Value]
- [Filter 2]: [Value]

Sync Settings:
- Include History: [Yes/No]
- Rate Limit: [Max API calls/minute]
- Comment Template: [Format string]
```

### **Rolling Summary Update**
```
Context: [Updated context based on sync outcomes]
Facts: [Issue IDs, new statuses, assignees, sync timestamps]
Decisions: [Status mapping decisions, ownership changes]
Risks: [Sync blockers, overdue tasks with RAG status]
Next: [Follow-up actions, sync cadence requirements]
```

## **Quality Standards & Guardrails**

### **Requirements**
- Be explicit about connector details; reference project keys, board IDs clearly
- Use bullet lists for target_items and fields_to_sync with full identifiers
- Note deltas when re-syncing (e.g., `Status mapping updated:`)
- Keep payload concise; avoid attaching large tracker exports inline
- Reference existing Task Package using task_reference parameter

### **Process Compliance**
- Note any secrets or auth requirements as `Open Question:` (never paste credentials)
- Mention sync timing and frequency expectations clearly
- Update Activity Log with sync transaction details and timestamps
- Maintain audit trail of all synchronization activities and changes
- Ensure proper conflict resolution documentation for discrepancies

### **Boundary Conditions**
- Do not sync sensitive personal data or confidential information
- Do not override manual status changes without explicit mapping rules
- Do not create duplicate entries across platforms
- Avoid syncing large attachments or binary data
- Do not sync fields that are system-specific or have no equivalent in target system

### **Validation Protocols**
- Verify connector credentials are valid and properly scoped
- Confirm status mapping maintains logical workflow progression
- Validate rate limits won't cause throttling or service disruption
- Ensure target items exist and are accessible in both systems
- Test sync operations with small datasets before full execution

## **Execution Parameters**

### **Success Criteria**
- All specified items are successfully synchronized between systems
- Status mapping is applied consistently and maintains workflow integrity
- Comments and notes are properly formatted according to templates
- Rate limiting is respected without causing API throttling
- Activity Log accurately documents all sync transactions and outcomes

### **Error Handling**
- If connector authentication fails, verify credentials and access permissions
- When rate limits are exceeded, implement backoff strategies and retry logic
- For field mapping conflicts, update mapping rules and re-run synchronization
- If items are not found in external system, verify IDs and access permissions
- When data format inconsistencies occur, apply transformation rules and validate results

## **Example Usage**
```
Use the pm-sync skill with these parameters:
task_reference: 20251013-onboarding-funnel
connector: jira
sync_direction: two-way
target_items:
  - PROJ-418
  - PROJ-419
fields_to_sync:
  - status
  - comment
  - assignee
status_mapping:
  - To Do → Planned
  - In Progress → In Flight
  - In Review → QA
  - Done → Shipped
comment_template: "[Codex] {{task_reference}} {{summary}}"
include_history: false
filters:
  sprint: "Sprint 3"
rate_limit_guard: 45
update_scope:
  - Activity Log
  - Initial Context
```