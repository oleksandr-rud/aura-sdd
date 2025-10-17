# Tesseract / On-Prem Orchestration

This directory stores manifests for running the monorepo inside an on-premise cluster managed by [Tesseract](https://tesseract.sh/) or a vanilla Docker Stack.

## Quick Notes
- `docker-compose.yml` at the repo root can be deployed with `tesseract stack apply` or `docker compose up`.
- Override resource requests in environment-specific overlays under `tooling/tesseract/overlays/` (create per cluster).
- Secrets are mounted via Tesseract secret stores; for local Docker use `.env` files.

## Next Steps
1. Create `tooling/tesseract/overlays/dev/stack.yaml` for your cluster.
2. Point the client `VITE_API_BASE_URL` at the API service host routed by your ingress.
3. Wire the API image to your registry (set `IMAGE_REGISTRY` in the overlay and push via CI).
