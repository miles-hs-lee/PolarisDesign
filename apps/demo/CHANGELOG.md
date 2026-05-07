# demo

## 0.7.0

### Minor Changes

- a28259b: v0.7.0 — Polaris Office Design System v1 (2026.05) 정렬

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

- 0a6e548: v0.7.0 — Tokens 페이지 재구성 + tooling fixes (Codex 리뷰 반영)

  마지막 RC 위에 추가된 마무리 변경 묶음. 외부 사용자에게 영향이 없는 내부/문서/도구 정비가 대부분이라 별도 RC 없이 0.7.0에 그대로 합산.

  ### 데모 Tokens 페이지 재구성

  `/tokens` 페이지가 v0.7-rc.2 토큰 시스템의 ~30% 만 보여주던 문제를 수정. C-base 자동 iterate + B-reinforcement 비-컬러 섹션:

  - **C-base**: `@polaris/ui/tokens.colors` 에서 색상 그룹 자동 iterate. 13 섹션 / ~150 swatch. 새 토큰 그룹이 추가되어도 자동 반영.
  - **B-reinforcement**: Spacing (12 named) / Radius (8 with samples) / Shadow (5 incl. ai glow) / Motion (duration × 4 + easing × 3 hover demo) / Z-index (6 use-case 표) / Breakpoint 명시 섹션.
  - **figma-spec PNG inline**: 각 섹션의 헤더에 `<details>` 로 디자인 정의서 PNG 첨부. `apps/demo/public/figma-spec/` 으로 자동 sync (`predev`/`prebuild` 훅이 `assets/figma-spec/` 에서 복사).

  ### Tooling fixes

  - **root version sync** — `node scripts/sync-root-version.mjs` 가 CI에서 항상 통과하도록 정리. `pnpm version` 흐름에서 자동 실행됨.
  - **demo / template-next prep:ui** — clean clone에서 `pnpm install` → `dev` 까지 무중단 실행되도록 `gen:ui-sources` (=`@polaris/ui gen:sources`) + `prep:ui` (=`@polaris/ui build`) 훅 추가. PostCSS / Tailwind 가 dist 를 요구하는 케이스도 처리.
  - **@polaris/ui prepare hook** — pnpm install 시 자동으로 `gen:sources` 가 실행되어 generated icon / file-icon / logo 소스가 항상 존재. 외부 git URL 설치도 동일.
  - **demo tsconfig paths** — Vite `resolve.alias` 와 동일한 경로를 tsconfig 에 미러링. dist 없이 source 기반 typecheck 가능.
  - **demo Vite alias** — 신규 subpath 3개 (`@polaris/ui/icons`, `/file-icons`, `/logos`) 추가. dev 시 source HMR 작동.

  ### 가이드 문서 v0.7 갱신

  - **`packages/plugin/skills/polaris-web/SKILL.md`** — 토큰 컬러 표를 v0.7 spec 명명으로 재작성 (`label.*` / `background.*` / `layer.*` / `accentBrand.*` / `state.*` / `ai.*`). Ribbon / icons / file-icons / logos import 예시 추가.
  - **`AGENTS.md`** (root) + **`packages/template-next/AGENTS.md`** — 동일 기준으로 갱신.
  - **`packages/ui/README.md`** — Tailwind class 표를 v0.7 spec 으로 교체. icons / file-icons / logos subpath 사용 예시 추가.
  - **루트 `README.md`** — `/icons` 데모 라우트 추가, v0.7 highlights 섹션 신설, Quick start 에 prep:ui 단계 명시.
  - **마이그레이션 가이드** — `v0.6-to-v0.7-rc.1.md` → `v0.6-to-v0.7.md` rename, rc.2 자산 통합 섹션 (3.10/3.11) 추가, codemod 적용 범위 메모 (`@polaris/ui` 자체 소스는 제외).

