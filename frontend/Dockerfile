FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build app
RUN npm run build

# Install serve to run the application
RUN npm install -g serve

# Start the application
CMD ["serve", "-s", "build", "-l", "3000"]