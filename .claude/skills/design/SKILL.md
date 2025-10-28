---
name: aura-design
description: Comprehensive design skill supporting UI/UX design, system design, architectural design, and design thinking. Use when creating user interfaces, designing systems, planning architecture, or applying design methodologies. Integrates with design tools, prototyping, and design systems for comprehensive design workflows.
---

# AURA Design Skill

## Segment: Identity

- **Skill ID**: design
- **Version**: 1.0
- **Last Updated**: 2025-10-27
- **Target Agent**: {{actor}} (primarily architect, accessible to all agents)

## Segment: Purpose

### Core Purpose
Provide comprehensive design capabilities across UI/UX design, system design, architectural design, and design thinking methodologies. Enable creation of user-centered designs, scalable system architectures, and effective design solutions with integration with modern design tools and prototyping capabilities.

### Success Criteria
- Design solutions meet user needs and business requirements
- Systems designed for scalability, maintainability, and performance
- User interfaces created with accessibility and usability standards
- Design documentation comprehensive and implementation-ready
- Prototypes validated with user feedback and iteration
- Design systems established for consistency and reusability
- All design resources organized in task-specific `/design` folders
- Design work properly indexed and tracked in task index files

### Trigger Scenarios
- **UI/UX Design**: User interface and user experience design for applications
- **System Design**: Software system architecture and component design
- **Architecture Design**: High-level system architecture and integration patterns
- **Design Thinking**: Problem-solving using design methodologies and user-centered approaches
- **Prototype Creation**: Interactive prototypes and design validation
- **Design System Development**: Component libraries and design guidelines
- **User Research**: User analysis and design research activities

## Segment: Required MCPs/Tools

### MCP Dependencies
- **FileSystem**: Design file management, asset organization, and documentation
- **Read**: Design analysis, specification review, and research access
- **Write**: Design creation, documentation generation, and specification writing
- **Bash**: Design tool execution, asset processing, and automation
- **WebSearch**: Design research, trend analysis, and inspiration gathering
- **WebFetch**: Documentation access, design resources, and external references

### Design and Prototyping Tools
- **Figma MCP**: UI design, prototyping, and collaborative design (recommended)
- **Adobe Creative MCP**: Professional design tools and creative workflows (recommended)
- **Sketch MCP**: Digital design platform and vector editing (recommended)
- **Design System Tools**: Component libraries and design token management (recommended)

### Analysis and Research Tools
- **User Research Tools**: Survey creation, user interviews, and analytics analysis
- **Analytics Platforms**: User behavior analysis and design metrics
- **A/B Testing Tools**: Design validation and conversion optimization
- **Accessibility Tools**: WCAG compliance validation and accessibility testing

### Architecture and System Design Tools
- **Diagramming Tools**: System architecture visualization and documentation
- **Modeling Tools**: UML diagrams and system modeling
- **Collaboration Platforms**: Design reviews and stakeholder feedback
- **Documentation Tools**: Design specifications and implementation guides

### Recommended MCPs to Install
1. **Figma MCP** - Professional UI/UX design and prototyping
   - Installation: `npm install -g @modelcontextprotocol/server-figma`
   - Purpose: Interface design, prototyping, and collaborative design workflows

2. **Adobe Creative MCP** - Professional design tools integration
   - Installation: `npm install -g @modelcontextprotocol/server-adobe-creative`
   - Purpose: Professional design, graphics, and creative workflows

3. **Sketch MCP** - Digital design and vector editing
   - Installation: `npm install -g @modelcontextprotocol/server-sketch`
   - Purpose: Vector design, UI components, and design systems

4. **Miro MCP** - Collaborative whiteboard and design thinking
   - Installation: `npm install -g @modelcontextprotocol/server-miro`
   - Purpose: Collaborative design, brainstorming, and visual planning

5. **Diagram MCP** - System architecture and flow diagramming
   - Installation: `npm install -g @modelcontextprotocol/server-diagrams`
   - Purpose: System diagrams, flowcharts, and architecture visualization

