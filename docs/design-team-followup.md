# 디자인팀 조율 항목 — v0.7 재검수 follow-up

폴라리스 디자인팀 v0.7.2 재검수에서 지적된 9건 미정합 중,
**자동/명확 처리 가능한 8건은 v0.7.3~v0.7.4에 반영 완료**, **5건은 디자인팀의 추가 답변이 필요**합니다.

이 문서는 디자인팀에 보낼 *질문 리스트*. 답을 받는 대로 본문을 채우고 컴포넌트 PR로 진행합니다.

---

## ✅ 이미 처리됨

| 항목 | 처리 버전 | 근거 |
|---|---|---|
| 1차 outline → tertiary 일괄 (22곳) | v0.7.3 | 디자인팀 spec과 alias 정리 |
| status-* → state-* 토큰 마이그 (24줄) | v0.7.3 | DESIGN.md §2 Semantic Tokens |
| Form helper-text `font-normal` 임시 패치 | v0.7.3 → v0.7.4에서 정식 토큰화 | DESIGN.md §4 Inputs & Forms |
| **Helper text 별도 토큰 신설 (`polaris-helper`, 12px / 400 / lh 1.3)** | v0.7.4 | DESIGN.md §4 명시 — Floating Title / Error Text 모두 weight regular. caption1(700)은 badge/tag 용도로 분리 |
| **FormMessage 자동 ErrorIcon prepend** (16px / 4px gap / state-error) | v0.7.4 | DESIGN.md §4 명시 — "필수: 아이콘 동반 (X 또는 ⚠️, 16px)... WCAG 1.4.1" |
| Checkbox / Textarea 에러 메시지에도 ErrorIcon 일관성 적용 | v0.7.4 | 동일 spec |
| brand colors 5종 hex 정합 / 타이포 11단계 / 헤딩 700 / radius 8단계 / Button 6 사이즈 / Tertiary variant / Black variant | v0.7.0~v0.7.2 | 디자인팀 spec |

---

## 🔴 디자인팀 답이 필요한 5건

각 항목은 **질문 형식**으로 정리. 디자인팀과 워크샵 또는 비동기 검토(Slack/Notion 댓글) 시 그대로 사용 가능. 답을 받는 즉시 컴포넌트 단위 PR로 진행.

### 1. Button — Tertiary / Ghost 정합 (부분 답)

**현재 상태**: 코드에 `tertiary`(gray bg, `--fill-normal`)와 `ghost`(transparent bg, hover→`--interaction-hover`) 두 variant가 별개로 존재. 1차 검수자는 "흰 배경 + 회색 배경 2종 Tertiary"가 필요하다고 지적.

**DESIGN.md 단서**: §4 Buttons에 "Tertiary / Ghost"가 한 섹션 / 한 spec(gray fill)으로 묶여 있음. 별도 ghost spec은 없음.

**받아야 할 답**:
1. 우리 코드의 `ghost` (transparent → 흰 surface 위에선 시각적으로 흰 배경)이 디자인팀이 말한 "흰 배경 Tertiary"와 동일한가요?
2. 동일하다면 — 카탈로그/문서에서 "Tertiary 2종 = `tertiary`(gray) + `ghost`(white)"로 명시하고 끝나도 되는지.
3. 다르다면 — 흰 solid bg + 보더가 있는 *제3의 variant*가 필요한 것이고, 정확한 spec(배경/보더/hover/active)을 받아야 함.
4. 사용 컨텍스트 가이드라인 (취소 / 이전으로가기 / 목록보기 / 목록더보기 등 어느 케이스에 어느 variant?)

**결정 후 작업**: (a) 가벼운 케이스 — 카탈로그 + Storybook + Button JSDoc에 "ghost = 흰 배경 tertiary" 명시 + DESIGN.md를 업데이트해 달라 요청. (b) 무거운 케이스 — 새 variant 추가 + 데모 사용처 정리 + 시각 회귀 baseline.

---

### 2. Modal / Dialog — 풀 너비 버튼 레이아웃

**현재 상태**: `DialogFooter`가 `flex flex-col-reverse sm:flex-row sm:justify-end gap-polaris-2xs` — 데스크톱 우측 정렬 / 모바일 세로 stack.

