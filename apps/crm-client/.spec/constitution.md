# CRM Client Constitution

## Mission
Deliver a modular React front-end with intelligent automation, consuming Spec Gen services with dynamic component generation, real-time performance monitoring, and adaptive user experience optimization.

## Constitution Apps Framework

### App Configuration
```yaml
App ID: crm-client
App Type: React Frontend Application
Version: {{current-version}}
Last Updated: {{current-date}}
Active Skills: 6/6
Automation Level: {{automation-percentage}}%
```

### Agent Orchestration
```yaml
Primary Agents:
  - tech-lead-orchestrator: Frontend engineering execution and component development
  - architect-orchestrator: Frontend architecture and design system decisions
  - qa-orchestrator: Frontend quality assurance and user experience testing
  - product-ops-orchestrator: Frontend roadmap and user experience coordination

Skill Execution:
  Development: [frontend-development, code-quality, devops-automation]
  Quality: [qa-testing, research-analysis]
  Architecture: [architect-plan]
  Management: [context-compact]
```

## Architectural Principles
- **🤖 Intelligent Component Generation**: Auto-generated React components with dynamic scaffolding
- **📊 Performance-First Design**: Core Web Vitals optimization with real-time monitoring
- **🔧 Modular Architecture**: Composition-first UI with route-driven code splitting
- **🎨 Dynamic Theming**: Centralized design tokens with adaptive theming
- **♿ Accessibility by Design**: WCAG compliance with automated accessibility testing

## Dynamic Capabilities
```yaml
Frontend Intelligence:
  Component Generation: {{component-generation-status}}
  Performance Monitoring: {{perf-monitoring-status}}
  User Experience Analytics: {{ux-analytics-status}}
  Accessibility Scoring: {{a11y-scoring-status}}

Automation Features:
  - Component Scaffolding: {{component-scaffolding}}
  - Page Generation: {{page-generation}}
  - Form Generation: {{form-generation}}
  - Test Generation: {{test-generation}}
  - Documentation: {{doc-generation}}
```

## Build & Runtime
```yaml
Tech Stack:
  Framework: React {{version}}
  Language: TypeScript {{version}}
  Build Tool: Vite {{version}}
  State Management: Redux Toolkit + RTK Query
  Styling: CSS Modules + Styled Components
  Testing: Vitest + Testing Library + Cypress
  UI Components: Custom component library

Build Configuration:
  Bundler: Vite (ESM, HMR, TypeScript-first)
  Code Splitting: Route-based + component-based
  Target Browsers: Evergreen browsers
  Environment: .env.local (dev) + .env.production (prod)
  Deployment: CDN edge + Docker preview server
```

## Performance Targets
```yaml
Core Web Vitals:
  TTI: ≤ 2.5s on reference hardware
  LCP: < 2.5s
  CLS: < 0.1
  FID: < 100ms
  INP: < 200ms

Bundle Budget:
  Initial: ≤ 200KB gzipped
  Async Chunks: ≤ 150KB gzipped
  Total Bundle: ≤ 1MB gzipped
  Asset Optimization: {{optimization-status}}

Quality Gates:
  Lighthouse Score: ≥ 90
  Accessibility Score: ≥ 95
  Best Practices Score: ≥ 90
  SEO Score: ≥ 85
```

## Testing Strategy
```yaml
Testing Pyramid:
  Unit Tests:
    Framework: Vitest + Testing Library
    Coverage: > 90%
    Focus: Component logic, hooks, utilities

  Integration Tests:
    Framework: Cypress Component Tests
    Coverage: Critical user flows
    Focus: Component interactions, API integration

  E2E Tests:
    Framework: Cypress E2E
    Coverage: Key user journeys
    Focus: Complete workflows, cross-browser compatibility

  Accessibility Tests:
    Tool: axe-core scans
    Coverage: All page templates
    Standard: WCAG 2.1 AA compliance
```

