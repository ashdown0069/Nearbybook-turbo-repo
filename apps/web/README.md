## 📚 프로젝트 소개

'NearbyBook'은 사용자가 원하는 도서의 정보를 기반으로, 주변 공공 도서관에서 해당 도서를 소장하고 있는지 검색해주는 웹사이트입니다.

- [Backend](https://github.com/ashdown0069/nearbybook__backend)
- [Extension](https://github.com/ashdown0069/nearbybook_extension)

## ✨ 주요 기능

- **도서 검색**: 도서명 또는 ISBN을 통해 원하는 책을 검색할 수 있습니다.
- **도서관 검색:** 지도를 사용하여 지역내 공공 도서관을 검색 할 수 있습니다.
- **소장 도서관 확인**: 검색된 책을 소장하고 있는 주변 공공 도서관의 정보를 사용자의 현재 위치 또는 지도상의 특정 지역을 중심으로 지도사용하여 제공합니다.
- **대출 가능 여부 조회**: 각 도서관의 대출 가능 여부를 확인할 수 있습니다.
- **브라우저 확장 프로그램**: 온라인 서점(교보문고, YES24, 알라딘 등) 페이지에서 바로 주변 도서관 소장 여부를 확인할 수 있는 확장 프로그램을 제공합니다.
- **반응형 UI/UX / 인기 대출 도서 정보 제공 / 트렌드 도서 정보 제공**

## 🛠️ 기술 스택

- **Frontend**: Next.js , React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand, React Query (@tanstack/react-query)
- **Map**: Naver Maps API
- **Testing:** Jest, React Testing Library
- **Deployment:** Vercel
- **Backend**: Nest.js (도서 Open API 및 데이터 처리) [[링크]](https://github.com/ashdown0069/nearbybook__backend)

## 💡 주요 구현 사항

### 반응형 UI/UX

- 모바일에서도 사용가능하도록 구현

### 지도

- 지도를 로드하고 인스턴스를 관리하는 `useMapInit`
- 데이터 변경에 따라 마커를 찍고 지우는 `useMapMarkers`
- 지도 이동 시 재검색 버튼 활성화를 담당하는 `useMapInteraction`

역할 별 커스텀 훅으로 분리하여 유지보수 및 재사용성을 증가

### SEO (검색 엔진 최적화)

검색 결과에 따라 동적인 메타태그를 생성하여 검색 엔진 노출을 극대화했습니다.

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

## 🚀 개발 환경 설정 및 실행

프로젝트를 로컬 환경에서 설정하고 실행하는 방법은 다음과 같습니다.

## ENV

```
NEXT_PUBLIC_BACKEND_URL="https://api.nearbybook.kr"
NEXT_PUBLIC_MAP_CLIENT_ID=""
NEXT_PUBLIC_EXTENSION_STORE_URL=""
NEXT_PUBLIC_EXTENSION_WHALE_STORE_URL=""
MAINTENANCE=false

```

## 실행

```
    npm install
    npm run dev
```
