FROM node:18

ENV NODE_OPTIONS="--experimental-global-webcrypto"

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY dist ./dist
COPY .env .env

COPY templates ./templates

CMD ["node", "dist/main"]
