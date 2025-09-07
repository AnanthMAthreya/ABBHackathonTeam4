# Stage 1: Build the Angular app
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build || { echo "Build failed"; cat /app/dist/frontend/browser/index.html || true; exit 1; }

RUN echo "Build output root:" && ls -l /app/dist
RUN echo "Build output frontend:" && ls -l /app/dist/frontend
RUN echo "Build output browser:" && ls -l /app/dist/frontend/browser || echo "No browser folder"

RUN ls -l /app/dist/frontend/browser

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built Angular app to nginx
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copy custom nginx config (optional)
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]