# Use official Node.js image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Set working directory to frontend app
WORKDIR /app/apps/frontend

# Install pnpm
RUN npm install -g pnpm@8.6.0

# Copy package.json and pnpm-lock.yaml for frontend
COPY apps/frontend/package.json apps/frontend/pnpm-lock.yaml ./

# Install dependencies for frontend
RUN pnpm install --frozen-lockfile

# Copy frontend source files
COPY apps/frontend ./

# Build the frontend application
RUN pnpm build

# Use nginx to serve the application
FROM nginx:alpine

# Copy nginx configuration
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]