FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY apps/api/package*.json ./
COPY apps/api/tsconfig.json ./
COPY package-lock.json ./
COPY ../../packages ./packages

# Install dependencies
RUN npm install --no-workspaces

# Copy source code
COPY src ./src

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY apps/api/package*.json ./

# Security: Run as non-root user
USER node

# Expose API port
EXPOSE 3000

CMD ["npm", "start"]