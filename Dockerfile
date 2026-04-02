# frontend/Dockerfile
# Stage 1: Build Vite React app
FROM node:22.12.0-alpine AS build
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the app
COPY . .

# Build production assets
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy Vite dist folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx config
COPY ../nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]