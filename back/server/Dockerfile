# 1단계: 빌드 스테이지
FROM node:18-slim AS builder

WORKDIR /app

# 타임존 설정 및 필수 패키지 설치
RUN apt-get update && apt-get install -y tzdata && \
    ln -fs /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ENV TZ=Asia/Seoul

# tsconfig-paths가 devDependencies에 있을 수 있으므로 --legacy-peer-deps 사용
COPY package*.json ./
RUN npm install --legacy-peer-deps

# 소스 전체 복사 후 빌드
COPY . .
RUN npm run build

# 2단계: 실행 스테이지
FROM node:18-slim AS runner

WORKDIR /app

RUN apt-get update && apt-get install -y tzdata && \
    ln -fs /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ENV TZ=Asia/Seoul
ENV LANG=ko_KR.UTF-8
ENV LC_ALL=ko_KR.UTF-8
ENV NODE_OPTIONS="--experimental-global-webcrypto"

# 필요한 파일만 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/nest-cli.json ./
COPY --from=builder /app/tsconfig*.json ./
COPY --from=builder /app/.env .env

# ❗ 실행환경에서 devDependencies까지 포함 설치 (필수)
RUN npm install --legacy-peer-deps

CMD ["node", "-r", "tsconfig-paths/register", "dist/main"]
