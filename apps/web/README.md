## 📚 프로젝트 소개

'NearbyBook'은 사용자가 원하는 도서의 정보를 기반으로, 주변 공공 도서관에서 해당 도서를 소장하고 있는지 검색해주는 웹사이트입니다.

## ✨ 주요 기능

- **도서 검색**: 도서명 또는 ISBN을 통해 원하는 책을 검색할 수 있습니다.
- **도서관 검색:** 지도를 사용하여 지역내 공공 도서관을 검색 할 수 있습니다.
- **소장 도서관 확인**: 검색된 책을 소장하고 있는 주변 공공 도서관의 정보를 사용자의 현재 위치 또는 지도상의 특정 지역을 중심으로 지도사용하여 제공합니다.
- **대출 가능 여부 조회**: 각 도서관의 대출 가능 여부를 확인할 수 있습니다.
- **브라우저 확장 프로그램**: 온라인 서점(교보문고, YES24, 알라딘 등) 페이지에서 바로 주변 도서관 소장 여부를 확인할 수 있는 확장 프로그램을 제공합니다.
- **반응형 UI/UX / 인기 대출 도서 정보 제공 / 트렌드 도서 정보 제공**

<br />

## 🛠️ 기술 스택

- **Framework**: `Next.js 15.5.x` (App Router)
- **Library**: `React 19.2.0`
- **Styling**: `Tailwind CSS 4` & `shadcn/ui`
- **State Management (Server)**: `@tanstack/react-query` (서버 상태 캐싱 및 Prefetch 동기화)
- **State Management (Client)**: `Zustand` (가볍고 직관적인 UI 및 필터 상태 관리)
- **Map & Location**: `Naver Maps API` (사용자 중심 지도 핀 시각화 및 클러스터링)
- **Icon**: `lucide-react`
- **Testing**: `Jest`, `@testing-library/react`, `jest-environment-jsdom` (컴포넌트 및 비즈니스 훅 테스트)
- **Telemetry**: `@vercel/analytics`, `@vercel/speed-insights` (실시간 Core Web Vitals 측정)
- **AI**: `Claude Code(SuperClaude_Framework skills 사용)`, `Google Gemini(Superpower skills 사용)` 사용


## 💡 주요 구현 사항

### 반응형 UI/UX

- 모바일에서도 사용가능하도록 구현

### SEO (검색 엔진 최적화)

- Next.js의 `generateMetadata` API를 활용하여 검색된 책의 제목, 저자, 이미지를 Open Graph 태그로 동적으로 생성
- `schema.org` 구조화된 데이터(JSON-LD)를 삽입하여 검색 엔진이 책 정보를 더 잘 이해하도록 구현

### 최적화

- 검색을 위한 타이핑시 검색어를 prefetchQuery 사용하여 prefetch 하도록 구현하여 사용자가 경험 향상
- 검색시 debounce 로직을 사용하여 네트워크 요청 최적화
- Tanstack Query의 `prefetchQuery`를 사용하여 서버사이드 렌더링 구현
- Next.js의 dynamic import 기능을 사용하여 Lazy Loading 구현(지도 관련 컴포넌트에 주로 적용)
- Next.js의 `Image` 컴포넌트를 사용하여 이미지 최적화
- CSR로 렌더링 되는 컴포넌트의 Hover 상태시 `prefetchQuery` 기능을 사용하도록 구현하여 사용자의 경험 향상
- Hover 상태가 300ms 지속되면 페칭하도록 구현하여 네트워크 요청을 최적화
- 네이버 지도의 클러스터링을 도입하여 수백개의 핀을 성능 저하없이 표시하도록 개선



## 🚀 개발 환경 설정 및 실행

개발환경 실행

```
    npm install
    npm run dev
```
테스트 실행 
```
    npm run test
```
