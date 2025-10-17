# API Service Constitution

## Mission
Expose domain services over HTTP with strict schema governance, enabling client apps and partner integrations to iterate safely.

## Architectural Tenets
- Fastify + Zod for predictable request/response contracts.
- Layered modules: `routes` → `services` → `adapters` (future); keep business logic pure.
- Prefer async/await with abort signals over callbacks.
- Observability baked-in (structured logging, request tracing hooks).

## Runtime & Delivery
- Node.js 20 LTS runtime (tsup bundles to ESM + CJS).
- Each route declares OpenAPI metadata; Swagger UI mounted at `/docs`.
- Configuration via environment variables validated at boot.
- Docker image runs distilled build (`dist/server.js`) under a non-root user.

## Reliability Targets
- Median response time ≤ 100ms for health check; 95th percentile ≤ 250ms for core endpoints.
- Error rate < 0.5% per rolling 24h window.
- Automated smoke tests before deploy; contract tests with consumer apps on staging.

## Security & Compliance
- Enforce HTTPS via reverse proxy; service itself listens on HTTP internally.
- Input validation on every boundary; log redaction for PII by default.
- Rotate secrets quarterly; prefer Vault or Kubernetes secrets for storage.

## Risks & Mitigation
- **Schema drift** — auto-generate TypeScript clients for consumers and add backward-compat acceptance tests.
- **Blocking I/O** — offload heavy jobs to async workers (queue service TBD).
