# 기여 가이드라인

Blog.itjustbong 프로젝트에 기여해 주셔서 감사합니다!

## 개발 환경 설정

```bash
# 레포지토리 클론
git clone https://github.com/itjustbong/blog.itjustbong.git
cd blog.itjustbong

# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

## 브랜치 전략

- `main`: 프로덕션 브랜치
- `develop`: 개발 브랜치
- `feature/*`: 기능 개발
- `fix/*`: 버그 수정

## 커밋 컨벤션

```
<type>(<scope>): <subject>

예시:
feat(blog): 새로운 포스트 에디터 추가
fix(ui): 버튼 스타일 수정
docs: README 업데이트
```

### Type

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드, 설정 변경

## Pull Request

1. `develop` 브랜치에서 새 브랜치 생성
2. 변경사항 커밋
3. `develop` 브랜치로 PR 생성
4. 코드 리뷰 후 머지

## 코드 스타일

- ESLint, Prettier 설정 준수
- TypeScript strict 모드 사용
- 컴포넌트는 함수형으로 작성

```bash
# 린트 검사
pnpm lint

# 포맷팅
pnpm format
```

## 문의

이슈나 질문이 있으시면 GitHub Issues를 이용해 주세요.
