# Polaris Next.js Template

Next.js 15 (App Router) 템플릿. 처음부터 [@polaris/ui](https://github.com/miles-hs-lee/PolarisDesign) 디자인 시스템이 통합돼 있습니다.

## 시작

```sh
npx tiged miles-hs-lee/PolarisDesign/packages/template-next my-app
cd my-app
pnpm install
pnpm dev
```

또는 Claude Code에서 `/polaris-init` 슬래시커맨드를 실행하면 위 단계를 자동으로 수행합니다.

## 무엇이 들어 있나

- **`@polaris/ui`** — 토큰 + 18개 컴포넌트, `app/page.tsx`에서 바로 사용 가능
- **`@polaris/lint`** — `eslint.config.mjs`에 recommended 프리셋 적용
- **Tailwind preset** — `bg-brand-primary`, `text-fg-primary`, `rounded-polaris-md` 등 토큰 클래스 자동 등록
- **Pretendard** 폰트 CDN 로드
- **다크모드** 토글 컴포넌트(`components/theme-toggle.tsx`) — `localStorage`에 영구화
- **샘플 페이지** — NovaInput, PromptChip, FileCard, Card 조합 예시

## 본인 서비스로 만들기

1. `package.json`의 `name`을 본인 프로젝트명으로 수정
2. `app/page.tsx`의 샘플 콘텐츠를 실제 화면으로 교체
3. 새 라우트는 `app/<path>/page.tsx` 추가
4. 컴포넌트는 `@polaris/ui`에서 import — 직접 native `<button>`, `<input>` 사용 시 lint 차단
5. 색상·폰트·간격은 모두 토큰만 사용 (`text-fg-primary`, `bg-brand-primary`, `p-4` 등)

## 검증

```sh
pnpm lint        # @polaris/lint — 위반 0건이어야 함
pnpm typecheck
pnpm build
```

## Pretendard 로컬 호스팅 (프로덕션)

CDN 대신 로컬 호스팅을 권장하는 경우:

```tsx
// app/layout.tsx
import localFont from 'next/font/local';

const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  variable: '--polaris-font-sans-loaded',
});
```

`@polaris/ui`의 `--polaris-font-sans` 변수는 Pretendard fallback 체인을 이미 가지고 있어, 로컬 폰트 미설치 시에도 자연스럽게 동작합니다.

## 라이선스

내부용. 본인 회사 정책에 맞게 변경하세요.