6. **Analytics MCP** - User analytics and design metrics
   - Installation: `npm install -g @modelcontextprotocol/server-analytics`
   - Purpose: User behavior analysis, design metrics, and performance tracking

### Prerequisites
- **Design Requirements**: Clear understanding of user needs and business requirements
- **Technical Constraints**: Knowledge of technical limitations and platform capabilities
- **Brand Guidelines**: Brand standards, design systems, and style guides
- **User Research**: User data, personas, and research insights
- **Design Tools**: Access to necessary design software and platforms

## Segment: Orientation

### Orientation Checks
- **Constitution Review**: Confirm ../../../.aura/constitution.md for design standards and architectural patterns
- **Design Systems**: Review existing design systems and brand guidelines
- **User Research**: Analyze available user data and research insights
- **Technical Constraints**: Understand platform limitations and technical requirements

### Pre-execution Validation
- **Agent Authorization**: Verify agent has design authorization
- **Tool Availability**: Confirm design tools and platforms accessible
- **Design Context**: Load project context, requirements, and constraints
- **User Understanding**: Validate user research and persona availability

## Segment: Execution Algorithm

### Advanced Design Framework

#### Phase 0: Task Structure Setup and Organization

1. **Task Directory Creation**
   - Create task-specific directory structure based on current task context
   - Establish `/design` subfolder within the task directory
   - Initialize design work organization and file structure
   - Set up design resource management and tracking

2. **Design Work Environment Setup**
   - Create design folder structure: `/design/{research, wireframes, mockups, prototypes, assets, documentation}`
   - Initialize design index file for tracking all design activities
   - Establish design version control and change tracking
   - Set up design collaboration and review processes

3. **Design Index Creation**
   - Create master index file in task root directory
   - Document all design activities, decisions, and resources
   - Establish design work timeline and milestone tracking
   - Set up design deliverable tracking and status management

4. **Integration with Task Management**
   - Update main task index with design work references
   - Establish design work dependencies and relationships
   - Create design handoff documentation for development team
   - Set up design review and approval workflows

#### Phase 1: Research and Analysis

1. **User Research and Analysis**
   - Conduct user interviews, surveys, and observation studies
   - Create user personas and journey maps
   - Analyze user behavior patterns and pain points
   - Identify user needs, goals, and motivations

2. **Market and Competitor Analysis**
   - Research industry design trends and best practices
   - Analyze competitor designs and user experience patterns
   - Identify opportunities for innovation and differentiation
   - Gather design inspiration and reference materials

3. **Requirements Analysis and Constraint Identification**
   - Analyze business requirements and success criteria
   - Identify technical constraints and platform limitations
   - Review brand guidelines and design system requirements
   - Document accessibility and compliance requirements

#### Phase 2: Design Strategy and Planning

1. **Design Thinking and Problem Definition**
   - Apply design thinking methodologies to problem-solving
   - Define design problems and opportunity areas
   - Create design principles and success metrics
   - Establish design strategy and approach

2. **Information Architecture and User Flows**
   - Design information architecture and content organization
   - Create user flows and interaction patterns
   - Define navigation structure and hierarchy
   - Plan content strategy and information design

3. **Design System Planning**
   - Define design system requirements and component library
   - Establish design tokens and style guidelines
   - Plan component reusability and consistency patterns
   - Create design governance and maintenance strategies

#### Phase 3: UI/UX Design and Prototyping

##### **User Interface Design**
1. **Wireframing and Layout Design**
   - Create low-fidelity wireframes and layout concepts
   - Design responsive layouts and breakpoint strategies
   - Establish visual hierarchy and information grouping
   - Optimize layout for different screen sizes and devices

2. **Visual Design and Branding**
   - Apply brand guidelines and visual identity systems
   - Design color palettes, typography, and iconography
   - Create visual styles and component designs
   - Ensure brand consistency across all touchpoints

3. **Interactive Design and Micro-interactions**
   - Design interactive elements and transition animations
   - Create micro-interactions and feedback mechanisms
   - Design gesture controls and touch interactions
   - Optimize interaction patterns for usability

