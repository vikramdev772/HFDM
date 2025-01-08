# Use Node.js 20 with Alpine 3.18
FROM node:20.13.1-alpine3.18 as builder

# Install dependencies required for Prisma and other packages
RUN apk add --no-cache openssl libc6-compat

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY nodemon.json ./

# Install dependencies
RUN npm install

# Copy prisma schema and other necessary files
COPY prisma ./prisma/
COPY tsconfig.json ./
COPY src ./src/

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Start a new stage for a smaller final image
FROM node:20.13.1-alpine3.18

WORKDIR /usr/src/app

# Copy built assets from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/package*.json ./

# Expose port
EXPOSE 3000

# Set NODE_ENV to production
ENV NODE_ENV production



# Start the application
CMD ["npm", "run", "dev"]

