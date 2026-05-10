---
'@polaris/ui': patch
'@polaris/lint': patch
'@polaris/plugin': patch
'polaris-template-next': patch
'demo': patch
---

v0.7.3 리뷰의 🟢 nice-to-have 7건 정리 + 컨슈머 피드백 8건 반영 (컴포넌트 4종 신규 + 토큰/문서 보강) + v0.7.5 후보 6건도 함께 묶어 처리 (컴포넌트 6종 신규/확장 + surface elevation 토큰 2단).

**컨슈머 피드백 fix (CLI/플러그인):**
- `packages/plugin/README.md` — 옵션 A "로컬 심링크" 절차가 현재 Claude Code에서 동작하지 않음. 루트에 [`.claude-plugin/marketplace.json`](../.claude-plugin/marketplace.json) 추가하고 README를 mini-marketplace 흐름(`/plugin marketplace add .` + `/plugin install polaris-design@polaris-design`)으로 갱신. Claude **데스크탑** 앱은 plugin 시스템 노출 안 한다는 한계도 명시.
- `packages/lint/bin/polaris-audit.mjs` — temp eslint config 생성 시 임시 디렉토리에 `node_modules`가 없어 `import polaris from '@polaris/lint'` resolve 실패하던 버그 수정. `createRequire(import.meta.url).resolve('@polaris/lint', { paths: [target] })` + `pathToFileURL`로 절대 file URL을 inject. target 우선, audit 스크립트 자체 location fallback. `@polaris/lint`가 target에 미설치면 친절한 에러 메시지로 종료.

**컨슈머 피드백 반영 — 컴포넌트 4종 신규 (37 → 41):**
- `Progress` — determinate (`value` 0-100) / indeterminate 두 모드, `tone` 5종(accent/success/warning/danger/ai), `size` 3종. ARIA `progressbar`/`valuemin`/`valuemax`/`valuenow` 자동, `prefers-reduced-motion` 자동 존중.
- `CopyButton` — `Button` 위에 얹은 wrapper. clipboard write + 1.5s "복사됨" 성공 상태 + `aria-live="polite"` + non-secure context fallback(textarea + `execCommand`)까지 일체. `iconOnly` 모드, `onCopy`/`onError` 콜백 지원.
- `Stat` — KPI 타일. `label`/`value`/`delta`/`deltaTone`(neutral/positive/negative/accent)/`icon`/`helper` 슬롯. `<Card>` 안에 넣어 dashboard 4-up grid 만드는 게 정석. delta 색은 항상 `+`/`-` 부호 동반(WCAG 1.4.1).
- `Disclosure` — Radix Collapsible 기반 single show/hide. 셰브론 180° 회전 + 키보드/ARIA 빌트인. `<Disclosure title="…">` 고수준 wrapper와 `DisclosureRoot`/`DisclosureTrigger`/`DisclosureContent` compound API 둘 다 export.

**컨슈머 피드백 반영 — 토큰/util:**
- `--polaris-shadow-focus` (light/dark 페어) + `shadow-polaris-focus` Tailwind util — 3px 시스템 포커스 링. `focus-ring` 토큰 기반, light에서 alpha 35% / dark에서 45%로 컨트라스트 자동 조정. 커스텀 인터랙티브 요소가 `box-shadow: 0 0 0 3px ...` 패턴을 매번 손코드로 짜는 것을 방지.
- 신규 keyframe `polaris-progress-indeterminate` + `animation-polaris-progress-indeterminate` (Progress 인디터미네이트 셔틀용).

**컨슈머 피드백 반영 — 문서 (discoverability fix):**
- `packages/ui/README.md` — "자주 놓치는 패턴 — discoverability cookbook" 섹션 신설. 컨슈머가 "직접 만들었다" 토로한 6건이 사실 다 있는 것을 1줄 사용 예시로 노출: Stack `direction="row"+justify="between"`, Card slots, Input `hint`/`error`, Toast `toast()` imperative, EmptyState `action`, DropdownMenuFormItem. + 신규 4종 사용 예시. + `label.*` vs `state.*` 시맨틱 분리(`label-danger` 토큰 안 만드는 이유) + 다크모드 자동/수동 대응 가이드.
- `packages/plugin/skills/polaris-web/SKILL.md` — "Don't roll your own when these exist" 항목 추가(같은 6건 + 신규 4종 + `shadow-polaris-focus`). § 5에 `label.*` vs `state.*` 의미 분리 추가. § 8-1 "Dark mode — what's automatic vs. what breaks" 신설(자동 대응 케이스 vs 자동 안 되는 케이스 + 검증 절차).

