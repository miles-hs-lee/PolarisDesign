---
'@polaris/ui': patch
'@polaris/lint': patch
'@polaris/plugin': patch
'polaris-template-next': patch
'demo': patch
---

리본 아이콘 셋(`@polaris/ui/ribbon-icons`) + 폴라리스 오피스 워드 데모 재구성.

**`@polaris/ui` 신규 — `@polaris/ui/ribbon-icons` 서브패스 (91 디자인팀 아이콘):**
- 57 big × 32 px (lg 리본 버튼용 — 멀티컬러 baked-in)
- 34 small × 16 px (sm/md 리본 버튼용 — 별도 디자인, big의 축소가 아님)
- `RIBBON_ICON_REGISTRY` 슬러그→컴포넌트 동적 lookup
- `RIBBON_ICON_BIG_SLUGS` / `RIBBON_ICON_SMALL_SLUGS` Set으로 set 판별
- `RibbonIconProps` 공용 타입 — `size` prop으로 native size에서 균등 스케일

**Ribbon 컴포넌트 폴리시:**
- `RibbonSeparator` / `RibbonRowDivider`가 deprecated `bg-surface-border` 대신 v0.7 spec 토큰 `bg-line-neutral` 사용 (v0.8의 alias 제거에 미리 대비).

**`apps/demo`:**
- `/polaris-office` 페이지를 실제 폴라리스 오피스 워드 리본에 맞춰 재구성. 홈/삽입/레이아웃/검토/AI 도구 5개 탭 모두 디자인팀 ribbon-icon 사용. 이전 lucide-react best-effort 매칭 대비 91/91 ribbon-icon이 전부 노출됨.
- 파일 백스테이지 메뉴 폰트 weight 정정 (실제 제품과 일치 — bold/semibold 제거).
- 탭 헤더의 "리본 접기" 버튼을 `<RibbonTabList>` 외부로 이동 (`role="tablist"` ARIA 위반 정정).
- `/icons` 카탈로그 페이지에 ribbon 섹션 추가.

**Generator infra:**
- `build-icons` / `build-file-icons` / `build-logos` / `build-ribbon-icons` 4종이 idempotent + concurrency-safe. `pnpm -r typecheck`처럼 동일 출력 디렉토리에 대한 병렬 invocation에서 발생하던 `ENOTEMPTY` 경쟁 상태 해소 (`rmSync` 제거 → mkdir + 파일 단위 overwrite + best-effort orphan prune 패턴).

**Asset 정정:**
- 디자인팀 export 파일명 오타 두 건 정정: `roatateright90` → `rotateright90`, `algnleft01` → `alignleft01`. 정식 첫 릴리즈 전이라 외부 영향 없음.
