---
'@polaris/ui': minor
'@polaris/lint': minor
'@polaris/plugin': minor
'polaris-template-next': minor
'demo': minor
---

v0.7.0-rc.1 — DESIGN.md + primitive-color-palette 완전 정렬

rc.0 출시 후 디자인팀의 더 상세한 정의서(`DESIGN.md` + `primitive-color-palette.html`)를 받아 9단계 reconciliation 수행. 사용자 피드백 단계 전이라 alias 부담 없이 spec 완전 정렬.

마이그레이션: [`docs/migration/v0.6-to-v0.7-rc.1.md`](https://github.com/miles-hs-lee/PolarisDesign/blob/main/docs/migration/v0.6-to-v0.7-rc.1.md)
Codemod (v0.6 / rc.0 모두 대응): `pnpm dlx @polaris/lint polaris-codemod-v07 --apply src`

### Highlights

**컬러 primitive 확장 (rc.1)**
- 모든 브랜드 램프에 step `90` (가장 어두운) 추가 — 10단계 (`05/10/20/30/40/50/60/70/80/90`)
- 5개 신규 supplementary 패밀리: Sky Blue, Blue (보조), Violet, Cyan, Yellow
- step `5` (no leading zero) 표기는 deprecated alias로 계속 작동 — codemod가 `05`로 rewrite
- step 40의 hex 보정 (rc.0 표류): Green `#B5CA5F→#85CA5F`, Purple `#9075EC→#9D75EC`, DarkBlue `#4C70CE→#4C7DCE`

**시맨틱 토큰 19개 신설**
NEW: `label.disabled` / `layer.surface/-overlay` / `interaction.pressed` / `fill.neutral/-strong` / `line.strong/-disabled` / `accentBrand.bg/-bgHover` / `accentAction.normal/-strong` (Black 버튼) / `focus.ring` / `staticColors.white/-black` / `state.new` + `state.{success,warning,error,info}Bg` 4개

**다크 모드 그레이스케일 재작성**
rc.0의 퍼플 틴트(`#1B1B2A` 등)가 spec의 단색 그레이(`#232323`/`#282828`/`#3B3B3B`)로 전체 교체

**Radius 스케일 한 단계 시프트**
`md` 8→12 (Button/Card/Modal default), `lg` 12→16, `xl` 16→24, `2xl` 24→38 (bottom sheet)

**타이포그래피 11레벨 spec 정렬**
- 명명 변경: `display`(60→40), `h1-h5` → `display`/`title`/`heading1-3`
- 신규 사이즈: `heading4` (18), `body3` (13), `caption2` (11)
- Caption weight 400 → 700, body letter-spacing 제거
- 모바일 (≤767px) type scale 자동 적용 (auto media query)

**4개 신규 토큰 시스템**
- Spacing: `4xs` (2) → `4xl` (64) 12레벨 — class form `p-polaris-md`, `gap-polaris-lg`
- Z-index: `base/dropdown/sticky/dim/modal/toast` — class form `z-polaris-modal`
- Motion: `duration-polaris-fast`, `ease-polaris-out`
- Breakpoint: `mobile/tablet-v/tablet-h/desktop` semantic names

**Button 6 사이즈 + Black variant**
사이즈 24/32/40/48/54/64. 사이즈별 weight 분기 (xs/sm/md = Medium 500, lg/xl/2xl = Bold 700). 신규 `dark` variant (Black 버튼, 다크모드 자동 반전).

**Input 52px + Floating Title + 강제 에러 아이콘**
높이 36→52, label이 입력 영역 안에서 floating. 에러 시 ⚠️ 아이콘 자동 동반 (WCAG 1.4.1).

**Modal 24r + layer.surface, Toast 48h dark+blur**
Dialog가 `--layer-surface` + 24px radius로 spec emphasis modal과 일치. Toast가 모든 variant 통일된 다크 글래스 표면(blur).

**신규 lint 룰**
`@polaris/state-color-with-icon` (warn) — `text-state-success/-warning/-error`가 아이콘 동반 없이 사용되면 경고 (WCAG 1.4.1).

### BREAKING vs rc.0

- 모든 컴포넌트 radius +4px (md 8→12 등)
- 다크 모드 hex 전면 변경
- `display` 사이즈 60→40
- Button 사이즈 명명 시프트 (`sm`→`xs`, `md`→`sm`, `lg`→`md`)
- Input height 36→52, NovaInput 외형 유지
- Modal 12r→24r
- Toast 단색 surface → 다크 글래스 (variant 배경 없음)
- `primary.*` (rc.0 alias) → `accentBrand.*`로 codemod 권장
- `text-polaris-h{1..5}` → spec 이름으로 codemod 권장
