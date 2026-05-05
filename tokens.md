# Polaris Design Tokens — Phase 1 초안 (v0.1)

> 2026-05-04 작성. 이 문서는 **합의를 위한 초안**이며, hex 값은 메인 사이트 스크린샷에서 추정한 값입니다. 실제 브랜드 가이드의 정확한 값으로 교체 필요. `🟡 confirm` 표시가 된 항목은 사용자 확인이 필요한 부분.

> **단일 소스 정책 (v0.6.1+)**: 실제 토큰 값은 [`packages/ui/src/tokens/*.ts`](packages/ui/src/tokens)에 정의됩니다. `packages/ui/src/styles/tokens.css`는 `tsx scripts/build-tokens.ts`로 자동 생성되며 손으로 편집하지 않습니다. CI가 두 파일이 동기화 상태인지 검증합니다.

---

## 0. 토큰 명명 원칙

- 토큰 이름은 **시맨틱 의미**로 (예: `color.brand.primary`, `color.text.muted`). 색상값 자체(`color.blue.500`)도 같이 expose하되, 컴포넌트는 시맨틱만 사용.
- 다크모드 페어를 항상 함께 정의. 한쪽만 정의된 토큰이 있으면 다크모드 전환 시 깨짐.
- **단일 소스 원칙**: 같은 색의 두 시맨틱이 있다면 한쪽이 다른 쪽을 참조하도록 정의. 예) `file.docx` 는 `brand.primary` 의 별칭. 두 곳에 같은 hex를 직접 박지 않음 — 한 번 변경하면 자동 전파되어야 함.

> **TS API vs Tailwind 클래스명 매핑 메모**
> 이 문서는 TS 토큰 네임스페이스(`text.primary` 등)를 그대로 사용합니다. Tailwind preset은 `text-` 유틸리티 prefix와 충돌을 피하기 위해 텍스트 색상만 `fg` 네임스페이스로 노출합니다 — 즉 Tailwind 클래스는 `text-fg-primary`, `text-fg-on-brand`. CSS 변수(`--polaris-text-*`)와 TS export(`text.primary`)는 그대로입니다.

---

## 1. 컬러 토큰

### 1.1 브랜드 팔레트 — 4색 + NOVA

**폴라리스 브랜드 아이덴티티는 4색 팔레트(파랑·초록·주황·빨강) + NOVA 보라**. 로고 자체가 이 4색을 조합한 형태이고, 파일 타입 컬러(docx/xlsx/pptx/pdf)와 브랜드 컬러는 **완전히 동일한 색**. 분리하지 않고 시맨틱 별칭만 추가.

기준 토큰 (Base):

| 토큰 | Light | Dark | 별칭 |
|---|---|---|---|
| `brand.blue` | `#2B7FFF` 🟡 confirm | `#5C9FFF` | ≡ `brand.primary`, `file.docx`, `file.hwp` |
| `brand.green` | `#1FAE53` 🟡 confirm | `#3FCB72` | ≡ `file.xlsx` |
| `brand.orange` | `#F37021` 🟡 confirm | `#FF8F4D` | ≡ `file.pptx` |
| `brand.red` | `#E5413A` 🟡 confirm | `#FF6962` | ≡ `file.pdf` |
| `brand.purple` | `#7C5CFF` 🟡 confirm | `#9B85FF` | ≡ `brand.secondary` (NOVA/AI) |

시맨틱 별칭 (Aliases):

| 토큰 | 참조 | 용도 |
|---|---|---|
| `brand.primary` | → `brand.blue` | 주 액션, 활성 네비, 일반 강조, 링크 |
| `brand.primary.hover` | `#1E66DB` light / `#7AA5F5` dark | primary hover |
| `brand.primary.subtle` | `#E8EFFF` light / `#1A2238` dark | 선택된 메뉴 배경 |
| `brand.secondary` | → `brand.purple` | NOVA/AI 액션, AI 컨텍스트 강조 |
| `brand.secondary.hover` | `#6B47FF` / `#A896FF` | secondary hover |
| `brand.secondary.subtle` | `#F3EFFF` / `#2A2247` | AI 영역 배경, AI 칩/배지 |
| `file.docx` | → `brand.blue` | 워드 파일 표상 |
| `file.hwp` | → `brand.blue` | 한글 파일 표상 (워드와 동일) |
| `file.xlsx` | → `brand.green` | 엑셀 파일 표상 |
| `file.pptx` | → `brand.orange` | 파워포인트 파일 표상 |
| `file.pdf` | → `brand.red` | PDF 파일 표상 |

