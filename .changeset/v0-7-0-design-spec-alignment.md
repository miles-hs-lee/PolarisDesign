---
'@polaris/ui': minor
'@polaris/lint': minor
'@polaris/plugin': minor
'polaris-template-next': minor
'demo': minor
---

v0.7.0 — Polaris Office Design System v1 (2026.05) 정렬

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
