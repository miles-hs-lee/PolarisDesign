---
description: 폴라리스 디자인 시스템 준수 여부 검사 (lint 실행)
---

다음을 실행하고 결과를 보고하세요:

```sh
pnpm lint
```

(프로젝트 root에 eslint 바이너리가 없어도 동작하도록 항상 `pnpm lint`를 사용. 모노레포라면 `pnpm --filter <pkg> lint`로 패키지별 실행.)

### 위반이 있으면

자동 수정 가능한 항목이 있다면 먼저 시도:

```sh
pnpm lint --fix
```

남은 항목은 직접 수정:

- **hex 색상** (`#1D4ED8` 등) → `var(--polaris-brand-primary)` 또는 `bg-brand-primary` 클래스
- **rgb/hsl 함수** → 시맨틱 토큰으로 교체
- **inline style의 CSS named color** (`style={{ color: 'red' }}`) → 시맨틱 토큰
- **Tailwind 임의값** (`bg-[#xxx]`, `p-[13px]`) → 토큰 기반 클래스 (`bg-brand-primary`, `p-4`)
- **font-family 직접 지정** → `var(--polaris-font-sans)` 또는 `font-polaris` 클래스
- **font-['Inter']** Tailwind 임의값 → `font-polaris`
- **native `<button>`/`<input>`/`<textarea>`/`<select>`/`<dialog>`** → `@polaris/ui` 컴포넌트로 교체 (`<Button>`, `<Input>`, …)

전체 진단(자주 등장 hex 분석 등)이 필요하면 `npx polaris-audit`로 요약 리포트 확인. 마이그레이션 가이드는 `/polaris-migrate`.

### 위반이 없으면

"디자인 시스템 준수 OK"라고 한 줄로 보고하세요.

### 룰을 disable하지 말 것

`// eslint-disable-next-line @polaris/...` 같은 우회는 금지. 룰이 잘못 잡는 false-positive로 보이면 사용자에게 보고해서 룰을 개선하세요.
