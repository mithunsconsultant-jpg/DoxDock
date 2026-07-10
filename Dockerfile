# syntax=docker/dockerfile:1

# ── Stage 1: build the static site ──────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies from the lockfile for reproducible builds.
COPY package.json package-lock.json ./
RUN npm ci

# Build the app (outputs a fully static site to /app/dist).
COPY . .
RUN npm run build

# ── Stage 2: serve the static files with nginx ──────────────────────────────
FROM nginx:1.27-alpine AS runtime

# DoxDock is a static, client-side app — nginx only serves files. The container
# makes no outbound calls; you can run it completely offline / air-gapped.
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -q -O /dev/null http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