**DESIGN.md 단서**: §4 Modals & Dialogs에 layout 룰 없음. §9 Responsive에 모바일은 바텀 시트로 전환된다는 정도만 명시. 버튼 정렬 / 너비 정책은 빠져 있음.

**받아야 할 답**:
1. "풀 너비"가 의미하는 정확한 layout:
   - (a) 단일 버튼 → 가로 100%
   - (b) 2개 버튼 → 50/50 grid
   - (c) 3개 → 33/33/33
   - (d) 데스크톱/모바일 동일인지, 데스크톱은 우측 정렬 유지인지
2. 모달 사이즈(standard 480px / large 720px)별로 동일한 룰?
3. 버튼 순서 — 취소가 왼쪽? 오른쪽? (한국 / 일본 / 영문 권역별 차이 있는지)
4. Dialog/AlertDialog/Drawer/Sheet 등 비슷한 dismiss 패턴들도 같은 룰?

**결정 후 작업**: `DialogFooter` className 갱신 + 카탈로그에 1버튼/2버튼/3버튼 케이스 추가 + 시각 회귀 baseline.

---

### 3. Checkbox — 4가지 형태 분리

**현재 상태**: `Checkbox`가 사각 체크 단일.

**DESIGN.md 단서**: Checkbox 섹션 자체가 없음. spec 미존재.

**받아야 할 답**:
1. 4가지 형태(사각 체크 / 원형 체크 / 체크마크만 / 라디오) 각각의 visual spec — border, fill, check mark 위치/크기, hover/active/disabled
2. **API 형태** — 어느 패턴이 자연스러운지:
   - (a) 단일 컴포넌트 + variant prop: `<Checkbox shape="square|round|check|radio">`
   - (b) 4개 컴포넌트로 분리: `Checkbox`, `RoundCheckbox`, `Checkmark`, `Radio`
   - (c) 라디오는 별도 `RadioGroup` 컴포넌트 (접근성 측면 — Polaris엔 현재 RadioGroup 없음). 나머지 3개는 Checkbox shape variant.
3. 각 형태의 use case 가이드라인
4. RadioGroup도 동시 신설인지

**결정 후 작업**: Checkbox 재설계 + RadioGroup 신규 검토 + 카탈로그 4종 케이스 + native `<input type="radio">` 차단 lint 룰.

---

### 4. Checkbox — AI Purple variant

**현재 상태**: `Checkbox`가 Brand Blue 단일.

**DESIGN.md 단서**: §4 AI / NOVA Feature Components에 "AI Purple은 NOVA 전용" 일반 룰만 있음. Checkbox 구체 spec 없음.

**받아야 할 답**:
1. AI Purple variant의 정확한 색 토큰 (체크 표시 색, focus ring, hover bg)
2. 언제 AI Purple variant를 써야 하는지 — NOVA 기능 안에서만? 아니면 컨텍스트 선택?
3. API:
   - (a) `<Checkbox tone="brand|ai">`
   - (b) NOVA 영역에선 `<NovaCheckbox>` 별도 컴포넌트
4. Switch / Radio / Toggle 등 다른 컴포넌트도 동일하게 AI Purple variant가 필요한지

**결정 후 작업**: Checkbox에 tone prop 추가 → 일관성 위해 다른 form control도 동일 패턴 검토.

---

### 5. Alert — 유지 / 제거 결정

**현재 상태**: `Alert.tsx`(Tier 2) 존재. `<Alert variant="info|success|warning|danger">` API. v0.7.3에 토큰 정합(state-* 사용)까지 완료. **데모/페이지 사용처는 적음**.

**DESIGN.md 단서**: §4 Components에 Alert 섹션 *없음*. 알림 컴포넌트는 `Toasts & Notifications` 단일 — 자동 사라짐 3초.

**받아야 할 답**:
1. **Alert 컴포넌트 유지/제거 방침**:
   - (a) 제거 — 모든 알림은 Toast로 통합 (DESIGN.md 흐름)
   - (b) 유지 — Toast로 표현 못 하는 use case가 존재 (예: 폼 상단 inline 안내, 페이지 banner, 영구 dismiss-able 경고)
