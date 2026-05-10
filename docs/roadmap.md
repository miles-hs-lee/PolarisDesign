# Polaris Design Roadmap

릴리스별 계획. 우선순위는 ROI 기준 추정 — 사이클 시작 시 재검토.

---

## ✅ v0.5.0 — Ribbon (완료)

에디터 제품군(Office 도큐먼트·MD 에디터·스프레드시트·PDF 도구 등)을 위한 toolbar 패턴. Subpath로 분리(`@polaris/ui/ribbon`)해서 일반 SaaS 사용자는 dep 부담 없음.

추가:
- `Ribbon`, `RibbonTabs`/`RibbonTabList`/`RibbonTab`/`RibbonContent`
- `RibbonGroup` (label 옵션) + `RibbonSeparator`
- `RibbonButton` (size: `sm` icon-only / `md` / `lg` icon-over-label)
- `RibbonSplitButton` (main + dropdown chevron)
- `RibbonToggleGroup` / `RibbonToggleItem` (single/multiple selection)
- 새 dep: `@radix-ui/react-toggle-group`

---

## ✅ v0.6.0 — Ribbon 정비 + 데모 통합 (완료)

- `RibbonMenuButton`, `RibbonRowDivider` 추가
- `RibbonSplitButton` lg vertical 분할, scrollbar 숨김으로 panel 높이 통일
- disabled split의 menu trigger도 차단, icon-only 버튼 aria-label 자동 fallback
- PolarisOffice 데모 탭별 컴포넌트 분리
- Storybook 제거 → 컴포넌트 카탈로그(SPA) + `/tokens` 라우트로 통일
- 데모 vite alias로 `@polaris/ui` source 직접 import (별도 빌드 없이 HMR)

---

## ✅ v0.7.0 — DESIGN.md 완전 정렬 + 디자인팀 자산 통합 (완료)

디자인팀 v1 (2026.05) 정의서 — `DESIGN.md` + `primitive-color-palette` — 에 토큰 명명·값·컴포넌트 스펙 완전 정렬. 8개 누적 changeset 통합.

추가:
- **시맨틱 토큰 19개 신설** — `label.*` (6) / `background.*` (4) / `layer.*` (2 NEW) / `interaction.*` (pressed NEW) / `fill.*` (neutral·strong NEW) / `line.*` (strong·disabled NEW) / `accentBrand.*` (bg·bgHover NEW) / `accentAction.*` (Black 버튼, NEW) / `focus.ring` / `staticColors.*` / `state.*` (new + bg variants 4 NEW)
- **컬러 primitive 확장** — 10단계 (`05`/`90`) × 11 family. 5 supplementary 신설 (Sky Blue / Blue / Violet / Cyan / Yellow). Gray ramp.
- **다크 모드 그레이스케일 재작성** — 퍼플 틴트 → 단색 그레이.
- **Radius 스케일 한 단계 시프트** — `md` 8→12 (default), `lg` 12→16, `xl` 16→24, `2xl` 24→38.
- **Typography 11레벨 spec 명명** — `display`(40)/`title`(32)/`heading1-4`(28/24/20/18)/`body1-3`(16/14/13)/`caption1-2`(12/11). Caption weight 700, body letter-spacing 제거. 모바일(≤767px) 자동 축소.
- **새 토큰 시스템 4개** — Spacing (12 named, `4xs`–`4xl`) · Z-index (6 levels) · Motion (duration × 4 + easing × 3) · Breakpoint (semantic).
- **Button 6 사이즈** — 24/32/40/48/54/64 + Black variant (`accentAction.*`).
- **Input 52px floating title**, **Modal 24r layer.surface**, **Toast dark+blur 48h**.
- **디자인팀 SVG 자산 통합**:
  - `@polaris/ui/icons` — 65 UI 아이콘 × 18/24/32 px (currentColor)
  - `@polaris/ui/file-icons` — 29 파일 타입 (multi-color baked-in)
  - `@polaris/ui/logos` — `PolarisLogo` (3 variants × 2 tones) + `NovaLogo` (2 tones)
  - `<FileIcon>` 색깔 사각형 → 디자인팀 실제 SVG로 완전 교체 (5 → 29 타입)
  - `@polaris/ui` 내부 lucide-react → 폴라리스 아이콘 교체 (있는 것만)
