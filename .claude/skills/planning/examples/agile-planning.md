# Agile Planning Example

## Scenario

A product-ops agent needs to plan the next sprint for a development team working on an e-commerce feature. The team has 5 developers with varying skills and 2 weeks of capacity.

## Execution

```bash
exec story=ECOM-002 skill=planning planning_type=agile requirements=docs/ecommerce-feature-requirements.md team_capacity=docs/team-capacity-q4-2025.csv dependencies=docs/technical-dependencies.md
```

## Expected Output

```
[TRANSITION|agile.planning] by product-ops
MODE: strict
FROM_STATE: PRD_READY
TO_STATE: PLANNED
WHY:
- Sprint planning required for upcoming development cycle
- Team capacity needs to be allocated to feature backlog
- Dependencies need to be resolved before sprint start
OUTPUT:
=== Agile Plan ===
summary: Created comprehensive sprint plan with 8 user stories sequenced by business value, team capacity allocated to match skills, and all dependencies resolved with clear owners.
inputs: requirements=ecommerce-feature-requirements.md team_capacity=team-capacity-q4-2025.csv dependencies=technical-dependencies.md
evidence: capacity_plan|result=validated|ref=plans/agile-sprint-ecom-002-2025-10-27.md
risks: [ ]Senior developer availability for complex components|owner=product-ops|mitigation=pair junior with senior for knowledge transfer
next_steps: Begin sprint execution with daily standups and progress tracking.
=== END Agile Plan ===
FOLLOW-UP:
- Sprint kickoff meeting - owner=product-ops - due=2025-10-28
```

## Generated Plan Structure

The agile planning creates the following deliverables:

### Sprint Backlog (8 User Stories)
1. **User Authentication** (5 story points) - Senior Dev
2. **Product Catalog** (8 story points) - Senior Dev + Mid Dev
3. **Shopping Cart** (3 story points) - Mid Dev
4. **Payment Integration** (8 story points) - Senior Dev
5. **Order Management** (5 story points) - Mid Dev + Junior Dev
6. **Admin Dashboard** (3 story points) - Junior Dev
7. **Search Functionality** (5 story points) - Mid Dev
8. **Mobile Responsive** (5 story points) - Junior Dev + Mid Dev

### Resource Allocation
- **Total Capacity**: 42 story points available (5 devs × 2 weeks)
- **Planned Velocity**: 42 story points (100% allocation)
- **Skill Distribution**: Complex tasks assigned to senior developers
- **Knowledge Transfer**: Junior developers paired with seniors on learning opportunities

### Timeline and Milestones
- **Sprint Duration**: 2 weeks (2025-10-28 to 2025-11-10)
- **Sprint Review**: 2025-11-11
- **Sprint Retrospective**: 2025-11-12
- **Key Milestones**:
  - Week 1: Core functionality (auth, catalog, cart)
  - Week 2: Integration and polish (payment, admin, mobile)

### Dependencies
- **Payment Gateway**: External API access required by 2025-11-01
- **Product Data**: Inventory system integration needed by 2025-10-30
- **Design Assets**: UI/UX designs required by 2025-11-01

### Quality Gates
- **Definition of Done**: Code reviewed, tests passing, documented
- **Acceptance Criteria**: All user stories must meet acceptance criteria
- **Performance**: Page load times < 2 seconds
- **Accessibility**: WCAG 2.1 AA compliance

## Planning Methodology

### 1. Business Value Prioritization
- **High Value**: User authentication, payment integration
- **Medium Value**: Product catalog, shopping cart, order management
- **Foundation**: Admin dashboard, search, mobile responsive

### 2. Dependency Analysis
- **Critical Path**: Authentication → Catalog → Cart → Payment
- **Parallel Streams**: Admin dashboard, search functionality
- **External Dependencies**: Payment gateway, inventory system

### 3. Capacity Planning
- **Skill Matching**: Complex tasks assigned to senior developers
- **Learning Opportunities**: Junior developers paired on lower complexity tasks
- **Buffer Allocation**: 10% buffer included in story point estimates

### 4. Risk Mitigation
- **Technical Risk**: Senior developer availability mitigated through pairing
- **Integration Risk**: Early integration testing planned
- **Timeline Risk**: Clear milestone tracking and daily check-ins

## Team Collaboration

### Daily Standups
- **Time**: 9:00 AM daily
- **Focus**: Progress, blockers, plan for the day
- **Participants**: All developers, product-ops, tech-lead

### Weekly Reviews
- **Sprint Planning**: Week 1 review and adjustments
- **Stakeholder Update**: Progress demonstration to stakeholders
- **Risk Assessment**: Weekly risk review and mitigation updates

## Success Metrics

### Delivery Metrics
- **Velocity**: Target 42 story points for the sprint
- **Cycle Time**: Average 3 days per user story
- **Throughput**: 4 user stories per week

### Quality Metrics
- **Defect Rate**: < 5 defects per sprint
- **Test Coverage**: > 80% code coverage
- **Code Review**: 100% code review coverage

### Team Metrics
- **Sprint Goal Achievement**: 100% sprint goals met
- **Team Happiness**: > 4/5 satisfaction score
- **Knowledge Sharing**: 2+ pair programming sessions per week

## Next Steps

1. **Sprint Kickoff** (2025-10-28): Review plan, assign tasks, set up tools
2. **Daily Execution**: Follow sprint plan with daily standups and progress tracking
3. **Mid-Sprint Review** (2025-11-04): Assess progress and adjust as needed
4. **Sprint Review** (2025-11-11): Demonstrate completed features
5. **Sprint Retrospective** (2025-11-12): Review process and identify improvements