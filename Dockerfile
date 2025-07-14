# ─────────────────── Build stage ───────────────────
FROM node:22-slim AS builder
WORKDIR /app

ARG NEXT_PUBLIC_WPGRAPHQL_URL
ENV NEXT_PUBLIC_WPGRAPHQL_URL=$NEXT_PUBLIC_WPGRAPHQL_URL

# 1️⃣  Copy workspace manifests first (cache‑friendly)
COPY package.json pnpm-lock.yaml ./
COPY nextjs-site/package.json ./nextjs-site/package.json

RUN npm install -g pnpm \
 && pnpm install --frozen-lockfile

# 2️⃣  Copy the full repo and build only the Next.js package
COPY . .
RUN pnpm --filter nextjs-site build

# ─────────────────── Runtime stage ───────────────────
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production

# Copy only the artefacts needed to run in production
COPY --from=builder /app/nextjs-site/public ./public
COPY --from=builder /app/nextjs-site/.next/standalone ./
COPY --from=builder /app/nextjs-site/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
