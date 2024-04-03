# Base image
FROM node:latest

# Set the working directory
WORKDIR /app

RUN apt-get update
RUN apt install -y libnss3-tools
RUN apt-get install -y openssl
RUN curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
RUN chmod +x mkcert-v*-linux-amd64
RUN cp mkcert-v*-linux-amd64 /usr/local/bin/mkcert
RUN mkcert -install
# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

RUN npm install -g npm@latest
# Install dependencies
RUN npm install

# Copy the rest of your project into the container
COPY . .

WORKDIR /app/certs
RUN mkcert -key-file key.pem -cert-file cert.pem localhost 127.0.0.1 ::1

# For some reason the build fails if we don't remove the node_modules and package-lock.json and reinstall
WORKDIR /app
RUN rm -rf node_modules package-lock.json
RUN npm install

# Build the Vue project
RUN npm run type-check
RUN npm run build-only

# Expose the application port
EXPOSE 5173

# Start the application
CMD [ "npm", "run", "serve" ]