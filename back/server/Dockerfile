# 1단계: 빌드 전용 단계
FROM node:18-slim AS builder

# 타임존 및 필수 도구 설정
RUN apt-get update && apt-get install -y tzdata && \
    ln -fs /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ENV TZ=Asia/Seoul
WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm ci

# 소스코드 전체 복사 (src 포함)
COPY . .

# NestJS 빌드
RUN npm run build

# 2단계: 실행 전용 단계
FROM node:18-slim AS runner

# 타임존만 유지
RUN apt-get update && apt-get install -y tzdata && \
    ln -fs /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ENV TZ=Asia/Seoul
ENV LANG=ko_KR.UTF-8
ENV LC_ALL=ko_KR.UTF-8
ENV NODE_OPTIONS="--experimental-global-webcrypto"

WORKDIR /app

# 런타임 실행에 필요한 최소 파일만 복사
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env .env
COPY --from=builder /app/nest-cli.json ./
COPY --from=builder /app/tsconfig*.json ./
COPY --from=builder /app/src ./src

# prod install
RUN npm ci --omit=dev

# 런타임 실행
CMD ["node", "dist/main"]
