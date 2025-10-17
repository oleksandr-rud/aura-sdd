# Spec Gen Monorepo

This repository hosts multiple applications managed under a single workspace. Each app keeps its own Spec Gen constitution and agent assignments while sharing tooling from the monorepo root.

## Structure
- `apps/` — application sources (`client`, `api`, `landing`, `crm`, `android`)
- `shared/` — cross-cutting libraries or configuration
- `tooling/` — DevOps, CI/CD, and infrastructure assets

## Getting Started
1. Install [pnpm](https://pnpm.io/) (`corepack enable` on Node 20+).
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run the dev servers:
   ```bash
   pnpm dev
   ```
   The command runs the client (Vite) and API (Fastify) servers concurrently.

Build, lint, and test commands execute across all packages:
```bash
pnpm build
pnpm lint
pnpm test
```

## Docker & On-Prem Orchestration
Use `docker-compose.yml` to run the stack locally or push the same manifest to a Tesseract-managed cluster. Each app also exposes its own `Dockerfile` for independent deployments.

```bash
docker compose up --build
```

For Tesseract, create an overlay under `tooling/tesseract/overlays/<env>/stack.yaml` and apply it with `tesseract stack apply`.

## Spec Ops
Each app keeps its own `.spec/` directory (constitution, agents, glossary). Align work with the respective constitution before committing changes.
