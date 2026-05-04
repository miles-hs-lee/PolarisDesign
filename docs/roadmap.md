# Polaris Design Roadmap

릴리스별 계획. v0.4.1 시점의 사내 피드백을 정리합니다. 우선순위는 ROI 기준 추정 — 사이클 시작 시 재검토.

---

## v0.5 — 사용자 검증된 우선순위 (피드백 기반)

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

## v0.6+ — 큰 작업 (RFC 후 진행)

- **DataTable** — sortable + filterable + virtualized. tanstack-table 위 또는 자체. v0.5 Table sticky+sortable 작업의 다음 단계.
- **Combobox** — 검색 가능 select. 200+ option 매핑 케이스.
- **NumberInput** — 한국어 IME 우회. 통화/단가 전용.
- **AvatarGroup** — collaborator 표시.
- **Slider/Range** — 가격/좌석 수 필터.
- **CodeBlock** — JSON debug view, RPC 결과.
- **Calendar/DatePicker/CommandPalette stable화** — 0.4 experimental → 사용자 피드백 후 API 확정.

## v1.0 — 사인오프

- 모든 v0.5 high-impact 항목 완료
- Tier 분류 + stability badge 정착
- 사내 npm registry publish + 첫 파일럿 baseline 측정
- Badge variant 축 BREAKING 재구성 (v0.4 RFC 보류 결정)
- Pretendard local hosting (CDN 졸업)
- 시각 회귀 테스트 (Playwright) 통합
- 다중 스택 지원 검토 (사내 두 번째 스택 사용처가 의미 있을 때만)

---

## 의도적으로 미루는 것

- **다중 프레임워크 (Vue/Svelte 포트)** — 사내 두 번째 스택 수요가 명확해질 때까지 보류. 토큰·Tailwind preset·lint는 React 없이도 동작.
- **Web Components 패키지** — 같은 이유. 향후 임베드/위젯 케이스 발생 시 검토.
- **React Native 패키지** — 모바일 앱 로드맵 확정 시. Tamagui 가능성 높음.
- **자체 토큰 builder GUI** — 토큰이 안정되기 전까지 over-engineering.
