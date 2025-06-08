FROM node:18-alpine

RUN apk add --no-cache tzdata
ENV TZ=Asia/Seoul
ENV NODE_OPTIONS="--experimental-global-webcrypto"

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

COPY .env .env

CMD ["node", "dist/main"]
