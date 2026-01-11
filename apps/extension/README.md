# NearbyBook - 내 주변 도서 검색 크롬 확장 프로그램

## 📚 프로젝트 소개

'NearbyBook'는 사용자가 현재 보고 있는 웹 페이지의 도서 정보를 기반으로, 주변 공공 도서관에서 해당 도서를 소장하고 있는지 검색해주는 크롬 확장 프로그램입니다.

[Backend](https://github.com/ashdown0069/nearbybook__backend) / 
[Frontend](https://github.com/ashdown0069/nearbybook)

## ✨ 주요 기능

- **자동 도서 정보 추출**: 웹 페이지에서 도서명, ISBN을 자동으로 파싱

- **책 소장 도서관 확인**: 추출한 정보를 토대로 내가 설정한 지역에서 내가 보고있는 페이지의 도서를 소장한 공공 도서관 검색

- **지원서점 사이트**:
  - 교보문고, YES24, 알라딘, 네이버 도서 가격비교

## 🛠️ 기술 스택

- **Frontend**: Wxt Framework, React
- **Browser API**: Chrome Extension API (Tabs, Scripting, Storage, SidePanel, notifications)
- **Backend**: Nest.js - 정부 Open API 연동 및 데이터 처리

## 🚀 설치

## Project setup and run the project

```bash
$ npm install
$ npm run dev
```

1.  크롬 - 확장프로그램 - 압축해제된 확장 프로그램 로드

2.  .output/chrome-mv3-dev 폴더 불러오기
