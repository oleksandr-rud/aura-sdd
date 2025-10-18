# syntax=docker/dockerfile:1.6

FROM node:20-alpine AS base
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable
WORKDIR /workspace

FROM base AS deps
COPY package.json pnpm-workspace.yaml ./
COPY apps/client/package.json apps/client/package.json
RUN pnpm install --filter @spec-gen/client... --prod=false

FROM base AS build
COPY --from=deps /workspace/node_modules /workspace/node_modules
COPY --from=deps /workspace/apps/client/node_modules /workspace/apps/client/node_modules
COPY . .
RUN pnpm --filter @spec-gen/client build

FROM nginx:1.25-alpine AS runtime
COPY --from=build /workspace/apps/client/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
