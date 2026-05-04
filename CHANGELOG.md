# Changelog

이 프로젝트의 주요 변경 사항을 기록합니다.

형식은 [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)을, 버전 규칙은 [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html)을 따릅니다.

---

## [Unreleased]

다음 릴리스(v0.5)에 우선 들어갈 항목들 — 자세한 우선순위는 [docs/roadmap.md](docs/roadmap.md) 참고.

**검증 필요:** v0.4 사용자 보고 — `prefer-polaris-component` lint가 server action `<form action={...}>` 안의 `<button type="submit">`을 일부 케이스에서 flag. v0.2.0 `allowFormSubmit` 수정 후 회귀 테스트는 통과 — 사용자 lint 버전 또는 화이트리스트 미커버 케이스 확인 필요.

---

## [0.4.1] — 2026-05-04

코덱스 리뷰 후속 패치. v0.4.0의 4건 이슈 수정.

### 수정됨 — Form을 subpath export로 분리 (P1)

`react-hook-form`이 optional peerDep인데도 v0.4.0의 root barrel이 `Form` 컴포넌트를 re-export해서, RHF 없이 `import { Button } from '@polaris/ui'`만 해도 dist 로드 시점에 `require('react-hook-form')`이 실행됐습니다.

수정: Form/FormField 시리즈를 **`@polaris/ui/form`** subpath로 분리. 루트 bundle은 RHF 의존 0건 (`grep` 검증).

```ts
// 기존 (v0.4.0)
import { Form, FormField } from '@polaris/ui';  // ❌ RHF 미설치 시 import 실패

// 신규 (v0.4.1+)
import { Form, FormField } from '@polaris/ui/form';  // ✓
```

### 수정됨 — DropdownMenuFormItem 키보드 submit 누락 (P1)

이전엔 `onSelect`에서 `e.preventDefault()`만 호출하고 inner button의 native click에 의존했습니다. 포인터로는 동작했지만 **Radix menuitem에 포커스가 있는 상태에서 Enter/Space로 선택하면 submit이 누락**될 수 있었습니다.

수정: `formRef`를 잡고 `onSelect`에서 `formRef.current?.requestSubmit()`을 명시적으로 호출. 포인터와 키보드 모두 동일 경로로 submit. 회귀 테스트 3건 추가 (DropdownMenu.test.tsx).

### 수정됨 — CommandDialog props가 UI에 연결되지 않던 문제 (P3)

`placeholder`/`emptyLabel` props가 사용되지 않은 채 API에만 노출돼 있었습니다. 자동 렌더링하는 길도 있었지만 cmdk의 합성 패턴(input/list/group을 children으로 두는)을 깨뜨립니다 — props 자체를 제거하고 children 합성 방식으로 통일. 사용자는 `<CommandInput placeholder="..." />`, `<CommandEmpty>`을 직접 자식으로 둠.

### 수정됨 — Codex/Cursor 에이전트 지침 갱신 (P2)

`AGENTS.md` (루트 + template-next)의 import 예시가 18개 컴포넌트로 고정돼 있어 Codex가 v0.3+ 컴포넌트(Table, Drawer, Form, DatePicker, Command 등)를 피하거나 불필요하게 질문하던 문제. 36개 기준으로 갱신 + Form은 subpath import 안내.

### 수정됨 — nextjs-app-router.md Form 섹션 (P3)

v0.4 시점에서 이미 `Form`/`FormField` 컴포넌트가 추가됐는데, 이 문서는 여전히 "추가 예정, 현재는 수동 RHF 패턴"이라고 안내했습니다. 새 컴포넌트 사용법으로 재작성. `recipes.md`와 표준 일치.

### 추가됨 — 회귀 테스트

`DropdownMenu.test.tsx` — 키보드/포인터 submit pathway + hiddenFields 렌더링 검증. 총 21 vitest tests (이전 18).

---

## [0.4.0] — 2026-05-04

두 번째 사내 마이그레이션 사이클(Next.js 16 + Tailwind v4)에서 받은 후속 피드백 + 0.2부터 약속된 v4 preset을 한 번에 정리한 릴리스. **Tailwind v4 native preset**, **Form/FormField (RHF + zod)**, 그리고 experimental 컴포넌트 2종(Calendar/DatePicker, CommandPalette).

### 추가됨 — Tailwind v4 native preset (`@polaris/ui/styles/v4-theme.css`)

0.2부터 약속된 v4 직접 지원. `@theme inline { ... }` 매핑을 사용자 측에서 50+줄 직접 작성하던 부담을 한 import로 대체:

