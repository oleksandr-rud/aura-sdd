analytics-research.skill

## **Purpose**
Transforms business questions into data-driven insights through hypothesis testing, metrics validation, and experimental design to enable data-informed decision making for existing initiatives.

## **Target Agent**
Analytics Analyst - agents who need to perform descriptive, causal, or exploratory analysis to validate hypotheses, measure performance, or guide experimentation for existing tasks.

## **Trigger Scenarios**
- When business decisions require data validation or hypothesis testing before proceeding
- When performance metrics need to be analyzed to identify trends, patterns, or anomalies
- When experimental design is needed to test causal relationships or measure intervention impact
- When stakeholders request evidence-based recommendations for strategic or tactical decisions
- When existing analytics need to be refreshed or expanded to inform current initiatives

## **Required MCPs/Tools**
- Data warehouse access (Snowflake, BigQuery, Redshift) for querying historical data
- Analytics dashboards (Tableau, Looker, Power BI) for visualization and monitoring
- Statistical analysis tools (Python/R libraries, Jupyter notebooks) for hypothesis testing
- Experimentation platforms (Optimizely, LaunchDarkly) for A/B testing and causal analysis
- Data pipeline and logging systems for tracking real-time metrics and events

## **Core Procedure (SOP)**

### **Phase 1: Requirements Analysis & Planning**
1. **Define Decision Context**: Clarify the specific business decision that analytics must support, including timeline, stakeholders, and impact scope
2. **Formulate Hypotheses**: Transform business questions into testable hypotheses with clear null and alternative hypotheses
3. **Identify Key Metrics**: Select primary and secondary metrics that directly measure the outcomes relevant to the decision
4. **Assess Data Availability**: Verify required data sources exist, are accessible, and contain sufficient historical coverage

### **Phase 2: Data Acquisition & Preparation**
1. **Extract Data**: Pull relevant datasets from identified sources, ensuring appropriate time windows and segmentation options
2. **Clean & Validate**: Perform data quality checks, handle missing values, and validate data integrity and completeness
3. **Transform & Aggregate**: Process raw data into analysis-ready format with appropriate aggregations and calculations
4. **Document Methodology**: Record all data transformations, assumptions, and processing steps for reproducibility

### **Phase 3: Analysis & Insights Generation**
1. **Descriptive Analysis**: Calculate baseline metrics, trends, and distributions to understand current state
2. **Hypothesis Testing**: Apply appropriate statistical tests to validate or refute hypotheses with confidence intervals
3. **Segmentation Analysis**: Analyze patterns across key segments (user types, geographies, time periods) to identify variations
4. **Synthesize Insights**: Extract actionable insights from statistical results, focusing on business implications and recommendations

### **Phase 4: Reporting & Recommendations**
1. **Prepare Visualizations**: Create clear charts and tables that effectively communicate key findings and trends
2. **Document Limitations**: Clearly state assumptions, data constraints, and confidence levels for all conclusions
3. **Formulate Recommendations**: Develop specific, measurable, and time-bound recommendations based on analytical insights
4. **Update Artifacts**: Record findings in relevant sections and update Activity Log with analysis completion

## **Required Parameters**
| Parameter | Description | Format | Example |
|---|---|---|---|
| `task_reference` | Task-ID or slug to link findings to the correct task | ULID or kebab-case | `20251013-onboarding-funnel` |
| `decision_to_inform` | Core decision that analysis should enable | sentence | `Prioritize KYC uplift backlog items for Q1` |
| `hypotheses` | One or more hypotheses to test or validate | bullet list | `H1: Manual doc review causes drop-offs` |
| `metrics` | KPIs or diagnostic metrics involved | list or mini-table | `Activation rate, KYC completion rate` |
| `time_window` | Period to analyze or monitor | ISO dates or relative span | `2025-07-01 -> 2025-09-30` |

