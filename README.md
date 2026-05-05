# Polaris Design System

폴라리스오피스의 **바이브코딩옵스**(LLM 기반 웹 서비스 자동 생성 환경)에서 만들어지는 React/Next.js 서비스들이 회사 단위로 일관된 디자인을 갖도록 만드는 시스템입니다. 토큰·컴포넌트·린트·Claude Code 플러그인을 한 묶음으로 제공해서 모델이 우회할 수 있는 길을 줄이는 데 초점을 둡니다.

> 텍스트 가이드만 두면 모델 준수율이 낮아진다는 문제에서 출발했습니다. 권고가 아니라 **기본값 + 자동 차단** 구조로 바꿔서, 토큰을 쓰는 게 가장 쉬운 길이 되도록 만드는 게 목표입니다.

## Live demo

GitHub Pages: **https://miles-hs-lee.github.io/PolarisDesign/**

데모는 좌측 Sidebar + 상단 Navbar의 앱 셸 위에 모든 라우트가 통합돼 있습니다:

- `/` — 데모 인덱스 (5 카드 + 아키텍처 요약)
- `/#/nova` — NOVA 워크스페이스 (AI 컨텍스트 시연: 코스믹 hero + NovaInput + Select·Tooltip + PromptChip + 8개 폴라리스 기능 카드 + DropdownMenu 별 응답)
- `/#/crm/contract` — 폴라리스 영업관리 계약 상세 (Card·Tabs·FileCard·Dialog·DropdownMenu)
- `/#/sign/contracts` — 폴라리스 사인 계약서 목록 (Stats·Filter chips·행별 DropdownMenu)
- `/#/polaris-office` — 폴라리스 오피스 워드 리본 재현 (Ribbon family — `@polaris/ui/ribbon`)
- `/#/components` — Tier 0 + Tier 1 + Tier 2 + Tier 2.5 + Tier 3 + Tier 4 컴포넌트 37개 카탈로그
- `/#/tokens` — 디자인 토큰 (색상 light/dark 페어, 타이포·반경·그림자) — `@polaris/ui/tokens`에서 자동 생성

상단 Navbar의 사용자 Avatar → DropdownMenu에서 라이트/다크 모드를 즉시 전환할 수 있습니다.

## Architecture

네 개의 패키지 + 데모 앱이 하나의 모노레포에 있습니다.

```
PolarisDesign/
├── packages/
│   ├── ui/             → @polaris/ui            — 토큰 + 37개 컴포넌트 + Ribbon family
│   ├── lint/           → @polaris/lint          — ESLint 플러그인 + polaris-audit CLI
│   ├── plugin/         → polaris-design         — Claude Code 플러그인
│   └── template-next/  → polaris-template-next  — Next.js 15 부트스트랩 템플릿 (AGENTS.md 동행)
├── apps/
│   └── demo/           — Vite 기반 데모 (Home/NOVA/CRM/Sign/Polaris Office + 컴포넌트 카탈로그 + 토큰 페이지)
├── AGENTS.md           — Codex / Cursor 등 비-Claude 에이전트용 절차
├── CHANGELOG.md        — 버전별 변경 사항 (Keep a Changelog 형식)
└── tokens.md           — Phase 1 디자인 토큰 사양
```

### `@polaris/ui`

