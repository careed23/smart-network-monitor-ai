# ── Stage 1: build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching
COPY package.json package-lock.json ./

RUN npm ci --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build

# ── Stage 2: serve ──────────────────────────────────────────────────────────
# nginx:alpine is a minimal production-ready static file server
FROM nginx:alpine AS runner

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy the Vite production build from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (mapped to host port in docker-compose.yml)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
