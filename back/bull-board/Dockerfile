FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache git

COPY package*.json ./
RUN npm install

COPY monitor.js ./
CMD ["node", "monitor.js"]
