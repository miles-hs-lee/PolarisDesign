# Polaris Design Roadmap

릴리스별 계획. 우선순위는 ROI 기준 추정 — 사이클 시작 시 재검토.

---

## ✅ v0.5.0 — Ribbon (완료)

에디터 제품군(Office 도큐먼트·MD 에디터·스프레드시트·PDF 도구 등)을 위한 toolbar 패턴. Subpath로 분리(`@polaris/ui/ribbon`)해서 일반 SaaS 사용자는 dep 부담 없음.

추가:
- `Ribbon`, `RibbonTabs`/`RibbonTabList`/`RibbonTab`/`RibbonContent`
- `RibbonGroup` (label 옵션) + `RibbonSeparator`
- `RibbonButton` (size: `sm` icon-only / `md` / `lg` icon-over-label)
- `RibbonSplitButton` (main + dropdown chevron)
- `RibbonToggleGroup` / `RibbonToggleItem` (single/multiple selection)
- 새 dep: `@radix-ui/react-toggle-group`

---

## ✅ v0.6.0 — Ribbon 정비 + 데모 통합 (완료)

- `RibbonMenuButton`, `RibbonRowDivider` 추가
- `RibbonSplitButton` lg vertical 분할, scrollbar 숨김으로 panel 높이 통일
- disabled split의 menu trigger도 차단, icon-only 버튼 aria-label 자동 fallback
- PolarisOffice 데모 탭별 컴포넌트 분리
- Storybook 제거 → 컴포넌트 카탈로그(SPA) + `/tokens` 라우트로 통일
- 데모 vite alias로 `@polaris/ui` source 직접 import (별도 빌드 없이 HMR)

---

## ✅ v0.7.0 — DESIGN.md 완전 정렬 + 디자인팀 자산 통합 (완료)

디자인팀 v1 (2026.05) 정의서 — `DESIGN.md` + `primitive-color-palette` — 에 토큰 명명·값·컴포넌트 스펙 완전 정렬. 8개 누적 changeset 통합.

추가:
- **시맨틱 토큰 19개 신설** — `label.*` (6) / `background.*` (4) / `layer.*` (2 NEW) / `interaction.*` (pressed NEW) / `fill.*` (neutral·strong NEW) / `line.*` (strong·disabled NEW) / `accentBrand.*` (bg·bgHover NEW) / `accentAction.*` (Black 버튼, NEW) / `focus.ring` / `staticColors.*` / `state.*` (new + bg variants 4 NEW)
- **컬러 primitive 확장** — 10단계 (`05`/`90`) × 11 family. 5 supplementary 신설 (Sky Blue / Blue / Violet / Cyan / Yellow). Gray ramp.
- **다크 모드 그레이스케일 재작성** — 퍼플 틴트 → 단색 그레이.
- **Radius 스케일 한 단계 시프트** — `md` 8→12 (default), `lg` 12→16, `xl` 16→24, `2xl` 24→38.
- **Typography 11레벨 spec 명명** — `display`(40)/`title`(32)/`heading1-4`(28/24/20/18)/`body1-3`(16/14/13)/`caption1-2`(12/11). Caption weight 700, body letter-spacing 제거. 모바일(≤767px) 자동 축소.
- **새 토큰 시스템 4개** — Spacing (12 named, `4xs`–`4xl`) · Z-index (6 levels) · Motion (duration × 4 + easing × 3) · Breakpoint (semantic).
- **Button 6 사이즈** — 24/32/40/48/54/64 + Black variant (`accentAction.*`).
- **Input 52px floating title**, **Modal 24r layer.surface**, **Toast dark+blur 48h**.
- **디자인팀 SVG 자산 통합**:
  - `@polaris/ui/icons` — 65 UI 아이콘 × 18/24/32 px (currentColor)
  - `@polaris/ui/file-icons` — 29 파일 타입 (multi-color baked-in)
  - `@polaris/ui/logos` — `PolarisLogo` (3 variants × 2 tones) + `NovaLogo` (2 tones)
  - `<FileIcon>` 색깔 사각형 → 디자인팀 실제 SVG로 완전 교체 (5 → 29 타입)
  - `@polaris/ui` 내부 lucide-react → 폴라리스 아이콘 교체 (있는 것만)
