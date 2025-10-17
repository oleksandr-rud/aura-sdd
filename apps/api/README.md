# API Service

Fastify-powered service delivering REST endpoints with Zod-powered contracts.

## Scripts
- `pnpm dev` — run the API with hot-reload via `tsx`
- `pnpm build` — bundle to ESM + CJS using `tsup`
- `pnpm start` — execute the compiled build
- `pnpm test` — run Vitest suite

## Environment
Environment variables are validated against `src/config/env.ts`. Place local overrides in `.env`.

| Variable | Default | Purpose |
| -------- | ------- | ------- |
| `API_PORT` | 4000 | Fastify listen port |
| `API_HOST` | 0.0.0.0 | Bind host |

## Spec Ops
- Constitution: `.spec/constitution.md`
- Agents: `.spec/Agents.md`
- Glossary: `.spec/glossary.md`
