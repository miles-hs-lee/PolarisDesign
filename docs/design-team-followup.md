# 디자인팀 조율 항목 — v0.7 재검수 follow-up

폴라리스 디자인팀의 v0.7.2 재검수 ([source](../private/v0.7.2-review.html))에서 지적된 9건의 미정합 항목 중 **자동 처리 가능한 6건은 v0.7.3에서 정리**됐습니다 (outline → tertiary 22곳, status-* → state-* 토큰 24줄, helper text font-normal). 나머지 **컴포넌트 spec 변경 7건은 디자인팀의 구체적 visual / API 결정이 필요**하여 이 문서에 정리합니다.

각 항목은 *질문 형식*으로 적었습니다 — 디자인팀 워크샵이나 비동기 검토 시 항목별로 답을 받아 채워주세요. 답을 받으면 컴포넌트 단위 PR로 진행합니다.

---

## 1. Button — Tertiary 2종 분리 (흰 배경 vs 회색 배경)

**현재 상태**: `Button variant="tertiary"`가 회색 배경(`bg-fill-normal`) 단일.

**디자인팀 지적**: Tertiary는 **흰 배경**과 **회색 배경 2종**으로 운영 — 컨텍스트별 사용:
- 흰 배경: 취소, 이전으로가기, 목록보기 등
- 회색 배경: 목록더보기 등

**받아야 할 답**:
1. 두 variant의 정확한 색상 토큰 (배경, 텍스트, 보더, hover, active, disabled 각각)
2. API 형태 — 둘 중 어느 쪽이 자연스러운지:
   - (a) `<Button variant="tertiary">` (default 흰 배경) + `<Button variant="tertiary-fill">` (회색)
   - (b) `<Button variant="tertiary" tone="default|fill">`
   - (c) 다른 명명 — 디자인팀이 부르는 이름
3. 각 variant의 use case 가이드라인 (어느 컨텍스트에 쓰는지) — JSDoc / Storybook에 명시

**결정 후 작업**: Button.tsx에 두 번째 tertiary variant 추가. 카탈로그 + 데모 두 형태 모두 노출. 시각 회귀 baseline 갱신.

---

## 2. Modal / Dialog — 풀 너비 버튼 레이아웃

**현재 상태**: `DialogFooter`가 `flex flex-col-reverse sm:flex-row sm:justify-end gap-2` — 데스크톱에선 우측 정렬, 모바일에선 세로 stack.

**디자인팀 지적**: 우리 시스템은 버튼이 **가로 100% 풀 너비**로 들어가는 형태.

**받아야 할 답**:
1. "풀 너비"가 의미하는 정확한 layout:
   - (a) 단일 버튼 → 가로 100%
   - (b) 2개 버튼 → 50/50 grid (gap 포함)
   - (c) 3개 → 33/33/33
   - (d) 모바일/데스크톱 동일 layout인지, 아니면 데스크톱에선 다른 형태인지
2. 가로 100% 적용 조건 — 모달 사이즈(sm/md/lg)별 동일한지, 아니면 큰 모달은 우측 정렬 유지인지
3. 버튼 순서 (취소가 왼쪽? 오른쪽?) — 한국 / 일본 / 영문 권역별 다른지

**결정 후 작업**: `DialogFooter` className 갱신. Storybook에 1버튼/2버튼/3버튼 케이스 추가. 시각 회귀.

---

## 3. Checkbox — 4가지 형태 분리 (사각 / 원 / 체크마크 / 라디오)

**현재 상태**: `Checkbox`가 사각 체크 단일.

**디자인팀 지적**: 컨텍스트별 4가지 형태 필요:
- 사각 체크 — 일반 다중 선택
- 원형 체크 — ?
- 체크마크만 — ?
- 라디오 — 단일 선택

**받아야 할 답**:
1. 각 4가지 형태의 visual spec (border, fill, check mark 위치/크기, hover/active/disabled)
2. **API 형태** — 어느 패턴이 자연스러운지:
   - (a) 단일 컴포넌트 + variant prop: `<Checkbox shape="square|round|check|radio">` 
   - (b) 4개 컴포넌트로 분리: `Checkbox`, `RoundCheckbox`, `Checkmark`, `Radio` (현재 Radio는 별도 없음)
   - (c) RadioGroup은 별도 컴포넌트로 분리(접근성 측면에서 차이가 큼) + Checkbox 내부에 shape 3종