- **자동 codemod** — `polaris-codemod-v07` (v0.6/rc.0/rc.1/rc.2 → v0.7)
- **신규 lint 룰 2개** — `state-color-with-icon` (WCAG 1.4.1) + `prefer-polaris-icon` (lucide-react 마이그레이션 유도)
- **Tokens 페이지 자동화** — `colors` export iterate로 새 그룹 추가 시 자동 반영. figma-spec PNG 인라인.

마이그레이션: [`docs/migration/v0.6-to-v0.7.md`](migration/v0.6-to-v0.7.md).

---

## v0.7.x — 작은 패치 + 마이그레이션 도우미

- **DataPagination 고수준 wrapper** (v0.5.x에서 미해결 carry-over)
- **lucide → polaris 잔여 마이그레이션** — `@polaris/lint`의 `prefer-polaris-icon` warning 해소. 데모 95건, template-next 3건.
- **prefer-polaris-icon auto-fix** — 단순 케이스(named import 1:1)는 `--fix`로 자동 변환.
- **codemod 적용 범위 가드** — `@polaris/ui/src/{tokens,styles,tailwind}` 자동 제외.
- **Form/Calendar/Command stable화** — v0.4 experimental 상태 평가 후 stable 또는 제거 결정.

---

## v0.5.x — 사용자 검증된 우선순위 (피드백 기반)

### High-impact (사이클 초반에 처리)

**1. Pagination — `<DataPagination>` 고수준 wrapper**
현재 `Pagination > PaginationPrev/Item/Ellipsis/Next`를 사용처마다 30줄로 조립. 거의 모든 사용처가 동일 패턴. wrapper 추가:
```tsx
<DataPagination current={n} total={t} buildHref={(p) => `?page=${p}`} />
```
- primitives는 그대로 유지 (low-level escape hatch)
- `pageNumberItems()`를 내부에서 사용
- asChild로 `<Link>`/`<NavLink>` 래핑 자동
- Server-side URL pagination 패턴 한 줄로

**2. Table — sticky header + sortable th**
0.4 Table primitive에 옵션 부재. legacy admin의 data-table은 1000px+ 가로 스크롤 + 정렬 header.
```tsx
<TableHeader sticky>
  <TableHead sortable direction="asc" onSort={(dir) => ...}>계약명</TableHead>
</TableHeader>
```
- DataTable(v0.6+ 큰 작업)과 별개. Table primitive에 옵션만 추가.

**3. StatCard — KPI 표시 컴포넌트**
사실상 모든 대시보드 SaaS에 동일 패턴. 사용자 측에서 자체 wrapper 만드는 중.
```tsx
<StatCard label="활성 계약" value="1,234" delta="+12%" deltaTone="success" />
```
- v0.3 recipes.md에 예시 코드는 있지만, 정식 컴포넌트화 가치 큼.
- icon prop, trend prop 포함.

**4. Badge `dot` variant**
상태 배지 (활성/취소/만료) 표현. 현재 사용자가 `<span className="size-1.5 rounded-full bg-status-success" />` 직접 그림.
```tsx
<Badge dot variant="success">활성</Badge>
```

**5. Drawer responsive — desktop → Dialog, mobile → bottom sheet**
모바일 대응 한 줄.
```tsx
<Drawer responsive>...</Drawer>
```
- breakpoint(`md` 이상은 side="right" Drawer, 미만은 side="bottom"으로 auto-switch)
- 또는 별도 `<ResponsiveDialog>` 컴포넌트.

### Medium-impact

**6. asChild 일관성 — Toaster, Toast**
useToast로만 커스텀 trigger 가능 — asChild 추가하면 wrap 패턴 자연스러워짐.

**7. Toast position 모바일 자동 전환**
`top-right` → 모바일에서 `top-center` 자동 전환 옵션.

**8. v4-theme.css ↔ Tailwind preset 단일 소스 보장**
현재 두 파일이 수동 동기화. drift 위험.
- 옵션 A: preset.ts를 source-of-truth로 두고 빌드 시 v4-theme.css 자동 생성
- 옵션 B: CI에서 diff 검증
- B가 빠르고 견고, A가 더 깔끔. v0.5에선 B로 시작.

**9. `--polaris-*` vs `--color-*` 네이밍 docs**
사용자가 `style={{ background: "var(--polaris-brand-primary)" }}` vs `var(--color-brand-primary)` 어느 쪽이 권장인지 헷갈림.
- 결론: `--polaris-*`가 source, `--color-*`는 Tailwind v4 alias. inline style에는 `--polaris-*` 사용 권장.
- patterns.md에 한 단락.

