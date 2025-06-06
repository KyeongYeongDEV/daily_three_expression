FROM node:18

ENV NODE_OPTIONS="--experimental-global-webcrypto"

WORKDIR /app

COPY package*.json ./
RUN npm install --production
RUN npm install -g @nestjs/cli

COPY . .

RUN npm run build

COPY .env .env

CMD ["node", "dist/main"]
