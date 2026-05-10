# @polaris/ui

폴라리스 디자인 시스템의 런타임 자산 — 토큰, CSS 변수, Tailwind preset, 41개 React 컴포넌트.

루트 [README](../../README.md)에 전체 시스템 설명이 있습니다. 이 문서는 패키지 사용법만 다룹니다.

## 설치

PolarisDesign이 사내 npm registry에 publish되기 전 단계라, `@polaris/ui`는 [GitHub Release](https://github.com/PolarisOffice/PolarisDesign/releases)의 `.tgz` 타르볼로 배포됩니다. Public repo이므로 인증 불요.

`package.json`에 직접 추가:

```jsonc
{
  "dependencies": {
    "@polaris/ui": "https://github.com/PolarisOffice/PolarisDesign/releases/download/v0.7.3/polaris-ui-0.7.3.tgz"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0"
  }
}
```

그리고 `pnpm install`. 전체 셋업 절차(Tailwind preset 연결, tokens.css import, Renovate 자동 업그레이드, 트러블슈팅): [`docs/internal-consumer-setup.md`](../../docs/internal-consumer-setup.md). 새 프로젝트는 `/polaris-init <name>` 슬래시커맨드 한 줄로 부트스트랩 가능.

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
| 그림자 | `shadow-polaris-{xs,sm,md,lg,ai,focus}` (`ai` = AI 표면 보라 글로우, `focus` = 3px 시스템 포커스 링) |
| Z-index | `z-polaris-{base,dropdown,sticky,dim,modal,toast}` |
| Motion | `duration-polaris-{instant,fast,normal,slow}`, `ease-polaris-{in-out,out,in}` |

v0.6 / rc.0 alias (`bg-brand-primary`, `text-fg-primary`, `bg-surface-raised`, `bg-status-danger`, `text-polaris-display-lg` 등)는 deprecated alias로 작동. v0.8에서 제거. 자동 변환: `pnpm dlx @polaris/lint polaris-codemod-v07 --apply src`.

## 컴포넌트 (41개)

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
  Stack, Container, Drawer, Table, DescriptionList,
  // Tier 3 — date / overlay / command
  Popover, PopoverTrigger, PopoverContent,
  Calendar, DatePicker, DateRangePicker,                          // experimental
  CommandDialog, CommandInput, CommandList, CommandGroup, CommandItem,  // experimental
  // Tier 3.5 (4) — feedback / utility (v0.7.4)
  Progress, CopyButton, Stat, Disclosure,
  // 부속 (server-action friendly)
  DropdownMenuFormItem,
  // Toast imperative API
  Toaster, useToast, toast,
  // 헬퍼
  cn,
} from '@polaris/ui';
```

각 컴포넌트의 prop은 IDE에서 JSDoc으로 확인. 시각 사용 예시는 [컴포넌트 카탈로그](https://polarisoffice.github.io/PolarisDesign/#/components) 또는 [디자인 토큰 페이지](https://polarisoffice.github.io/PolarisDesign/#/tokens).

## 자주 놓치는 패턴 — discoverability cookbook

컨슈머 피드백에서 자주 “이 기능 없어서 직접 만들었어요”로 토로된 항목들. 다 이미 있습니다.

### Stack — `direction="row"`로 Inline·between 둘 다 처리

별도 `Inline`/`HStack` 없이 `Stack` 하나로 두 케이스 모두:

```tsx
import { Stack } from '@polaris/ui';

// 세로 스택
<Stack gap={3}>
  <Card>…</Card><Card>…</Card>
</Stack>

// 가로 + 양끝 정렬 (= shadcn의 `Inline`/Mantine의 `Group justify="between"`)
<Stack direction="row" justify="between" align="center">
  <h2>제목</h2>
  <Button>액션</Button>
</Stack>
```

`gap`, `align`, `justify`, `wrap`, `asChild` 모두 지원. 거의 모든 페이지 레이아웃이 `Stack` + `Container` + `Card` 셋으로 해결됩니다.

### Card — header/footer 슬롯

`<Card variant="padded">` 한 번에 끝내거나 기본(`bare`) variant + 슬롯 분리:

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '@polaris/ui';

<Card>
  <CardHeader>
    <CardTitle>링크 분석</CardTitle>
    <CardDescription>지난 7일 기준</CardDescription>
  </CardHeader>
  <CardBody>{/* 본문 */}</CardBody>
  <CardFooter>{/* 액션 / 통계 */}</CardFooter>
</Card>
```

각 슬롯은 spec 토큰으로 패딩·텍스트 색을 정해두니, `.panel h2` 같은 자체 CSS를 쓸 필요 없습니다.

### Input — `label`·`hint`·`error` 표준

```tsx
<Input
  label="묶음 이름"           // floating label (rc.0의 above-label 대체)
  hint="공유 시 상대에게 표시됨" // helper text — below input, label-alternative
  error={errors.name?.message} // ⚠ 아이콘 + state-error 자동, ARIA invalid 자동
  placeholder="2025-Q4"
/>
```

(`hint` = 다른 시스템의 `helperText` / `description`. 명명 다르니 검색이 어렵죠.)

### Toast — imperative API 한 줄 호출

```tsx
import { toast } from '@polaris/ui';

toast({ title: '복사됨', description: '클립보드에 저장되었습니다.' });
toast({ variant: 'destructive', title: '저장 실패', description: err.message });
```

setup은 한 번:

```tsx
import { Toaster } from '@polaris/ui';
// app/layout.tsx
<Toaster />
```

`useToast()` hook으로 dismiss/update도 가능.

### EmptyState — `action` slot

```tsx
<EmptyState
  title="아직 업로드한 파일이 없어요"
  description="첫 파일을 업로드하면 분석이 시작됩니다."
  action={<Button>파일 업로드</Button>}
/>
```

