# @polaris/ui

폴라리스 디자인 시스템의 런타임 자산 — 토큰, CSS 변수, Tailwind preset, 37개 React 컴포넌트.

루트 [README](../../README.md)에 전체 시스템 설명이 있습니다. 이 문서는 패키지 사용법만 다룹니다.

## 설치

```sh
pnpm add @polaris/ui
pnpm add -D tailwindcss
```

## 토큰

```ts
import {
  brand,        // brand.primary, brand.secondary, brand.blue/green/orange/red/purple
  fileType,     // fileType.docx (= brand.blue), .xlsx, .pptx, .pdf, .hwp
  status,       // status.success/warning/danger/info
  neutral,      // neutral['0'] ~ neutral['1000']
  surface,      // surface.canvas/raised/sunken/border/borderStrong
  text,         // text.primary/secondary/muted/onBrand
  radius,       // radius.sm/md/lg/xl/full
  shadow,       // shadow.light/dark
  textStyle,    // displayLg, headingMd, bodyLg, …
  spacing,      // Tailwind 기본 그대로
  breakpoint,
  fontFamily,
  fontWeight,
} from '@polaris/ui/tokens';

brand.primary; // { light: '#2B7FFF', dark: '#5C9FFF' }
brand.primary === fileType.docx; // true — 단일 소스 별칭
```

## CSS 변수

```ts
import '@polaris/ui/styles/tokens.css';
```

`<html>` 또는 임의 ancestor에 `data-theme="dark"` 적용 시 다크 페어로 자동 전환. `prefers-color-scheme: dark` 폴백 포함.

## Tailwind preset

```ts
// tailwind.config.ts
import polarisPreset from '@polaris/ui/tailwind';
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  presets: [polarisPreset],
} satisfies Config;
```

이후 다음 클래스가 자동 생성됩니다 (v0.7 spec 명명):

| 카테고리 | 클래스 |
|---|---|
| 라벨 (텍스트/아이콘) | `text-label-{normal,neutral,alternative,assistive,inverse,disabled}` |
| 배경 (페이지) | `bg-background-{base,disabled}` |
| 레이어 (raised) | `bg-layer-surface`, `bg-layer-overlay` |
| 인터랙션 | `bg-interaction-{hover,pressed}` |
| Fill | `bg-fill-{neutral,normal,strong}` |
| 보더 | `border-line-{neutral,normal,strong,disabled}` |
| Brand 액센트 | `bg-accent-brand-{normal,strong,bg,bg-hover}`, `text-accent-brand-normal` |
| Black 액션 | `bg-accent-action-{normal,strong}` (다크모드 자동 반전) |
| 포커스 / Static | `ring-focus-ring`, `bg-static-white`, `bg-static-black` |
| 상태 | `bg-state-{success,warning,error,info,new}`, `bg-state-{}-bg` |
| AI / NOVA | `bg-ai-{normal,strong,hover,pressed}` |
| 컬러 램프 (10단계) | `bg-blue-{05,10,...,90}`, `bg-purple-50`, `bg-green-30`, etc. |
| 서브 팔레트 (rc.1) | `bg-sky-blue-50`, `bg-violet-50`, `bg-cyan-50`, `bg-yellow-50`, `bg-blue-supplementary-50` |
| Gray | `bg-gray-{10,20,...,90}` |
| 폰트 | `font-polaris`, `font-polaris-mono` |
| 폰트 크기 | `text-polaris-{display,title,heading1-4,body1-3,caption1-2}` |
| Spacing (named) | `p-polaris-{4xs,3xs,2xs,xs,sm,md,lg,xl,2xl,3xl,4xl}` (named) + Tailwind 기본 |
| 반경 | `rounded-polaris-{2xs,xs,sm,md,lg,xl,2xl,pill}` (default `md` 12px) |
| 그림자 | `shadow-polaris-{xs,sm,md,lg,ai}` (`ai` = AI 표면 보라 글로우) |
| Z-index | `z-polaris-{base,dropdown,sticky,dim,modal,toast}` |
| Motion | `duration-polaris-{instant,fast,normal,slow}`, `ease-polaris-{in-out,out,in}` |

