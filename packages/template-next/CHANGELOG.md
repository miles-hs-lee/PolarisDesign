# polaris-template-next

## 0.7.0-rc.1

### Minor Changes

- v0.7.0-rc.1 — DESIGN.md + primitive-color-palette 완전 정렬

  rc.0 출시 후 디자인팀의 더 상세한 정의서(`DESIGN.md` + `primitive-color-palette.html`)를 받아 9단계 reconciliation 수행. 사용자 피드백 단계 전이라 alias 부담 없이 spec 완전 정렬.

  마이그레이션: [`docs/migration/v0.6-to-v0.7-rc.1.md`](https://github.com/miles-hs-lee/PolarisDesign/blob/main/docs/migration/v0.6-to-v0.7-rc.1.md)
  Codemod (v0.6 / rc.0 모두 대응): `pnpm dlx @polaris/lint polaris-codemod-v07 --apply src`

  ### Highlights

  **컬러 primitive 확장 (rc.1)**

  - 모든 브랜드 램프에 step `90` (가장 어두운) 추가 — 10단계 (`05/10/20/30/40/50/60/70/80/90`)
  - 5개 신규 supplementary 패밀리: Sky Blue, Blue (보조), Violet, Cyan, Yellow
  - step `5` (no leading zero) 표기는 deprecated alias로 계속 작동 — codemod가 `05`로 rewrite
  - step 40의 hex 보정 (rc.0 표류): Green `#B5CA5F→#85CA5F`, Purple `#9075EC→#9D75EC`, DarkBlue `#4C70CE→#4C7DCE`

  **시맨틱 토큰 19개 신설**
  NEW: `label.disabled` / `layer.surface/-overlay` / `interaction.pressed` / `fill.neutral/-strong` / `line.strong/-disabled` / `accentBrand.bg/-bgHover` / `accentAction.normal/-strong` (Black 버튼) / `focus.ring` / `staticColors.white/-black` / `state.new` + `state.{success,warning,error,info}Bg` 4개

  **다크 모드 그레이스케일 재작성**
  rc.0의 퍼플 틴트(`#1B1B2A` 등)가 spec의 단색 그레이(`#232323`/`#282828`/`#3B3B3B`)로 전체 교체

  **Radius 스케일 한 단계 시프트**
  `md` 8→12 (Button/Card/Modal default), `lg` 12→16, `xl` 16→24, `2xl` 24→38 (bottom sheet)

  **타이포그래피 11레벨 spec 정렬**

  - 명명 변경: `display`(60→40), `h1-h5` → `display`/`title`/`heading1-3`
  - 신규 사이즈: `heading4` (18), `body3` (13), `caption2` (11)
  - Caption weight 400 → 700, body letter-spacing 제거
  - 모바일 (≤767px) type scale 자동 적용 (auto media query)

  **4개 신규 토큰 시스템**

  - Spacing: `4xs` (2) → `4xl` (64) 12레벨 — class form `p-polaris-md`, `gap-polaris-lg`
  - Z-index: `base/dropdown/sticky/dim/modal/toast` — class form `z-polaris-modal`
  - Motion: `duration-polaris-fast`, `ease-polaris-out`
  - Breakpoint: `mobile/tablet-v/tablet-h/desktop` semantic names

  **Button 6 사이즈 + Black variant**
  사이즈 24/32/40/48/54/64. 사이즈별 weight 분기 (xs/sm/md = Medium 500, lg/xl/2xl = Bold 700). 신규 `dark` variant (Black 버튼, 다크모드 자동 반전).

  **Input 52px + Floating Title + 강제 에러 아이콘**
  높이 36→52, label이 입력 영역 안에서 floating. 에러 시 ⚠️ 아이콘 자동 동반 (WCAG 1.4.1).

  **Modal 24r + layer.surface, Toast 48h dark+blur**
  Dialog가 `--layer-surface` + 24px radius로 spec emphasis modal과 일치. Toast가 모든 variant 통일된 다크 글래스 표면(blur).

  **신규 lint 룰**
  `@polaris/state-color-with-icon` (warn) — `text-state-success/-warning/-error`가 아이콘 동반 없이 사용되면 경고 (WCAG 1.4.1).

  ### BREAKING vs rc.0

  - 모든 컴포넌트 radius +4px (md 8→12 등)
  - 다크 모드 hex 전면 변경
  - `display` 사이즈 60→40
  - Button 사이즈 명명 시프트 (`sm`→`xs`, `md`→`sm`, `lg`→`md`)
  - Input height 36→52, NovaInput 외형 유지
  - Modal 12r→24r
  - Toast 단색 surface → 다크 글래스 (variant 배경 없음)
  - `primary.*` (rc.0 alias) → `accentBrand.*`로 codemod 권장
  - `text-polaris-h{1..5}` → spec 이름으로 codemod 권장

### Patch Changes

- Updated dependencies
  - @polaris/ui@0.7.0-rc.1

## 0.7.0-rc.0

### Minor Changes

- v0.7.0 — Polaris Office Design System v1 (2026.05) 정렬

  디자인팀의 정식 정의서에 맞춰 토큰 명명·값·컴포넌트 스펙을 재정렬한 **breaking 릴리즈**입니다.

  전체 마이그레이션 가이드: [`docs/migration/v0.6-to-v0.7.md`](https://github.com/miles-hs-lee/PolarisDesign/blob/main/docs/migration/v0.6-to-v0.7.md)

  자동 codemod: `pnpm dlx @polaris/lint polaris-codemod-v07 --apply src`

  ### Highlights

  **브랜드 컬러 갱신**
  PO Blue · Sheet Green · Slide Orange · PDF Red · AI Purple — 5색 모두 hex 값이 정의서에 맞게 변경되었습니다 (예: `brand.primary` `#2B7FFF` → `#1D7FF9`).

  **9-step 컬러 램프 + 8-level radius**
  `bg-blue-50`, `text-purple-70`처럼 9단계 (5/10/20/30/40/50/60/70/80) 사용 가능. radius는 `2xs` (2) → `pill` (9999) 8단계로 확장. `md` 10→8, `lg` 14→12, `full`은 `pill`의 deprecated alias.

  **시맨틱 토큰 명명 변경**
  `text.*` → `label.*`, `surface.*` → `background.*` / `line.*`, `brand.secondary*` → `ai.*` 등. Tailwind 클래스도 동일 (`text-fg-primary` → `text-label-normal`). v0.6 이름은 alias로 계속 작동 — v0.8에서 제거 예정.

  **타이포그래피 H1–H5 + weight 700**
  `display` (60), `h1` (40) ~ `h5` (20) 헤딩 위계 추가. 모든 heading이 weight 600(SemiBold) → 700(Bold)으로 변경. `detail` (14/Medium), `meta` (12), `tiny` (10) 신설.

  **컴포넌트 스펙 정렬**

  - `<Button>`: 6 variants (`ai` 신규) × 3 sizes. 사이즈 한 단계씩 축소 (lg 48→40, md 40→32, sm 32→26).
  - `<Input>`: 36px 높이 + 1px PO Blue border + 3px outer glow focus 효과.
  - `<NovaInput>`: 단일행 알약 → 두 줄 컴포저 (12px radius, ai.pressed border, shadow-ai purple glow). `modelPill` prop 신설.

  **자동화 도구**

  - `polaris-codemod-v07` CLI (TS/TSX 토큰, Tailwind 클래스, CSS 변수 일괄 변환). `--check` 모드로 CI 통합 가능.
  - `shadow-polaris-ai` Tailwind 유틸리티 등록 (AI 표면용 보라 글로우).

  **시각 회귀 베이스라인**
  13개 라우트 × 2 viewport (desktop/mobile) — 26개 Playwright 베이스라인 모두 v0.7 비주얼로 갱신.

  ### BREAKING

  - 모든 heading의 weight: 600 → 700
  - `displayLg`: 48 → 60px
  - Button 사이즈 한 단계씩 축소
  - Input height: 40 → 36px
  - NovaInput 외형 (단일행 → 두 줄)
  - radius `md` 10 → 8, `lg` 14 → 12
  - 일부 deprecated alias (`text.primary` 등)는 계속 작동하지만 값이 v0.7 spec hex로 resolve됨 (예: `text.primary` → `#26282B`로 갱신, 이전엔 `#0B0B12`)

### Patch Changes

- Updated dependencies
  - @polaris/ui@0.7.0-rc.0

## 0.6.1

### Patch Changes

- v0.6.1 — ribbon polish, infra hardening, and design assets reference

  Ribbon (@polaris/ui/ribbon)

  - `RibbonSplitButton` no longer mounts a `DropdownMenu` when `disabled`,
    so the chevron half can't open the menu (Radix asChild + native
    disabled wasn't enough). Verified by a Vitest case in the new ribbon
    suite.
  - `RibbonContent` panel pinned to `min-h-20` (80px). Tabs that pair an
    `lg` button with a multi-row `sm` stack no longer change ribbon
    height when the active tab switches.
  - `overflow-x-auto overflow-y-clip` — kills the stray vertical
    scrollbar that the implicit `overflow-y: auto` would otherwise add.
  - Horizontal scrollbar visible on mobile (`<md`), hidden on desktop
    (Office pattern). `RibbonTabList` mirrors the same behavior.
  - `RibbonContent` honors `data-[state=inactive]:hidden` so inactive
    panels collapse to 0 height instead of claiming `py-1` padding.

  Tests (@polaris/ui)

  - 14 new component test files (Card / Input / Textarea / Toast /
    Tooltip / Select / Checkbox / Switch / Badge / Avatar / Alert /
    Pagination / NovaInput) plus first suites for `@polaris/ui/ribbon`
    and `@polaris/ui/form`. Coverage went from 17% to ~60%, total
    21 files / 82 tests.

  Tokens

  - `packages/ui/scripts/build-tokens.ts` is now the single source for
    `src/styles/tokens.css`. Hand-editing the CSS is blocked by a CI
    drift check. Includes color, radius, shadow, AND font-family
    variables — the latter was missed in the first generator pass and
    broke `font-polaris` / `font-polaris-mono` utilities until fixed.
  - `tokens.md` rewritten to match `tokens.ts` 1-for-1 (was missing
    status hover variants, `text.onStatus`, full spacing scale, dark
    shadow column, and used dotted names where the code uses camelCase).

  Demo

  - New `/#/assets` route under "시스템 레퍼런스" — surfaces Polaris's
    own logos, icons, and AI-model marks (sourced from
    `polink-static-contents.polarisoffice.com`) alongside a curated
    lucide-react grid. Goal: contributors check the existing brand
    assets before pulling in new lucide imports.
  - New `/#/tokens` route — replaces the static `swatches.html` with a
    React page that imports straight from `@polaris/ui/tokens`. Token
    changes show up automatically.
  - Polaris Office demo: top-bar action labels collapse responsively
    below md/lg, document title now `truncate`s. EditorChrome stays
    one row on phones.
  - vite.config aliases `@polaris/ui` and its subpaths directly to
    source so dev HMR no longer needs a separate tsup build between
    package edits.

  Infra (root + CI)

  - `@changesets/cli` introduced with all five workspace packages in a
    `fixed` group. Releases now run via `pnpm version` (no more sed-bumping
    six package.json files) + `scripts/sync-root-version.mjs` keeps the
    root pkg in lockstep too, with a CI `--check` step.
  - Playwright visual regression suite — desktop + mobile baselines for
    every demo route plus per-tab ribbon snapshots. 26 baseline PNGs
    committed; `pnpm test:e2e` is the diff gate, `pnpm test:e2e:update`
    refreshes after intentional changes.
  - Turbo `test` task now depends on `^build` AND `build` — no more
    race between a package's own build and its node:test reading
    `dist/`.
  - CI `pnpm changeset status` step uses `fetch-depth: 0` and the
    actual base ref (`github.base_ref`); fails loudly on ref errors
    instead of `|| true`-swallowing them.
  - `AGENTS.md` and plugin commands updated to use `pnpm lint` —
    `pnpm exec eslint .` was failing at the root because there's no
    eslint binary there. Leftover `/storybook/` links scrubbed.

  No public API was added or removed in this release — all changes are
  fixes, infra, or new demo routes. Bumping minor would have been
  defensible for the new test/visual/token-generator infra, but every
  behavior change is backward compatible, so going with patch.

- Updated dependencies
  - @polaris/ui@0.6.1
