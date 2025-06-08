FROM node:18

RUN apt-get update && \
    apt-get install -y tzdata && \
    ln -fs /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata

ENV TZ=Asia/Seoul
ENV NODE_OPTIONS="--experimental-global-webcrypto"

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# .env는 docker-compose에서 불러오면 COPY 생략 가능
COPY .env .env

CMD ["node", "dist/main"]
