# 사용할 Node.js 버전을 변수로 선언합니다. (2026년 기준 LTS 안정 버전인 22대 사용)
ARG NODE_VERSION=22.18.0

# [Base 이미지 설정] 
# 경량화된 slim 이미지를 기반으로 시작합니다.
FROM node:${NODE_VERSION}-slim AS base
# 최신 npm 버전 간의 호환성을 위해 전역 npm을 최신으로 업데이트합니다.
RUN npm install -g npm@latest


# =========================================================================
# Stage 1: Prepare (준비 단계)
# 모노레포 전체 코드에서 api 앱을 빌드하는 데 필요한 패키지 구조만 솎아냅니다.
# =========================================================================
FROM base AS prepare
WORKDIR /app
# Turborepo 전역 명령어를 사용하기 위해 turbo를 설치합니다.
RUN npm install -g turbo
# 현재 프로젝트의 모든 파일을 도커 컨텍스트로 복사합니다.
COPY . .
# api 서비스와 그에 의존하는 로컬 패키지만 추출하여 /app/out 폴더에 저장합니다.
RUN turbo prune api --docker


# =========================================================================
# Stage 2: Builder (빌드 단계)
# 솎아낸 설정을 바탕으로 의존성(node_modules)을 설치하고 NestJS를 빌드합니다.
# =========================================================================
FROM base AS builder
WORKDIR /app

# 1. 솎아낸 패키지 설정 파일들(package.json 등)만 먼저 복사합니다. (레이어 캐싱 활용)
COPY --from=prepare /app/out/json/ .

#  npm Workspaces 404 에러 방지
# api 앱 빌드 그래프에서 제외된 @workspace/eslint-config의 빈 폴더와 가짜 package.json을 생성합니다.
# 이 작업이 없으면 npm은 로컬에 폴더가 없다고 판단하여 npm 공식 레지스트리에서 다운로드를 시도하다가 404 에러를 냅니다.
RUN mkdir -p packages/eslint-config && \
    echo '{"name":"@workspace/eslint-config","version":"0.0.1"}' > packages/eslint-config/package.json

# 2. 로컬 워크스페이스가 잡혔으므로 에러 없이 안전하게 모든 의존성을 설치합니다.
RUN npm install --no-package-lock

# 3. 실제 소스 코드(.ts 파일 등)를 복사합니다.
COPY --from=prepare /app/out/full/ .

# 4. Turborepo를 이용해 api 프로젝트와 하위 의존 패키지들을 함께 빌드합니다.
RUN npx turbo build --filter=api...


# =========================================================================
# Stage 3: Runner (실행 단계)
# 빌드가 완료된 결과물만 가져와서 아주 가볍고 안전한 환경에서 앱을 구동합니다.
# =========================================================================
# 실행 환경은 보안과 용량 최적화를 위해 alpine 리눅스 기반 이미지를 사용합니다.
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

# 애플리케이션 환경 변수를 프로덕션(운영)으로 설정합니다.
ENV NODE_ENV=production

# [보안 설정] root 권한으로 프로세스가 실행되는 것을 막기 위해 비루트(non-root) 유저를 생성합니다.
RUN addgroup --system --gid 1001 jhk
RUN adduser --system --uid 1001 jhk
USER jhk

# Builder 단계에서 완성된 의존성과 빌드 결과물(dist) 전체를 그대로 복사합니다.
COPY --from=builder /app .

# 컨테이너 외부로 노출할 포트를 지정합니다.
EXPOSE 4001

# NestJS 앱을 실행합니다. 
# 모노레포 구조 상 루트 기준 최하위 빌드 파일의 경로인 apps/api/dist/src/main.js를 실행합니다.
CMD ["node", "apps/api/dist/src/main.js"]