```css
@import 'tailwindcss';
@import '@polaris/ui/styles/tokens.css';
@import '@polaris/ui/styles/v4-theme.css';
```

v3 preset과 **동일한 클래스명**(`bg-brand-primary`, `text-fg-primary`, `rounded-polaris-md`, `text-polaris-body-sm` 등)이 v4에서도 그대로 작동. v3와 v4 매핑이 같은 CSS 변수 이름을 참조하므로 토큰 추가 시 양쪽이 함께 갱신됩니다.

### 추가됨 — Form/FormField (`@polaris/ui`)

shadcn 패턴 기반 `react-hook-form` + `zod` 어댑터. 사내 폼 wiring 표준:

```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>이메일</FormLabel>
          <FormControl><Input {...field} /></FormControl>
          <FormDescription>로그인용 주소</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">제출</Button>
  </form>
</Form>
```

자동: `htmlFor` wiring, error 시 label 색 전환, `aria-invalid`/`aria-describedby` 연결, `<FormMessage />`가 RHF `errors` 직접 읽음.

### 추가됨 — Calendar / DatePicker / DateRangePicker (`@polaris/ui`, **experimental**)

`react-day-picker` v9 기반. 한국어 로케일(`date-fns/locale/ko`) 기본. `<Calendar mode="single|range">`, `<DatePicker>`, `<DateRangePicker>`. **API는 v0.5에서 변경될 수 있음** — 사용자 피드백 기반.

### 추가됨 — CommandPalette (`@polaris/ui`, **experimental**)

`cmdk` 기반 Ctrl+K 검색 팔레트. `<CommandDialog>`, `<CommandInput>`, `<CommandList>`, `<CommandGroup>`, `<CommandItem>`, `<CommandShortcut>`, `<CommandEmpty>`, `<CommandSeparator>`. **API는 v0.5에서 변경될 수 있음**.

### 추가됨 — Popover (`@polaris/ui`)

Radix Popover 래퍼. `<Popover>`, `<PopoverTrigger>`, `<PopoverContent>`, `<PopoverAnchor>`, `<PopoverClose>`. DatePicker 내부에서 사용되며, 일반 popover 용도로도 export.

### 변경됨 — DropdownMenuFormItem `hiddenFields` prop

CSRF token, `redirect_to` 같은 hidden input 추가:

```tsx
<DropdownMenuFormItem
  action="/auth/sign-out"
  hiddenFields={{ redirect: '/login' }}
  destructive
>로그아웃</DropdownMenuFormItem>
```

### 변경됨 — `<ToastViewport>` `position` prop

`top-right` (default) / `top-left` / `top-center` / `bottom-right` / `bottom-left` / `bottom-center`.

### 변경됨 — NavbarBrand `asChild`

`<NavbarBrand asChild><Link href="/">Polaris</Link></NavbarBrand>` — div + a 중첩 제거.

### 추가됨 — Pagination 보조

- `pageNumberItems(current, total, siblings?)` — `[1, '…', 5, 6, 7, '…', 20]` 같은 ellipsis 시퀀스 계산 유틸리티
- `PAGE_ELLIPSIS` sentinel
- `PaginationPrev`/`PaginationNext`에 `label` prop (aria-label override)

### 변경됨 — DescriptionList `inline` 반응형

`layout="inline"` (기본)이 `sm` 미만에서 자동으로 stack. 좁은 viewport에서 label 컬럼 squeeze 방지. 명시적 grid가 필요하면 `layout="inline-strict"` 사용.

### 추가됨 — 문서

- **patterns.md**에 §6 Drawer vs Dialog, §7 asChild 가능 컴포넌트 표 추가
- **app-shell-layout.md** — Sidebar + Navbar 표준 레이아웃 패턴 + 모바일 대응 + 다크 토글 + CommandPalette 통합
- **tailwind-v4-migration.md** 전면 갱신 — 새 v4-theme.css 사용법 (manual @theme inline 작성 제거)
- **recipes.md §1 Form** — RHF + Form/FormField 컴포넌트 패턴으로 갱신

### 의존성 추가

- `@radix-ui/react-popover@^1.1.4` (Popover, DatePicker)
- `cmdk@^1.0.4` (CommandPalette)
- `date-fns@^4.1.0` (Calendar 한국어 로케일)
- `react-day-picker@^9.4.4` (Calendar)
- `react-hook-form@^7.50.0` peerDep (Form/FormField, optional)

### 데모

- §31 DatePicker / DateRangePicker
- §32 CommandPalette (⌘K)
- §33 Form (RHF + zod)
- §34로 폴라리스 화면 모방 이동

---

## [0.3.0] — 2026-05-04