### Low-impact / 작은 polish

**10. 다크 모드 warning 채도 조정**
`--polaris-status-warning` dark가 살짝 saturated. `Alert variant="warning"`이 다크 배경에서 튐. 톤다운.

**11. Tier 분류 매트릭스**
현재 README에 "Tier 0/1/2/2.5/3" 분류는 있지만, 안정성(production-ready vs experimental)과 따로 표현되지 않음. 별도 표:
| 컴포넌트 | Tier | Stability |
|---|---|---|
| Button | Tier 0 | ✓ Stable |
| Calendar | Tier 3 | 🧪 Experimental |
| ... | | |

per-component badge — JSDoc `@experimental` tag → docs에서 자동 추출.

**12. 설치 가이드 v4 우선 재작성**
현재 README는 v3가 default. 사실 v4 + v4-theme.css가 한 줄이라 새 프로젝트에선 압도적으로 단순. install guide 첫 예시를 v4로 교체.

---

## v0.5.x — 작은 패치

### 검증 필요 (잠재적 bug)

**`prefer-polaris-component` lint가 server action `<button type="submit">` flag**
v0.4 사용자 보고 — `app-user-manager.tsx`, `price-book-activate-button.tsx` 등의 server action `<form action={...}>` 안의 `<button type="submit">`가 여전히 warning. v0.2.0의 `allowFormSubmit` 수정으로 회귀 테스트는 통과하고 있어서 두 가지 가능성:
- (a) 사용자의 `@polaris/lint` 버전이 v0.2.0 이전
- (b) form action 안의 특정 케이스가 우리 화이트리스트를 통과하지 못함

조치: 보고 환경에서 `npx polaris-audit` + `pnpm list @polaris/lint`로 확인. 진짜 회귀면 lint 룰 추가 fixture + patch.

---

## v0.8.0 — Deprecated alias 제거 (BREAKING)

- v0.6 / rc.0 / rc.1 토큰 이름 alias 모두 제거 — `text.primary`, `surface.raised`, `brand.primary`, `bg-fg-*`, `text-polaris-h1` 등.
- `polaris-codemod-v07` 가 마이그레이션 마무리해야 통과.
- `@polaris/lint` deprecated alias warning 룰 추가 (v0.7.1 부터 운영, v0.8에서 error 승격).
- Pretendard local hosting (CDN 졸업) — 폰트 로딩 안정성 확보.
- v0.4 experimental (Calendar / DatePicker / CommandPalette) 결정 — stable promote 또는 별도 패키지 분리.

---

## v0.9 — 신규 컴포넌트 (RFC 후)

- **DataTable** — sortable + filterable + virtualized. tanstack-table 위 또는 자체. v0.5 Table sticky+sortable 작업의 다음 단계.
- **Combobox** — 검색 가능 select. 200+ option 매핑 케이스.
- **NumberInput** — 한국어 IME 우회. 통화/단가 전용.
- **AvatarGroup** — collaborator 표시.
- **Slider/Range** — 가격/좌석 수 필터.
- **CodeBlock** — JSON debug view, RPC 결과.

---

## v1.0 — 사인오프

- 모든 v0.5–v0.7 carry-over 완료
- Tier 분류 + stability badge 정착
- 사내 npm registry publish + 첫 파일럿 baseline 측정
- Badge variant 축 BREAKING 재구성 (v0.4 RFC 보류 결정)
- 시각 회귀 테스트 (Playwright) CI 통합 ✓ (v0.7 시점에 28 baselines 운영 중 — 사이즈 안정화 후 stable 마크)
- 다중 스택 지원 검토 (사내 두 번째 스택 사용처가 의미 있을 때만)

---

## 의도적으로 미루는 것

- **다중 프레임워크 (Vue/Svelte 포트)** — 사내 두 번째 스택 수요가 명확해질 때까지 보류. 토큰·Tailwind preset·lint는 React 없이도 동작.
- **Web Components 패키지** — 같은 이유. 향후 임베드/위젯 케이스 발생 시 검토.
- **React Native 패키지** — 모바일 앱 로드맵 확정 시. Tamagui 가능성 높음.
- **자체 토큰 builder GUI** — 토큰이 안정되기 전까지 over-engineering.
