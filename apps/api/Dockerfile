ARG NODE_VERSION=22.18.0
FROM node:${NODE_VERSION}-slim AS base
RUN npm install -g npm@latest
# Stage 1: Prepare - 모노레포에서 api 앱에 필요한 부분만 추출
FROM base AS prepare
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune api --docker

# Stage 2: Builder - 전체 의존성 설치 및 NestJS 빌드
FROM base AS builder
WORKDIR /app

# 패키지 설정 파일 복사 및 의존성 설치
COPY --from=prepare /app/out/json/ .
RUN rm -f package-lock.json && npm install

# 전체 소스 코드 복사 및 빌드
COPY --from=prepare /app/out/full/ .
RUN npx turbo build --filter=api...

# Stage 3: Runner - 실제 실행 환경
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# 보안을 위해 비루트 유저 생성 (jhk)
RUN addgroup --system --gid 1001 jhk
RUN adduser --system --uid 1001 jhk
USER jhk

# 빌드 결과물 및 전체 컨텍스트 복사 (pruned된 상태이므로 안전함)
COPY --from=builder /app .

EXPOSE 4001

# NestJS 앱 실행 (프로젝트 구조에 따른 메인 파일 경로)
CMD ["node", "apps/api/dist/src/main.js"]
