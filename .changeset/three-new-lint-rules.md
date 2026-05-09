---
'@polaris/lint': patch
'@polaris/ui': patch
'@polaris/plugin': patch
'polaris-template-next': patch
'demo': patch
---

🛡️ `@polaris/lint`에 신규 룰 3개 — 외부 사이트 검수에서 발견된 사각지대를 회귀 차단으로 막음.

**배경**: 2026-05-08 `jane-h-oh.github.io/design-test/dashboard` 검수에서 Polaris 토큰을 *load*만 하고 실제 사용은 Tailwind 기본 palette + 자체 `--color-*` alias 레이어 + rc.0 deprecated 토큰을 쓰는 사이트 발견. 기존 lint 룰 6종(`no-hardcoded-color`, `no-arbitrary-tailwind` 등)으로는 어느 것도 잡지 못함 — bracket-arbitrary 패턴, hex literal에만 반응하는 한계.

**신규 룰**:

1. **`@polaris/no-tailwind-default-color`** (warn, v0.8 → error 예정)
   Tailwind 기본 22 palette(`slate-*`, `rose-*`, `red-*`, `blue-*`, …)를 색상 utility에 사용하는 것 차단. 17개 utility prefix(`text/bg/border/ring/outline/divide/placeholder/caret/accent/decoration/shadow/from/via/to/fill/stroke`) × 22 palette × 알파 modifier까지 매칭. 메시지에 semantic 토큰 hint 동봉(예: slate → label-* / fill-* / line-*).

2. **`@polaris/no-deprecated-polaris-token`** (error)
   v0.6 / rc.0 / v1 deprecated alias 사용 차단. Tailwind class(`bg-fg-primary`, `text-surface-raised`, `bg-brand-primary`, `bg-status-danger` 등) + CSS variable(`var(--polaris-neutral-*)`, `var(--polaris-text-*)`, `var(--polaris-surface-*)` 등) 둘 다. 각 검출 시 v0.7 spec 교체값 메시지에 동봉. v0.8에서 alias 제거 예정이라 신규 코드는 처음부터 차단해 회귀 방지.

3. **`@polaris/no-non-polaris-css-var`** (warn)
   JSX/className/style에서 `var(--polaris-*)` 또는 `var(--tw-*)` 외 CSS 변수 사용 차단. `var(--color-copy)`, `var(--app-gradient-*)`, `var(--my-brand)` 같은 자체 alias 레이어 검출. `allowedPrefixes` 옵션으로 third-party 변수 escape hatch 제공. *제한*: pure `*.css` 파일은 ESLint scope 밖 — 글로벌 CSS의 자체 alias *정의*는 못 잡지만 JS/TSX의 *소비*는 잡음.

**테스트 커버리지**: 33 신규 테스트 케이스 추가 → 53개 → 86개. 각 룰 valid/invalid 패턴 다양하게.

**기존 코드베이스 정리**:
- 데모 39 위반(전부 deprecated alias) — 자동 sed 마이그레이션으로 해소: `bg-status-* → bg-state-*` (danger→error rename), `border-brand-primary → border-accent-brand-normal`, `border-brand-secondary → border-ai-normal`, `from/via/to-surface-canvas → -background-base` 등.
- 데모 4 위반(Tailwind 기본색 `bg-neutral-100`) — `bg-fill-neutral`로 정합.
- 데모 1 위반(custom CSS var `--editor-chrome-h`) — 의도된 데모 전용 layout var, eslint-disable-next-line으로 명시.

**검증**:
- `pnpm --filter @polaris/lint test` → 86 ✓ + 11 codemod ✓
- `pnpm --filter @polaris/ui test` → 89/89
- `pnpm test:e2e` → 28/28 (시각 baseline 변동 없음 — status-*/state-* 토큰이 유사 hex)
- `pnpm --filter polaris-template-next lint --max-warnings=0` → 0 warnings, 0 errors
- `pnpm --filter demo lint` → 0 errors (deprecated alias 위반 모두 해소)

**v0.8 계획**:
- `no-tailwind-default-color` warn → error (consumer 마이그레이션 시간 후)
- deprecated alias CSS 변수 자체 제거 → `no-deprecated-polaris-token` 룰의 일부 패턴 자연 무용화
- Stylelint 기반 `--color-*` alias *정의* 차단 룰 검토(global CSS 커버리지)
