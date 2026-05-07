---
description: 폴라리스 디자인 시스템 준수 여부 검사 (lint 실행)
---

다음을 실행하고 결과를 보고하세요:

```sh
pnpm lint
```

(프로젝트 root에 eslint 바이너리가 없어도 동작하도록 항상 `pnpm lint`를 사용. 모노레포라면 `pnpm --filter <pkg> lint`로 패키지별 실행.)

### 위반(error)이 있으면

자동 수정 가능한 항목이 있다면 먼저 시도:

```sh
pnpm lint --fix
```

남은 항목은 직접 수정 (v0.7 spec 기준):

- **hex 색상** (`#1D4ED8` 등) → 시맨틱 토큰. 예: `var(--polaris-accent-brand-normal)` 또는 `bg-accent-brand-normal` 클래스. 색상 종류별 매핑은 `/polaris-component`로 표 확인.
- **rgb/hsl 함수** → 시맨틱 토큰으로 교체
- **inline style의 CSS named color** (`style={{ color: 'red' }}`) → 시맨틱 토큰
- **Tailwind 임의값** (`bg-[#xxx]`, `p-[13px]`, `z-[999]`) → 토큰 기반 클래스 (`bg-accent-brand-normal`, `p-4` / `p-polaris-md`, `z-polaris-modal`)
- **font-family 직접 지정** → `var(--polaris-font-sans)` 또는 `font-polaris` 클래스
- **font-['Inter']** Tailwind 임의값 → `font-polaris`
- **native `<button>`/`<input>`/`<textarea>`/`<select>`/`<dialog>`** → `@polaris/ui` 컴포넌트로 교체

### 경고(warn)는 옵트인 마이그레이션

v0.7+ 에서 두 가지 warn 룰이 추가됐습니다 (lint를 실패시키진 않음):

- **`@polaris/state-color-with-icon`** — `text-state-{success,warning,error}` 가 아이콘 동반 없이 사용되면 경고. WCAG 1.4.1 (정보를 색상만으로 전달하지 않음). 처리: `<ErrorIcon />`/`<CheckIcon />` 등 아이콘 추가, 18px+ Bold 사용, 또는 `bg-state-{}-bg` 뱃지 패턴.
- **`@polaris/prefer-polaris-icon`** — `lucide-react` 에서 폴라리스 대응 아이콘 있을 때 권장. 처리: `import { ChevronRightIcon } from '@polaris/ui/icons'` 같은 식으로 점진 교체.

### 옛 (v0.6 / rc.0) 토큰 이름이 코드에 남아 있으면

v0.7 spec 이름으로 일괄 변환:

```sh
# 미리 확인 (변경 없음)
pnpm dlx @polaris/lint polaris-codemod-v07 src

# 적용
pnpm dlx @polaris/lint polaris-codemod-v07 --apply src
```

처리: TS 토큰 멤버 (`text.primary` → `label.normal`), Tailwind 클래스 (`bg-brand-primary` → `bg-accent-brand-normal`, `text-polaris-h1` → `text-polaris-display`), CSS 변수 (`--polaris-text-primary` → `--polaris-label-normal`), 컬러 램프 step (`bg-blue-5` → `bg-blue-05`), `rounded-polaris-full` → `rounded-polaris-pill`.

자세한 매핑 표 / 적용 범위 주의사항: [`docs/migration/v0.6-to-v0.7.md`](https://github.com/PolarisOffice/PolarisDesign/blob/main/docs/migration/v0.6-to-v0.7.md).

전체 진단 (자주 등장 hex 분석 등) 이 필요하면 `npx polaris-audit` 로 요약 리포트 확인. 페이지 단위 마이그레이션은 `/polaris-migrate`.

### 위반이 없으면

"디자인 시스템 준수 OK" 라고 한 줄로 보고하세요 (warn 카운트는 별도로 명시 — 예: "0 errors, 12 warns").

### 룰을 disable하지 말 것

`// eslint-disable-next-line @polaris/...` 같은 우회는 금지. 룰이 잘못 잡는 false-positive로 보이면 사용자에게 보고해서 룰을 개선하세요. (단, `state-color-with-icon` / `prefer-polaris-icon` 같은 warn 룰은 의도된 케이스에서 line suppression OK — 둘 다 도움말에 명시된 사용 가이드 있음.)