## Dynamic Skill Integration
```yaml
Frontend Development Pipeline:
  1. architect-plan: Design component architecture and design system
  2. frontend-development: Generate components and pages
  3. code-quality: Review and validate frontend code quality
  4. qa-testing: Execute comprehensive frontend testing
  5. devops-automation: Deploy frontend with CI/CD pipeline
  6. research-analysis: Analyze user experience and performance
  7. context-compact: Maintain clean documentation

Auto-Execution:
  - Component Generation: {{component-auto-gen}}
  - Page Scaffolding: {{page-scaffolding}}
  - Form Generation: {{form-auto-gen}}
  - Test Generation: {{test-auto-gen}}
  - Documentation: {{doc-auto-gen}}
```

## Risk & Mitigation
```yaml
Risk Management:
  State Bloat:
    Risk: Medium
    Mitigation: Redux Toolkit best practices + slice ownership enforcement
    Status: {{mitigation-status}}

  Design Drift:
    Risk: Medium
    Mitigation: Centralized design tokens + component library
    Status: {{mitigation-status}}

  API Coupling:
    Risk: Low
    Mitigation: Generated TypeScript clients + API contract testing
    Status: {{mitigation-status}}

  Performance Degradation:
    Risk: High
    Mitigation: Real-time monitoring + bundle optimization
    Status: {{mitigation-status}}

  Accessibility Regression:
    Risk: Medium
    Mitigation: Automated accessibility testing + CI checks
    Status: {{mitigation-status}}
```

## Quality Standards
```yaml
Code Quality:
  TypeScript Strict Mode: Enabled
  ESLint Configuration: Standard + React rules
  Prettier Formatting: Automated
  Pre-commit Hooks: Quality checks enforced
  Husky: Git hooks for quality enforcement

Component Quality:
  Prop TypeScript Interfaces: Required
  Component Testing: > 90% coverage
  Storybook Documentation: Required for all components
  Accessibility Testing: Automated for all components

Performance Standards:
  Bundle Size: Within budget limits
  Load Performance: Core Web Vitals targets met
  Runtime Performance: No memory leaks, smooth animations
  SEO Standards: Meta tags, semantic HTML
```

## Design System Integration
```yaml
Component Library:
  Structure: Atomic design methodology
  Tokens: Centralized design tokens (shared/ui-theme)
  Components: Reusable UI components
  Documentation: Storybook with live examples
  Testing: Automated visual regression testing

Theme Management:
  Light/Dark Mode: Dynamic theme switching
  Brand Themes: Multiple brand support
  Customization: Configurable theme variants
  Accessibility: High contrast mode support
```

## Monitoring & Observability
```yaml
Performance Monitoring:
  Core Web Vitals: Real-time tracking
  Bundle Analysis: Webpack Bundle Analyzer
  Runtime Performance: Memory usage, frame rate
  User Experience: Error tracking, session analytics

User Analytics:
  Page Views: Route-based analytics
  Feature Usage: Component interaction tracking
  Performance Metrics: User-perceived performance
  Error Tracking: Frontend error monitoring

Alerting:
  Performance Degradation: Core Web Vitals alerts
  Error Rate Spikes: Frontend error monitoring
  Bundle Size Issues: Build time alerts
  Accessibility Issues: A11y test failures
```

## Integration Points
```yaml
API Integration:
  Client Generation: Auto-generated TypeScript clients
  State Management: RTK Query for server state
  Error Handling: Centralized error boundaries
  Caching: RTK Query caching strategy

Internal Integrations:
  Design System: shared/ui-theme package
  Component Library: Reusable component library
  Testing Framework: Shared test utilities
  Build Pipeline: Shared CI/CD configuration

External Integrations:
  Analytics: User behavior tracking
  Error Monitoring: Frontend error reporting
  Performance: Real user monitoring
  Authentication: OAuth provider integration
```

## Development Workflow
```yaml
Development Process:
  1. Feature Planning: Define requirements and acceptance criteria
  2. Component Design: Design components with Figma/UI kit
  3. Implementation: Generate components and write business logic
  4. Testing: Write unit, integration, and E2E tests
  5. Review: Code review and design review
  6. Deployment: Deploy to staging and production
  7. Monitoring: Monitor performance and user experience

Quality Gates:
  Code Review: All PRs require review
  Testing: All tests must pass
  Performance: Bundle size and Core Web Vitals checks
  Accessibility: Automated accessibility scans
  Documentation: Storybook documentation required
```

---

*Dynamic CRM Client Constitution with intelligent automation and comprehensive user experience optimization*