3. 각 형태의 use case 가이드라인
4. RadioGroup도 디자인팀 spec에 있는지 (Polaris에 현재 없음)

**결정 후 작업**: Checkbox 재설계. 새 RadioGroup 추가 검토. 카탈로그/Storybook에 4종 케이스. lint 룰로 native `<input type="radio">` 차단.

---

## 4. Checkbox — AI Purple variant 추가

**현재 상태**: `Checkbox`가 Brand Blue 단일.

**디자인팀 지적**: Brand Blue + AI Purple 2종 컬러 variant 운영.

**받아야 할 답**:
1. AI Purple variant의 정확한 색 토큰 (체크 표시 색, focus ring, hover bg)
2. **언제 AI Purple variant를 써야 하는지** — NOVA 기능 안에서만? 아니면 컨텍스트 선택?
3. API:
   - (a) `<Checkbox tone="brand|ai">` 
   - (b) NOVA 영역에선 `<NovaCheckbox>` 별도 컴포넌트
4. 다른 컴포넌트(Switch, Radio, Toggle 등)도 동일하게 AI Purple variant가 필요한지

**결정 후 작업**: Checkbox에 tone prop 추가. 일관성 위해 Switch / 가능하면 Button 등도 동일 패턴 검토.

---

## 5. Alert 컴포넌트 — 제거 vs 별도 분류

**현재 상태**: `Alert` 컴포넌트 존재 (Tier 2). `<Alert variant="info|success|warning|danger">` API.

**디자인팀 지적**: "우리 시스템에 없는 Alert 컴포넌트". 디자인팀은 모든 알림을 **Toast로 통합**.

**받아야 할 답**:
1. **제거 여부 확정**: 정말 제거할 것인지, 아니면 일부 use case(예: 폼 상단 inline 안내, 페이지 상단 banner)는 별도 컴포넌트로 살릴 것인지
2. 제거하면 — 대체 패턴은:
   - 일시 알림 → Toast (이미 있음)
   - 폼 상단 inline 안내 → ?
   - 페이지 상단 banner → ?
3. 이미 Alert를 쓰고 있는 데모 페이지(있다면) 마이그레이션 방향
4. v0.8(BREAKING)에서 제거 vs v0.7.x에서 deprecated alias로 두고 v0.9 제거 — 어느 쪽?

**결정 후 작업**: Alert.tsx 제거 + 사용처(데모) 정리, Toast 또는 새 Banner 컴포넌트로 마이그레이션 가이드.

---

## 6. Helper text weight — 토큰 vs 별도 helper 스타일

**현재 v0.7.3 처리**: `polaris-caption1` 토큰은 weight 700 그대로 두고, form helper-text 사용처 7곳에 `font-normal` 명시 추가. 즉 caption1의 *기본 weight는 Bold 유지*하되 *form 안에서만 Regular로 override*.

**디자인팀 지적**: helper / error text는 Regular(400)이어야 함.

**받아야 할 답**:
1. **caption1 토큰 자체를 Regular(400)로 바꿔야 하는지**:
   - (a) Yes — caption1의 모든 사용처(Tooltip, Badge, Avatar, Sidebar/DropdownMenu label, Table header 등)도 Regular가 맞음. 현재 v0.7.3의 form-only override는 임시 패치로 남고, v0.8에서 caption1 weight 자체 변경 BREAKING.
   - (b) No — caption1은 *small bold* 의미가 맞고, helper text는 별도 토큰. 새 `polaris-helper` 텍스트 토큰 신설 (12px / 16 / weight 400) 후 form helper text가 그것을 사용하도록 정합.
2. 현재 caption1을 쓰는 다른 사용처(Tooltip, Badge, Sidebar label 등)들의 spec — Regular인지 Bold인지 디자인팀 확인.

**결정 후 작업 (option b 가정)**: 새 `polaris-helper` 토큰 추가, 모든 form helper-text를 그 토큰으로 마이그레이션. form-only override 제거.

---

## 7. Form 패턴의 에러 아이콘 일관성

**현재 상태**: `Input` 단독 사용 시 에러 표시에 아이콘 동반(WCAG 1.4.1). react-hook-form 기반 `<Form>`/`<FormMessage>` 패턴은 아이콘 없음.

