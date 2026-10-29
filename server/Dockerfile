# ========================================================
# HARDENED DOCKERFILE (Post-Security Audit & Trivy Remediation)
# Hardening Controls Implemented:
# 1. Minimal Base Image: Alpine Linux 3.20 (node:20-alpine, ~180MB)
# 2. Least Privilege: Runs as non-root user 'node' (UID 1000)
# 3. Production Scope: Omits development dependencies (npm ci --only=production)
# 4. Attack Surface Reduction: Zero extra build compilers or debugging shells
# ========================================================

FROM node:20-alpine AS production

# Set production environment flags
ENV NODE_ENV=production
ENV PORT=5000

# Create application directory with non-root ownership
WORKDIR /app
RUN chown -R node:node /app

# Copy dependency manifests first for cached layer builds
COPY --chown=node:node package*.json ./

# Install production-only dependencies as unprivileged user
USER node
RUN npm ci --only=production --ignore-scripts && npm cache clean --force

# Copy application source code with non-root permissions
COPY --chown=node:node . .

# Expose internal service port
EXPOSE 5000

# Healthcheck configuration
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start server as non-root user
CMD ["node", "src/server.js"]
