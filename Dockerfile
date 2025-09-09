# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build  # Vite outputs to /app/build per vite.config.mjs

# --- Runtime stage ---
FROM nginx:alpine
# Add SPA fallback for client-side routing
RUN printf 'server {\n\
  listen 9001;\n\
  server_name _;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  include /etc/nginx/mime.types;\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
  location = /50x.html { root /usr/share/nginx/html; }\n\
}\n' > /etc/nginx/conf.d/default.conf
RUN apk add --no-cache wget
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 9001
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget --spider -q http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
