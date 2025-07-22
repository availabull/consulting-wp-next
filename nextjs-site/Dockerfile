# ───────────── Build stage ─────────────
FROM node:20-slim AS builder
WORKDIR /app

ARG NEXT_PUBLIC_WPGRAPHQL_URL
ARG NEXT_SKIP_BUILD_STATIC_GENERATION=true
ENV NEXT_PUBLIC_WPGRAPHQL_URL=$NEXT_PUBLIC_WPGRAPHQL_URL
ENV NEXT_SKIP_BUILD_STATIC_GENERATION=$NEXT_SKIP_BUILD_STATIC_GENERATION

# leverage cache on manifest
COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm && pnpm install --frozen-lockfile

# copy source and build
COPY . .
RUN pnpm build

# ─────────── Runtime stage ────────────
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
