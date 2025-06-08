FROM node:18-alpine

# 시간 설정
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone

ENV TZ=Asia/Seoul
ENV NODE_OPTIONS="--experimental-global-webcrypto"

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

COPY .env .env

CMD ["node", "dist/main"]
