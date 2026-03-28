# ============================================
# NearbyBook API - Coolify 프로덕션 배포용 Dockerfile
# ============================================
# 작동원리:
# 멀티스테이지 빌드로 최종 이미지를 경량화합니다.
#   deps       → package.json만으로 의존성 설치 (레이어 캐싱)
#   build      → TypeScript 컴파일
#   production → 실행에 필요한 최소 파일만 포함
#
# 왜 멀티스테이지인가?
# - 빌드 도구(typescript, nest-cli 등)가 최종 이미지에 포함되지 않음
# - devDependencies 제외로 이미지 크기 최소화
# - 각 단계가 독립 레이어로 캐싱되어 재빌드 속도 향상
#
# 인프라 전제 (Coolify):
# - PostgreSQL, Redis는 Coolify에서 별도 서비스로 관리
# - DATABASE_URL, REDIS_URL 등은 Coolify 환경변수로 주입
# - 빌드 컨텍스트는 모노레포 루트 (packages/types 의존성)
# ============================================

# ---- 베이스 이미지 ----
# alpine: 일반 node 이미지(~1GB) 대비 ~150MB로 가벼움
FROM node:20-alpine AS base

# ---- 의존성 설치 ----
# package.json만 먼저 복사하여 Docker 레이어 캐싱 활용
# 소스코드가 변경되어도 의존성이 같으면 이 레이어를 재사용
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/types/package.json ./packages/types/package.json
COPY apps/api/package.json ./apps/api/package.json

# devDependencies 포함 설치 (빌드 단계에서 typescript, nest-cli 필요)
RUN npm ci --include=dev

# ---- 빌드 ----
FROM deps AS build
WORKDIR /app

# packages/types 소스 복사 (Internal Package: 빌드 불필요, .ts 직접 참조)
COPY packages/types/ ./packages/types/

# api 소스 복사 후 NestJS 빌드 (TypeScript → JavaScript)
COPY apps/api/ ./apps/api/
RUN cd apps/api && npx nest build

# ---- 프로덕션 ----
# 컴파일된 JavaScript와 프로덕션 의존성만 포함
FROM base AS production

ENV NODE_ENV=production
WORKDIR /app

# 프로덕션 의존성만 설치 (devDependencies 제외)
# 왜 루트에서 실행하는가?
# - npm workspaces 모노레포 구조상 루트 package-lock.json이 전체 의존성 트리를 관리
# - apps/api/에서 별도 실행 시 packages/types 등 내부 패키지 해석 실패
# - --ignore-scripts: postinstall 등 빌드 도구가 필요한 스크립트 건너뜀 (alpine 환경)
COPY package.json package-lock.json ./
COPY packages/types/package.json ./packages/types/package.json
COPY apps/api/package.json ./apps/api/package.json
RUN npm ci --omit=dev --ignore-scripts

# 빌드 결과물 복사
COPY --from=build /app/packages/types/src ./packages/types/src
COPY --from=build /app/packages/types/package.json ./packages/types/package.json
COPY --from=build /app/apps/api/dist ./apps/api/dist

# 보안: root 대신 node 유저로 실행하여 권한 제한
USER node

EXPOSE 4001

# 컨테이너 자체 헬스체크 (Coolify 헬스체크와 병행)
# wget 사용 이유: alpine에 curl 미포함
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-4001}/ || exit 1

WORKDIR /app/apps/api
CMD ["node", "dist/main.js"]
