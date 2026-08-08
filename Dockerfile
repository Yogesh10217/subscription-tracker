# ==========================================
# STAGE 1: Dependencies Base
# ==========================================
FROM node:20-alpine AS deps
WORKDIR /app

# Install build dependencies if needed
RUN apk add --no-cache libc6-compat

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# ==========================================
# STAGE 2: Builder & Quality Check
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# Run linting and unit/integration verification
RUN npm run verify

# ==========================================
# STAGE 3: Production Runner (Security Hardened)
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5500

# Install tini for process supervision and signal forwarding
RUN apk add --no-cache tini curl

# Copy production dependencies and application code
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Security hardening: Ensure non-root user execution
USER node

# Healthcheck probe targeting internal /health endpoint
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health || exit 1

EXPOSE 5500

# Use tini as init process to handle SIGTERM / SIGINT gracefully
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "app.js"]