> 💡 **사용 규칙**:
> - 일반 페이지의 버튼·링크·포커스 = `brand.primary` (파랑)
> - AI/NOVA 기능(생성·요약·자동완성·NOVA 진입) = `brand.secondary` (보라)
> - 파일 표상(아이콘·필터 칩·파일 카드 강조선) = `file.*`
> - 같은 화면에서 primary와 secondary를 혼용하지 말 것 — 컨텍스트로 하나만 선택
> - 일반 데이터 시각화(차트 색상)에 `file.*`을 차용하지 말 것 — 별도 차트 팔레트 추후 정의
> - 단일 소스 원칙: brand.blue 값을 바꾸면 brand.primary, file.docx, file.hwp가 자동으로 따라 바뀜

### 1.3 시맨틱 상태 (Semantic)

| 토큰 | Light | Dark |
|---|---|---|
| `status.success` | `#16A34A` | `#3FCB72` |
| `status.warning` | `#EAB308` | `#FFD64A` |
| `status.danger`  | `#DC2626` | `#FF6962` |
| `status.info`    | `#2563EB` | `#5C9FFF` |

각 상태별 `.subtle`(배경용 옅은 톤)도 함께 정의 — 토스트/배너에 사용.

### 1.4 뉴트럴 스케일 (12단계)

`neutral.0` (가장 밝음) → `neutral.1000` (가장 어두움). 다크모드는 자동으로 반전되는 게 아니라 **별도 페어**로 정의.

```
neutral.0    #FFFFFF      |  #0B0B12   (페이지 배경)
neutral.50   #FAFAFB      |  #131320
neutral.100  #F4F4F7      |  #1B1B2A   (서피스 1)
neutral.200  #E8E8EE      |  #232336   (서피스 2, 보더)
neutral.300  #D5D5DE      |  #2D2D45
neutral.400  #B5B5C4      |  #4A4A66
neutral.500  #8C8CA0      |  #6B6B85   (보조 텍스트)
neutral.600  #6E6E84      |  #8B8BA3
neutral.700  #4F4F63      |  #B4B4C8
neutral.800  #2F2F40      |  #D5D5DE
neutral.900  #1A1A26      |  #EDEDF2
neutral.1000 #0B0B12      |  #FFFFFF   (메인 텍스트)
```

🟡 confirm: 메인 텍스트가 너무 진한 회색(`#1A1A26`)인지, 완전 검정(`#000`)인지 확인 필요.

### 1.5 표면 / 텍스트 시맨틱 (이게 가장 자주 쓰임)

| 토큰 | Light → Dark | 의미 |
|---|---|---|
| `surface.canvas` | `neutral.50` → `neutral.0` | 페이지 배경 |
| `surface.raised` | `neutral.0` → `neutral.100` | 카드, 모달 |
| `surface.sunken` | `neutral.100` → `neutral.50` | 안쪽 영역 |
| `surface.border` | `neutral.200` → `neutral.200` | 일반 보더 |
| `surface.border.strong` | `neutral.300` → `neutral.300` | 강조 보더 |
| `text.primary` | `neutral.1000` → `neutral.1000` | 본문 |
| `text.secondary` | `neutral.700` → `neutral.700` | 보조 |
| `text.muted` | `neutral.500` → `neutral.500` | 비활성/메타 |
| `text.onBrand` | `#FFFFFF` | 브랜드 컬러 위 텍스트 |

🟡 confirm: 메인 페이지의 옅은 보라 그라데이션 배경(`#F5F3FF`-ish)을 별도 토큰(`surface.canvas.brand`)으로 둘지, 페이지별로만 적용할지.

---

## 2. 타이포그래피

### 2.1 패밀리

```
font.sans  = "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont,
             "Apple SD Gothic Neo", "Malgun Gothic", "맑은 고딕",
             system-ui, sans-serif
font.mono  = "JetBrains Mono", "D2Coding", ui-monospace, monospace
```

🟡 confirm: Pretendard 라이선스(SIL OFL 1.1) 사내 승인 여부.

### 2.2 스케일 (7단계)

