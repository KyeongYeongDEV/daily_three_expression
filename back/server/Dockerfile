# 1단계: 빌드 스테이지 (Node.js 20 버전으로 변경)
FROM node:20-slim AS builder

WORKDIR /app

# 타임존 설정 (기존과 동일)
RUN apt-get update && apt-get install -y tzdata && \
    ln -fs /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata && \
    apt-get clean && rm -rf /var/lib/apt/lists/*
ENV TZ=Asia/Seoul

COPY package*.json ./
# devDependencies 포함하여 모든 의존성 설치
RUN npm install

# 소스 전체 복사 후 빌드
COPY . .
RUN npm run build

# ---

# 2단계: 실행 스테이지 (Node.js 20 버전으로 변경)
FROM node:20-slim AS runner

WORKDIR /app

# 타임존 설정 (기존과 동일)
RUN apt-get update && apt-get install -y tzdata && \
    ln -fs /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata && \
    apt-get clean && rm -rf /var/lib/apt/lists/*
ENV TZ=Asia/Seoul
ENV NODE_OPTIONS="--experimental-global-webcrypto"

# ✨ 최적화: package.json과 node_modules를 빌더에서 복사
# 이렇게 하면 실행 환경에서 npm install을 다시 할 필요가 없습니다.
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# 빌드 결과물 및 필수 설정 파일 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/nest-cli.json ./
COPY --from=builder /app/tsconfig*.json ./
COPY --from=builder /app/.env .env

# tsconfig-paths는 devDependencies에 있지만, 실행에 필요하므로 node_modules 전체를 복사했습니다.
CMD ["node", "-r", "tsconfig-paths/register", "dist/main"]