첫 사내 마이그레이션 사이클(Next.js 16 + Tailwind v4)에서 받은 후속 피드백을 반영. Tier 2.5 layout/structural 컴포넌트 + Pagination asChild + Form-aware DropdownMenu + 4건의 docs.

### 추가됨 — Tier 2.5 컴포넌트 5개 (`@polaris/ui` → 30개)

- **Stack / HStack / VStack** — `flex flex-col gap-N` 반복 패턴 제거. `direction`, `gap`, `align`, `justify`, `wrap`, `asChild` props
- **Container** — `max-w-screen-N mx-auto px 반응형` 패턴 컴포넌트화. `size: sm/md/lg/xl/2xl/full`
- **Drawer / DrawerHeader / DrawerBody / DrawerFooter / DrawerTitle / DrawerDescription** — Radix Dialog 기반 side-anchored 패널. `side: right (default) / left / top / bottom`. table-row inspector, filter side panel, mobile nav drawer 용
- **Table / TableHeader / TableBody / TableFooter / TableRow / TableHead / TableCell / TableCaption** — semantic `<table>` primitive + `density: compact/comfortable/relaxed` 축. context로 cell까지 전파
- **DescriptionList / DescriptionTerm / DescriptionDetails** — semantic `<dl>`. `layout: inline (grid 2-col) / stacked`. 고객/계약 상세 패널 용

### 추가됨 — DropdownMenuFormItem (`@polaris/ui`)

DropdownMenu 안에서 server action을 form submit으로 트리거하는 패턴 — Radix의 close behavior가 form unmount보다 먼저 일어나는 race condition을 컴포넌트로 추상화.

```tsx
<DropdownMenuFormItem action={signOut} destructive icon={<LogOut />}>
  로그아웃
</DropdownMenuFormItem>
```

### 변경됨 — Pagination asChild

`PaginationItem`/`PaginationPrev`/`PaginationNext`에 `asChild` prop 추가. URL-driven pagination에서 `<Link href={...}>`로 wrap 가능 → Next.js App Router의 RSC + 브라우저 history와 자연스럽게 통합.

```tsx
<PaginationItem asChild active={n === current}>
  <Link href={`?page=${n}`}>{n}</Link>
</PaginationItem>
```

### 변경됨 — Checkbox `label` / `hint` / `error` props

기존엔 외부 `<label>`로 wrap이 강제됐던 것을 `<Checkbox label="이용 약관에 동의" hint="..." error="..." />`로 통일. Input과 동일한 a11y wiring (`htmlFor`, `aria-describedby`, `aria-invalid`).

### 변경됨 — Card `variant` prop

`variant: 'bare' (default) | 'padded'`. `<Card variant="padded">`이 자동으로 `px-5 py-4` 적용 → CardBody 없이 단순 카드를 한 줄로 작성. 기본값이 `bare`라 기존 코드 호환성 유지.

### 변경됨 — EmptyState 기본 아이콘

`icon` 미지정 시 `<Inbox />` default. `icon={null}`로 명시적 비활성 가능.

### 추가됨 — 문서 5건 (`docs/`)

- **variant-axes.md** — 4가지 variant 의미 축(status/emphasis/brand/domain) 명문화. "통일하지 않는다" 결정 + 각 컴포넌트별 축 매핑
- **patterns.md** — Toast vs Alert / border vs border-strong / opacity modifier 5가지 헷갈리는 패턴
- **nextjs-app-router.md** — RSC + Server Actions + Suspense fallback + URL pagination + Drawer inspector + 알려진 한계
- **migration-checklist.md** — 기존 프로젝트 단계별 마이그레이션 (M0~M7), `polaris-audit` baseline 측정 포함
- **recipes.md** — 5개 레시피: Form (RHF + zod, 사내 표준), Confirm Dialog, Stat Card, Table+Drawer Inspector, UserMenu+server action signOut

### 데모

- 컴포넌트 카탈로그에 §25-§30 추가 (Stack, Container, Table, Drawer 4-side, DescriptionList 2-layout, EmptyState 기본 아이콘)
- 30개 컴포넌트로 카운트 갱신

---

## [0.2.1] — 2026-05-04

### 수정됨 — focus 링 시각 비대칭

`bg-surface-raised` 부모(예: Navbar) 위에 놓인 버튼/컴포넌트에서 focus 링이 좌/상/하는 얇고 우/모서리만 두꺼워 보이던 문제 수정.

원인: `focus-visible:ring-offset-2 ring-offset-surface-canvas` 패턴의 box-shadow gap이 `surface-canvas` 색으로 칠해지면서 부모의 `surface-raised` 배경과 색 차이가 발생. 라운드 코너에서는 gap 노출 면적이 더 커서 더 도드라짐.

