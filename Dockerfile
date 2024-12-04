# 빌드 스테이지
FROM node:22-alpine3.18 AS builder

# pnpm 설치
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# pnpm fetch를 활용하기 위한 package.json 복사
COPY package.json pnpm-lock.yaml ./

# 모든 의존성(개발 의존성 포함)을 fetch
RUN pnpm fetch

# 소스 코드 복사 및 의존성 설치
COPY . .

RUN pnpm install --frozen-lockfile

# NestJS 애플리케이션 빌드
RUN pnpm run build

# 실행 스테이지
FROM node:22-alpine3.18

# nginx 설치 및 설정
RUN apk add --no-cache nginx && \
    rm -rf /var/cache/apk/* && \
    mkdir -p /run/nginx && \
    mkdir -p /etc/nginx/ssl

# pnpm 설치
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 프로덕션 의존성만 설치하기 위한 파일 복사
COPY pnpm-lock.yaml ./
COPY package.json ./

# 프로덕션 의존성만 설치
RUN pnpm fetch --prod && \
    pnpm install --prod --frozen-lockfile --offline && \
    pnpm store prune

# 빌드된 애플리케이션 복사
COPY --from=builder /app/dist ./dist

# nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

COPY start.sh ./start.sh
RUN chmod +x ./start.sh

EXPOSE 443

CMD ["./start.sh"]