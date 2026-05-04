---
description: 기존 프로젝트를 폴라리스 디자인 시스템으로 점진적 마이그레이션
---

이 프로젝트가 폴라리스 웹 서비스인데 아직 디자인 시스템이 적용되지 않은 상태(예: 직접 hex 색상, 임의 Tailwind 값을 쓰고 있음)라면 다음을 순서대로 진행하세요. 각 단계 끝마다 사용자에게 결과를 짧게 보고하고 다음으로 넘어갑니다.

## 1. 진단 (audit)

```sh
npx polaris-audit
```

이 명령은 ESLint를 `@polaris/lint` recommended 프리셋으로 돌려서 다음을 출력합니다:
- 총 위반 수
- 룰별 카운트 (`no-hardcoded-color`, `no-arbitrary-tailwind`, `no-direct-font-family`, `prefer-polaris-component`)
- 자주 등장하는 hex 컬러 top 10 (브랜드 색상 후보)
- 자주 등장하는 Tailwind 임의값 top 10
- 위반이 가장 많은 파일 top 10

`@polaris/lint`가 없으면 먼저 설치:
```sh
pnpm add -D @polaris/lint @polaris/ui
```

## 2. 자동 수정

```sh
npx eslint . --fix
```

자동 수정 가능한 위반은 여기서 처리됩니다. 수정 전후 audit을 비교해서 줄어든 위반 수를 사용자에게 보고하세요.

## 3. 매핑 합의

audit의 "Top recurring hex colors" 결과를 토대로 사용자에게 다음을 확인:

> 자주 쓰이는 hex 색상이 다음과 같이 잡혔습니다. 각 색상이 어떤 폴라리스 토큰에 매핑되는지 알려주세요. 그 외 색상은 어떻게 처리할지(가까운 토큰으로 흡수 / 새 토큰 추가 / 그대로 유지)도 함께 결정해야 합니다.

매핑 결정에는 다음 토큰을 사용 가능:
- 브랜드: `brand.primary` (파랑), `brand.secondary` (보라/NOVA), `brand.green`, `brand.orange`, `brand.red`, `brand.purple`
- 파일: `file.docx/hwp` (파랑), `file.xlsx` (초록), `file.pptx` (주황), `file.pdf` (빨강)
- 상태: `status.success/warning/danger/info`
- 표면: `surface.canvas/raised/sunken/border/border-strong`
- 텍스트: `fg.primary/secondary/muted/on-brand`
- 뉴트럴: `neutral.0` ~ `neutral.1000`

## 4. 페이지 단위 마이그레이션 (Strangler-fig)

빅뱅 금지. 한 번에 한 페이지씩:

a. 가장 위반이 적은 파일부터 시작 (audit "Worst offender files" 역순)
b. 그 파일의 위반을 토큰으로 교체
   - hex `#1D4ED8` → `var(--polaris-brand-primary)` 또는 `bg-brand-primary` 클래스
   - `bg-[#xxx]` / `p-[13px]` → 토큰 기반 클래스 (`bg-brand-primary`, `p-4`)
   - `font-family: ...` → `font-polaris` 또는 `var(--polaris-font-sans)`
   - `<button>` → `<Button>` from `@polaris/ui`
c. `npx polaris-audit <file>`로 그 파일만 재검증
d. 0건이면 다음 파일로

각 페이지가 끝날 때마다 사용자에게 진행 상황을 짧게 보고:
> `app/dashboard/page.tsx` 마이그레이션 완료. 위반 47건 → 0건. 다음은 `app/settings/page.tsx` (위반 32건).

## 5. 강제 전환

모든 페이지가 0건이 되면 `eslint.config.mjs`의 룰을 `'error'` 레벨로 격상(이미 recommended에서 `error`이지만, 마이그레이션 중에는 일부를 `warn`으로 임시 완화한 경우 복원). 그리고 사용자에게:

> 마이그레이션 완료. 이제부터 hex 색상·임의값·직접 폰트는 lint에서 차단됩니다. CI에 lint를 추가하면 PR 단계에서도 자동 차단됩니다.

## 6. PostToolUse 훅 활성화

이 프로젝트에서 Claude Code로 작업할 때 자동 검증이 작동하도록 `polaris-design` 플러그인이 설치돼 있는지 확인:
- `~/.claude/plugins/polaris-design`이 존재하는지
- 없으면 사용자에게 설치 방법 안내

## 주의

- **시각 회귀 검증 필수**: 토큰 교체 후 페이지가 시각적으로 달라질 수 있습니다. 페이지마다 before/after 스크린샷을 사용자에게 보여주거나, Playwright 같은 도구로 비교를 권장.
- **대량 자동치환 금지**: regex로 `#xxx` → `var(--polaris-...)` 일괄치환은 위험. 같은 hex라도 컨텍스트(글자색 vs 배경색 vs 보더)에 따라 다른 토큰일 수 있음.
- **`/* eslint-disable */`로 우회 금지**: 룰을 끄면 마이그레이션의 의미가 사라집니다. 정 안 되는 케이스(예: 외부 라이브러리 색)는 사용자에게 보고해서 토큰 추가 여부를 결정.
