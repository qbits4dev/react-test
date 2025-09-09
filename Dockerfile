# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source and build
COPY . .
RUN npm run build  # Vite outputs to /app/build (per vite.config.mjs)

# --- Runtime stage ---
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# Custom nginx config for SPA fallback
RUN printf 'server {\n\
  listen 9001;\n\
  server_name _;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  include /etc/nginx/mime.types;\n\
\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
\n\
  location = /50x.html { root /usr/share/nginx/html; }\n\
}\n' > /etc/nginx/conf.d/default.conf

# Copy build output
COPY --from=build /app/build .

# Install curl for healthcheck
RUN apk add --no-cache curl

EXPOSE 9001

# Healthcheck (fixed to port 9001)
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:9001/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
