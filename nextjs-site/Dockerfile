# ---------- build stage ----------
FROM node:22-slim AS builder

WORKDIR /app

# copy manifest files first for better caching
COPY package.json pnpm-lock.yaml* ./

# install deps with pnpm; fall back to npm if pnpm‑lock not present
RUN npm i -g pnpm && pnpm install --frozen-lockfile

# copy the rest of the source and build
COPY . .
RUN pnpm build

# ---------- runtime stage ----------
FROM node:22-slim

WORKDIR /app
COPY --from=builder /app ./

EXPOSE 3000
CMD ["node", ".next/standalone/server.js"]
