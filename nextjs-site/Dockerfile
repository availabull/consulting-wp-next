# ─────────────── Build stage ───────────────
FROM node:22-slim AS builder

WORKDIR /app
ARG NEXT_PUBLIC_WPGRAPHQL_URL
ENV NEXT_PUBLIC_WPGRAPHQL_URL=$NEXT_PUBLIC_WPGRAPHQL_URL

# copy manifest first to leverage cache
COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm && pnpm install --frozen-lockfile --prod

# copy source
COPY . .
RUN pnpm build

# ─────────────── Runtime stage ─────────────
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production

# Copy only the built application and production dependencies
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
