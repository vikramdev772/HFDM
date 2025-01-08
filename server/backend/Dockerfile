# Use Node.js 20 with Alpine 3.18
FROM node:20.13.1-alpine3.18

# Install dependencies required for Prisma and other packages
RUN apk add --no-cache openssl libc6-compat

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Copy prisma schema and other necessary files
COPY prisma ./prisma/
COPY tsconfig.json ./
COPY src ./src/

# Install dependencies with clean install
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]