##### **Prototyping and User Testing**
1. **Interactive Prototypes**
   - Create high-fidelity interactive prototypes
   - Design prototype flows and user scenarios
   - Implement realistic interactions and state changes
   - Prepare prototypes for user testing and validation

2. **User Testing and Validation**
   - Conduct usability testing with target users
   - Gather feedback on design concepts and interactions
   - Analyze user behavior and identify improvement areas
   - Iterate designs based on user feedback

#### Phase 4: System and Architecture Design

##### **System Architecture Design**
1. **High-Level Architecture**
   - Design system architecture and component relationships
   - Define service boundaries and integration patterns
   - Plan data flow and communication protocols
   - Establish scalability and performance requirements

2. **Component Design**
   - Design individual components and modules
   - Define component interfaces and contracts
   - Plan component reusability and maintainability
   - Document component dependencies and interactions

3. **Integration and API Design**
   - Design API specifications and integration patterns
   - Define data models and schemas
   - Plan authentication and security patterns
   - Document integration requirements and dependencies

##### **Database and Infrastructure Design**
1. **Data Architecture**
   - Design database schemas and data models
   - Plan data access patterns and optimization strategies
   - Define data migration and versioning approaches
   - Establish data governance and security requirements

2. **Infrastructure Design**
   - Plan cloud architecture and deployment patterns
   - Define scalability and performance optimization strategies
   - Design monitoring and observability systems
   - Establish disaster recovery and business continuity plans

#### Phase 5: Design Documentation and Handoff

##### **Design Documentation**
1. **Design Specifications**
   - Create comprehensive design specifications and documentation
   - Document design decisions and rationale
   - Provide implementation guidelines and best practices
   - Create design asset libraries and resource references

2. **Developer Handoff**
   - Prepare design deliverables for development team
   - Create style guides and component libraries
   - Provide implementation support and guidance
   - Establish design review and validation processes

##### **Quality Assurance and Validation**
1. **Design Review and Validation**
   - Conduct design reviews with stakeholders
   - Validate designs against requirements and constraints
   - Ensure accessibility and compliance standards are met
   - Test designs across different platforms and devices

2. **Performance and Optimization**
   - Optimize designs for performance and loading times
   - Validate design assets and optimize file sizes
   - Test designs under various network conditions
   - Ensure designs meet performance requirements

## Segment: Artifact Output

### Primary Outputs
- **Task Design Structure**: Organized `/design` folder within task directory with complete design work
- **Design Index**: Master index file tracking all design activities, decisions, and resources
- **Design Systems**: Component libraries, style guides, and design tokens
- **UI Designs**: Wireframes, mockups, and high-fidelity designs
- **Interactive Prototypes**: Clickable prototypes and user flow demonstrations
- **System Architecture**: Architecture diagrams and technical specifications
- **Design Documentation**: Comprehensive design specifications and implementation guides
- **User Research**: Personas, journey maps, and user insights

### Design Folder Structure
```
task_name/
├── index.md                    # Main task index with design references
└── design/                     # Design work folder
    ├── index.md               # Design work index and tracking
    ├── research/              # User research and analysis
    │   ├── personas.md
    │   ├── journey-maps.md
    │   └── competitive-analysis.md
    ├── wireframes/            # Low-fidelity design concepts
    │   ├── mobile-wireframes.fig
    │   ├── desktop-wireframes.fig
    │   └── user-flows.md
    ├── mockups/              # High-fidelity visual designs
    │   ├── final-designs.fig
    │   ├── component-library.fig
    │   └── style-guide.md
    ├── prototypes/           # Interactive prototypes
    │   ├── user-testing-prototype.fig
    │   └── prototype-specs.md
    ├── assets/               # Design assets and resources
    │   ├── icons/
    │   ├── images/
    │   └── illustrations/
    ├── documentation/        # Design specifications
    │   ├── ui-specifications.md
    │   ├── system-architecture.md
    │   └── handoff-guide.md
    └── reviews/              # Design reviews and feedback
        ├── stakeholder-review.md
        └── usability-testing-results.md
```

