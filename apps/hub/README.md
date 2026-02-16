# Hub Service (`@apps/hub`)

itjustbong 서비스 링크를 한눈에 모아 제공하는 Vite + Vanilla TypeScript 기반 링크 허브입니다.

## 주요 기능

- 3D 카드 캐러셀 기반 서비스 탐색 UI
- 각 서비스 페이지 iframe 미리보기 및 로딩/실패 처리
- 하단 정보 패널(요약/방문 버튼)과 네비게이션 도트
- 서비스 목록 오버레이 메뉴
- 터치/휠/키보드(좌우 방향키) 내비게이션

## 데이터 소스

- 서비스/소셜 링크 원본: `packages/shared/src/site-links.ts`
- Hub 앱에서 `@repo/shared/site-links`를 import하여 카드와 메뉴를 구성합니다.

## 레이아웃 참고

- 카드 크기/간격 반응형 계산: `src/main.ts`의 `getConfig()`
- 모바일 카드 높이 계산: `src/main.ts`의 `w < 640` 분기 (`cardHeight`)
- 실제 카드 높이 적용: CSS 변수 `--card-h` (`src/style.css`의 `.card`)

## 로컬 실행

```bash
pnpm dev
```

기본 포트는 `3003`입니다.

## 빌드

```bash
pnpm build
pnpm preview
```

## 배포

정적 빌드 결과물은 `dist/`에 생성됩니다.
Docker 배포는 `apps/hub/Dockerfile`과 `apps/hub/nginx.conf`를 사용합니다.