## **Optional Parameters**
| Parameter | Description | Usage |
|---|---|---|
| `data_sources` | Warehouses, tables, dashboards, or logs | Guides analysts to the right systems |
| `experiment_context` | Existing/desired experiments, variants, or MDE targets | Supports causal design recommendations |
| `segments` | User segments, cohorts, or geographies | Enables targeted cuts and comparisons |
| `bias_checks` | Known data quality issues or confounders | Flags mitigation steps |
| `deliverable_format` | Tables, charts, narrative, or deck expectations | Sets output format in the task |
| `update_scope` | Whether to refresh analytics section, PRD, or both | Directs downstream updates |

## **Execution Templates**

### **Analytics Summary**
```
Analytics Research Summary
- Decision Supported: [What decision this analysis enables]
- Hypotheses Tested: [List of hypotheses and validation results]
- Key Metrics: [Critical metrics measured with values and trends]
- Insights: [Top 3-5 actionable insights from analysis]
- Recommendations: [Data-driven recommendations with owners]
```

### **Detailed Findings**
| Hypothesis | Result | Evidence | Confidence |
|---|---|---|---|
| [Hypothesis statement] | [Supported/Refuted/Inconclusive] | [Metric values, sample sizes] | [High/Medium/Low] |

### **Rolling Summary Update**
```
Context: [Updated context based on analytics findings]
Facts: [Key metrics, trends, and statistical results]
Decisions: [Decisions enabled or informed by analytics]
Risks: [Data quality or statistical risks identified]
Next: [Next analytical steps or experiments needed]
```

## **Quality Standards & Guardrails**

### **Requirements**
- All hypotheses must be tested with appropriate statistical methods and significance levels
- Metrics must include baseline values, targets, and actual results with confidence intervals
- Analysis must account for segmentation and confounding variables
- Findings must be documented with clear methodology and data sources
- Recommendations must be specific, measurable, and time-bound

### **Process Compliance**
- Use appropriate statistical methods for the data type and research question
- Ensure data quality, completeness, and accuracy before analysis
- Document methodology and enable result replication
- Present findings with appropriate context and caveats
- Clearly state assumptions, limitations, and confidence levels

### **Boundary Conditions**
- Do not draw conclusions beyond what the data supports
- Do not use data without proper validation and quality checks
- Do not ignore statistical significance or confidence intervals
- Do not present findings without context or appropriate caveats
- Must respect data privacy and compliance requirements

### **Validation Protocols**
- Verify data source integrity and completeness
- Validate statistical methods and assumptions
- Cross-check findings with business context and domain knowledge
- Test recommendations for feasibility and impact
- Ensure documentation enables reproducible analysis

## **Execution Parameters**

### **Success Criteria**
- Statistical significance achieved for hypothesis testing (p < 0.05 or appropriate threshold)
- Insights directly support the specified business decision with clear recommendations
- Analysis is reproducible with documented methodology and data sources
- Findings are communicated clearly to stakeholders with appropriate visualizations
- Recommendations are actionable within project constraints and timeline

### **Error Handling**
- If data quality issues are identified, document limitations and proceed with caution
- When statistical significance is not achieved, report confidence intervals and sample size considerations
- For insufficient data coverage, extend time window or identify additional data sources
- If confounding variables are discovered, incorporate them into analysis or document as limitations
- When stakeholder questions extend beyond scope, document as follow-up items

## **Example Usage**
```
Use the analytics-research skill with these parameters:
task_reference: 20251013-onboarding-funnel
decision_to_inform: Decide whether to expand KYC automation scope before Sprint 3
hypotheses:
  - H1: Manual document verification causes 18% drop at step 3
  - H2: Mobile users experience higher friction due to image quality issues
metrics:
  - Activation rate (P1) weekly
  - KYC completion rate (P1) per segment
  - Support ticket volume related to KYC (P2)
time_window: 2025-07-01 -> 2025-09-30
data_sources:
  - warehouse.prod.kyc_events
  - analytics_dashboard.kyc_conversion
experiment_context:
  - Proposed A/B: Automated doc review vs. control; MDE 6 p.p.; alpha 0.05
segments:
  - Device type (iOS, Android, Web)
  - Geography (DE, FR, ES)
bias_checks:
  - Data loss for uploads >5MB (monitor)
deliverable_format: Summary table + chart
update_scope: Analytics & Research
```