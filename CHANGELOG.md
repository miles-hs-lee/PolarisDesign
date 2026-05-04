# Changelog

이 프로젝트의 주요 변경 사항을 기록합니다.

형식은 [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)을, 버전 규칙은 [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html)을 따릅니다.

---

## [Unreleased]

— 다음 릴리스에 들어갈 변경 사항을 여기에 누적하세요.

---

## [0.1.0] — 2026-05-04

사내 공개 alpha. 폴라리스오피스의 바이브코딩옵스에서 만들어지는 React/Next.js 웹 서비스가 **토큰·컴포넌트·린트·플러그인 한 묶음**으로 회사 단위 일관성을 자동 유지하도록 한다는 가설을 처음 외부 검증에 내놓는 버전. v0.0.x는 내부 실험이었고, 0.1.0부터 SemVer 약속이 시작됩니다.

### 추가됨 — `@polaris/ui` (디자인 시스템 자산)

**토큰 시스템**
- 브랜드 4색 팔레트 (파랑·초록·주황·빨강) + NOVA 보라 — 폴라리스 로고가 그대로 토큰
- 단일 소스 별칭: `brand.primary` ≡ `file.docx` ≡ `file.hwp` (한 곳 변경 → 자동 전파)
- 라이트/다크 페어 (수동 자동 반전 아님 — 명시적 페어로 정의)
- 12단계 뉴트럴 스케일, 7단계 타이포 스케일, 5단계 반경, 4단계 그림자
- 시맨틱 상태 토큰 (success/warning/danger/info)
- TypeScript export, CSS 변수, Tailwind preset 세 형태로 동시 노출

**컴포넌트 18개** (Radix UI 위에 폴라리스 토큰으로 스타일링)
- **Tier 0 (12개)** — Button, Input, Textarea, Card, Badge, Avatar, Dialog, Toast, Tabs, FileIcon, FileCard, NovaInput
- **Tier 1 (6개)** — DropdownMenu, Tooltip, Select, Sidebar, Navbar, PromptChip
- ⭐ 폴라리스 고유: FileIcon, FileCard, NovaInput, PromptChip
- Next.js RSC 호환을 위한 `'use client'` 디렉티브 자동 prepend
- Tailwind alpha 모디파이어(`bg-status-success/15`) 지원 — `color-mix()` 기반
- Badge에 `tone="subtle" | "solid"` 분리 — 사진/busy 배경 위 가독성

### 추가됨 — `@polaris/lint` (자동 검증)

ESLint 9 flat config 플러그인. 4가지 룰로 모델의 토큰 우회를 차단:
- `no-hardcoded-color` — hex / rgb / hsl / CSS named color (inline style)
- `no-arbitrary-tailwind` — `bg-[#xxx]`, `p-[13px]`, `font-['Inter']` 등
- `no-direct-font-family` — `font-family: ...` 직접 지정
- `prefer-polaris-component` — native `<button>/<input>/<textarea>/<select>/<dialog>`

**`polaris-audit` CLI** — `npx polaris-audit`로 기존 프로젝트의 비준수율 정량 측정. 위반 카운트, 룰별 분포, 자주 등장 hex / 임의값 top 10, 위반 많은 파일 top 10.

### 추가됨 — `polaris-design` (Claude Code 플러그인)

- **`polaris-web` 스킬** — 폴라리스 웹 서비스 작성 시 절차적 강제
- **4개 슬래시 커맨드**:
  - `/polaris-init <name>` — 새 프로젝트 부트스트랩
  - `/polaris-migrate` — 기존 코드 점진적 마이그레이션
  - `/polaris-check` — 현재 lint 검증
  - `/polaris-component <이름>` — 컴포넌트 사용/추가 가이드
- **PostToolUse 훅** — Edit/Write 발생 시 자동 lint, 위반 시 다음 턴 컨텍스트에 수정 가이드 주입. ESLint 미설정 프로젝트에는 1시간당 1회 안내.

### 추가됨 — 시작점 + 에이전트 호환

- **`packages/template-next`** — Next.js 15 (App Router) + 폴라리스 사전 통합 템플릿. ToastProvider/TooltipProvider/다크 토글/Pretendard 모두 wired. `AGENTS.md`가 함께 들어 있어 클론 후에도 에이전트 규칙 유지.
- **`AGENTS.md` (루트 + 템플릿)** — Codex / Cursor / 기타 비-Claude 에이전트용 절차. SKILL.md와 동일 규칙을 텍스트 가이드로.

### 추가됨 — 데모 + 카탈로그

GitHub Pages에 자동 배포 (https://miles-hs-lee.github.io/PolarisDesign/):
- **앱 셸** — 좌측 Sidebar + 상단 Navbar (DropdownMenu 사용자 메뉴 포함)
- **4개 라우트**: Home, NOVA 워크스페이스, CRM 계약 상세, Sign 계약서 목록
- **NOVA 워크스페이스** — 코스믹 그라데이션 hero + NovaInput + Select·Tooltip + 8개 폴라리스 기능 카드(실제 마케팅 이미지) + DropdownMenu별 응답
- **컴포넌트 카탈로그** — 18개 컴포넌트의 모든 variant·상태·조합
- **`/swatches.html`** — Phase 1 디자인 토큰 시각 시트
- **`/storybook/`** — Storybook 8 + 5개 핵심 스토리

### 추가됨 — 인프라

- **`.github/workflows/ci.yml`** — push/PR 시 모든 패키지·앱·템플릿의 lint·typecheck·test·build 자동 실행
- **`.github/workflows/deploy.yml`** — main push 시 데모 + Storybook을 결합해 GitHub Pages로 자동 배포
- **80개 테스트** 통과: `@polaris/ui` 21 (vitest 18 + node:test 3), `@polaris/lint` 42 (RuleTester), `@polaris/plugin` 17 (훅 smoke)
- **이미지 최적화 스크립트** — `pnpm --filter demo optimize-images` (sharp, 4.06 MB → 843 KB, 80% 감소)

### 핵심 결정

- **단일 소스 원칙** — 같은 색의 두 시맨틱이면 한쪽이 다른 쪽의 별칭 (참조 동일성)
- **`fg` namespace** — Tailwind class `text-fg-primary` (TS API는 `text.primary` 유지)
- **shadcn/ui 패턴 차용** — Radix primitives 위에 Tailwind + 토큰
- **`'use client'` banner** — 18개 컴포넌트 dist 전체에 일괄 적용

### 알려진 한계 (v0.1.0 시점)

- 🟡 **사내 npm 레지스트리 미결정** — 외부 클론(`npx tiged`) 후 `pnpm install`이 실패. 모노레포 내부에서만 즉시 동작.
- 🟡 **tokens.md hex 값 사인오프 대기** — 메인 사이트 추정값 사용 중 (`brand.blue: #2B7FFF` 등). 디자인 리드 확정 시 v0.1.x에서 교체.
- 🟡 **Pretendard 라이선스 사내 승인 대기** — SIL OFL 1.1, CDN 사용 중.
- ⚪ **Tier 2 컴포넌트 없음** — Table, Pagination, Breadcrumb 등 추후.
- ⚪ **시각 회귀 테스트 없음** — Playwright/Chromatic 미통합.
- ⚪ **파일럿 baseline 측정 미실시** — v0.1.x에서 신규 vs 기존 위반율 비교 예정.

---

[Unreleased]: https://github.com/miles-hs-lee/PolarisDesign/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/miles-hs-lee/PolarisDesign/releases/tag/v0.1.0
