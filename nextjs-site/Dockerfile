# nextjs-site/Dockerfile
FROM node:22-slim AS builder

WORKDIR /app

# copy manifest files first to leverage Docker cache
COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm && pnpm install --frozen-lockfile

# copy the rest of the source
COPY . .

RUN pnpm build

# ─────────────────────────────────────────────────────────
FROM node:22-slim
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
CMD ["node", ".next/standalone/server.js"]
