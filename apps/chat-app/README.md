# Client Application

React + Vite single-page application scaffolded with Redux Toolkit state management.

## Tech Stack Requirements

Per the [root constitution](../../../.spec/constitution.md#tech-stack-requirements), this application follows the standardized tech stack:

- **Code Linting and Formatting**: **Biome** is the required tool for all code linting, formatting, and quality checks
- **TypeScript**: Strict TypeScript configuration is mandatory
- **Testing Framework**: Vitest for unit tests
- **Build Tools**: Vite for development and production builds
- **Package Manager**: pnpm is the preferred package manager for the monorepo
- **State Management**: Redux Toolkit for state management

## Scripts
- `pnpm dev` — start Vite dev server on port 5173
- `pnpm build` — type-check and produce production bundle
- `pnpm preview` — run the built bundle locally
- `pnpm test` — execute Vitest unit tests
- `pnpm lint` — run Biome linting and formatting (replaces ESLint)

## Code Quality

All code must comply with Biome linting rules. Run `pnpm lint` before committing to ensure code quality standards are met.

## Spec Ops
- Constitution: `.spec/constitution.md`
- Agents: `.spec/Agents.md`
- Glossary: `.spec/glossary.md`

Reference these documents before extending the app to stay aligned with product and architecture guardrails.
