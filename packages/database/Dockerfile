# ✅ Database Dockerfile with Multi-Stage Build
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

# Security hardening
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

CMD ["node", "./dist/index.js"]