- 7100ee0: v0.7.0-rc.1 — DESIGN.md + primitive-color-palette 완전 정렬

  rc.0 출시 후 디자인팀의 더 상세한 정의서(`DESIGN.md` + `primitive-color-palette.html`)를 받아 9단계 reconciliation 수행. 사용자 피드백 단계 전이라 alias 부담 없이 spec 완전 정렬.

  마이그레이션: [`docs/migration/v0.6-to-v0.7.md`](https://github.com/miles-hs-lee/PolarisDesign/blob/main/docs/migration/v0.6-to-v0.7.md)
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

- 068f25c: v0.7.0-rc.2 — 디자인팀 자산 통합 (UI 아이콘 65종 × 3 사이즈, 파일 아이콘 29종, 로고 컴포넌트)

  디자인팀 Figma 출처 SVG 자산을 빌드 파이프라인을 통해 React 컴포넌트로 자동 변환. v0.7.0-rc.1 위에 4개의 신규 시스템 추가:

  ### 새 entry point 3개

  ```ts
  import {
    ArrowDownIcon,
    ChevronRightIcon,
    SearchIcon,
  } from "@polaris/ui/icons";
  import { DocxIcon, FolderIcon, ZipIcon } from "@polaris/ui/file-icons";
  import { PolarisLogo, NovaLogo } from "@polaris/ui/logos";
  ```

  - **`@polaris/ui/icons`** — 65 monochrome UI 아이콘 × 3 사이즈 (18/24/32 px). 디자이너가 그리드별로 hand-tune 한 path를 모두 보존. `size` prop은 임의 px 받음 (16, 28 등도 OK — 자동으로 가장 가까운 그리드 SVG 선택). stroke `#454C53` → `currentColor` 자동 변환되어 Tailwind `text-{token}`으로 색 제어.
  - **`@polaris/ui/file-icons`** — 29 multi-color 파일 타입 아이콘 (docx, xlsx, pptx, pdf 외 folder, image, video, zip, music, voc, my-template, note-pnt, app-\* 등). 32px 마스터 + size prop 으로 균등 스케일.
  - **`@polaris/ui/logos`** — `PolarisLogo` (horizontal/symbol/favicon × default/negative) + `NovaLogo` (default/white).

  ### 빌드 파이프라인

  ```
  assets/svg/{icons,file-icons,logos}/  →  packages/ui/src/{icons,file-icons,logos}/  (gitignored)
  ```

  새 스크립트:

  - `pnpm normalize:icons` — Figma 자동 export 이름 (`Type=Arrow-Down, Size=18.svg`) → kebab-case (`arrow-down.svg`) 정규화. idempotent.
  - `pnpm build:icons` / `:file-icons` / `:logos` — SVG → React 컴포넌트 생성

  ### BREAKING

  - **`<FileIcon>` 완전 교체.** rc.1까지의 색깔 사각형 + 글자 표시는 사라지고 디자인팀 실제 SVG 사용. 5타입 → 29타입 확장. `size` prop은 t-shirt (`'sm'|'md'|'lg'`) 대신 px (`number`).
  - **`@polaris/ui` 내부 lucide-react → polaris 아이콘 교체** (있는 것만): `X`/`Send`/`Search`/`Check`/`Minus`/`ChevronDown/Up/Left/Right`/`AlertCircle` → polaris 컴포넌트. 없는 것만 (Bold/Italic/MoreHorizontal/CalendarIcon/Sparkles/Loader2/Inbox 등) lucide 유지.

  ### 신규 lint 룰

  `@polaris/prefer-polaris-icon` (warn) — `lucide-react` import 시 폴라리스에 대응 아이콘 있으면 권장. 데모에서 95개 warning 감지 (점진적 마이그레이션).

  ### 데모

  새 페이지 `/icons` — 65 UI 아이콘 검색 가능, 사이즈별 비교, 파일 아이콘 29종, 로고 4종. visual baseline 추가 (28개 → 30개).

  ### 디렉토리 정리

  ```
  assets/
  ├── README.md                            # 갱신 절차 문서화
  ├── figma-spec/                          # was figma_PDS
  │   ├── foundation/                      # color · grid · radius · typography
  │   ├── theme/                           # iconography
  │   └── components/                      # 13 컴포넌트 spec PNG
  └── svg/                                 # was image_assets
      ├── icons/{18,24,32}/                # 65 × 3 = 195 SVG
      ├── file-icons/32/                   # 29 SVG
      └── logos/{polaris-office,nova}/
  ```

  모든 파일명 kebab-case 영문 (한국어 `가로.svg` → `horizontal.svg`, Figma `Type=...` 자동 정규화).

  ### DESIGN.md 갱신

  각 섹션에 figma-spec PNG 인라인 추가 (Color / Typography / Grid / Radius / Iconography / Button / Input). Iconography 섹션 신설.

  ### 검증

  - pnpm -r build ✓ (8 entries)
  - pnpm --filter @polaris/ui test ✓ (84 tests)
  - pnpm --filter @polaris/lint test ✓ (50 + 11 codemod)
  - pnpm --filter demo build ✓
  - pnpm exec playwright test ✓ (30 baselines)
  - pnpm -w lint ✓ (errors: 0; warns: 95 lucide migration suggestions)

### Patch Changes

- Updated dependencies [a28259b]
- Updated dependencies [0a6e548]
- Updated dependencies [7100ee0]
- Updated dependencies [068f25c]
  - @polaris/ui@0.7.0

## 0.7.0-rc.2

### Minor Changes

- v0.7.0-rc.2 — 디자인팀 자산 통합 (UI 아이콘 65종 × 3 사이즈, 파일 아이콘 29종, 로고 컴포넌트)

  디자인팀 Figma 출처 SVG 자산을 빌드 파이프라인을 통해 React 컴포넌트로 자동 변환. v0.7.0-rc.1 위에 4개의 신규 시스템 추가:

  ### 새 entry point 3개

  ```ts
  import {
    ArrowDownIcon,
    ChevronRightIcon,
    SearchIcon,
  } from "@polaris/ui/icons";
  import { DocxIcon, FolderIcon, ZipIcon } from "@polaris/ui/file-icons";
  import { PolarisLogo, NovaLogo } from "@polaris/ui/logos";
  ```

  - **`@polaris/ui/icons`** — 65 monochrome UI 아이콘 × 3 사이즈 (18/24/32 px). 디자이너가 그리드별로 hand-tune 한 path를 모두 보존. `size` prop은 임의 px 받음 (16, 28 등도 OK — 자동으로 가장 가까운 그리드 SVG 선택). stroke `#454C53` → `currentColor` 자동 변환되어 Tailwind `text-{token}`으로 색 제어.
  - **`@polaris/ui/file-icons`** — 29 multi-color 파일 타입 아이콘 (docx, xlsx, pptx, pdf 외 folder, image, video, zip, music, voc, my-template, note-pnt, app-\* 등). 32px 마스터 + size prop 으로 균등 스케일.
  - **`@polaris/ui/logos`** — `PolarisLogo` (horizontal/symbol/favicon × default/negative) + `NovaLogo` (default/white).

  ### 빌드 파이프라인

  ```
  assets/svg/{icons,file-icons,logos}/  →  packages/ui/src/{icons,file-icons,logos}/  (gitignored)
  ```

  새 스크립트:

  - `pnpm normalize:icons` — Figma 자동 export 이름 (`Type=Arrow-Down, Size=18.svg`) → kebab-case (`arrow-down.svg`) 정규화. idempotent.
  - `pnpm build:icons` / `:file-icons` / `:logos` — SVG → React 컴포넌트 생성

  ### BREAKING

  - **`<FileIcon>` 완전 교체.** rc.1까지의 색깔 사각형 + 글자 표시는 사라지고 디자인팀 실제 SVG 사용. 5타입 → 29타입 확장. `size` prop은 t-shirt (`'sm'|'md'|'lg'`) 대신 px (`number`).
  - **`@polaris/ui` 내부 lucide-react → polaris 아이콘 교체** (있는 것만): `X`/`Send`/`Search`/`Check`/`Minus`/`ChevronDown/Up/Left/Right`/`AlertCircle` → polaris 컴포넌트. 없는 것만 (Bold/Italic/MoreHorizontal/CalendarIcon/Sparkles/Loader2/Inbox 등) lucide 유지.

  ### 신규 lint 룰

  `@polaris/prefer-polaris-icon` (warn) — `lucide-react` import 시 폴라리스에 대응 아이콘 있으면 권장. 데모에서 95개 warning 감지 (점진적 마이그레이션).

  ### 데모

  새 페이지 `/icons` — 65 UI 아이콘 검색 가능, 사이즈별 비교, 파일 아이콘 29종, 로고 4종. visual baseline 추가 (28개 → 30개).

  ### 디렉토리 정리

  ```
  assets/
  ├── README.md                            # 갱신 절차 문서화
  ├── figma-spec/                          # was figma_PDS
  │   ├── foundation/                      # color · grid · radius · typography
  │   ├── theme/                           # iconography
  │   └── components/                      # 13 컴포넌트 spec PNG
  └── svg/                                 # was image_assets
      ├── icons/{18,24,32}/                # 65 × 3 = 195 SVG
      ├── file-icons/32/                   # 29 SVG
      └── logos/{polaris-office,nova}/
  ```

  모든 파일명 kebab-case 영문 (한국어 `가로.svg` → `horizontal.svg`, Figma `Type=...` 자동 정규화).

  ### DESIGN.md 갱신

  각 섹션에 figma-spec PNG 인라인 추가 (Color / Typography / Grid / Radius / Iconography / Button / Input). Iconography 섹션 신설.

  ### 검증

  - pnpm -r build ✓ (8 entries)
  - pnpm --filter @polaris/ui test ✓ (84 tests)
  - pnpm --filter @polaris/lint test ✓ (50 + 11 codemod)
  - pnpm --filter demo build ✓
  - pnpm exec playwright test ✓ (30 baselines)
  - pnpm -w lint ✓ (errors: 0; warns: 95 lucide migration suggestions)

### Patch Changes

- Updated dependencies
  - @polaris/ui@0.7.0-rc.2

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
