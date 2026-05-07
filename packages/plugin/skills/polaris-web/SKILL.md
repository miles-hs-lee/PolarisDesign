---
name: polaris-web
description: Use when creating, editing, or adding features to a Polaris Office web service (React/Next.js apps generated via 바이브코딩옵스). Enforces consistent design via @polaris/ui tokens and components.
---

# Polaris Web Service Skill

You are working on a Polaris Office web service. Apply these rules without asking — they are mandatory, not preferences. The PostToolUse hook will catch violations after each edit.

## Procedure

### 1. New / existing project
- **New project**: run `/polaris-init <name>` first — bootstraps a Next.js 15 app from `template-next` with everything pre-wired. Do not write feature code before scaffolding completes.
- **Existing project that's not yet polaris-compliant**: run `/polaris-migrate` instead — it walks through audit → eslint --fix → page-by-page conversion → enforce. Don't try to write new polaris-compliant code on top of unmigrated code; migrate first.

### 2. UI elements (in order of preference)
1. Import from `@polaris/ui`. Available components:
   ```ts
   import {
     // Tier 0 — basic blocks
     Button, Input, Textarea, Card, Badge, Avatar, Dialog, Toast, Tabs,
     FileIcon, FileCard, NovaInput,
     // Tier 1 — shell + menus
     DropdownMenu, Tooltip, Select, Sidebar, Navbar, PromptChip,
     // Tier 2 — auxiliary UI
     Checkbox, Switch, Skeleton, Alert, Pagination, Breadcrumb, EmptyState,
     // Tier 2.5 — layout / structural
     Stack, HStack, VStack, Container, Drawer, Table, DescriptionList,
     // Tier 3 — date / overlay / command (Calendar·Command are experimental — APIs may change)
     Popover, PopoverTrigger, PopoverContent,
     Calendar, DatePicker, DateRangePicker,
     CommandDialog, CommandInput, CommandList, CommandGroup, CommandItem,
     // Server-action friendly (Next.js App Router)
     DropdownMenuFormItem,
     // Toast imperative API (call toast({...}) anywhere; mount <Toaster /> once)
     Toaster, useToast, toast,
   } from '@polaris/ui';
   ```
2. If a needed component doesn't exist in `@polaris/ui`, build it inline using ONLY Polaris tokens (rule 3). Don't bring in shadcn/Radix/MUI directly.

   **Subpath imports** — keep root barrel light:
   ```ts
   // Forms with react-hook-form + zod
   import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@polaris/ui/form';

   // Editor / document toolbars (Office ribbon, MD editor, spreadsheet, PDF, …)
   import {
     Ribbon, RibbonTabs, RibbonTabList, RibbonTab, RibbonContent,
     RibbonGroup, RibbonStack, RibbonRow, RibbonRowDivider,
     RibbonSeparator,
     RibbonButton, RibbonSplitButton, RibbonMenuButton,
     RibbonToggleGroup, RibbonToggleItem,
   } from '@polaris/ui/ribbon';

   // v0.7 — Design-team SVG assets (65 UI icons + 29 file-type + logos + 91 ribbon)
   import { ArrowDownIcon, ChevronRightIcon, SearchIcon } from '@polaris/ui/icons';
   import { DocxIcon, FolderIcon, ZipIcon } from '@polaris/ui/file-icons';
   import { PolarisLogo, NovaLogo } from '@polaris/ui/logos';
   // Ribbon-only icons (multi-color, native 16/32; for use INSIDE Ribbon buttons):
   import { BoldIcon, PasteIcon, AiChatIcon } from '@polaris/ui/ribbon-icons';
   ```