**테스트 (신규 28건):**
- Progress: 8 (ARIA `valuenow` 누락/유무, clamp, custom min/max, tone/size variants)
- CopyButton: 7 (clipboard call, idle↔copied 스왑, onCopy/onError, iconOnly, disabled, aria-live)
- Stat: 7 (label/value/delta 렌더, tone 색상, helper, icon)
- Disclosure: 6 (default/controlled open, aria-expanded, hideChevron, compound API)

**Test infra note:** `userEvent.setup()`이 `navigator.clipboard`를 자체 폴리필로 덮어쓰기 때문에 CopyButton 테스트는 `userEvent.setup()` *이후* `vi.spyOn(navigator.clipboard, 'writeText')` 패턴을 사용. 헬퍼 함수 `setupClipboardMock(user)`로 묶음.

**v0.7.5 후보 6건 — 컴포넌트 4종 신규 + 기존 2종 확장 (41 → 47):**
- `FileInput` — 트리거 버튼 + 선택 파일명 표시 + 멀티파일 제거 UI. native `<input type="file">` wrap, `accept`/`multiple`/`disabled`/`error`/`hint` props.
- `FileDropZone` — 드래그&드롭 zone. `accept`/`maxSize` 검증 + `onFilesChange`/`onReject({ file, code, reason }[])`. ARIA `role="button"` + Enter/Space 키로 picker 활성화.
- `DateTimeInput` — native `<input type="datetime-local">` wrap. `<Input>`과 동일한 52px 높이 + sm radius + label/hint/error slots. 모바일 OS native picker 자동.
- `TimeInput` — native `<input type="time">` wrap. 24h 값 형식 + 브라우저 i18n 처리.
- `Badge` — `outline` tone 추가 (12 variants × 3 tones = 36 compound entries). transparent bg + colored 1px border + colored text. 비활성/초안/위반 같은 passive 상태용.
- `Pagination` — `PaginationFooter` wrapper 신규. 페이지 번호 + "X-Y of N" 인디케이터 + 페이지사이즈 셀렉터를 한 row로 묶음. 컨트롤드 패턴 (`page`/`pageSize`/`total` + `onPageChange`/`onPageSizeChange`). `labels` prop으로 i18n.
- `Table` — `TableHead`에 `sortable`/`sortDirection`/`onSortChange`/`cycle` props 추가. `aria-sort` 자동 (none/ascending/descending) + 3-state chevron 아이콘 (`asc`/`desc`/null). 기본 cycle `null → asc → desc → null`, 2-state cycle도 지원. `sortable` 미전달 시 기존 동작 그대로 — non-breaking.

**v0.7.5 후보 — 토큰:**
- `surface.popover` (light: `#FFFFFF` / dark: `#232336`) — popover/dropdown/menu/combobox panel 표면.
- `surface.modal` (light: `#FFFFFF` / dark: `#2D2D45`) — modal/dialog/drawer/sheet panel 표면.
- 의미 분리: `layer.overlay`(기존, scrim/dim용 rgba)와 `surface.modal`(NEW, 모달의 패널 자체)는 별개 토큰.

**v0.7.5 테스트 (+33건, 117 → 150/151):**
- Pagination/PaginationFooter: 8 (이미 있던 5 + PaginationFooter 8 새로 + pageNumberItems 2)
- Table: 5 (sortable button render, aria-sort 매핑, 3-state cycle, custom 2-state cycle 등)
- FileInput: 5 (label, error, onFilesChange, multi-summary, remove)
- FileDropZone: 5 (Enter activation, accepted/rejected size/type, disabled)
- DateTimeInput / TimeInput: 6 (type, error border, hint, value forwarding)
- Badge: 2 (outline tone, neutral border-strong)

**v0.7.5 SKILL/README 업데이트:**
- README "자주 놓치는 패턴" 섹션에 7개 신규 사용 예시 1줄씩 + Surface elevation 표.
- SKILL.md "Don't roll your own when these exist"에 7개 항목 추가.

**v0.7.5 — Table helpers 추가 (47 → 51):**
- `TableSearchInput` — 돋보기 + clear × + 옵션 debounce. 단독 사용 가능
- `TableToolbar` — search + filter chips + 우측 actions 슬롯을 표준 layout으로 묶은 wrapper. `chips`은 `{value, label, count?}[]`, `activeChip`/`onChipChange`로 컨트롤
- `TableSelectionBar` — 선택 행 N개 + bulk action 슬롯 + cancel. brand 틴트 strip. toolbar 자리에 conditional render하는 패턴
- `TableSkeleton` — `rows×columns` 행 placeholder. `role="status"` + `aria-busy="true"` + `aria-live="polite"`. animate-pulse는 motion-safe (reduced-motion 자동 존중)
- README cookbook에 별도 컴포넌트화 안 한 4건 추가: 행별 ⋯ 액션 메뉴 (TableCell + DropdownMenu) / 행 선택 (Checkbox + indeterminate 헤더) / 빈 상태 (TableCell colSpan + EmptyState) / 컬럼 가시성 토글 (TableToolbar actions + DropdownMenuCheckboxItem)
- 테스트 +12건 (TableSearchInput 2 + TableToolbar 4 + TableSelectionBar 3 + TableSkeleton 3)

