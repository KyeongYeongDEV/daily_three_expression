FROM node:18-alpine

ENV NODE_OPTIONS="--experimental-global-webcrypto"

WORKDIR /app

COPY package*.json ./

RUN npm ci 

COPY . .

RUN npm run build

COPY .env .env

CMD ["node", "dist/main"]