- **토큰** (`@polaris/ui/tokens`) — TypeScript export. `brand`, `fileType`, `status`, `neutral`, `surface`, `text`, `radius`, `shadow`, `textStyle`, `spacing`, `breakpoint`.
- **CSS 변수** (`@polaris/ui/styles/tokens.css`) — 라이트/다크 모드 페어. `[data-theme="dark"]`로 토글.
- **Tailwind preset** (`@polaris/ui/tailwind`) — `bg-brand-primary`, `text-fg-on-brand`, `text-polaris-body-sm`, `rounded-polaris-md`, `shadow-polaris-sm` 같은 시맨틱 유틸리티 클래스 자동 등록.
- **컴포넌트 37개** — Radix UI 위에 폴라리스 토큰으로 스타일링.
  - **Tier 0 (12)**: Button, Input, Textarea, Card, Badge, Avatar, Dialog, Toast, Tabs, FileIcon, FileCard, NovaInput
  - **Tier 1 (6)**: DropdownMenu, Tooltip, Select, Sidebar, Navbar, PromptChip
  - **Tier 2 (7)**: Checkbox, Switch, Skeleton, Alert, Pagination, Breadcrumb, EmptyState
  - **Tier 2.5 (5)**: Stack/HStack/VStack, Container, Drawer, Table, DescriptionList — layout/structural
  - **Tier 3 (6)**: Form/FormField, Popover, Calendar, DatePicker/DateRangePicker, CommandPalette — form / date / overlay (Calendar·Command은 experimental). Form은 `@polaris/ui/form` subpath
  - **Tier 4 — Ribbon (subpath)**: `Ribbon` / `RibbonTabs` / `RibbonTabList` / `RibbonTab` / `RibbonContent` / `RibbonGroup` / `RibbonStack` / `RibbonRow` / `RibbonSeparator` / `RibbonRowDivider` / `RibbonButton` / `RibbonMenuButton` / `RibbonSplitButton` / `RibbonToggleGroup` / `RibbonToggleItem` — Office 도큐먼트, MD 에디터, 스프레드시트 등 에디터 제품 전용. `@polaris/ui/ribbon` (별도 subpath라 미사용 시 `@radix-ui/react-toggle-group` 의존성 0)

### `@polaris/lint`

ESLint 9 플러그인. 모델이 토큰을 우회하는 가장 흔한 4가지 패턴을 차단합니다.

- `no-hardcoded-color` — `#fff`, `rgb(...)`, `hsl(...)` 등 직접 색상 + inline style의 CSS named color (`style={{ color: 'red' }}`) 차단
- `no-arbitrary-tailwind` — `bg-[#xxx]`, `p-[13px]` 등 임의값 차단
- `no-direct-font-family` — `font-family: ...`, `font-['Inter']` 등 직접 폰트 지정 차단
- `prefer-polaris-component` — native `<button>`, `<input>`, `<textarea>`, `<select>`, `<dialog>`을 `@polaris/ui` 컴포넌트로 교체

추가로 **`npx polaris-audit`** CLI — 기존 프로젝트의 토큰 비준수율을 정량 측정 (위반 카운트, 자주 쓰이는 hex, 임의값, 위반 많은 파일).

### Claude Code 플러그인 (`packages/plugin`)

- `polaris-web` 스킬 — 폴라리스 웹 서비스 작성 시 절차적 지시 (토큰만 쓰기, 컴포넌트 우선)
- 슬래시 커맨드:
  - `/polaris-init <name>` — 새 프로젝트 1줄 부트스트랩 (template-next 사용)
  - `/polaris-migrate` — 기존 코드 점진적 마이그레이션 (audit → fix → enforce)
  - `/polaris-check` — 현재 프로젝트 lint 검증
  - `/polaris-component <이름>` — 컴포넌트 사용/추가 가이드
- **PostToolUse 훅** — Edit/Write 발생 시 변경 파일에 자동 lint, 위반이 있으면 다음 턴 모델 컨텍스트에 수정 가이드 주입 (eslint 미설정 시 1시간 1회 안내)

### 템플릿 + 마이그레이션 도구

- **`packages/template-next`** — Next.js 15 (App Router) + 폴라리스 사전 통합 템플릿. `/polaris-init`이 가리키는 실제 코드. `AGENTS.md`가 함께 들어 있어 클론 후에도 에이전트 규칙이 유지됨.
- **`packages/lint/bin/polaris-audit.mjs`** — `npx polaris-audit`로 실행. 기존 프로젝트의 토큰 비준수율을 정량 측정.

### 에이전트 호환

- **Claude Code** — `packages/plugin`의 SKILL + 슬래시커맨드 + PostToolUse 훅으로 자동 강제.
- **Codex / Cursor / 기타** — 루트 [`AGENTS.md`](AGENTS.md)에 같은 절차를 텍스트 가이드로 제공. 작업 종료 전 `pnpm exec eslint .`을 직접 실행하도록 명시. 템플릿에서 시작한 새 앱은 [`packages/template-next/AGENTS.md`](packages/template-next/AGENTS.md)를 함께 가져감.

## Quick start

### 새 프로젝트 (greenfield)

