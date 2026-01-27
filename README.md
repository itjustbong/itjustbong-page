# Blog.itjustbong Monorepo

Turborepo 기반 모노레포 개인 포트폴리오 플랫폼

## 프로젝트 구조

```
├── apps/
│   ├── blog/      # 기술 블로그 (Next.js)
│   ├── resume/    # 이력서 서비스
│   ├── llm/       # LLM 챗봇 서비스
│   └── shell/     # MFA Shell (추후)
│
├── packages/
│   ├── ui/        # 공용 UI 컴포넌트
│   ├── shared/    # 공용 유틸리티/타입
│   └── config/    # 공용 설정 (ESLint, TypeScript, Tailwind)
```

## 기술 스택

- **Build System**: Turborepo
- **Package Manager**: pnpm
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui

## 시작하기

### 요구사항

- Node.js 20+
- pnpm 9+

### 설치

```bash
# 의존성 설치
pnpm install

# 전체 개발 서버 실행
pnpm dev

# 특정 앱만 실행
pnpm dev:blog
pnpm dev:resume
pnpm dev:llm
```

### 빌드

```bash
# 전체 빌드
pnpm build

# 린트
pnpm lint

# 포맷팅
pnpm format
```

## 앱별 포트

| App    | Port | URL                   |
| ------ | ---- | --------------------- |
| Blog   | 3000 | http://localhost:3000 |
| Resume | 3001 | http://localhost:3001 |
| LLM    | 3002 | http://localhost:3002 |
| Shell  | 3003 | http://localhost:3003 |

## 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
