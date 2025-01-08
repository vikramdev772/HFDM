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

# Copy nodemon configuration if you have one
COPY nodemon.json ./

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Set NODE_ENV to development
ENV NODE_ENV development

# Start the application in development mode
CMD ["npm", "run", "dev"]