### Design Index Structure
The design index file (`design/index.md`) serves as the master tracking document for all design work within a task:

```markdown
# Design Work Index

## Task Information
- **Task Name**: [Task Name]
- **Design Lead**: [Designer Name]
- **Created**: [Date]
- **Last Updated**: [Date]
- **Status**: [In Progress/Review/Complete]

## Design Activities
- [ ] **Research**: User research and analysis completed
- [ ] **Ideation**: Design concepts and brainstorming completed
- [ ] **Wireframing**: Low-fidelity designs created
- [ ] **Visual Design**: High-fidelity mockups completed
- [ ] **Prototyping**: Interactive prototypes created
- [ ] **Testing**: User testing and validation completed
- [ ] **Documentation**: Design specifications completed
- [ ] **Handoff**: Development handoff completed

## Design Decisions Log
| Date | Decision | Rationale | Impact |
|------|----------|-----------|---------|
| [Date] | [Design decision] | [Why this decision was made] | [Impact on project] |

## Design Assets
### Research
- `research/personas.md` - User personas and profiles
- `research/journey-maps.md` - User journey mapping
- `research/competitive-analysis.md` - Competitive analysis

### Wireframes
- `wireframes/mobile-wireframes.fig` - Mobile wireframes
- `wireframes/desktop-wireframes.fig` - Desktop wireframes
- `wireframes/user-flows.md` - User flow documentation

### Mockups
- `mockups/final-designs.fig` - Final high-fidelity designs
- `mockups/component-library.fig` - Component library
- `mockups/style-guide.md` - Style guide documentation

### Prototypes
- `prototypes/user-testing-prototype.fig` - User testing prototype
- `prototypes/prototype-specs.md` - Prototype specifications

### Documentation
- `documentation/ui-specifications.md` - UI implementation specifications
- `documentation/system-architecture.md` - System architecture diagrams
- `documentation/handoff-guide.md` - Development handoff guide

## Reviews and Feedback
- `reviews/stakeholder-review.md` - Stakeholder review feedback
- `reviews/usability-testing-results.md` - Usability testing results

## Timeline and Milestones
- **Research Phase**: [Start Date] - [End Date]
- **Design Phase**: [Start Date] - [End Date]
- **Testing Phase**: [Start Date] - [End Date]
- **Documentation Phase**: [Start Date] - [End Date]

## Integration Points
- **Development Team**: [Development lead contact]
- **Product Management**: [Product manager contact]
- **Stakeholders**: [Key stakeholders and review schedule]

## Next Steps
1. [ ] Complete wireframe review with product team
2. [ ] Conduct user testing on prototype
3. [ ] Finalize design specifications
4. [ ] Prepare development handoff package
```

### Evidence Requirements
- **User Validation**: User testing results and feedback analysis
- **Design Compliance**: Adherence to brand guidelines and design systems
- **Technical Feasibility**: Validation of technical implementation approaches
- **Performance Metrics**: Loading times, interaction speeds, and optimization results
- **Accessibility Compliance**: WCAG compliance and accessibility testing results
- **Index Completeness**: Design index fully populated with all activities and decisions

## Segment: Transition Log Template

### Standard Format
```
[TRANSITION|design] by {{actor}}
MODE: {{transition_mode}}
FROM_STATE: {{from_state}}
TO_STATE: {{to_state}}
WHY:
- {{design_reason_1}}
- {{design_reason_2}}
OUTPUT:
=== Design ===
summary: {{operation_summary}} with {{design_type}} and {{design_methodology}}.
inputs: operation_type={{operation_type}} design_scope={{design_scope}} requirements={{requirements_ref}}
evidence: {{validation_type}}|result={{validation_result}}|ref={{design_deliverable_path}}
risks: [ ]{{design_risk}}|owner={{actor}}|mitigation={{mitigation_strategy}}
next_steps: {{next_design_actions}}
=== END Design ===
FOLLOW-UP:
- {{follow_up_action}} - owner={{responsible_agent}} - due={{timeline}}
```