3. Native `<button>`, `<input>`, `<textarea>`, `<select>`, `<dialog>` are forbidden in feature code — the lint rule `@polaris/prefer-polaris-component` blocks them. (They're allowed inside `@polaris/ui` itself.)

### 3. Colors — the most common violation (v0.7 spec names)

**Always reach for v0.7 semantic tokens first.** They are organized by role and auto-switch in dark mode.

| Role | Tailwind class | Token |
|---|---|---|
| 1차 텍스트 | `text-label-normal` | `label.normal` |
| 보조 텍스트 | `text-label-neutral` | `label.neutral` |
| 캡션 | `text-label-alternative` | `label.alternative` |
| Placeholder | `text-label-assistive` | `label.assistive` |
| 반전 텍스트 | `text-label-inverse` | `label.inverse` |
| 비활성 텍스트 | `text-label-disabled` | `label.disabled` |
| 페이지 배경 | `bg-background-base` | `background.base` |
| 비활성 배경 | `bg-background-disabled` | `background.disabled` |
| Card / Dialog surface | `bg-layer-surface` | `layer.surface` |
| Modal dim | `bg-layer-overlay` | `layer.overlay` |
| Hover surface | `bg-interaction-hover` | `interaction.hover` |
| Pressed surface | `bg-interaction-pressed` | `interaction.pressed` |
| 약한 보더 | `border-line-neutral` | `line.neutral` |
| 일반 보더 | `border-line-normal` | `line.normal` |
| 강조 보더 | `border-line-strong` | `line.strong` |
| Brand 강조 (CTA) | `bg-accent-brand-normal` / `text-accent-brand-normal` | `accentBrand.normal` |
| Brand hover | `bg-accent-brand-strong` | `accentBrand.strong` |
| Brand 틴트 (Secondary 버튼) | `bg-accent-brand-bg` | `accentBrand.bg` |
| Black 버튼 | `bg-accent-action-normal text-static-white` | `accentAction.normal` |
| 포커스 ring | `ring-focus-ring` | `focus.ring` |
| 항상 흰색/검정 (모드 무관) | `bg-static-white` / `bg-static-black` | `staticColors.white/black` |
| 성공 텍스트 / 아이콘 | `text-state-success` (+ icon!) | `state.success` |
| 성공 배너 배경 | `bg-state-success-bg` | `state.successBg` |
| 경고 / 에러 / 정보 | `state-warning` / `-error` / `-info` (+ `-bg`) | `state.*` |
| 신규 알림 dot | `bg-state-new` | `state.new` |
| AI / NOVA | `bg-ai-normal text-label-inverse` (+ `shadow-polaris-ai`) | `ai.normal` |

**TS imports**:
```ts
import { label, background, layer, fill, line, accentBrand, state, ai } from '@polaris/ui/tokens';
```

**v0.6 / rc.0 alias는 deprecated** — `bg-brand-primary` / `text-fg-primary` / `bg-surface-raised` / `bg-status-danger` 등은 v0.7에서 계속 작동하지만 v0.8에서 제거. 새 코드는 spec 이름 사용. `pnpm dlx @polaris/lint polaris-codemod-v07 --apply` 로 자동 변환.

NEVER write any of:
- Hex colors: `#fff`, `#1D4ED8`
- CSS color functions: `rgb(...)`, `rgba(...)`, `hsl(...)`
- Tailwind arbitrary values: `bg-[#fff]`, `text-[red]`, `border-[#ccc]`

### 4. AI / NOVA contexts
- AI features (generation, summarization, NOVA entry points) → `bg-ai-normal` + `shadow-polaris-ai` (purple glow)
- Everything else → `bg-accent-brand-normal` (blue)
- Don't mix accent-brand and ai on the same screen.

### 5. State 컬러 — 색상만으로 정보 전달 금지 (WCAG 1.4.1)

`state.success / warning / error` 는 작은 텍스트에서 contrast AA를 만족하지 않습니다. 다음 룰 준수:

- ✅ 아이콘 동반 (`<ErrorIcon />` `<CheckIcon />` etc.) + 텍스트 라벨
- ✅ 18px+ Bold 텍스트
- ✅ 뱃지 (`bg-state-{}-bg` + Caption1 12 / 700)
- ❌ 14px 본문에서 `text-state-error` 단독 사용 (lint 룰 `@polaris/state-color-with-icon` 가 경고)

### 6. File-type contexts (Polaris-specific)

29개 파일 타입 SVG가 `@polaris/ui` 에서 제공됩니다 — `<FileIcon type="docx" />` 또는 직접 import:
```ts
import { DocxIcon, XlsxIcon, PptxIcon, PdfIcon, FolderIcon } from '@polaris/ui/file-icons';
```
색상은 SVG 안에 baked-in — `text-{color}` 로 변경 불가 (의도된 디자인).

### 7. Typography (v0.7 spec)
- Family: `font-polaris` (Tailwind) or `var(--polaris-font-sans)` (CSS)
- Scale: `text-polaris-display` (40) / `-title` (32) / `-heading1` ~ `-heading4` (28/24/20/18) / `-body1` ~ `-body3` (16/14/13) / `-caption1` (12) / `-caption2` (11). 모든 heading + caption은 weight 700.
- 모바일 (≤767px) 자동 축소 — `tokens.css` 에 @media 자동 적용.
- NEVER `font-family: ...` 직접 지정.
- NEVER `font-['Inter']` 임의값.
- NEVER letter-spacing 수정 — Pretendard 자체 메트릭 사용.
- v0.6 / rc.0 alias (`text-polaris-display-lg`, `-h1`~`-h5`, `-body`, `-meta`, `-tiny`) 는 deprecated alias로 작동.

### 8. Spacing / radius / shadow / motion / z-index
- **Spacing** (v0.7 named): `p-polaris-md`, `gap-polaris-lg` 등 (4xs/3xs/2xs/xs/sm/md/lg/xl/2xl/3xl/4xl). Tailwind 기본 `p-4` 도 OK. Never `p-[13px]`.
- **Radius**: `rounded-polaris-{2xs,xs,sm,md,lg,xl,2xl,pill}`. Default for buttons/cards/modals = `md` (12px). Input = `sm` (8). Large CTA = `lg` (16). Modal = `xl` (24).
- **Shadow**: `shadow-polaris-{xs,sm,md,lg,ai}`. AI surfaces (NovaInput / response cards) = `ai` (purple glow).
- **Motion**: `duration-polaris-{instant,fast,normal,slow}` + `ease-polaris-{in-out,out,in}`.
- **Z-index**: `z-polaris-{base,dropdown,sticky,dim,modal,toast}`. Never `z-[999]`.

### 8. Verify before reporting done
After meaningful changes, run `/polaris-check`. Don't tell the user the task is complete while violations remain.

## Single source of truth

Color/font/radius values live ONLY in `@polaris/ui`. If you genuinely need a token that doesn't exist, propose it in `tokens.md` first; do not invent values in component code.

## Anti-patterns to actively avoid

- "I'll just hardcode #FF5500 since the user mentioned it" — wrong. Use the closest token; if none fits, ask before adding.
- "Material/shadcn has a nice X component, let me use it" — wrong. Wrap in `@polaris/ui` first or build inline with tokens.
- "I'll disable the lint rule for this one case" — wrong. Disabling rules defeats the purpose. Fix the root cause.
- "The arbitrary value is shorter to write" — irrelevant. Token classes are mandatory regardless of brevity.
