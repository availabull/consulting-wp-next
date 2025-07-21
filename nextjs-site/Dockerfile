# ───────────── Build stage ─────────────
FROM node:22-slim AS builder
WORKDIR /app

ARG NEXT_PUBLIC_WPGRAPHQL_URL
ENV NEXT_PUBLIC_WPGRAPHQL_URL=$NEXT_PUBLIC_WPGRAPHQL_URL

# leverage cache on manifest
COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm && pnpm install --frozen-lockfile

# copy source and build
COPY . .
RUN pnpm build

# ─────────── Runtime stage ────────────
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