### BLOCKED Protocol
```
BLOCKED(missing_inputs=[{{critical_inputs}}], unblock_steps=[{{resolution_steps}}])
```

## Advanced Design Templates

### **Design Index Template**
The design index template provides a comprehensive structure for tracking all design work within a task:

- **Task Information**: Basic task metadata and status tracking
- **Design Activities**: Checklist of design phases and completion status
- **Design Decisions Log**: Historical record of design decisions and rationale
- **Design Assets**: Complete inventory of all design files and resources
- **Timeline and Milestones**: Project timeline with key milestones
- **Integration Points**: Team contacts and collaboration schedule
- **Quality Metrics**: Design quality and user experience metrics
- **Risks and Mitigation**: Project risks and mitigation strategies

### **UI/UX Design Template**
```
You are creating comprehensive UI/UX designs following user-centered design principles and modern design standards.

DESIGN REQUIREMENTS:
1. USER-CENTERED APPROACH: Design for user needs, goals, and behaviors
2. ACCESSIBILITY STANDARDS: WCAG 2.1 AA compliance and inclusive design
3. RESPONSIVE DESIGN: Multi-device compatibility and responsive layouts
4. BRAND CONSISTENCY: Adherence to brand guidelines and design systems
5. PERFORMANCE OPTIMIZATION: Fast loading and smooth interactions

DESIGN WORKFLOW:
1. Research & Analysis: User research, competitor analysis, and requirements gathering
2. Information Architecture: Content organization, navigation, and user flows
3. Wireframing: Layout design, information hierarchy, and responsive planning
4. Visual Design: Brand application, typography, color, and visual styling
5. Prototyping: Interactive prototypes and user testing scenarios
6. Validation: User feedback, accessibility testing, and iteration

DESIGN TOOLS INTEGRATION:
- Figma/Sketch for UI design and prototyping
- Design system tools for component libraries
- Accessibility tools for compliance validation
- Analytics tools for user behavior analysis

QUALITY STANDARDS:
- User testing with ≥5 target users
- Accessibility compliance (WCAG 2.1 AA)
- Performance benchmarks (loading <3 seconds)
- Cross-browser and device compatibility
```

### **System Design Template**
```
You are designing scalable system architecture following modern architectural patterns and best practices.

SYSTEM DESIGN REQUIREMENTS:
1. SCALABILITY: Design for growth and increased load
2. MAINTAINABILITY: Clean code principles and modular architecture
3. PERFORMANCE: Optimized response times and resource usage
4. SECURITY: Security best practices and vulnerability prevention
5. RELIABILITY: High availability and fault tolerance

ARCHITECTURE WORKFLOW:
1. Requirements Analysis: Functional and non-functional requirements
2. High-Level Design: System components and their relationships
3. Detailed Design: Component specifications and interfaces
4. Data Architecture: Database design and data flow patterns
5. Infrastructure Design: Deployment and scaling strategies
6. Security Design: Authentication, authorization, and data protection

ARCHITECTURE PATTERNS:
- Microservices architecture for scalability
- Event-driven patterns for loose coupling
- CQRS for read/write separation
- API Gateway for external interface management
- Circuit breaker for fault tolerance

DESIGN VALIDATION:
- Performance testing and load analysis
- Security assessment and vulnerability scanning
- Architecture review with technical stakeholders
- Documentation completeness and clarity
```

### **Design Thinking Template**
```
You are applying design thinking methodologies to solve complex problems with user-centered approaches.

DESIGN THINKING REQUIREMENTS:
1. EMPATHY: Deep understanding of user needs and contexts
2. DEFINITION: Clear problem articulation and opportunity framing
3. IDEATION: Creative solution generation and exploration
4. PROTOTYPING: Rapid prototype creation and iterative testing
5. TESTING: User validation and continuous improvement

DESIGN THINKING WORKFLOW:
1. Empathize: User research, interviews, and observation
2. Define: Problem framing and opportunity identification
3. Ideate: Brainstorming and solution concept generation
4. Prototype: Rapid prototyping and concept visualization
5. Test: User validation and feedback collection

METHODS AND TECHNIQUES:
- User interviews and empathy mapping
- Journey mapping and experience mapping
- Brainstorming and creative ideation techniques
- Rapid prototyping and MVP development
- User testing and validation methodologies

OUTCOME FOCUS:
- User-centered solution validation
- Iterative improvement based on feedback
- Innovation and creative problem-solving
- Cross-functional collaboration and insights
```

