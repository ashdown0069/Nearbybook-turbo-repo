# NearbyBook API

NearbyBook 및 NearbyBook 확장프로그램의 백엔드 서버

<br />

## 🛠️ 기술 스택

- **Runtime & Language**: `Node.js 22` / `TypeScript 5.9`
- **Application Framework**: `NestJS 10.x` (Express 기반)
- **Database & ORM**: `PostgreSQL 16` / `Drizzle ORM`
- **Caching & CQS**: `Redis 7` / `@nestjs/cache-manager` & `ioredis`
- **Async Job Queue**: `BullMQ` / `@nestjs/bullmq` (분산 비동기 처리 및 주기적 배치 스케줄링)
- **Search Engine**: `Meilisearch` (초고속 텍스트 검색 엔진 - 검색어 자동완성에 사용)
- **Testing**: `Jest`, `@nestjs/testing`, `Supertest` (유닛 테스트 및 E2E API 검증)
- **Logging & Monitoring**: `Winston` (`nest-winston`, `winston-daily-rotate-file`),
- **AI**: `Claude Code(SuperClaude_Framework skills 사용)`, `Google Gemini(Superpower skills 사용)` 사용


<br />

## 🌟 주요 백엔드 구현 사항


### 1. Redis & Cache Manager 기반 API  캐싱
- 공공 API 호출 병목을 차단하기 위해 **Redis 캐싱 전략**을 수립하였습니다. 실시간성이 필수적인 데이터와 정적인 데이터를 분류하여 각각 30분 및 30일의 정교한 만료 주기(TTL)를 관리합니다.
- `@nestjs/throttler`를 결합하여 특정 클라이언트 IP 및 API 키에 대한 무제한적인 API 악용을 미연에 방지하고 서버 가용성을 일정하게 유지합니다.


### 2. BullMQ를 통한 백그라운드 스케줄러
- 사용자의 동기적인 요청에서 처리할 필요가 없는 무거운 연산(예: 도서 대출 통계 데이터 집계)을 **BullMQ**  도입하여 완전히 비동기 백그라운드로 격리했습니다.



## 🚀 Getting Started

### 사전 요구사항
- **Docker Compose**
- **Node.js v20+**

```bash
# 1. 의존성 설치 (모노레포 루트에서)
npm install

# 2. 환경변수 설정
cp .env.example .env
# .env 파일을 열어 실제 값을 채워주세요
```

### 환경변수 목록

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `PORT` | 서버 포트 | `4001` |
| `DATABASE_URL` | PostgreSQL 연결 URL | - |
| `REDIS_URL` | Redis 연결 URL | - |
| `LIBRARY_BIGDATA_API_KEY` | 도서관 정보나루 API 키 | - |
| `DISCORD_WEBHOOK_URL` | Discord 웹훅 URL | - |
| `NAVER_CLIENT_ID` | 네이버 API 클라이언트 ID | - |
| `NAVER_SECRET` | 네이버 API 시크릿 | - |


---

## 개발 환경

### 1. DB / Redis 실행

<!-- docker-compose.yml이 PostgreSQL과 Redis만 컨테이너로 띄우는 구조 -->
<!-- 백엔드는 로컬에서 직접 실행하여 HMR(Hot Module Reload) 속도를 확보 -->

```bash
# apps/api 디렉토리에서 실행
docker compose up -d
```

| 컨테이너 | 포트 | 설명 |
|-----------|------|------|
| `nearbybook-db` | `5432` | PostgreSQL 16 |
| `nearbybook-redis` | `6379` | Redis 7 |

### 2. DB 마이그레이션

<!-- Drizzle ORM으로 스키마를 관리 -->
<!-- generate: SQL 마이그레이션 파일 생성, migrate: 실제 DB에 적용 -->

```bash
# 마이그레이션 파일 생성
npm run db:generate

# DB에 마이그레이션 적용
npm run db:migrate

# 스키마를 DB에 바로 반영 (개발용, 마이그레이션 파일 없이)
npm run db:push

# Drizzle Studio (DB GUI)
npm run db:studio
```

### 3. 서버 실행

```bash
# 개발 모드
npm run start:dev

```

서버가 `http://localhost:4001`에서 실행

### 4. 개발 환경 종료

```bash
# 컨테이너 중지 (데이터 유지)
docker compose down

# 컨테이너 + 볼륨 데이터 모두 삭제
docker compose down -v
```

---

## 프로덕션 환경

### Docker 이미지 빌드

<!-- 멀티스테이지 빌드: deps → build → production -->
<!-- 빌드 도구(typescript, nest-cli)가 최종 이미지에 포함되지 않아 이미지 크기 최소화 -->
<!-- 빌드 컨텍스트가 모노레포 루트여야 packages/types 의존성을 해결할 수 있음 -->

```bash
# 모노레포 루트(NearbyBook)에서 실행
docker build -f apps/api/Dockerfile -t nearbybook-api .

# ARM 아키텍처용 빌드 -- 배포환경 Oracle cloud arm 4core 24GB RAM
docker build --platform linux/arm64 -f apps/api/Dockerfile -t nearbybook-api .
```

### Docker 이미지 실행

```bash
# 기본 실행
docker run -p 4001:4001 --env-file apps/api/.env nearbybook-api

# 백그라운드 실행
docker run -d -p 4001:4001 --env-file apps/api/.env nearbybook-api
```

### Docker 없이 실행

```bash
# 빌드 (TypeScript → JavaScript)
npm run build

# 프로덕션 모드 실행
npm run start:prod
```

---

## 테스트(준비 중)

```bash
# 단위 테스트
npm run test

# 워치 모드
npm run test:watch

# 커버리지
npm run test:cov

# E2E 테스트
npm run test:e2e
```

## 코드 품질

```bash
# 린트
npm run lint

# 포맷팅
npm run format
```
