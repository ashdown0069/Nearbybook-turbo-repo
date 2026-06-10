# NearbyBook (주변 도서관 소장 도서 통합 검색 서비스)

> **"원하는 책, 사지 말고 근처 도서관에서 바로 빌려보세요!"**  
> NearbyBook은 사용자의 위치 또는 관심 지역을 기반으로 주변 공공 도서관의 실시간 도서 소장 여부 및 대출 가능 상태를 지도(Naver Maps) 위에서 즉시 확인하고, 온라인 서점에서도 브라우저 확장 프로그램을 통해 원클릭으로 소장 현황을 조회할 수 있도록 돕는 통합 서비스입니다.

<br />

## 📌 배포 URL
- **공식 서비스 배포 URL**: [https://nearbybook.kr](https://nearbybook.kr)
- **API Swagger 문서**: [https://api.nearbybook.kr/api-docs](https://api.nearbybook.kr/api-docs)
- Extension - [웨일스토어](https://store.whale.naver.com/detail/obibakaogmkejdobgjnlnjbnpbjpeegk)
- extension - [크롬스토어](https://chromewebstore.google.com/detail/nearbybook/ifholedgogcogipjgaaljiboodpnbcec?hl=ko&utm_source=ext_sidebar)


## 📂 Applications

README 문서로 이동
- [**Web**](./apps/web/README.md) - Next.js Web Application
- [**API**](./apps/api/README.md) - NestJS API Server
- [**Extension**](./apps/extension/README.md) - Chrome Extension
- [**Native**](./apps/native/README.md) - React Native (Expo) Application (개발 중)



<br />

## 📌 프로젝트 소개

### 1. 개발 동기 및 배경
원하는 책을 읽고 싶을 때, 매번 주변의 여러 구립·시립 도서관 웹사이트를 각각 방문하여 검색해야 하는 과정은 매우 번거롭습니다. 또한 온라인 서점(교보문고, YES24, 알라딘 등)에서 책을 구매하기 전에 근처 도서관에서 무료로 대출할 수 있는지 즉각적으로 파악하기 어렵습니다. 이러한 일상적인 불편함을 해소하고, 공공 도서 자원의 접근성을 극대화하기 위해 본 서비스를 기획 및 개발하였습니다.

### 2. 핵심 목표
- **통합 검색의 편의성**: 여러 도서관의 도서 소장 데이터를 하나로 통합하여 단 한 번의 검색으로 대출 상태 확인.
- **지도 기반 시각화**: 텍스트 리스트가 아닌 네이버 지도를 활용해 내 주변 도서관들의 위치와 상태를 직관적으로 표현.
- **웹 서점 밀착 연동**: 브라우저 확장프로그램을 통해 교보문고, 알라딘, YES24 등에서 도서를 보는 도중 바로 주변 도서관 소장 현황 조회 지원.
- **모노레포를 통한 코드 재사용성 극대화**: 웹 서비스와 브라우저 확장 프로그램이 동일한 타입 정의 및 비즈니스 데이터 계층을 공유하여 개발 효율성 향상.

### 3. 개발 기간 및 인원
- **개발 기간**:  ~ 2026.06
- **개발 인원**: 1인 개발 (기획, 디자인, 프론트엔드, 백엔드, 확장프로그램, 인프라 구축 및 배포 전체 담당)


<br />

## 🛠️ 기술 스택

### 모노레포 전체 기술 요약

| 분류 | 기술 스택 | 설명 |
| :--- | :--- | :--- |
| **Language** | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) | 정적 타입 제공 및 런타임 안정성 확보 |
| **Monorepo** | ![Turborepo](https://img.shields.io/badge/Turborepo-000000?style=for-the-badge&logo=turborepo&logoColor=white) | 고속 빌드 파이프라인 및 패키지 의존성 관리 |
| **Backend** | ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white) | 확장성 높고 모듈화된 백엔드 아키텍처 설계 |
| **Frontend** | ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) | SSR/SSG 지원 및 SEO 최적화된 프론트엔드 |
| **Extension** | ![WXT](https://img.shields.io/badge/WXT-FF4500?style=for-the-badge&logo=vite&logoColor=white) | 차세대 Web Extension 프레임워크 (Vite 기반) |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white) | 정형 도서 데이터 및 도서관 정보를 위한 RDBMS |
| **ORM** | ![DrizzleORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black) | TypeScript 친화적이고 가벼운 고성능 ORM |
| **Cache & Queue**| ![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white) ![BullMQ](https://img.shields.io/badge/BullMQ-8B0000?style=for-the-badge&logo=redis&logoColor=white) |  캐싱 및 비동기 작업 큐 |
| **Search Engine**| ![Meilisearch](https://img.shields.io/badge/Meilisearch-FF5A5F?style=for-the-badge&logo=meilisearch&logoColor=white) |검색 엔진을 사용하여 자동완성 구현|
| **Infrastructure**| ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) | 컨테이너 기반 일관된 개발 및 배포 환경 보장 |

<br />

## 📐 아키텍처

```mermaid
flowchart TB
    subgraph Client ["Client Services"]
        Web["Next.js Web App (Port 4000)"]
        Ext["WXT Chrome/Firefox Extension"]
    end

    subgraph Packages ["Shared Packages (Monorepo Workspace)"]
        Types["@workspace/types<br/>(Shared TS Types)"]
        UI["@workspace/ui<br/>(Tailwind v4 Components)"]
        DataAccess["@workspace/data-access<br/>(API Clients & Storage)"]
    end

    subgraph Backend ["NestJS Backend Server (Port 4001)"]
        Nest["NestJS Core"]
        Bull["BullMQ (Queue Handler)"]
        Cache["Cache Manager"]
    end

    subgraph Data ["Data & Caching Layer"]
        PG[("PostgreSQL 16 (Drizzle ORM)")]
        Redis[("Redis 7 (Cache & Queue Store)")]
        Meili[("Meilisearch (Search Engine)")]
    end

    subgraph External ["External Services"]
        Naver["Naver Book Search API"]
        Naru["도서관 정보나루 API<br/>(실시간 소장/대출 조회)"]
        Discord["Discord Webhook<br/>(System Logging)"]
    end

    %% Dependencies & Shares
    Web -.-> Packages
    Ext -.-> Packages
    
    %% Communications
    Web -- "HTTP / REST API" --> Nest
    Ext -- "HTTP / REST API" --> Nest
    
    Nest --> PG
    Nest --> Redis
    Nest --> Meili
    Bull --> Redis
    
    Nest -- "ISBN / Book Search" --> Naver
    Nest -- "Real-time Availability" --> Naru
    Nest -- "Error Monitoring" --> Discord
    
    classDef client fill:#e3f2fd,stroke:#1e88e5,stroke-width:2px;
    classDef pack fill:#efebe9,stroke:#5d4037,stroke-width:2px;
    classDef back fill:#fce4ec,stroke:#d81b60,stroke-width:2px;
    classDef data fill:#e8f5e9,stroke:#43a047,stroke-width:2px;
    classDef ext fill:#fff3e0,stroke:#fb8c00,stroke-width:2px;
    
    class Web,Ext client;
    class Types,UI,DataAccess pack;
    class Nest,Bull,Cache back;
    class PG,Redis,Meili data;
    class Naver,Naru,Discord ext;
```

<br />

## 🌟 주요 기능

### 1. 지도 기반 내 주변 공공 도서관 소장 여부 확인 (Web)
- 사용자의 현재 GPS 위치 혹은 지도 이동 범위 내의 공공 도서관들을 Naver Maps 위에 시각화합니다.
- 특정 도서를 검색하면 해당 도서를 소장하고 있는 도서관만 필터링하여 지도 위에 핀으로 표시합니다.

### 2. 도서 실시간 대출 가능 상태 조회 (Web / Extension)
- 도서관 정보나루 공공 API와 연동하여 선택한 도서가 현재 도서관 서가에 비치되어 있는지(대출 가능), 대출 중인지 실시간 상태를 조회해 보여줍니다.
- 사용자는 도서관을 방문하기 전 헛걸음을 방지할 수 있습니다.

### 3. 주요 온라인 서점 연동 브라우저 확장 프로그램 (Extension)
- 교보문고, YES24, 알라딘, 네이버 도서 가격비교 등의 상세 페이지에 진입하면 책의 ISBN과 도서명을 자동으로 스크래핑/파싱합니다.
- 확장프로그램 팝업을 열거나 페이지 내 임베디드 영역을 통해 도서 구매 전 내 주변 단골 도서관의 실시간 대출 가능 정보를 원클릭으로 연동해 보여줍니다.

### 4. 자동 완성 및 검색 (Web / Search Engine)
- Meilisearch 를 사용하여 자동완성 기능을 구현하였습니다.

- 사용자가 도서 제목의 일부만 타이핑해도 즉시 관련 도서 리스트를 렌더링합니다.

<br>


<br />

## 🚀 Getting Started

### 사전 요구사항
- **Node.js**: `v20` 이상
- **Package Manager**: `npm`
- **Docker & Docker Compose**: PostgreSQL 및 Redis 컨테이너 구동용

### 설치 및 환경 설정

1. **저장소 클론 및 패키지 설치**
   ```powershell
   git clone https://github.com/ashdown0069/Nearbybook-turbo-repo.git
   cd Nearbybook-turbo-repo
   npm install
   ```

2. **환경변수 설정**
   루트 폴더와 각 `apps/web`, `apps/api`, `apps/extension` 디렉토리에 각각의 `.env.example` 파일을 복사하여 `.env.development`를 생성 및 작성합니다.
   
   - 백엔드 (`apps/api/.env.development`):
     ```env
     PORT=4001
     DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nearbybook"
     REDIS_URL="redis://localhost:6379"
     LIBRARY_BIGDATA_API_KEY="공공데이터_API키"
     NAVER_CLIENT_ID="네이버_아이디"
     NAVER_SECRET="네이버_시크릿"
     JWT_SECRET="임시_JWT_비밀키"
     ```
   - 프론트엔드 (`apps/web/.env.development`):
     ```env
     NEXT_PUBLIC_BACKEND_URL="http://localhost:4001"
     NEXT_PUBLIC_MAP_CLIENT_ID="네이버_클라우드_맵_ID"
     ```
    - 확장프로그램 (`apps/extension/.env.development`):
     ```env
     WXT_EXTERNAL_URL="프론드엔드 주소"
     WXT_BACKEND_URL="백엔드 서버 주소"
     ```

### 개발 서버 실행

Turborepo의 강력한 병렬 태스크 실행 기능으로 전체 서비스를 한 번에 구동할 수 있습니다.

```powershell
# 백그라운드 인프라(PostgreSQL, Redis) 컨테이너 기동
docker compose up -d

# 모노레포의 모든 패키지 개발 서버 실행 (web, api, extension 등)
npm run dev
```

- **프론트엔드 웹**: `http://localhost:4000`
- **백엔드 API**: `http://localhost:4001`
- **확장 프로그램 개발 모드**: `http://localhost:3100` 및 WXT 자동 브라우저 로딩

<br />

## 📂 프로젝트 구조

```text
NearbyBook/
├── apps/
│   ├── api/             # NestJS 백엔드 애플리케이션
│   ├── web/             # Next.js 프론트엔드 웹 서비스
│   ├── extension/       # WXT 기반 브라우저 확장 프로그램
│   └── native/          # React native 를 사용한 모바일 앱(개발 중)
├── packages/
│   ├── data-access/     # 공통 API 호출 로직 및 로컬 스토리지 래퍼
│   ├── eslint-config/   # 프로젝트 공통 ESLint 설정 규칙
│   ├── types/           # 공유 TypeScript 타입 정의 패키지
│   ├── typescript-config/# 공유 tsconfig 템플릿
│   └── ui/              # Tailwind v4 & shadcn/ui 기반 공통 UI 컴포넌트
├── docker-compose.prod.yml # 운영용 도커 컴포즈 파일 (api) 
├── package.json         # 모노레포 의존성 정의
└── turbo.json           # Turborepo 파이프라인 캐싱 및 의존성 설정
```

<br />

## 📝 Commit Convention

### 1. Scope

변경된 코드의 영역(Scope)을 괄호 안에 명시합니다.

| Scope                 | 설명                                           | 사용 예시                       |
| :-------------------- | :--------------------------------------------- | :------------------------------ |
| **native**            | Expo / React Native 앱 관련 변경 사항          | `feat(native): ...`             |
| **web**               | 웹 프론트엔드 관련 변경 사항                   | `fix(web): ...`                 |
| **api**               | backend api 변경사항                           | `fix(api): ...`                 |
| **extension**         | 크롬 확장프로그램 변경 사항                    | `fix(extension): ...`           |
| **data-access**       | API 호출, React Query, 상태 관리 로직          | `feat(data-access): ...`        |
| **types**             | 공통 타입/인터페이스 정의 (`.d.ts`, interface) | `chore(types): ...`             |
| **eslint-config**     | ESLint, Prettier 등 린트 설정 변경             | `chore(eslint-config): ...`     |
| **typescript-config** | `tsconfig.json` 등 TS 설정 변경                | `build(typescript-config): ...` |

### 2. Type

- **feat**: 새로운 기능 추가
- **fix**: 버그 수정
- **refactor**: 기능 변경 없는 코드 구조 개선
- **style**: 코드 포맷팅, 세미콜론 누락 (비즈니스 로직 X)
- **docs**: 문서 수정 (README, 주석 등)
- **test**: 테스트 코드 추가/수정
- **chore**: 기타 자잘한 설정, 패키지 매니저 등
- **build**: 빌드 시스템, 의존성 변경
- **ci**: CI/CD 설정 변경
- **perf**: 성능 개선

### 3. 커밋 테스트

```bash
echo "build(native): change something in api's build" | npx commitlint
```