## Specialized Design Capabilities

### **UI/UX Design**
- **User Research**: Interviews, surveys, personas, and journey mapping
- **Information Architecture**: Content organization, navigation, and user flows
- **Visual Design**: Branding, typography, color theory, and visual hierarchy
- **Interaction Design**: Micro-interactions, animations, and gesture controls
- **Prototyping**: Wireframes, mockups, and interactive prototypes
- **Usability Testing**: User validation and iterative design improvements

### **System Architecture Design**
- **High-Level Architecture**: System components, services, and integration patterns
- **Microservices Design**: Service boundaries, APIs, and communication patterns
- **Database Design**: Schema design, data modeling, and optimization strategies
- **Security Architecture**: Authentication, authorization, and data protection
- **Performance Design**: Caching strategies, load balancing, and optimization
- **Cloud Architecture**: Deployment patterns, scalability, and infrastructure design

### **Design Systems**
- **Component Libraries**: Reusable UI components and design patterns
- **Design Tokens**: Consistent design variables and style guidelines
- **Pattern Libraries**: Interaction patterns and design best practices
- **Brand Guidelines**: Visual identity, voice, and tone guidelines
- **Accessibility Standards**: WCAG compliance and inclusive design patterns
- **Design Governance**: Design system maintenance and evolution strategies

## Integration Features

### **AURA Constitution Integration**
- **Design Standards**: Follow AURA design patterns and architectural guidelines
- **Workflow Integration**: Seamless integration with AURA State Machine transitions
- **Agent Coordination**: Support multi-agent collaboration for design workflows
- **Audit Trail**: Complete design documentation and decision tracking

### **Tool Integration**
- **Design Software**: Integration with Figma, Adobe Creative Cloud, Sketch
- **Prototyping Tools**: Interactive prototyping and user testing platforms
- **Collaboration Platforms**: Design reviews, feedback, and stakeholder collaboration
- **Development Handoff**: Seamless transition from design to development workflows

## Additional Resources

- [AURA Constitution](../../../.aura/constitution.md) - Design standards and architectural patterns
- [AURA Glossary](../../../.aura/glossary.md) - Design terminology and definitions
- [Design Templates](templates/) - Design template files and examples
  - [Design Index Template](templates/design-index-template.md) - Master tracking template for design work
  - [UI Design Template](templates/ui-design-template.md) - UI/UX design methodology
  - [System Design Template](templates/system-design-template.md) - System architecture design
- [Design Tools](tools/) - Design utilities and automation scripts
  - [Design Validator](tools/design-validator.py) - Design validation and quality checking
- [Design Examples](examples/) - Design examples and case studies
- [Best Practices](docs/) - Design methodologies and guidelines

## Guardrails

- Follow AURA constitution design standards and architectural patterns
- Design for accessibility and inclusive user experiences
- Ensure designs are technically feasible and implementable
- Validate designs with user research and testing
- Maintain brand consistency and design system adherence
- Consider performance implications and optimization requirements
- Document design decisions and rationale thoroughly
- Collaborate with cross-functional teams and stakeholders
- **Task Structure Management**: Always create `/design` folder within task directories
- **Index Maintenance**: Keep design index file current with all activities and decisions
- **Resource Organization**: Store all design resources in organized folder structure
- **Version Control**: Track design iterations and changes in the design index
- **Handoff Preparation**: Ensure development handoff documentation is complete and accessible

---

*Advanced Design skill providing comprehensive UI/UX design, system architecture, and design thinking capabilities with modern design tool integration for creating user-centered, scalable, and maintainable design solutions.*