- **자동 codemod** — `polaris-codemod-v07` (v0.6/rc.0/rc.1/rc.2 → v0.7)
- **신규 lint 룰 2개** — `state-color-with-icon` (WCAG 1.4.1) + `prefer-polaris-icon` (lucide-react 마이그레이션 유도)
- **Tokens 페이지 자동화** — `colors` export iterate로 새 그룹 추가 시 자동 반영. figma-spec PNG 인라인.

마이그레이션: [`docs/migration/v0.6-to-v0.7.md`](migration/v0.6-to-v0.7.md).

---

## ✅ v0.7.1 — Ribbon 아이콘 셋 + 폴라리스 오피스 데모 재구성 (완료)

v0.7.0 위에 누적된 추가. **breaking 없음**, 디자인 시스템에 ribbon 아이콘 셋 추가.

- **`@polaris/ui/ribbon-icons` 신규 서브패스** — 91 디자인팀 아이콘 (57 big × 32 + 34 small × 16). `RIBBON_ICON_REGISTRY`, `RIBBON_ICON_BIG_SLUGS`, `RIBBON_ICON_SMALL_SLUGS` Set 동적 lookup.
- **폴라리스 오피스 데모 페이지 재구성** — 홈/삽입/레이아웃/검토/AI 도구 5개 탭을 실제 폴라리스 오피스 워드 리본과 1:1 매칭. lucide best-effort → 91/91 디자인팀 아이콘.
- **SVG id 격리** — 4종 generator (`build-icons`, `build-file-icons`, `build-logos`, `build-ribbon-icons`)가 SVG 본문의 모든 `id="..."` 정의 + `url(#...)` / `href="#..."` 참조를 슬러그 prefix로 다시 작성. Figma 자동 ID 충돌 해소.
- **Ribbon 폰트 weight 정정** — `text-polaris-caption1`이 spec상 weight 700이지만 Office 실제 ribbon은 regular. `RibbonButton` lg + `RibbonStack` 라벨 + `RibbonTab` active 상태 모두 정정.
- **Generator concurrency-safe** — `pnpm -r typecheck`처럼 동일 출력 dir에 대한 병렬 invocation에서 `ENOTEMPTY` 경쟁 상태 해소.
- **template-next lint 게이트** — `--max-warnings=0` 적용. 3 warnings (`Plus`, `Search`, `Image`)는 polaris 등가물로 swap.
- **컴포넌트 네이밍 정리** — Figma compound concat 슬러그를 사람이 읽기 쉬운 PascalCase로 (예: `Aligncenter` → `AlignCenter`, `Wordcount` → `WordCount`, `Rotateright90` → `RotateRight90`).

---

## ✅ v0.7.3 — 디자인팀 재검수 + tooling 강화 (완료)

- 12+ 컴포넌트 hover/active 회귀 fix (`accent-brand-normal-subtle` Tailwind alias 누락)
- `polaris-helper` 토큰 신설 (12 / 400 / lh 1.3) + Form 7곳 마이그레이션
- `FormMessage` 자동 ErrorIcon prepend (DESIGN.md §4 / WCAG 1.4.1)
- 신규 lint 룰 3개: `no-tailwind-default-color`, `no-deprecated-polaris-token`, `no-non-polaris-css-var`
- `/proposal-platform` 데모 페이지 + `/polaris-brand-audit` 슬래시커맨드
- `pnpm verify` 13-step 통합 (CI 회귀 차단)

---

## ✅ v0.7.5 — 컨슈머 피드백 + v0.8 후보 일괄 (완료)

DocFlow 컨슈머 피드백을 받아 누적된 갭을 한 번에 해소. **BREAKING 없음.** 컴포넌트 37 → 51 (+14).

- **신규 컴포넌트 14종**: feedback / utility (Progress · CopyButton · Stat · Disclosure) + file / time / pagination (FileInput · FileDropZone · DateTimeInput · TimeInput · PaginationFooter) + Table helpers (TableSearchInput · TableToolbar · TableSelectionBar · TableSkeleton + TableHead `sortable`)
- **Badge `outline` tone** + `state-{success|warning|error|info}-strong` WCAG AA 토큰 4개
- **Surface elevation 토큰**: `surface.popover` / `surface.modal` (다크 모드 elevation 강화)
- **`shadow-polaris-focus` Tailwind utility** — 3px 시스템 포커스 링
- 컨슈머 측 plugin install 가이드 fix (`.claude-plugin/marketplace.json` 추가) + `polaris-audit` temp config resolve fix