> ⚠️ **현재 한계 — 사내 npm 레지스트리 publish 전까지 외부 클론은 install이 실패합니다.**
> 템플릿이 `@polaris/ui`/`@polaris/lint`를 `workspace:*`로 참조하므로 모노레포 외부에서 `pnpm install`이 패키지를 못 찾습니다. 자세한 경로 안내는 [`packages/template-next/README.md`](packages/template-next/README.md) 참조. 그 전까지는 아래 두 경로 중 하나로 시작하세요:

**경로 A — 모노레포 안에서 작업 (현재 권장)**

```sh
git clone https://github.com/miles-hs-lee/PolarisDesign.git
cd PolarisDesign
pnpm install
pnpm --filter polaris-template-next dev
# → http://localhost:3000 — 그대로 본인 앱으로 발전시키거나 packages/ 또는 apps/ 아래 새 디렉터리로 복사
```

**경로 B — `@polaris/ui` publish 이후 (미래)**

```sh
npx -y tiged miles-hs-lee/PolarisDesign/packages/template-next my-app
cd my-app
# package.json의 "@polaris/ui": "workspace:*"를 실제 버전으로 교체
pnpm install
pnpm dev
```

또는 Claude Code에서 `/polaris-init my-app` 슬래시커맨드 — 위 두 경로 중 적절한 쪽을 안내.

### 기존 프로젝트 온보딩 (migration)

먼저 진단:

```sh
npx polaris-audit
```

위반 카운트, 자주 쓰이는 hex 컬러, 임의 Tailwind 값, 위반 많은 파일 등을 한 번에 보여줍니다. 마이그레이션 절차는 Claude Code의 `/polaris-migrate` 슬래시커맨드가 단계별로 안내합니다.

### 수동 셋업

기존 코드에 직접 추가하려면:

```sh
pnpm add @polaris/ui @polaris/lint
pnpm add -D tailwindcss postcss autoprefixer eslint
```

`tailwind.config.ts`:

```ts
import polarisPreset from '@polaris/ui/tailwind';
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  presets: [polarisPreset],
} satisfies Config;
```

`eslint.config.mjs`:

```js
import polaris from '@polaris/lint';

export default [...polaris.configs.recommended];
```

앱 진입점:

```ts
import '@polaris/ui/styles/tokens.css';
```

사용:

```tsx
import { Button, FileCard, NovaInput } from '@polaris/ui';

export function Page() {
  return (
    <div className="bg-surface-canvas text-fg-primary p-6">
      <Button>새 문서</Button>
      <NovaInput onSubmit={(v) => console.log(v)} />
      <FileCard type="docx" name="보고서.docx" meta="방금 전" />
    </div>
  );
}
```

## 핵심 원칙

### 4색 + NOVA = 브랜드 아이덴티티

폴라리스 로고가 4색(파랑·초록·주황·빨강)을 조합한 형태이고, 각 색은 동시에 파일 타입(DOCX·XLSX·PPTX·PDF)을 표상합니다. 토큰 시스템에서도 분리하지 않고 별칭으로 묶었습니다 — `brand.primary` ≡ `file.docx` ≡ `file.hwp` 모두 같은 hex. 한 곳을 바꾸면 자동 전파됩니다. NOVA 보라(`brand.secondary`)는 AI/생성 컨텍스트 전용입니다.

### 권고 → 기본값 + 자동 차단

- **자산 레이어**: 토큰을 import만 하면 자동 준수
- **시작점 레이어**: `/polaris-init` + `template-next`로 새 프로젝트가 처음부터 정렬
- **검증 레이어**: 린트 + PostToolUse 훅이 우회를 즉시 잡음
- **온보딩 레이어**: `/polaris-migrate` + `polaris-audit`로 기존 코드도 점진적 정렬

## 개발

