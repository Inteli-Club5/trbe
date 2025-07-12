# Multi-stage build for production
FROM node:18-alpine AS frontend-builder

# Set working directory
WORKDIR /app

# Copy package files for frontend
COPY src/frontend/package*.json ./src/frontend/

# Install frontend dependencies
WORKDIR /app/src/frontend
RUN npm install --legacy-peer-deps

# Copy frontend source code
COPY src/frontend/ ./

# Build the frontend
RUN npm run build

# Backend builder stage
FROM node:18-alpine AS backend-builder

# Set working directory
WORKDIR /app

# Install system dependencies including SSL libraries
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    openssl \
    openssl-dev \
    libc6-compat \
    && rm -rf /var/cache/apk/*

# Copy package files for backend
COPY src/backend/package*.json ./src/backend/

# Install all dependencies (including dev dependencies for Prisma)
WORKDIR /app/src/backend
RUN npm install

# Copy Prisma schema and generate client
COPY src/backend/prisma ./prisma/
RUN npx prisma generate

# Production stage
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Install system dependencies including SSL libraries
RUN apk add --no-cache \
    git \
    openssl \
    libc6-compat \
    && rm -rf /var/cache/apk/*

# Copy package files
COPY src/backend/package*.json ./src/backend/

# Install only production dependencies
WORKDIR /app/src/backend
RUN npm install --only=production

# Copy Prisma client from backend builder
COPY --from=backend-builder /app/src/backend/node_modules/.prisma ./node_modules/.prisma/

# Copy backend source code
COPY src/backend/ ./

# Copy frontend build from frontend builder
COPY --from=frontend-builder /app/src/frontend/.next ./public/.next
COPY --from=frontend-builder /app/src/frontend/public ./public/public
COPY --from=frontend-builder /app/src/frontend/next.config.mjs ./public/next.config.mjs

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"] 