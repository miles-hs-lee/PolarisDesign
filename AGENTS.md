# Agent instructions — Polaris Design System

이 파일은 **Codex / Cursor / 기타 코드 에이전트**가 이 프로젝트(또는 이 프로젝트의 디자인 시스템을 적용하는 다른 프로젝트)에서 작업할 때 따라야 할 절차를 담습니다. Claude Code는 같은 내용을 [`packages/plugin/skills/polaris-web/SKILL.md`](packages/plugin/skills/polaris-web/SKILL.md)와 PostToolUse 훅으로 강제하지만, 다른 에이전트는 이 파일을 읽고 자가 강제해야 합니다.

## 0. 시작 전 — DESIGN.md를 1차 spec으로 읽기

작업 시작 전에 다음 두 파일이 있으면 **반드시** 먼저 읽으세요:

1. **시스템 spec (auto-generated)** — 저장소 루트의 [`DESIGN.md`](DESIGN.md). 폴라리스 시스템의 토큰·타이포·컴포넌트 표준이 [Stitch DESIGN.md 형식](https://stitch.withgoogle.com/docs/design-md/specification/)으로 정의되어 있습니다. YAML front matter는 기계가 읽고 prose는 사람이 읽지만, 에이전트는 **둘 다** 읽어야 합니다.
2. **제품 spec (있으면)** — 작업 중인 프로젝트 root의 `DESIGN.md`. 그 제품 고유의 컴포넌트·색상·레이아웃 결정이 적혀 있습니다 (예: [`packages/template-next/DESIGN.md`](packages/template-next/DESIGN.md)).

규칙:
- DESIGN.md의 토큰 값과 prose 가이드는 **권장이 아니라 spec**입니다. 우회하려면 사용자에게 확인.
- 제품 DESIGN.md의 토큰 reference(`{polaris.colors.primary}` 등)는 시스템 DESIGN.md의 토큰을 가리킵니다. 두 파일은 함께 읽어야 의미가 완성됩니다.
- 시스템 DESIGN.md는 `tokens.ts`에서 자동 생성되므로 직접 편집하지 마세요. 토큰을 바꿔야 하면 `packages/ui/src/tokens/*.ts`를 수정 후 `pnpm --filter @polaris/ui build:design-md`.

## 어떤 프로젝트에서 적용되나

**Polaris Office 웹 서비스**(React/Next.js 앱)를 만들거나 수정할 때만 이 규칙을 따릅니다. 무관한 React 프로젝트에는 적용하지 마세요.

판단 기준:
- `package.json`에 `@polaris/ui` 또는 `@polaris/lint`가 의존성으로 있으면 적용
- `eslint.config.*`에 `@polaris/lint`가 있으면 적용
- 위 둘 다 없는데 사용자가 "폴라리스 디자인 시스템 적용" 등을 요청하면 적용

## 핵심 규칙

### 1. UI 요소는 `@polaris/ui` 우선

```ts
import {
  // Tier 0 (12) — basic blocks
  Button, Input, Textarea, Card, Badge, Avatar, Dialog, Toast, Tabs,
  FileIcon, FileCard, NovaInput,
  // Tier 1 (6) — shell + menus
  DropdownMenu, Tooltip, Select, Sidebar, Navbar, PromptChip,
  // Tier 2 (7) — auxiliary UI
  Checkbox, Switch, Skeleton, Alert, Pagination, Breadcrumb, EmptyState,
  // Tier 2.5 (5) — layout / structural
  Stack, HStack, VStack, Container, Drawer, Table, DescriptionList,
  // Tier 3 — date / overlay / command (Calendar · Command은 experimental)
  Popover, Calendar, DatePicker, DateRangePicker,
  CommandDialog, CommandInput, CommandList, CommandGroup, CommandItem,
  // Server-action friendly
  DropdownMenuFormItem,
  // Toast imperative API
  Toaster, useToast, toast,
} from '@polaris/ui';

// Form/FormField는 react-hook-form 의존이므로 subpath:
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage,
} from '@polaris/ui/form';

// 에디터 / 도큐먼트 제품(MS Office 스타일 리본 + MD 에디터 등):
import {
  Ribbon, RibbonTabs, RibbonTabList, RibbonTab, RibbonContent,
  RibbonGroup, RibbonStack, RibbonRow,
  RibbonSeparator, RibbonRowDivider,
  RibbonButton, RibbonMenuButton, RibbonSplitButton,
  RibbonToggleGroup, RibbonToggleItem,
} from '@polaris/ui/ribbon';
```

native `<button>`, `<input>`, `<textarea>`, `<select>`, `<dialog>`은 **feature 코드에서 금지**. ESLint 룰 `@polaris/prefer-polaris-component`가 차단합니다 (단, `<button type="submit">`는 form-control 패턴이라 허용).

### 2. 색상은 토큰만

| 사용처 | 권장 |
|---|---|
| Tailwind 클래스 | `bg-brand-primary`, `text-fg-primary`, `border-surface-border`, `bg-status-danger`, `text-file-pdf`, `bg-neutral-100` |
| CSS 변수 | `var(--polaris-brand-primary)`, `var(--polaris-text-primary)` |
| TS 토큰 | `import { brand, status, fileType } from '@polaris/ui/tokens';` |

**금지**:
- hex/rgb/hsl 직접 사용 (`#fff`, `rgb(...)`, `hsl(...)`)
- inline style의 CSS named color (`style={{ color: 'red' }}`)
- Tailwind 임의값 (`bg-[#fff]`, `text-[red]`, `border-[#ccc]`)

### 3. AI / NOVA 컨텍스트는 `brand-secondary` (보라)

- AI 기능(생성/요약/자동완성/NOVA 진입점) → `bg-brand-secondary`, `text-brand-secondary`
- 일반 기능 → `bg-brand-primary`, `text-brand-primary`
- 같은 화면에서 둘을 섞지 마세요

### 4. 파일 타입 색상은 파일 표상 컨텍스트 전용

- DOCX/HWP → `text-file-docx`, `bg-file-docx` (파랑)
- XLSX → `text-file-xlsx` (초록)
- PPTX → `text-file-pptx` (주황)
- PDF → `text-file-pdf` (빨강)

차트나 일반 데이터 시각화에 차용 금지.

### 5. 타이포그래피

- 패밀리: `font-polaris` (Tailwind) 또는 `var(--polaris-font-sans)` (CSS)
- 스케일: `text-polaris-display-lg`, `text-polaris-heading-md`, `text-polaris-body-lg`, `text-polaris-caption`
- `font-family: ...` 직접 지정 금지
- `font-['Inter']` Tailwind 임의값 금지

### 6. 스페이싱·반경·그림자

- 스페이싱: Tailwind 기본 (`p-4`, `m-6`, `gap-2`). `p-[13px]` 같은 임의값 금지
- 반경: `rounded-polaris-sm/md/lg/xl/full`
- 그림자: `shadow-polaris-xs/sm/md/lg`

### 7. 마침 검증

작업을 완료로 보고하기 전에 반드시:

```sh
pnpm lint
```

(폴라리스 모노레포는 root에 eslint 바이너리가 없으므로 `pnpm exec eslint .`은 실패합니다 — 항상 `pnpm lint` 또는 `pnpm --filter <pkg> lint`를 사용하세요.)

위반이 있으면 **모두 수정한 후** 보고. 자동 수정 가능한 것은 패키지 단위로:

```sh
pnpm --filter <pkg> lint --fix
```

## 새 프로젝트를 만들 때

`@polaris/ui`가 사내 npm 레지스트리에 publish된 후라면:

```sh
npx -y tiged miles-hs-lee/PolarisDesign/packages/template-next my-app
cd my-app
pnpm install
pnpm dev
```

publish 전이라면 모노레포 내부에서 `apps/` 또는 `packages/` 아래에 새 디렉터리를 추가하고 workspace 의존성으로 작업하세요.

## 기존 프로젝트를 폴라리스로 마이그레이션

진단 → 자동 수정 → 페이지 단위 수동 수정 → 강제 전환 순서:

```sh
# 1. 진단: 어디에 얼마나 위반이 있는지
npx polaris-audit

# 2. 자동 수정 가능한 항목 처리 (대상 프로젝트의 lint 스크립트로)
pnpm lint --fix

# 3. 남은 위반은 페이지 단위로 토큰으로 교체
#    - hex → var(--polaris-*) 또는 bg-brand-* 클래스
#    - 임의값 → 토큰 기반 클래스
#    - native HTML → @polaris/ui 컴포넌트

# 4. 0건 달성 후 lint를 CI에 추가
```

자세한 절차는 [`packages/plugin/commands/polaris-migrate.md`](packages/plugin/commands/polaris-migrate.md) 참고.

## 안티 패턴 — 절대 하지 말 것

- "사용자가 #FF5500을 언급했으니 그대로 박자" → ❌. 가까운 토큰을 사용하거나, 없으면 사용자에게 토큰 추가 여부 확인.
- "shadcn/MUI에 비슷한 게 있으니 가져다 쓰자" → ❌. `@polaris/ui`에 없으면 토큰만 써서 인라인 구현.
- "lint 룰을 disable로 우회하자" → ❌. 룰을 끄면 디자인 시스템의 의미가 사라집니다. 룰이 false-positive면 사용자에게 보고.
- "임의값이 더 짧다" → 무관. 토큰 클래스가 무조건 우선.

## 추가 자료

- [DESIGN.md](DESIGN.md) — 시스템 spec (Stitch 형식, auto-generated)
- [메인 README](README.md) — 시스템 전체 개요
- [tokens.md](tokens.md) — 토큰 사양 (사람용 reference)
- 라이브 데모: https://miles-hs-lee.github.io/PolarisDesign/
- 컴포넌트 카탈로그: https://miles-hs-lee.github.io/PolarisDesign/#/components
- 디자인 토큰: https://miles-hs-lee.github.io/PolarisDesign/#/tokens
- 디자인 자산 (로고/아이콘): https://miles-hs-lee.github.io/PolarisDesign/#/assets
