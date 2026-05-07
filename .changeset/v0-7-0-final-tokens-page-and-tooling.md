---
'@polaris/ui': minor
'@polaris/lint': minor
'@polaris/plugin': minor
'polaris-template-next': minor
'demo': minor
---

v0.7.0 — Tokens 페이지 재구성 + tooling fixes (Codex 리뷰 반영)

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
