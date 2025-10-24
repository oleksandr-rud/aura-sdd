# syntax=docker/dockerfile:1.6

FROM node:20-alpine AS base
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable
WORKDIR /workspace

FROM base AS deps
COPY package.json pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
RUN pnpm install --filter @spec-gen/api... --prod=false

FROM deps AS build
COPY . .
RUN pnpm --filter @spec-gen/api build

FROM base AS prod-deps
COPY package.json pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
RUN pnpm install --filter @spec-gen/api... --prod --no-optional

FROM base AS runtime
ENV NODE_ENV=production
WORKDIR /workspace
COPY --from=build /workspace/apps/api/dist ./apps/api/dist
COPY --from=prod-deps /workspace/node_modules ./node_modules
COPY --from=prod-deps /workspace/apps/api/node_modules ./apps/api/node_modules
COPY apps/api/package.json apps/api/package.json
WORKDIR /workspace/apps/api
EXPOSE 4000
CMD ["node", "dist/server.js"]