```sh
# 의존성 설치 (Node 22+, pnpm 10)
pnpm install

# 패키지 빌드 (lint는 ui dist를 import하므로 ui 먼저)
pnpm --filter @polaris/ui build
pnpm --filter @polaris/lint build

# 데모 dev 서버 — `@polaris/ui`를 source로 alias하므로
# ui 변경 시 별도 빌드 없이 즉시 HMR 반영됨 (vite.config.ts).
pnpm --filter demo dev
# → http://localhost:5173/

# 템플릿 직접 검증
pnpm --filter polaris-template-next dev
# → http://localhost:3000/

# 변경 사항 기록 (PR 작성 시)
# 사용자에게 영향 있는 변경이면 PR에 같이 commit. 자세히 → .changeset/README.md
pnpm changeset

# 릴리스 (changeset이 모인 후 main에서)
pnpm version    # 모든 fixed 패키지 자동 bump + CHANGELOG.md 갱신
# → 검토 후 commit + tag + push

# 린트 + 단위 테스트
pnpm --filter @polaris/ui test    # 컴포넌트 + ribbon + form + cn() 테스트 (~85건)
pnpm --filter @polaris/lint test   # ESLint 룰 단위 테스트 (42건)
pnpm --filter @polaris/plugin test # PostToolUse 훅 스모크 (17건)
pnpm --filter demo lint            # 데모 코드 자기 검증 (위반 0건)
pnpm -r typecheck                  # 모든 패키지 typecheck

# 시각 회귀 테스트 (Playwright)
pnpm test:e2e                  # baseline과 비교, 실패 시 diff HTML report
pnpm test:e2e:update           # 의도적 시각 변경 시 baseline 갱신
pnpm test:e2e:report           # 마지막 실행 report 열기
# baseline은 e2e/__screenshots__/ 에 OS별로 분리 저장됨 (darwin / linux 별도)

# 전체 — CI에서 동일하게 실행
pnpm install --frozen-lockfile
pnpm --filter @polaris/ui build && pnpm --filter @polaris/lint build
pnpm -r typecheck
pnpm --filter @polaris/ui test && pnpm --filter @polaris/lint test && pnpm --filter @polaris/plugin test
pnpm --filter demo lint && pnpm --filter polaris-template-next lint
pnpm --filter demo build && pnpm --filter polaris-template-next build
```

CI 워크플로우는 `.github/workflows/ci.yml` 참조. 배포는 `.github/workflows/deploy.yml`이 main push 시 GitHub Pages로 데모를 자동 푸시합니다.

## 로드맵

- **v0.1.0** — 토큰 + 18개 컴포넌트, 4 lint 룰, Claude Code 플러그인, NOVA 워크스페이스 + CRM/Sign 예시, 템플릿, polaris-audit, AGENTS.md, CHANGELOG
- **v0.2.0** — Tier 2 컴포넌트 7개(Checkbox/Switch/Skeleton/Alert/Pagination/Breadcrumb/EmptyState), Toast `useToast`/`<Toaster>` imperative API, Card `asChild`, lint false-positive 보정, SSR-safe theme toggle, status hover/on-status 색상 토큰, Tailwind v4 임시 가이드
- **v0.2.1** — focus 링 비대칭 fix (`ring`+`ring-offset` → 네이티브 `outline`+`outline-offset`)
- **v0.3.0** — Tier 2.5 컴포넌트 5개(Stack/Container/Drawer/Table/DescriptionList), DropdownMenuFormItem, Pagination/Card/Checkbox/EmptyState API 보강, 5건 docs
- **v0.4.x (현재)** — Tailwind v4 네이티브 preset, Form/FormField (RHF + zod), Calendar/DatePicker/Command (experimental), Popover, 사내 npm 레지스트리 publish, tokens.md hex 사인오프, 파일럿 위반율 측정 baseline
- **v0.5.0** — Ribbon 컴포넌트 family (subpath `@polaris/ui/ribbon`) — Office 도큐먼트·MD 에디터·스프레드시트·PDF 등 에디터 제품용. Tabs/Groups/Separator/Button(sm/md/lg)/SplitButton/ToggleGroup 합성
- **v0.6.0 (현재)** — Ribbon 정비: `RibbonMenuButton`/`RibbonRowDivider` 추가, lg vertical split, scrollbar 숨김으로 panel 높이 통일, disabled split의 menu trigger도 차단, icon-only 버튼 aria-label 자동 fallback. PolarisOffice 데모 탭별 컴포넌트 분리. Storybook 제거 → 컴포넌트 카탈로그(SPA) + `/tokens` 라우트로 통일. demo vite alias로 ui source 직접 import (별도 빌드 없이 HMR)
- **v0.6.x+** — DataTable, Combobox, NumberInput, AvatarGroup, Slider, CodeBlock, experimental 컴포넌트 안정화. 자세히 → [docs/roadmap.md](docs/roadmap.md)
- **v1.0** — Badge variant BREAKING, Pretendard local, 시각 회귀 테스트, 사인오프

## License

사내용 — `Polaris Office`.  외부 공개 시 라이선스 정책 별도 결정 예정.
