
# Use Node.js 20 with Alpine 3.18
FROM node:20-alpine3.18

# Install dependencies required for Prisma and other packages
RUN apk add --no-cache openssl libc6-compat

# Update npm to a compatible version
RUN npm install -g npm@10.5.2

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies with clean install
RUN npm ci

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