---

## ✅ v0.7.7 — 컴포넌트 완성도 리뷰 + 코덱스 리뷰 (완료, 2026-05-10)

컴포넌트 완성도/범용도 리뷰 결과 도출된 갭을 메운 누적 patch + 코덱스 리뷰로 발견된 a11y/state-sync 회복. **BREAKING 없음.** 컴포넌트 51 → 58 family · 169 → 235 tests.

**신규 컴포넌트 7종 (Tier 3.8)**:
- `Combobox` (Popover + cmdk searchable Select, single + multiple + groups)
- `PageHeader` / `SectionHeader` (페이지 / 섹션 레이아웃 표준)
- `Tabs variant="underline"` (페이지 navigation 스타일)
- `Accordion` (Radix Accordion 기반, type=single|multiple)
- `CircularProgress` (라디얼 인디케이터, 4 size × 5 tone)
- `AvatarGroup` (overlap row + +N 인디케이터)
- `NavbarItem` (Sidebar/SidebarItem 패턴 미러 — `active`/`asChild`/`icon`/`href`)

**API surface 채우기 — 13개 컴포넌트 props 추가**:
- Textarea `autoResize` + `showCount`
- Input `prefix` / `suffix` / `clearable` + `onClear`
- Switch `label` / `hint` / `error` (Checkbox 일관성)
- Skeleton `shape="rect|text|circle|bare"` + `lines={N}`
- Alert `dismissible` + `action`
- Badge `dismissible` + `icon`
- Stat `loading`
- Button `iconLeft` / `iconRight` / `fullWidth`
- Card `interactive`
- DropdownMenuItem `icon`
- TableRow `selected` / `clickable` (keyboard activation 빌트인)
- Toaster `defaultDuration`

**코덱스 리뷰 9건 fix (a11y / state-sync 회복)**:
- Combobox interactive nesting 해소 (clear button을 trigger SIBLING으로)
- Input `value={0}` false-negative + controlled value reset 동기화
- Textarea uncontrolled showCount + over-limit state-error 색
- TableRow `clickable && onClick` 시 keyboard 활성화 + descendant click 격리
- Surface elevation 토큰 first-party overlay 적용 (DropdownMenu/Select/Popover/Command → popover, Dialog/Drawer/Command → modal)
- FileDropZone `multiple=false` drop 경로 제한 + consumer event handler compose
- DateTimeInput JSDoc UTC shift 함정 제거
- Badge outline tone WCAG AA (`state.*Strong` 매핑)
- Skeleton (+ TableSkeleton) `motion-safe:animate-pulse`

**Demo 카탈로그 재구성**:
51 → 45 섹션 통합 (한 컴포넌트 = 한 섹션) + 6 카테고리 탭 (foundation / forms / navigation / overlays / data / polaris) + 카테고리 안 1부터 재번호 + sub-grouping (Variants / Sizes / States / Slots) + Toast outlet을 page root로 이동.

**SKILL.md cookbook 18건 추가** — "Don't roll your own when these exist" 항목 강화.

---

## v0.7.x — 후속 patch

- 컨슈머/코덱스 리뷰 후속 fix (필요 시)
- 디자인팀 follow-up 합의분 흡수
- DataPagination 고수준 wrapper (v0.5.x carry-over) — `<PaginationFooter>`로 부분 해소됨 평가
- Form/Calendar/Command stable화 — v0.4 experimental 상태 평가 후 stable 또는 제거 결정

---

## v0.5.x — 사용자 검증된 우선순위 (피드백 기반)

### High-impact (사이클 초반에 처리)

**1. Pagination — `<DataPagination>` 고수준 wrapper**
현재 `Pagination > PaginationPrev/Item/Ellipsis/Next`를 사용처마다 30줄로 조립. 거의 모든 사용처가 동일 패턴. wrapper 추가:
```tsx
<DataPagination current={n} total={t} buildHref={(p) => `?page=${p}`} />
```
- primitives는 그대로 유지 (low-level escape hatch)
- `pageNumberItems()`를 내부에서 사용
- asChild로 `<Link>`/`<NavLink>` 래핑 자동
- Server-side URL pagination 패턴 한 줄로

