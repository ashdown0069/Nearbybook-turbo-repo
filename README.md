# Turborepo Nearbybook

## 📂 Applications

- [**Web**](./apps/web/README.md) - Next.js Web Application
- [**Native**](./apps/native/README.md) - React Native (Expo) Application
- [**Extension**](./apps/extension/README.md) - Chrome Extension
- [**API**](./apps/api/README.md) - NestJS API Server

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
