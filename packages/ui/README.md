# @polaris/ui

폴라리스 디자인 시스템의 런타임 자산 — 토큰, CSS 변수, Tailwind preset, 18개 React 컴포넌트.

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

이후 다음 클래스가 자동 생성됩니다:

| 카테고리 | 클래스 |
|---|---|
| 브랜드 | `bg-brand-primary`, `bg-brand-secondary`, `bg-brand-secondary-subtle`, `bg-polaris-blue/green/orange/red/purple` |
| 파일 | `bg-file-docx`, `text-file-pdf`, … |
| 상태 | `bg-status-success`, `text-status-danger`, … |
| 표면 | `bg-surface-canvas`, `border-surface-border`, `bg-surface-sunken` |
| 전경 | `text-fg-primary`, `text-fg-on-brand`, … (`fg`로 시작 — `text-` 유틸리티 prefix와 충돌 회피) |
| 뉴트럴 | `bg-neutral-0` ~ `bg-neutral-1000` |
| 폰트 | `font-polaris`, `font-polaris-mono` |
| 폰트 크기 | `text-polaris-display-lg`, `text-polaris-heading-md`, `text-polaris-body-lg`, `text-polaris-caption`, … |
| 반경 | `rounded-polaris-sm/md/lg/xl/full` |
| 그림자 | `shadow-polaris-xs/sm/md/lg` |

## 컴포넌트 (18개)

```tsx
import {
  // Tier 0 (12)
  Button, Input, Textarea, Card, Badge, Avatar, Dialog, Toast, Tabs,
  FileIcon, FileCard, NovaInput,
  // Tier 1 (6)
  DropdownMenu, Tooltip, Select, Sidebar, Navbar, PromptChip,
  // 헬퍼
  cn,
} from '@polaris/ui';
```

각 컴포넌트의 prop은 IDE에서 JSDoc으로 확인. 시각 사용 예시는 [Storybook](https://miles-hs-lee.github.io/PolarisDesign/storybook/)이나 [데모 페이지](https://miles-hs-lee.github.io/PolarisDesign/#/components).

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
