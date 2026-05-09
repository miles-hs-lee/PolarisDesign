---
'@polaris/ui': patch
'@polaris/lint': patch
'@polaris/plugin': patch
'polaris-template-next': patch
'demo': patch
---

v0.7.3 리뷰의 🟢 nice-to-have 7건 정리 + 컨슈머 피드백 2건 fix.

**컨슈머 피드백 fix:**
- `packages/plugin/README.md` — 옵션 A "로컬 심링크" 절차가 현재 Claude Code에서 동작하지 않음. 루트에 [`.claude-plugin/marketplace.json`](../.claude-plugin/marketplace.json) 추가하고 README를 mini-marketplace 흐름(`/plugin marketplace add .` + `/plugin install polaris-design@polaris-design`)으로 갱신. Claude **데스크탑** 앱은 plugin 시스템 노출 안 한다는 한계도 명시.
- `packages/lint/bin/polaris-audit.mjs` — temp eslint config 생성 시 임시 디렉토리에 `node_modules`가 없어 `import polaris from '@polaris/lint'` resolve 실패하던 버그 수정. `createRequire(import.meta.url).resolve('@polaris/lint', { paths: [target] })` + `pathToFileURL`로 절대 file URL을 inject. target 우선, audit 스크립트 자체 location fallback. `@polaris/lint`가 target에 미설치면 친절한 에러 메시지로 종료.



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
- `pnpm verify` → 13/13 ✓ in 51s
- `pnpm test:e2e` → 30/30 ✓ (baseline 변동 없음 — polaris/lucide 동일 시각)
- `pnpm --filter @polaris/lint test` → 95/95 ✓
- `pnpm --filter @polaris/ui test` → 89/89 ✓
- demo lint warning **80 → 36** (-44, 55% 감소)

Patch only — additive. 컨슈머 영향 없음.
