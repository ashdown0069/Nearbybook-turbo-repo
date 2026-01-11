# 📱 NearbyBook App (React native)

'NearbyBook'의 모바일 애플리케이션입니다. 사용자가 원하는 도서의 정보를 기반으로, 주변 공공 도서관에서 해당 도서를 소장하고 있는지 검색해주는 서비스를 모바일 앱으로 제공합니다.

## ✨ 주요 기능

- **도서 검색**: 도서명, ISBN 또는 바코드 스캔을 통해 원하는 책을 검색할 수 있습니다.
- **주변 도서관 찾기**: 네이버 지도를 활용하여 내 위치 주변의 공공 도서관을 쉽게 찾을 수 있습니다.
- **소장 여부 확인**: 검색한 도서가 주변 도서관에 있는지, 대출 가능한지 확인할 수 있습니다.
- **북마크/즐겨찾기**: 관심 있는 책을 저장할 수 있습니다.

## 🛠️ 기술 스택 (Tech Stack)

- **Framework**: [Expo](https://expo.dev), [React Native](https://reactnative.dev)
- **Language**: TypeScript
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS), Lucide React Native
- **Navigation**: Expo Router
- **State Management**: Zustand, React Query (@tanstack/react-query)
- **Map**: Naver Maps API (@mj-studio/react-native-naver-map)
- **Local Database**: Drizzle ORM, Expo SQLite
- **Storage**: React Native MMKV
- **Camera**: React Native Vision Camera (바코드 스캔 등)

## 🚀 개발 환경 설정 및 실행

> **Note**: 이 프로젝트는 네이티브 모듈(지도, 카메라 등)을 포함하고 있어 **Expo Go 대신 개발 빌드(Development Build)** 환경에서 실행해야 합니다.

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

```
EXPO_PUBLIC_BACKEND_URL="https://api.nearbybook.kr"
```

### 3. 개발 빌드 실행

**개발 빌드 실행:**

```bash
npx expo run:android
npx expo run:ios
```

## 📂 폴더 구조

- **app/**: Expo Router 기반의 페이지 및 라우팅 구조
- **components/**: 재사용 가능한 UI 컴포넌트
- **constants/**: 상수 데이터
- **db/**: 로컬 데이터베이스 설정 (Drizzle ORM)
- **hooks/**: 커스텀 React Hooks
- **lib/**: 유틸리티 함수 및 외부 라이브러리 설정
- **store/**: 전역 상태 관리 (Zustand)
- **types/**: TypeScript 타입 정의