| 토큰 | size / line-height / weight | 용도 |
|---|---|---|
| `text.displayLg` | 48 / 60 / 700 | 랜딩 히어로 |
| `text.displayMd` | 36 / 44 / 700 | 섹션 타이틀 |
| `text.headingLg` | 24 / 32 / 600 | 페이지 제목 |
| `text.headingMd` | 20 / 28 / 600 | 카드 제목 |
| `text.headingSm` | 16 / 24 / 600 | 소제목 |
| `text.bodyLg` | 16 / 24 / 400 | 본문 |
| `text.bodySm` | 14 / 20 / 400 | 보조 본문, 라벨 |
| `text.caption` | 12 / 16 / 400 | 메타, 캡션 |

> 📝 weight는 Pretendard Variable 기준. 400=Regular, 500=Medium, 600=SemiBold, 700=Bold.

---

## 3. 스페이싱

**Tailwind 기본 스케일을 그대로 채택**. 4px 베이스(`0, 1=4px, 2=8px, 3=12px, 4=16px, 5=20px, 6=24px, 8=32px, 10=40px, 12=48px, 16=64px, 20=80px, 24=96px`).

별도 시맨틱 토큰을 만들지 않는 이유: Tailwind 기본이 이미 업계 표준이고, 모델이 자연스럽게 사용할 수 있는 값이라 진입 장벽이 가장 낮음.

> 단 `p-[13px]` 같은 임의값은 린트로 차단.

---

## 4. 반경 (Radius)

| 토큰 | 값 | 용도 |
|---|---|---|
| `radius.sm` | 6px | 작은 칩, 토글 |
| `radius.md` | 10px | 버튼, 인풋 |
| `radius.lg` | 14px | 카드 |
| `radius.xl` | 20px | 모달, 큰 표면 |
| `radius.full` | 9999px | 알약, 아바타 |

🟡 confirm: 메인 사이트 검색창이 매우 둥근 알약 형태 → `radius.full` 또는 `radius.xl` 사용. 카드가 부드럽게 둥근 편이라 `radius.lg=14px` 추정.

---

## 5. 그림자 (Shadow)

| 토큰 | Light | 용도 |
|---|---|---|
| `shadow.xs` | `0 1px 2px rgba(15, 15, 35, 0.06)` | 미세 강조 |
| `shadow.sm` | `0 2px 6px rgba(15, 15, 35, 0.08)` | 카드 |
| `shadow.md` | `0 8px 20px rgba(15, 15, 35, 0.10)` | 드롭다운, 토스트 |
| `shadow.lg` | `0 20px 40px rgba(15, 15, 35, 0.14)` | 모달 |

다크모드는 그림자 대신 **보더 강조**로 대체(어두운 배경에서 그림자가 보이지 않으므로).

---

## 6. Breakpoint

```
sm  640
md  768
lg  1024
xl  1280
2xl 1536
```

Tailwind 기본 그대로.

---

## 7. 컨테이너 폭

| 토큰 | 값 |
|---|---|
| `container.sm` | 640px |
| `container.md` | 768px |
| `container.lg` | 1024px |
| `container.xl` | 1200px |
| `container.full` | 100% |

---

## 🟡 사용자 확인 필요 항목 요약

1. **brand.blue / brand.primary / file.docx / file.hwp 정확한 hex** (모두 동일 값): 추정 `#2B7FFF`
2. **brand.green / file.xlsx 정확한 hex**: 추정 `#1FAE53`
3. **brand.orange / file.pptx 정확한 hex**: 추정 `#F37021`
4. **brand.red / file.pdf 정확한 hex**: 추정 `#E5413A`
5. **brand.purple / brand.secondary 정확한 hex** (NOVA): 추정 `#7C5CFF`
6. **본문 텍스트 컬러** 완전 검정(#000) vs 진한 회색(#1A1A26)
7. **Pretendard 사내 라이선스 승인** 및 폰트 파일 호스팅 방식 (CDN vs 자체 호스팅)
8. **카드 radius** 12 / 14 / 16 중 어느 값
9. **AI 그라데이션** 사용 여부 — NOVA 별 모양에 그라데이션 — `gradient.ai` 토큰 필요?
10. **링크 컬러** = `brand.primary` 동일 사용 여부

---

## 다음 단계

1. 위 🟡 confirm 항목을 30분 워크숍에서 일괄 결정
2. 합의된 값으로 v0.2 작성 → 시각 시트(컬러 스와치 한 장 이미지) 생성
3. v0.2 확정 후 Phase 2(`@polaris/ui` 패키지)로 진입
