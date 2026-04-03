# Stage 1: Build React app
FROM node:22.12.0-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

# Install dependencies (ignore peer deps conflict)
RUN npm install --legacy-peer-deps

# Copy all source files
COPY . .

# Build React app
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy React build output from Stage 1
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config (optional)
# Make sure nginx/default.conf exists relative to Dockerfile
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]