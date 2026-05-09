---
'@polaris/ui': patch
'@polaris/lint': patch
'@polaris/plugin': patch
'polaris-template-next': patch
'demo': patch
---

DESIGN.md §4 Inputs & Forms에 명시된 폼 helper / error 텍스트 spec 정합.

**`polaris-helper` 타이포그래피 토큰 신설** — 12px / weight 400 / lh 1.3.

DESIGN.md가 Floating Title과 Error Text 모두 `--font-size-xxs (12px) / --weight-regular`로 명시. 기존 `polaris-caption1` 토큰은 spec상 weight 700 (badges, tags 용도)이라 그대로 유지. 의미상 다른 두 사용처를 별도 토큰으로 분리해 향후 단일 변경으로 모든 폼 helper 텍스트가 따라가도록 정합.

마이그레이션 (7곳):
- `Form.tsx` FormDescription, FormMessage
- `Input.tsx` floating label / error / helper
- `Checkbox.tsx` error / hint
- `Textarea.tsx` error / hint

이전 v0.7.3의 임시 `text-polaris-caption1 font-normal` 패치를 `text-polaris-helper`로 정식 토큰화. caption1 token 자체는 무변경.

**`FormMessage` 자동 ErrorIcon prepend** — DESIGN.md §4 명시:

> 필수: 아이콘 동반 (X 또는 ⚠️, 16px) — 텍스트 좌측에 4px gap. 색상만으로 에러를 전달하지 않음 (WCAG 1.4.1)
>
> 레이아웃: `[icon] Error message text` — 아이콘과 텍스트 모두 `--state-error` 색상

`Form.tsx`의 `FormMessage`가 자동으로 `<ErrorIcon size={16} />`을 prepend. `flex items-start gap-polaris-3xs`, `role="alert"` 적용. react-hook-form 컨트롤러 흐름에서 모든 폼 에러가 일관된 시각/접근성 패턴으로 표시됨.

**`Checkbox` / `Textarea` 에러 상태 일관성** — 같은 ErrorIcon + flex 레이아웃 적용. hint 상태는 텍스트만(아이콘 없음). 폼 컴포넌트 패밀리 전체가 동일 spec.

**시각 회귀 baseline**: components-catalog (desktop + mobile) 갱신.

**나머지 디자인팀 답이 필요한 5+1건은 docs/design-team-followup.md로 분리**:
- Tertiary / Ghost 정합 (DESIGN.md 부분 답)
- Modal 풀 너비 버튼 layout (DESIGN.md 미정)
- Checkbox 4가지 형태 + RadioGroup 신설 (DESIGN.md 미정)
- Checkbox AI Purple variant (DESIGN.md 일반 룰만)
- Alert 유지/제거 결정 (DESIGN.md에 Alert 미존재 — Toast 단일)
- 디자인팀 검수 절차 확립 (메타)

검증: typecheck 4/4 Done, vitest 89/89, playwright 28/28 (catalog baseline 갱신).
