---
'@polaris/ui': patch
'@polaris/lint': patch
'@polaris/plugin': patch
'polaris-template-next': patch
'demo': patch
---

v0.7.3 리뷰의 🟢 nice-to-have 7건 정리 + 컨슈머 피드백 8건 반영 (컴포넌트 4종 신규 + 토큰/문서 보강).

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
- `pnpm test:e2e` → baseline 변동 없음 (Progress/CopyButton/Stat/Disclosure는 demo 카탈로그에 아직 미노출 — 다음 패치 후보)
- `pnpm --filter @polaris/lint test` → 95/95 ✓
- `pnpm --filter @polaris/ui test` → **89 → 117/117 ✓** (+28 신규)
- demo lint warning **80 → 36** (-44, 55% 감소)

Patch only — additive. 컨슈머 영향 없음 (모든 신규 export, 기존 API 변경 없음).