CTA 버튼 전용 슬롯이 이미 있습니다.

### DropdownMenuFormItem — server action을 메뉴 안에서 안전하게

`DropdownMenuItem` 안에 form을 직접 넣으면 Radix가 form을 unmount해서 submit이 안 터지는 race가 있는데, `DropdownMenuFormItem`이 이를 처리해줍니다.

```tsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuFormItem } from '@polaris/ui';

<DropdownMenu>
  <DropdownMenuTrigger>…</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuFormItem
      action={signOut}             // server action 또는 string URL
      destructive
      icon={<LogOut className="h-4 w-4" />}
    >
      로그아웃
    </DropdownMenuFormItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Disclosure — 셰브론 회전이 빌트인된 collapsible

```tsx
import { Disclosure } from '@polaris/ui';

<Disclosure title="고급 설정">
  <Stack gap={2}>{/* fields */}</Stack>
</Disclosure>
```

`<details>` + 자체 CSS 안 만들어도 됨. 키보드/ARIA + 셰브론 180° 회전 다 처리.

### CopyButton — clipboard + 1.5s 성공 피드백 + ARIA

```tsx
import { CopyButton } from '@polaris/ui';

<CopyButton text={shareUrl}>링크 복사</CopyButton>
<CopyButton text={shareUrl} iconOnly aria-label="공유 URL 복사" />
```

`navigator.clipboard` 폴백 처리 + `aria-live="polite"` + 자동 idle 복귀까지 일체.

### Progress — determinate / indeterminate

```tsx
<Progress value={47} aria-label="파일 업로드" />          {/* determinate */}
<Progress aria-label="문서 분석 중" />                     {/* indeterminate */}
<Progress value={100} tone="success" aria-label="완료" />  {/* tone */}
```

`tone`: `accent`(default) / `success` / `warning` / `danger` / `ai`.
`size`: `sm` / `md`(default) / `lg`. 인디터미네이트는 `prefers-reduced-motion`을 자동 존중.

### Stat — KPI 타일

```tsx
<Card variant="padded">
  <Stat label="조회수" value="1,234" delta="+12%" deltaTone="positive" />
</Card>
```

대시보드 4-up 레이아웃은 `<Card><Stat /></Card>`를 grid로 묶어 쓰세요. `helper`로 비교 윈도우(“지난 7일 기준”)도 함께 표시 가능.

### `shadow-polaris-focus` — 커스텀 인터랙티브 요소의 시스템 포커스 링

`Button`/`Input` 외 직접 만든 클릭 가능한 요소에:

```tsx
<div
  role="button"
  tabIndex={0}
  className="rounded-polaris-md focus-visible:outline-none focus-visible:shadow-polaris-focus"
>
  …
</div>
```

`box-shadow: 0 0 0 3px ...` 패턴을 매번 손코드 짜지 않아도 됨. 다크모드는 자동 alpha 조정.

## 토큰 시맨틱 — `label.*` vs `state.*`

| 그룹 | 의미 | 사용 |
|---|---|---|
| `label.*` | 일반 텍스트·아이콘 색상 위계 | `text-label-{normal\|neutral\|alternative\|assistive\|inverse\|disabled}` |
| `state.*` | 상태(success/warning/error/info)를 나타내는 텍스트·배경 | `text-state-{success\|warning\|error\|info}`, `bg-state-{...}-bg` |

→ "위반 라벨"용으로 `label-danger` 같은 토큰은 **없습니다** (시맨틱 흐려짐). 위반/오류 텍스트 = `text-state-error`(혹은 `state-warning`). 단, **state 컬러 텍스트는 작은 텍스트 단독 사용 금지** — 반드시 아이콘 동반(WCAG 1.4.1). 이 규칙은 `@polaris/lint`의 `state-color-with-icon` 룰로 자동 검출됩니다.

## 다크모드

- **CSS 토큰은 모두 light/dark 페어로 정의**되어 있어서 `data-theme="dark"`만 토글하면 자동 전환됩니다. 컴포넌트가 토큰 클래스(`bg-background-base`, `text-label-normal` 등)만 쓰면 추가 작업 0.
- **자동 대응되지 않는 케이스**: `color-mix()`로 토큰을 즉석 합성하거나, `rgba(...)` 하드코딩, `style={{ color: '#fff' }}` 같은 인라인 스타일은 다크에서 깨집니다. → `@polaris/lint`의 `no-hardcoded-color` / `no-arbitrary-tailwind` 룰이 검출.
- **그림자도 light/dark 페어**: `shadow-polaris-md` 등은 두 테마 자동 매칭. 직접 `box-shadow: 0 4px ...` 쓰면 다크에서 안 보임.
- **포커스 링도 다크 자동 대응**: `shadow-polaris-focus`는 light에서 alpha 35%, dark에서 45%로 컨트라스트 자동 조정.

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

// 리본 전용 아이콘 91종 (57 big × 32 + 34 small × 16 px, 멀티컬러 baked-in)
// 큰/작은 set은 별도로 디자인됨 — 같은 슬러그가 두 set에 동시에 존재하지 않음.
// `RIBBON_ICON_REGISTRY`로 슬러그→컴포넌트 동적 lookup, `RIBBON_ICON_BIG_SLUGS`/
// `RIBBON_ICON_SMALL_SLUGS` Set으로 어느 set에 속하는지 판별.
import { BoldIcon, AiChatIcon, PasteIcon } from '@polaris/ui/ribbon-icons';
<BoldIcon />              // 16 × 16 (small native — sm/md 리본 버튼용)
<AiChatIcon />            // 32 × 32 (big native — lg 리본 버튼용)
<PasteIcon size={20} />   // size prop으로 균등 스케일
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
