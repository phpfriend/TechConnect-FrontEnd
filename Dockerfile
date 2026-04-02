# Stage 1: Build React app
FROM node:22.12.0-alpine as build
WORKDIR /app

# Copy package files first to leverage caching
COPY package*.json ./

# Install dependencies using legacy-peer-deps to avoid peer conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the app
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve with Nginx# Stage 1: Build Vite React app
FROM node:22.12.0-alpine AS build
WORKDIR /app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build production assets (Vite outputs to dist/)
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy Vite dist folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY ../nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
FROM nginx:alpine

# Copy build folder from previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx config
COPY ../nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]