**2. Table — sticky header + sortable th**
0.4 Table primitive에 옵션 부재. legacy admin의 data-table은 1000px+ 가로 스크롤 + 정렬 header.
```tsx
<TableHeader sticky>
  <TableHead sortable direction="asc" onSort={(dir) => ...}>계약명</TableHead>
</TableHeader>
```
- DataTable(v0.6+ 큰 작업)과 별개. Table primitive에 옵션만 추가.

**3. StatCard — KPI 표시 컴포넌트**
사실상 모든 대시보드 SaaS에 동일 패턴. 사용자 측에서 자체 wrapper 만드는 중.
```tsx
<StatCard label="활성 계약" value="1,234" delta="+12%" deltaTone="success" />
```
- v0.3 recipes.md에 예시 코드는 있지만, 정식 컴포넌트화 가치 큼.
- icon prop, trend prop 포함.

**4. Badge `dot` variant**
상태 배지 (활성/취소/만료) 표현. 현재 사용자가 `<span className="size-1.5 rounded-full bg-status-success" />` 직접 그림.
```tsx
<Badge dot variant="success">활성</Badge>
```

**5. Drawer responsive — desktop → Dialog, mobile → bottom sheet**
모바일 대응 한 줄.
```tsx
<Drawer responsive>...</Drawer>
```
- breakpoint(`md` 이상은 side="right" Drawer, 미만은 side="bottom"으로 auto-switch)
- 또는 별도 `<ResponsiveDialog>` 컴포넌트.

### Medium-impact

**6. asChild 일관성 — Toaster, Toast**
useToast로만 커스텀 trigger 가능 — asChild 추가하면 wrap 패턴 자연스러워짐.

**7. Toast position 모바일 자동 전환**
`top-right` → 모바일에서 `top-center` 자동 전환 옵션.

**8. v4-theme.css ↔ Tailwind preset 단일 소스 보장**
현재 두 파일이 수동 동기화. drift 위험.
- 옵션 A: preset.ts를 source-of-truth로 두고 빌드 시 v4-theme.css 자동 생성
- 옵션 B: CI에서 diff 검증
- B가 빠르고 견고, A가 더 깔끔. v0.5에선 B로 시작.

**9. `--polaris-*` vs `--color-*` 네이밍 docs**
사용자가 `style={{ background: "var(--polaris-brand-primary)" }}` vs `var(--color-brand-primary)` 어느 쪽이 권장인지 헷갈림.
- 결론: `--polaris-*`가 source, `--color-*`는 Tailwind v4 alias. inline style에는 `--polaris-*` 사용 권장.
- patterns.md에 한 단락.

### Low-impact / 작은 polish

**10. 다크 모드 warning 채도 조정**
`--polaris-status-warning` dark가 살짝 saturated. `Alert variant="warning"`이 다크 배경에서 튐. 톤다운.

**11. Tier 분류 매트릭스**
현재 README에 "Tier 0/1/2/2.5/3" 분류는 있지만, 안정성(production-ready vs experimental)과 따로 표현되지 않음. 별도 표:
| 컴포넌트 | Tier | Stability |
|---|---|---|
| Button | Tier 0 | ✓ Stable |
| Calendar | Tier 3 | 🧪 Experimental |
| ... | | |

per-component badge — JSDoc `@experimental` tag → docs에서 자동 추출.

**12. 설치 가이드 v4 우선 재작성**
현재 README는 v3가 default. 사실 v4 + v4-theme.css가 한 줄이라 새 프로젝트에선 압도적으로 단순. install guide 첫 예시를 v4로 교체.

---

## v0.5.x — 작은 패치

### 검증 필요 (잠재적 bug)

**`prefer-polaris-component` lint가 server action `<button type="submit">` flag**
v0.4 사용자 보고 — `app-user-manager.tsx`, `price-book-activate-button.tsx` 등의 server action `<form action={...}>` 안의 `<button type="submit">`가 여전히 warning. v0.2.0의 `allowFormSubmit` 수정으로 회귀 테스트는 통과하고 있어서 두 가지 가능성:
- (a) 사용자의 `@polaris/lint` 버전이 v0.2.0 이전
- (b) form action 안의 특정 케이스가 우리 화이트리스트를 통과하지 못함