**Demo 카탈로그 보강:**
- `apps/demo/src/pages/Components.tsx`에 v0.7.4/v0.7.5 신규 10종 모두 섹션 추가 (#36~#44):
  - Progress (5단 값 · tone 5종 · size 3종 · indeterminate · 인터랙티브)
  - CopyButton (4 variants · iconOnly · 토스트 연동)
  - Stat (4-up grid · positive/negative/accent · helper · icon)
  - Disclosure (default · defaultOpen · hideChevron · asChild Button trigger)
  - Badge outline tone (subtle/solid/outline 6 variant 비교)
  - PaginationFooter (기본 · showTotal=false · 사이즈 셀렉터 미사용 · i18n labels)
  - **Sortable Table 통합 데모** — `TableToolbar`(검색+chip+추가) ↔ `TableSelectionBar`(N개 선택 시 교체) + Checkbox 행 선택(indeterminate 헤더) + sortable TableHead + 행별 ⋯ DropdownMenu + TableSkeleton
  - FileInput / FileDropZone (3+2 variants)
  - DateTimeInput / TimeInput (정상 / 에러 상태 grid)



**`apps/demo`:**
- `ProposalPlatform.tsx` 미사용 import 제거 (`Sparkles`, `SearchIcon`)
- `ProposalPlatform.tsx` JSDoc inconsistency 수정 (`hwp/hwpx/docx` → `hwp/docx/pdf`, 실제 코드와 일치)
- `prefer-polaris-icon` warning 80건 → 36건 마이그레이션 (44 swap). lucide → polaris 매핑 표(`prefer-polaris-icon.ts`의 `ICON_MAP`)대로 8 파일 일괄 처리: `Bell→BellIcon`, `Search→SearchIcon`, `Plus→PlusIcon`, `User/Users→UserIcon`, `Pencil/Edit→PencilLineIcon`, `Trash2→DeleteIcon`, `XCircle→CircleXIcon`, `Languages→TranslateIcon` 등. `Assets.tsx`(의도적 lucide catalog 페이지)와 polaris 등가물 없는 36건은 lucide 그대로.
- `CrmContractDetail.tsx`/`PolarisOffice.tsx`의 mixed-source icon array 타입을 `LucideIcon` → `React.ElementType`으로 widen.

**`packages/template-next/README.md`:**
- v0.6 deprecated alias 광고(`bg-brand-primary`, `text-fg-primary`) → v0.7 spec 토큰명(`bg-accent-brand-normal`, `text-label-normal`)으로 정정. 새 컨슈머가 이를 따라하면 v0.7.3에 추가된 `no-deprecated-polaris-token` 룰(error)에 install 직후 막혔음.

**`packages/lint/src/index.ts`:**
- `meta.version` `0.5.0` → `0.7.3` (stale 메타데이터 정합).
- `scripts/sync-root-version.mjs`에 `TS_TARGETS` 패턴 매처 추가 — 앞으로 `pnpm version`이 이 string literal도 자동 갱신. 다음 release 사이클부터 stale 재발 방지.

**`scripts/verify.mjs`:**
- "Verify token sync" / "Verify DESIGN.md sync" step이 unrelated WIP에 mis-fire하던 문제 해소. 해당 파일이 working tree에서 dirty면 자동 skip하고 경고 출력. CI clean checkout에서는 그대로 strict 동작 — drift 보호 유지하되 dev branch에서 pre-push hook 거짓 알람 방지.

**`@polaris/lint/no-tailwind-default-color`:**
- `bg-neutral-*` 위반 메시지에 deprecated rc.0 ramp임을 명시. semantic 교체 hint를 `label-* / fill-* / line-*`로 specific하게.

**검증:**
- `pnpm verify` → 13/13 ✓
- `pnpm test:e2e` → baseline 변동 없음 (신규 컴포넌트는 demo 카탈로그에 아직 미노출 — 다음 패치 후보)
- `pnpm --filter @polaris/lint test` → 95/95 ✓
- `pnpm --filter @polaris/ui test` → **89 → 163/163 ✓** (+74 신규)
- demo lint warning **80 → 36** (-44, 55% 감소)

Patch only — additive. 컨슈머 영향 없음 (모든 신규 export, 기존 API 변경 없음). `TableHead`의 `sortable`/`sortDirection`/`onSortChange`/`cycle` props도 모두 optional이라 미전달 시 기존 동작 그대로.
