---
description: 새 폴라리스 디자인 시스템 적용 프로젝트를 1줄로 부트스트랩
argument-hint: <프로젝트 이름>
---

새 폴라리스 웹 서비스를 만듭니다. 사용자에게 따로 확인받지 말고 진행하세요 — 사용자가 이 명령을 호출했다는 것 자체가 동의입니다.

## 1. 템플릿 클론

`$ARGUMENTS`가 비어 있으면 사용자에게 프로젝트 이름을 물어보고, 있으면 그대로 사용:

```sh
npx -y tiged miles-hs-lee/PolarisDesign/packages/template-next $ARGUMENTS
cd $ARGUMENTS
```

이 한 줄이면 다음이 모두 세팅된 상태로 시작합니다 (v0.7+):
- Next.js 15 (App Router) + TypeScript
- `@polaris/ui` + `@polaris/lint` 사전 통합 (v0.7 spec 토큰)
- Tailwind preset + tokens.css 자동 import
- 디자인팀 SVG 자산 — `@polaris/ui/icons` (65) · `/file-icons` (29) · `/logos` (Polaris + Nova) 즉시 사용 가능
- Pretendard 폰트 (CDN)
- `app/layout.tsx`에 ToastProvider/TooltipProvider/다크모드 영구화 wrapping
- 샘플 `app/page.tsx`에 NovaInput, PromptChip, FileCard, Card 사용 예시
- `prep:ui` / `prep:ui-sources` npm 스크립트 — `pnpm dev` 시 `@polaris/ui` build/source generation 자동 실행 (clean clone에서도 무중단)

## 2. 의존성 설치 + dev 실행

```sh
pnpm install   # @polaris/ui prepare hook이 토큰/아이콘 source 자동 생성
pnpm dev       # template의 prep:ui가 @polaris/ui dist 빌드 → next dev
```

## 3. package.json 정리

`package.json`의 `name`을 사용자가 원하는 프로젝트명으로 바꿉니다. 그 외에는 손대지 마세요.

## 4. 검증

```sh
pnpm lint        # @polaris/lint — 위반 0건이어야 함 (샘플 페이지가 토큰만 사용)
pnpm typecheck
pnpm build
```

## 5. 사용자에게 보고

다음 형식으로 한 메시지에 정리:

> 새 프로젝트 `<name>`이 준비됐습니다. http://localhost:3000 에서 확인하세요.
> - `app/page.tsx`를 편집해서 본인 콘텐츠로 교체
> - 추가 라우트는 `app/<path>/page.tsx`
> - 컴포넌트는 `@polaris/ui`에서 import
> - lint가 토큰 우회를 자동 차단하니 hex/임의값 직접 사용 금지

## 주의

- **기존 디렉터리에 적용하려는 경우** `/polaris-init`이 아니라 `/polaris-migrate`를 사용하세요 (기존 코드는 토큰 위반을 가지고 있을 가능성이 높음).
- **`@polaris/ui` 미배포 상태에서 외부 클론은 실패**합니다. 템플릿의 `package.json`이 `"@polaris/ui": "workspace:*"`로 의존성을 참조하기 때문에 `pnpm install`이 npm 레지스트리에서 패키지를 찾지 못합니다.
  - **확인 절차**: 1단계 클론 직후 `cat package.json | grep workspace`로 workspace 참조가 남아 있는지 확인. 남아 있으면 사용자에게 다음 중 한 경로를 선택하도록 보고하세요.
    - (a) 모노레포 안에서 작업 — 새 앱을 `packages/` 또는 `apps/` 아래에 만들고 이 템플릿 파일들을 참조
    - (b) `@polaris/ui`/`@polaris/lint`를 사내 npm/GitHub Packages에 publish 후, `workspace:*`를 실제 버전(예: `^0.1.0`)으로 교체
    - (c) 임시 우회: `pnpm link`로 로컬 모노레포 빌드를 새 프로젝트에 링크
  - 위 셋 모두 사용자 결정이 필요하므로 임의로 진행하지 말고 반드시 보고할 것.