조치: 보고 환경에서 `npx polaris-audit` + `pnpm list @polaris/lint`로 확인. 진짜 회귀면 lint 룰 추가 fixture + patch.

---

## v0.8.0 — BREAKING 청소 (codemod 1회 마이그레이션)

v0.6/rc.0/rc.1 거치며 누적된 deprecated alias + naming 불일치를 한 번에 정리. 컨슈머는 `polaris-codemod-v08` 1회 실행으로 자동 마이그레이션.

**Tailwind utility deprecated alias 제거** (`bg-fg-*`, `bg-surface-canvas/raised/sunken`, `bg-brand-primary*`, `bg-status-*`, `text-polaris-display-lg`/`-h1`~`-h5`/`-body`/`-meta`/`-tiny`, `bg-neutral-5` 등).

**TS token alias 제거** (`text.*` / `surface.*` / `brand.*` / `primary.*` namespaces, `displayLg`/`displayMd`/`headingLg`/`headingMd`, ramp `'5'` no-leading-zero).

**컴포넌트 prop 정리**:
- `Button variant="outline"` 제거 (→ `tertiary`)
- `radius.full` 제거 (→ `pill` 단일화)
- **`Input.hint` → `helperText` rename** (다른 디자인 시스템과 정렬, 컨슈머 디스커버리 fix)
- **`HStack` / `VStack` 제거** (→ `Stack direction` 단일 API. 이미 SKILL/README에선 Stack만 안내 중)

**의존성**:
- `polaris-codemod-v08` 신규 — Tailwind utility / TS token / prop 매핑 자동 변환
- `@polaris/lint` `no-deprecated-polaris-token` 룰을 warning → **error** 승격

**그 외**:
- Pretendard local hosting (CDN 졸업) — 폰트 로딩 안정성 확보 (선택, 가능하면 v0.8.0에 묶기)
- v0.4 experimental (Calendar / DatePicker / CommandPalette) 결정 — stable promote 또는 별도 패키지 분리

---

## v0.9 — 디자인팀 follow-up + 추가 신규 (RFC 후)

**디자인팀 검수 보류분 (v0.7.2부터 누적, 합의 후 진행)**:
- Tertiary 2종 분리 (흰 배경 + 회색 배경)
- Modal/Dialog 풀 너비 버튼 layout
- Checkbox 4종 (default / disabled / error / AI Purple)
- Alert 결정 (variant 축 vs tone 축)
- PolarisLogo `stacked` variant + symbol negative SVG
- NovaLogo tone 옵션 확장

**추가 컴포넌트 후보 (실 사용 요청 검증 후)**:
- **DataTable** — sortable + filterable + virtualized. tanstack-table 위 또는 자체. v0.7.5 Table integration 위에서 다음 단계.
- **NumberInput** — 한국어 IME 우회. 통화/단가 전용.
- **Slider / Range** — 가격/좌석 수 필터.
- **CodeBlock** — JSON debug view, RPC 결과.
- **CheckboxGroup / RadioGroup** — 그룹 ARIA + horizontal/vertical layout.

---

## v1.0 — 사인오프

- 모든 v0.5–v0.7 carry-over 완료
- 디자인팀 v0.9 follow-up 완료
- Tier 분류 + stability badge 정착
- 사내 npm registry publish 검토 (현재는 GitHub Release tarball)
- 시각 회귀 테스트 (Playwright) CI 통합 ✓ (v0.7 시점에 28 baselines 운영 중 — 사이즈 안정화 후 stable 마크)
- 다중 스택 지원 검토 (사내 두 번째 스택 사용처가 의미 있을 때만)

---

## 의도적으로 미루는 것

- **다중 프레임워크 (Vue/Svelte 포트)** — 사내 두 번째 스택 수요가 명확해질 때까지 보류. 토큰·Tailwind preset·lint는 React 없이도 동작.
- **Web Components 패키지** — 같은 이유. 향후 임베드/위젯 케이스 발생 시 검토.
- **React Native 패키지** — 모바일 앱 로드맵 확정 시. Tamagui 가능성 높음.
- **자체 토큰 builder GUI** — 토큰이 안정되기 전까지 over-engineering.