수정: `ring + ring-offset` (box-shadow 스택) → 네이티브 `outline + outline-offset`. gap이 투명이라 부모 배경 색과 자동으로 맞고, `border-radius`를 정확히 따라가 모든 면이 균일.

영향 컴포넌트: Button, Pagination, Switch, Checkbox, NovaInput, PromptChip.

브라우저 지원: Chrome 94+, Firefox 88+, Safari 16.4+ (모던 outline + border-radius). 그보다 구버전에서는 outline이 사각형으로 그려지지만 기능엔 문제 없음.

---

## [0.2.0] — 2026-05-04

첫 사내 마이그레이션(Next.js 16 + Tailwind v4 기존 프로젝트)에서 받은 피드백을 반영한 패치 릴리스. 컴포넌트 7개 추가, lint 룰 false-positive 보정, SSR 호환 패턴 정비.

### 추가됨 — Tier 2 컴포넌트 7개 (`@polaris/ui` → 18개에서 25개)

- **Checkbox** — Radix Checkbox 기반, `checked='indeterminate'` 지원
- **Switch** — Radix Switch 기반, on/off 24px 트랙
- **Skeleton** — `animate-pulse` placeholder, prop 없이 className만으로 사용
- **Alert / AlertTitle / AlertDescription** — info/success/warning/danger/neutral 5종, leading icon 자동
- **Pagination / PaginationItem / PaginationPrev / PaginationNext / PaginationEllipsis** — 페이지 번호 + prev/next + ellipsis
- **Breadcrumb / BreadcrumbList / BreadcrumbItem / BreadcrumbLink / BreadcrumbPage / BreadcrumbSeparator** — `asChild`로 라우터 Link wrap 가능
- **EmptyState** — icon + title + description + action 슬롯

### 추가됨 — Toast imperative API (`@polaris/ui`)

기존 `<Toast>` primitive에 더해 shadcn 패턴의 `useToast()` 훅 + `toast()` 함수 + `<Toaster />` 컴포넌트 export. 호출처에서 stack을 직접 관리할 필요 없음:

```tsx
<ToastProvider><App /><Toaster /><ToastViewport /></ToastProvider>
// 어디서든
toast({ title: '저장됨', variant: 'success' });
```

### 추가됨 — Card `asChild` (`@polaris/ui`)

`<Card asChild><section>...</section></Card>` — Button·DropdownMenuTrigger·SidebarItem과 동일한 Slot 패턴.

### 추가됨 — 색상 토큰

- `status.{success,warning,danger,info}.hover` — solid 액션 버튼 hover 색
- `text.onStatus` (Tailwind: `text-fg-on-status`) — solid 상태 배경 위 텍스트 색

### 추가됨 — 문서

- `docs/tailwind-v4-migration.md` — Tailwind v4 (`@theme inline`) 매핑 가이드. v0.3에서 v4-네이티브 preset 추가 전까지의 임시 안내.

### 변경됨 — `@polaris/lint`

- `no-arbitrary-tailwind` — `grid-cols-[1fr_180px_120px]` 같은 layout utility 화이트리스트. 토큰화 불가능한 layout 표현은 허용.
- `prefer-polaris-component` — 새 옵션 `allowFormSubmit` (default `true`). `<button type="submit">`/`<button type="reset">`은 form-control 패턴이므로 native 사용 허용.

### 변경됨 — `packages/template-next`

- `ThemeToggle` SSR 안전 재작성. `useState` + `useEffect` 제거, DOM(`html[data-theme]`) + 쿠키를 source of truth로. React 19의 `react-hooks/set-state-in-effect` 경고 제거 + 첫 페인트부터 올바른 테마.
- `app/layout.tsx`가 `cookies()`로 `polaris-theme` 쿠키를 읽어 `<html data-theme>`을 SSR 시점에 결정.

### 의존성 추가 — `@polaris/ui`

- `@radix-ui/react-checkbox@^1.1.3`
- `@radix-ui/react-switch@^1.1.2`

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

[Unreleased]: https://github.com/miles-hs-lee/PolarisDesign/compare/v0.4.1...HEAD
[0.4.1]: https://github.com/miles-hs-lee/PolarisDesign/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/miles-hs-lee/PolarisDesign/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/miles-hs-lee/PolarisDesign/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/miles-hs-lee/PolarisDesign/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/miles-hs-lee/PolarisDesign/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/miles-hs-lee/PolarisDesign/releases/tag/v0.1.0
