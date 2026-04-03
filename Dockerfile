# Stage 1: Build React app
FROM node:22.12.0-alpine AS build

WORKDIR /app

# Accept the argument from docker-compose
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copy package files for better caching
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Clean default files
RUN rm -rf /usr/share/nginx/html/*

# Copy build output (using 'dist' for Vite)
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom SSL Nginx config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]