2. 유지한다면 — DESIGN.md에 추가될 spec이 어떻게 되는지 (배경/보더/아이콘/액션 버튼/dismiss 동작/접근성 role)
3. 제거한다면 — 대체 패턴 확정:
   - 일시 알림 → Toast (이미 있음)
   - 영구 inline 안내 → Toast로는 표현 안 됨, 어떻게?
   - 페이지 상단 banner → ?
4. 우리 시스템에 Banner 같은 별도 컴포넌트가 필요한지 디자인팀이 평가
5. 결정 시점 — v0.8 BREAKING에 묶을지, 그 전에 점진적 deprecated 처리할지

**현재 운영 방침 (확정 전 임시)**: Alert는 그대로 유지(v0.7.4까지 토큰만 정합). 디자인팀 결정이 나오기 전엔 사용 자제 권고만 명시 (lint warning 또는 카탈로그에서 "확정 대기" 라벨).

---

### 6. (보너스) 디자인팀 검수 절차 확립

**현재 상태**: 디자인 시스템 변경이 디자인팀 review 없이 main에 들어감. v0.7.0 정식 릴리즈 후 재검수에서 9건 미정합 발견 — 자동 정합의 한계가 명확.

**받아야 할 답**:
1. **트리거 — 어느 변경에 디자인팀 검수가 필요한지**:
   - (a) 모든 컴포넌트 추가/수정
   - (b) 컴포넌트 추가만 (수정은 자동)
   - (c) Visual 변화가 있는 PR만 — 시각 회귀 baseline 변경 시 자동 라벨
2. **방식**:
   - GitHub PR review (디자인팀 멤버를 reviewer로 지정)
   - 비동기 Figma 코멘트
   - 정기 워크샵 (격주 1시간 등)
3. **CODEOWNERS 적용 범위** — `packages/ui/src/components/**`만? 토큰도? 카탈로그 페이지(`apps/demo/src/pages/Components.tsx`)도?
4. **디자인팀 멤버** — 몇 명을 reviewer 그룹에 둘지

**결정 후 작업**: `.github/CODEOWNERS` 디자인팀 멤버 등록 + PR 템플릿에 "디자인 spec 변경 체크박스" 추가 + spec-shift 라벨 자동 부착 (visual baseline 변경 시 GH Action에서 라벨 추가) + `docs/release-process.md`에 절차 명시.

---

## 진행 권장 순서

| # | 우선순위 | 영향 | 예상 작업량 (답 받은 후) |
|---|---|---|---|
| 6. 디자인팀 검수 절차 | 🔴 높음 (메타) | repo 운영 정책 | 0.5일 |
| 1. Tertiary / Ghost 명확화 | 🟡 중 | Button 문서 + 카탈로그 (가벼운 케이스) / Button.tsx + 데모 (무거운 케이스) | 0.5~1일 |
| 2. Modal 풀 너비 | 🔴 높음 (자주 쓰는 컴포넌트) | Dialog.tsx + 카탈로그 | 0.5일 |
| 3. Checkbox 4종 + RadioGroup | 🟡 중 (큰 작업) | Checkbox + 신규 RadioGroup + 카탈로그 + lint | 2~3일 |
| 4. Checkbox AI Purple | 🟡 중 | Checkbox + 정책 결정 | 0.5일 |
| 5. Alert 결정 | 🟢 저 | Alert.tsx 유지/제거 + 데모 마이그 또는 Banner 신설 | 0.5일 |

**총 예상 작업량**: 5~7일 (답변 받은 후, 한 사람 풀타임).

---

## 검토 받는 방법 (제안)

1. **이 5+1건을 디자인팀에 한꺼번에 보내기** — Slack DM / Notion 댓글 / 정기 미팅 의제. 각 항목별 답변 칸을 빈 표로 보내면 작성 부담이 적음.
2. 답변 받은 항목부터 컴포넌트 PR — 우선순위 순.
3. 각 PR에 디자인팀 reviewer 지정 (CODEOWNERS 셋업 후 자동).
4. v0.8 BREAKING 릴리즈에 묶을 항목(Alert 제거 시 등) vs v0.7.x patch에 점진 적용할 항목 구분.

이 문서는 답이 들어올 때마다 업데이트하세요. 5+1건 모두 닫히면 v0.7 재검수 follow-up 종료.