**디자인팀 지적**: 일관성 깨짐 — 같은 의미의 에러 표시인데 컴포넌트 사용 패턴에 따라 시각이 달라짐.

**받아야 할 답**:
1. **`FormMessage`도 항상 ErrorIcon을 동반해야 하는지** — yes/no
2. 색만 빨강이고 아이콘은 옵션인지, 아니면 아이콘이 강제인지
3. ErrorIcon 외에 success / warning / info 메시지에서도 각자 아이콘 동반인지 (FormMessage가 다양한 의미를 표시할 수 있는 경우)
4. lint 룰 강도 — `FormMessage` 사용 시 자동으로 아이콘이 들어가게 만들지(컴포넌트 내부에서 강제), 아니면 컨슈머가 명시적으로 prop으로 넣게 할지

**결정 후 작업**: `FormMessage` 컴포넌트가 `ErrorIcon` 자동 prepend (또는 prop). 새 `state-color-with-icon` lint 룰의 적용 범위에 FormMessage 추가.

---

## 8. (보너스) 검수 절차 확립 — 디자인팀 sign-off

**현재 상태**: 디자인 시스템 변경이 코드만 거치고 디자인팀 검토 없이 main에 들어감. 그래서 v0.7 정합 작업이 끝났는데도 9건 미정합이 발견됨.

**받아야 할 답**:
1. **트리거**: 어느 변경에 디자인팀 검수가 필요한지:
   - (a) 모든 컴포넌트 추가/수정
   - (b) 컴포넌트 추가만 (수정은 자동)
   - (c) Visual 변화가 있는 PR만 (시각 회귀 baseline 변경 시 자동 라벨)
2. **방식**: GitHub PR review (디자인팀 멤버가 reviewer로 등록) vs 비동기 Figma 코멘트 vs 정기 워크샵
3. **CODEOWNERS 적용 범위** — `packages/ui/src/components/**`만? 토큰도?

**결정 후 작업**: `.github/CODEOWNERS`에 디자인팀 멤버 등록 + PR 템플릿에 "디자인 spec 변경 체크박스" 추가 + `state-color-with-icon` 같은 lint 룰처럼 visual 룰 강화.

---

## 진행 권장 순서

| # | 우선순위 | 영향 범위 | 예상 작업량 |
|---|---|---|---|
| 1. Tertiary 2종 | 🔴 높음 (변경 빈번) | Button.tsx + 데모 + 카탈로그 | 1일 |
| 2. Modal 풀 너비 | 🔴 높음 (모달 흔함) | Dialog.tsx + 카탈로그 | 0.5일 |
| 3. Checkbox 4종 | 🟡 중 (RadioGroup 신규) | Checkbox.tsx + RadioGroup 신규 + 카탈로그 + lint | 2~3일 |
| 4. Checkbox AI Purple | 🟡 중 | Checkbox + 정책 결정 | 0.5일 |
| 5. Alert 제거 vs 분류 | 🟢 저 (사용처 적음) | Alert.tsx 제거 / 데모 마이그레이션 | 0.5일 |
| 6. Helper text 토큰 | 🟡 중 (form 전반) | tailwind preset + 7곳 component | 1일 |
| 7. FormMessage 아이콘 | 🟢 저 | Form.tsx + lint 룰 | 0.5일 |
| 8. 검수 절차 | 🔴 높음 (메타) | CODEOWNERS + PR 템플릿 + 정책 문서 | 0.5일 |

**총 예상 작업량**: 6~8일 (디자인팀 답변 받은 후, 한 사람 기준 풀타임).

---

## 검토 받는 방법 (제안)

1. **각 항목별로 디자인팀에 질문 발송** — 위 7건 + 보너스 1건. Slack/Notion 댓글 또는 정기 미팅 의제.
2. 답변 받은 항목부터 PR 작성 — 위 표의 우선순위 기준.
3. 각 PR에 "Closes #(이슈 번호)" + 디자인팀 reviewer 지정.
4. v0.8 BREAKING 릴리즈에 묶을 항목 vs v0.7.x patch에 점진 적용할 항목 구분.

이 문서는 답변이 들어올 때마다 업데이트하세요. 8개 모두 닫히면 v0.7 디자인 시스템 정합 완료.
