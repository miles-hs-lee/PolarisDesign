# Polaris Design System

폴라리스오피스의 **바이브코딩옵스**(LLM 기반 웹 서비스 자동 생성 환경)에서 만들어지는 React/Next.js 서비스들이 회사 단위로 일관된 디자인을 갖도록 만드는 시스템입니다. 토큰·컴포넌트·린트·Claude Code 플러그인을 한 묶음으로 제공해서 모델이 우회할 수 있는 길을 줄이는 데 초점을 둡니다.

> 텍스트 가이드만 두면 모델 준수율이 낮아진다는 문제에서 출발했습니다. 권고가 아니라 **기본값 + 자동 차단** 구조로 바꿔서, 토큰을 쓰는 게 가장 쉬운 길이 되도록 만드는 게 목표입니다.

## Live demo

GitHub Pages: **https://miles-hs-lee.github.io/PolarisDesign/**

- `/` — 데모 인덱스
- `/#/components` — Tier 0 컴포넌트 12개
- `/#/crm/contract` — 폴라리스 영업관리 계약 상세 화면 예시
- `/#/sign/contracts` — 폴라리스 사인 계약서 목록 예시
- `/swatches.html` — 디자인 토큰 스와치 (라이트/다크 토글)

## Architecture

세 개의 패키지 + 데모 앱이 하나의 모노레포에 있습니다.

```
PolarisDesign/
├── packages/
│   ├── ui/      → @polaris/ui      — 토큰 + 컴포넌트
│   ├── lint/    → @polaris/lint    — ESLint 플러그인
│   └── plugin/  → polaris-design   — Claude Code 플러그인
├── apps/
│   └── demo/                       — Vite 기반 데모 / 예시 화면
└── tokens.md                       — Phase 1 디자인 토큰 사양 (v0.1)
```

### `@polaris/ui`

- **토큰** (`@polaris/ui/tokens`) — TypeScript export. `brand`, `fileType`, `status`, `neutral`, `surface`, `text`, `radius`, `shadow`, `textStyle`, `spacing`, `breakpoint`.
- **CSS 변수** (`@polaris/ui/styles/tokens.css`) — 라이트/다크 모드 페어. `[data-theme="dark"]`로 토글.
- **Tailwind preset** (`@polaris/ui/tailwind`) — `bg-brand-primary`, `text-text-on-brand`, `text-polaris-body-sm`, `rounded-polaris-md`, `shadow-polaris-sm` 같은 시맨틱 유틸리티 클래스 자동 등록.
- **Tier 0 컴포넌트 12개** — Button, Input, Textarea, Card, Badge, Avatar, Dialog, Toast, Tabs, FileIcon, FileCard, NovaInput. Radix UI 위에 폴라리스 토큰으로 스타일링.

### `@polaris/lint`

ESLint 9 플러그인. 모델이 토큰을 우회하는 가장 흔한 세 패턴을 차단합니다.

- `no-hardcoded-color` — `#fff`, `rgb(...)`, `hsl(...)` 등 직접 색상 금지
- `no-arbitrary-tailwind` — `bg-[#xxx]`, `p-[13px]` 등 임의값 금지
- `no-direct-font-family` — `font-family: ...`, `font-['Inter']` 등 직접 폰트 지정 금지

### Claude Code 플러그인 (`packages/plugin`)

- `polaris-web` 스킬 — 폴라리스 웹 서비스 작성 시 절차적 지시 (토큰만 쓰기, 컴포넌트 우선)
- 슬래시 커맨드:
  - `/polaris-init <name>` — 새 프로젝트 1줄 부트스트랩 (template-next 사용)
  - `/polaris-migrate` — 기존 코드 점진적 마이그레이션 (audit → fix → enforce)
  - `/polaris-check` — 현재 프로젝트 lint 검증
  - `/polaris-component <이름>` — 컴포넌트 사용/추가 가이드
- **PostToolUse 훅** — Edit/Write 발생 시 변경 파일에 자동 lint, 위반이 있으면 다음 턴 모델 컨텍스트에 수정 가이드 주입 (eslint 미설정 시 1시간 1회 안내)

### 템플릿 + 마이그레이션 도구

- **`packages/template-next`** — Next.js 15 (App Router) + 폴라리스 사전 통합 템플릿. `/polaris-init`이 가리키는 실제 코드.
- **`packages/lint/bin/polaris-audit.mjs`** — `npx polaris-audit`로 실행. 기존 프로젝트의 토큰 비준수율을 정량 측정.

## Quick start

### 새 프로젝트 (greenfield)

한 줄로 폴라리스 통합 Next.js 앱 생성:

```sh
npx -y tiged miles-hs-lee/PolarisDesign/packages/template-next my-app
cd my-app
pnpm install
pnpm dev
```

또는 Claude Code에서 `/polaris-init my-app` 슬래시커맨드.

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
    <div className="bg-surface-canvas text-text-primary p-6">
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

- 자산 레이어: 토큰을 import만 하면 자동 준수
- 시작점 레이어: `/polaris-init`이 새 프로젝트를 올바른 상태로 부트스트랩
- 검증 레이어: 린트 + PostToolUse 훅이 우회를 즉시 잡음

## 개발

```sh
# 의존성 설치 (Node 22+, pnpm 10)
pnpm install

# @polaris/ui 빌드
pnpm --filter @polaris/ui build

# 데모 dev 서버
pnpm --filter demo dev
# → http://localhost:5173/

# 린트 + 테스트
pnpm --filter @polaris/lint test    # ESLint 룰 단위 테스트 (28건)
pnpm --filter @polaris/plugin test  # PostToolUse 훅 스모크 (17건)
pnpm --filter demo lint             # 데모 코드 자기 검증 (위반 0건)
```

## 로드맵

- **현재 (v0.0.1)** — Tier 0 컴포넌트 12개, 강제 레이어 동작, 데모 + 예시 2종
- **다음** — 사내 npm 레지스트리 결정, 실제 바이브코딩옵스 파일럿에서 위반율 측정, Tier 1 컴포넌트(DropdownMenu, Tooltip, Sidebar, Navbar, PromptChip, Select) 확장

## License

내부용. 라이선스 정책은 별도 결정 예정.