v0.6 / rc.0 alias (`bg-brand-primary`, `text-fg-primary`, `bg-surface-raised`, `bg-status-danger`, `text-polaris-display-lg` 등)는 deprecated alias로 작동. v0.8에서 제거. 자동 변환: `pnpm dlx @polaris/lint polaris-codemod-v07 --apply src`.

## 컴포넌트 (37개)

```tsx
import {
  // Tier 0 (12) — 기본 빌딩 블록
  Button, Input, Textarea, Card, Badge, Avatar, Dialog, Toast, Tabs,
  FileIcon, FileCard, NovaInput,
  // Tier 1 (6) — 셸 + 메뉴
  DropdownMenu, Tooltip, Select, Sidebar, Navbar, PromptChip,
  // Tier 2 (7) — 보조 UI
  Checkbox, Switch, Skeleton, Alert, Pagination, Breadcrumb, EmptyState,
  // Tier 2.5 (5) — layout / structural
  Stack, HStack, VStack, Container, Drawer, Table, DescriptionList,
  // Tier 3 — date / overlay / command
  Popover, PopoverTrigger, PopoverContent,
  Calendar, DatePicker, DateRangePicker,                          // experimental
  CommandDialog, CommandInput, CommandList, CommandGroup, CommandItem,  // experimental
  // 부속 (server-action friendly)
  DropdownMenuFormItem,
  // Toast imperative API
  Toaster, useToast, toast,
  // 헬퍼
  cn,
} from '@polaris/ui';
```

각 컴포넌트의 prop은 IDE에서 JSDoc으로 확인. 시각 사용 예시는 [컴포넌트 카탈로그](https://polarisoffice.github.io/PolarisDesign/#/components) 또는 [디자인 토큰 페이지](https://polarisoffice.github.io/PolarisDesign/#/tokens).

### Subpath imports — 필요한 사람만

루트 bundle을 가볍게 유지하기 위해 일부 컴포넌트는 별도 subpath로 분리됩니다.

```tsx
// 폼 (react-hook-form + zod 의존)
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage,
} from '@polaris/ui/form';

// 리본 / 에디터 툴바 (Office 도큐먼트 · MD 에디터 · 스프레드시트 · PDF 등)
import {
  Ribbon, RibbonTabs, RibbonTabList, RibbonTab, RibbonContent,
  RibbonGroup, RibbonStack, RibbonRow,
  RibbonSeparator, RibbonRowDivider,
  RibbonButton, RibbonMenuButton, RibbonSplitButton,
  RibbonToggleGroup, RibbonToggleItem,
} from '@polaris/ui/ribbon';

// v0.7+ — 디자인팀 SVG 자산
// UI 아이콘 65종 × 18/24/32 px (모노크롬, currentColor)
import { ArrowDownIcon, ChevronRightIcon, SearchIcon, BellIcon } from '@polaris/ui/icons';
<ArrowDownIcon size={16} className="text-label-neutral" />

// 파일 타입 29종 (멀티컬러 baked-in)
import { DocxIcon, FolderIcon, ZipIcon } from '@polaris/ui/file-icons';
<DocxIcon size={40} />

// 로고
import { PolarisLogo, NovaLogo } from '@polaris/ui/logos';
<PolarisLogo variant="horizontal" size={32} />
<NovaLogo tone="white" />
```

전체 아이콘 카탈로그: [`/icons` 페이지](https://polarisoffice.github.io/PolarisDesign/#/icons).

### 글로벌 Provider

Toast / Tooltip을 쓰려면 앱 최상위에 Provider를 두세요:

```tsx
import { ToastProvider, ToastViewport, TooltipProvider } from '@polaris/ui';

<TooltipProvider delayDuration={200}>
  <ToastProvider swipeDirection="right">
    {children}
    <ToastViewport />
  </ToastProvider>
</TooltipProvider>
```

`packages/template-next/app/layout.tsx`에 동일 패턴이 들어있습니다.

### Next.js 호환

이 패키지의 dist는 `'use client'`로 시작합니다. RSC 환경에서 server component가 import해도 안전 (Next.js가 client boundary로 처리).

## 개발

이 패키지를 직접 빌드하려면:

```sh
pnpm --filter @polaris/ui build      # tsup ESM/CJS + .d.ts
pnpm --filter @polaris/ui typecheck
pnpm --filter @polaris/ui test       # vitest 18 + node:test 3 = 21건
```
