# 1단계: 빌드 스테이지
FROM node:20-slim AS builder

WORKDIR /app

# 타임존 설정
RUN apt-get update && apt-get install -y tzdata && \
    ln -fs /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata && \
    apt-get clean && rm -rf /var/lib/apt/lists/*
ENV TZ=Asia/Seoul

COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build

# ---

# 2단계: 실행 스테이지
FROM node:20-slim AS runner

WORKDIR /app

# 타임존 설정
RUN apt-get update && apt-get install -y tzdata && \
    ln -fs /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata && \
    apt-get clean && rm -rf /var/lib/apt/lists/*
ENV TZ=Asia/Seoul
ENV NODE_OPTIONS="--experimental-global-webcrypto"

# 의존성 및 빌드 결과물 복사
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# 필수 설정 파일 복사
COPY --from=builder /app/nest-cli.json ./
COPY --from=builder /app/tsconfig*.json ./



CMD ["node", "-r", "tsconfig-paths/register", "dist/main"]