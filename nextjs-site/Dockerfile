# nextjs-site/Dockerfile
FROM node:22-slim AS builder
WORKDIR /app
COPY nextjs-site/package.json nextjs-site/pnpm-lock.yaml ./
RUN npm i -g pnpm && pnpm install --frozen-lockfile
COPY nextjs-site .
RUN pnpm build

FROM node:22-slim
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
CMD ["node",".next/standalone/server.js"]
