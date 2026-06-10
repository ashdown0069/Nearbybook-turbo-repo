# NearbyBook - 내 주변 도서 검색 크롬 확장 프로그램

## 📚 프로젝트 소개

'NearbyBook'는 사용자가 현재 보고 있는 웹 페이지의 도서 정보를 기반으로, 주변 공공 도서관에서 해당 도서를 소장하고 있는지 검색해주는 크롬 확장 프로그램입니다.

## ✨ 주요 기능

- **자동 도서 정보 추출**: 웹 페이지에서 도서명, ISBN을 자동으로 파싱

- **책 소장 도서관 확인**: 추출한 정보를 토대로 내가 설정한 지역에서 내가 보고있는 페이지의 도서를 소장한 공공 도서관 검색

- **지원서점 사이트**:
  - 교보문고, YES24, 알라딘, 네이버 도서 가격비교

  <br />

## 🛠️ 기술 스택

- **Framework**: `WXT (Web Extension Framework) 0.20.x` (Vite)
- **Library**: `React 19.2.0`
- **Styling**: `Tailwind CSS 4.x` / `@workspace/ui` 
- **State & Storage**: `@wxt-dev/storage` (Chrome Extension Sync Storage 추상화 라이브러리)
- **Browser APIs**: `Chrome Extension API (MV3)`
  - `activeTab` / `scripting`: 현재 활성화된 서점 페이지 DOM 내의 ISBN 메타데이터 파싱
  - `storage`: 사용자 단골 도서관 목록 및 선호 지역 정보의 클라이언트 측 동기화 영속 저장
  - `notifications`: 실시간 소장 여부 발견 시 브라우저 알림 피드백 전송
- **Code Sharing**: `@workspace/data-access` (백엔드 통신 API 클라이언트)

<br />

## 🚀 Getting Started

### 사전 요구사항
- **Node.js v20** 이상

### 로컬 빌드 및 수동 로드 방법

1. **프로젝트 빌드 및 준비** (모노레포 루트)
   ```powershell
   npm install
   # WXT 컴파일러가 확장프로그램 전용 manifest 및 types를 빌드하도록 트리거
   npm run build --workspace=extension
   ```

2. **개발 모드 기동**
   ```powershell
   cd apps/extension
   # 실시간 변경사항 핫 리로딩이 적용된 개발자 브라우저 기동
   npm run dev
   ```

3. **크롬 브라우저 로드 방법**
   1. 크롬 주소창에 `chrome://extensions/`를 입력하여 접속합니다.
   2. 우측 상단의 **'개발자 모드'** 토글을 켭니다.
   3. 좌측 상단의 **'압축해제된 확장 프로그램을 로드'** 버튼을 클릭합니다.
   4. `apps/extension/.output/chrome-mv3-dev/` 폴더를 지정하여 불러옵니다.
   5. 온라인 서점 사이트에 접속하여 도서를 확인하고 NearbyBook 아이콘을 클릭하여 기능을 테스트합니다.
   
