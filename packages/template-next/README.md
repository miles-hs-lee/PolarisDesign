# Polaris Next.js Template

Next.js 15 (App Router) 템플릿. 처음부터 [@polaris/ui](https://github.com/miles-hs-lee/PolarisDesign) 디자인 시스템이 통합돼 있습니다.

> ⚠️ **현재 한계 — `@polaris/ui` 미배포**
>
> 이 템플릿은 `@polaris/ui`와 `@polaris/lint`를 `workspace:*`로 참조합니다. 그래서 다음 두 경로 중 하나로만 동작합니다:
>
> 1. **모노레포 내부에서 사용** — `packages/template-next/`를 그대로 새 디렉터리로 복사하거나, 새 앱을 모노레포 안에 만들고 이 템플릿의 파일을 참조. `pnpm install`이 workspace 의존성을 정상 해결.
> 2. **`@polaris/ui`/`@polaris/lint`가 사내 npm 레지스트리(또는 npmjs)에 publish된 이후** — 그때부터 `workspace:*`를 실제 버전 번호로 바꾸고 외부 프로젝트에서도 `npx tiged ...` + `pnpm install`이 동작합니다.
>
> 외부 클론(예: `npx tiged miles-hs-lee/PolarisDesign/packages/template-next my-app`)을 시도하면 `pnpm install` 단계에서 `@polaris/ui`/`@polaris/lint`가 npm 레지스트리에 없어 실패합니다. 사내 레지스트리 셋업은 [메인 README](../../README.md#license)의 "다음" 항목을 참고하세요.

## 시작 (모노레포 내부)

```sh
# 모노레포 클론 후
cd PolarisDesign
pnpm install                                    # workspace 전체
pnpm --filter polaris-template-next dev         # 템플릿이 그대로 dev 실행됨
```

## 시작 (사내 레지스트리 publish 이후)

```sh
npx tiged miles-hs-lee/PolarisDesign/packages/template-next my-app
cd my-app
# package.json 안의 "@polaris/ui": "workspace:*"를 실제 버전으로 교체 후
pnpm install
pnpm dev
```

또는 Claude Code에서 `/polaris-init` 슬래시커맨드를 실행하면 위 단계와 알림을 자동으로 수행합니다.

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
