---
'@polaris/ui': patch
'@polaris/lint': patch
'@polaris/plugin': patch
'polaris-template-next': patch
'demo': patch
---

디자인팀 v0.7.2 재검수의 자동 처리 가능 항목 6건 정리. 디자인 조율이 필요한 7건은 [`docs/design-team-followup.md`](docs/design-team-followup.md)로 분리.

**`variant="outline"` (deprecated) → `variant="tertiary"` 일괄 마이그레이션 (22곳)**

`apps/demo` 21곳 + `packages/ui/src/components/DatePicker.tsx` 2곳 (Button trigger). Components 카탈로그의 `<Button variant="tertiary">Outline</Button>` showcase 줄도 라벨을 "Tertiary"로 정정 — outline은 더 이상 표면에 노출되지 않음.

**`status-*` v1 토큰 → `state-*` v2 토큰 (24줄, 6 컴포넌트)**

`Alert`, `Badge`, `DropdownMenu`, `Checkbox`, `Textarea`, `Form` 컴포넌트에서 `text-status-{success,warning,info,danger}`, `bg-status-X/<alpha>`, `border-status-X`, `outline-status-X`, `ring-status-X` 등을 모두 v0.7 spec의 `state-*`로 마이그레이션. 매핑:

- `success`/`warning`/`info` → 동명
- `danger` → `error` (rename)
- `bg-status-X/N` (alpha-blended) → `bg-state-X-bg` (디자인된 light tint)

`DropdownMenu`의 destructive variant도 같이 정합. 옛 alpha 기반 추정 색이 디자인팀 spec의 정식 `*-bg` 토큰으로 교체되어 다크 모드에서도 의도한 색이 정확히 나옵니다.

**Form helper / error / floating-label 텍스트 weight 정정 (7곳)**

`polaris-caption1` 토큰은 spec상 weight 700이지만, form 컨텍스트의 helper / error / description / floating-label은 Regular(400)이 정확. 토큰 자체는 그대로 두고 사용처에 `font-normal` 명시:

- `Form.tsx`: FormDescription, FormMessage
- `Input.tsx`: 플로팅 라벨, error message, helper message
- `Checkbox.tsx`: error / description text
- `Textarea.tsx`: error / description text

caption1 토큰을 통째로 Regular로 바꿀지(다른 사용처 영향) 별도 helper 토큰을 만들지는 디자인팀 follow-up 항목 #6.

**Test / Visual 회귀**

- 테스트 89/89 통과 (`Alert.test`, `Badge.test`의 status-* 어서션도 state-*로 갱신)
- Playwright 28/28 통과 (마이그레이션으로 인한 시각 변화는 baseline에 반영)
- `pnpm -r typecheck` 깨끗

**Follow-up — 디자인 조율 필요한 7건**

[`docs/design-team-followup.md`](docs/design-team-followup.md):
1. Button Tertiary 2종 분리 (흰 배경 + 회색 배경)
2. Modal/Dialog 풀 너비 버튼 레이아웃
3. Checkbox 4가지 형태 분리 (사각/원/체크마크/라디오)
4. Checkbox AI Purple variant
5. Alert 제거 vs 별도 분류 결정
6. Helper text weight: caption1 토큰 변경 vs 별도 helper 토큰 신설
7. FormMessage 에러 아이콘 일관성 (+ 보너스: 디자인팀 검수 절차 확립)

각 항목별 답변 후 컴포넌트 단위 PR로 진행. 자동 처리분만 v0.7.3에 우선 반영해 회귀 차단.
