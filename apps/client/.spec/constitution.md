# Client App Constitution

## Purpose
Deliver a modular React front-end that consumes Spec Gen services, supports rapid feature toggles, and scales across multiple product surfaces (web landing, CRM portals, dashboards).

## Architectural Principles
- Composition-first UI with route-driven code splitting.
- Global state via Redux Toolkit slices; RTK Query for data fetching once endpoints are defined.
- TypeScript everywhere; favor feature folders with colocated tests.
- Keep side effects inside thunks or RTK Query endpoints, never in components.

## Build & Runtime
- Bundler: Vite (ESM, hot module reload, first-class TypeScript).
- Target browsers: evergreen Chromium, Firefox ESR, Safari ≥ 16, Edge ≥ 116.
- Environment variables are loaded from `.env.local` (developer) and `.env.production`.
- CI deploys static assets to the CDN edge; Docker image bundles Vite preview server for on-prem previews.

## Non-Functional Targets
- TTI ≤ 2.5s on reference hardware (Moto G Power via Lighthouse).
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms.
- Bundle budget: initial ≤ 200KB gzipped, async chunk ≤ 150KB.

## Testing Strategy
- Unit: Vitest + Testing Library for component logic and hooks.
- Integration: cypress component tests (to be added) for critical flows.
- Accessibility: axe-core scans on top-level templates.

## Risks & Mitigations
- **State bloat**: enforce slice ownership via PR templates; prune unused reducers.
- **Design drift**: centralize tokens in `shared/ui-theme` package.
- **API coupling**: use generated TypeScript clients from API OpenAPI spec to keep parity.
