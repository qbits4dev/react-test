# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build  # Vite outputs to /app/dist by default

# --- Runtime stage ---
FROM nginx:alpine
# Add SPA fallback for client-side routing
RUN printf 'server {\n\
  listen 80;\n\
  server_name _;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  include /etc/nginx/mime.types;\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
  location = /50x.html { root /usr/share/nginx/html; }\n\
}\n' > /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget --spider -q http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
