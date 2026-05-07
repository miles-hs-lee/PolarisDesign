---
'@polaris/ui': minor
'@polaris/lint': minor
'@polaris/plugin': minor
'polaris-template-next': minor
'demo': minor
---

v0.7.0-rc.2 — 디자인팀 자산 통합 (UI 아이콘 65종 × 3 사이즈, 파일 아이콘 29종, 로고 컴포넌트)

디자인팀 Figma 출처 SVG 자산을 빌드 파이프라인을 통해 React 컴포넌트로 자동 변환. v0.7.0-rc.1 위에 4개의 신규 시스템 추가:

### 새 entry point 3개

```ts
import { ArrowDownIcon, ChevronRightIcon, SearchIcon } from '@polaris/ui/icons';
import { DocxIcon, FolderIcon, ZipIcon } from '@polaris/ui/file-icons';
import { PolarisLogo, NovaLogo } from '@polaris/ui/logos';
```

- **`@polaris/ui/icons`** — 65 monochrome UI 아이콘 × 3 사이즈 (18/24/32 px). 디자이너가 그리드별로 hand-tune 한 path를 모두 보존. `size` prop은 임의 px 받음 (16, 28 등도 OK — 자동으로 가장 가까운 그리드 SVG 선택). stroke `#454C53` → `currentColor` 자동 변환되어 Tailwind `text-{token}`으로 색 제어.
- **`@polaris/ui/file-icons`** — 29 multi-color 파일 타입 아이콘 (docx, xlsx, pptx, pdf 외 folder, image, video, zip, music, voc, my-template, note-pnt, app-* 등). 32px 마스터 + size prop 으로 균등 스케일.
- **`@polaris/ui/logos`** — `PolarisLogo` (horizontal/symbol/favicon × default/negative) + `NovaLogo` (default/white).

### 빌드 파이프라인

```
assets/svg/{icons,file-icons,logos}/  →  packages/ui/src/{icons,file-icons,logos}/  (gitignored)
```

새 스크립트:
- `pnpm normalize:icons` — Figma 자동 export 이름 (`Type=Arrow-Down, Size=18.svg`) → kebab-case (`arrow-down.svg`) 정규화. idempotent.
- `pnpm build:icons` / `:file-icons` / `:logos` — SVG → React 컴포넌트 생성

### BREAKING

- **`<FileIcon>` 완전 교체.** rc.1까지의 색깔 사각형 + 글자 표시는 사라지고 디자인팀 실제 SVG 사용. 5타입 → 29타입 확장. `size` prop은 t-shirt (`'sm'|'md'|'lg'`) 대신 px (`number`).
- **`@polaris/ui` 내부 lucide-react → polaris 아이콘 교체** (있는 것만): `X`/`Send`/`Search`/`Check`/`Minus`/`ChevronDown/Up/Left/Right`/`AlertCircle` → polaris 컴포넌트. 없는 것만 (Bold/Italic/MoreHorizontal/CalendarIcon/Sparkles/Loader2/Inbox 등) lucide 유지.

### 신규 lint 룰

`@polaris/prefer-polaris-icon` (warn) — `lucide-react` import 시 폴라리스에 대응 아이콘 있으면 권장. 데모에서 95개 warning 감지 (점진적 마이그레이션).

### 데모

새 페이지 `/icons` — 65 UI 아이콘 검색 가능, 사이즈별 비교, 파일 아이콘 29종, 로고 4종. visual baseline 추가 (28개 → 30개).

### 디렉토리 정리

```
assets/
├── README.md                            # 갱신 절차 문서화
├── figma-spec/                          # was figma_PDS
│   ├── foundation/                      # color · grid · radius · typography
│   ├── theme/                           # iconography
│   └── components/                      # 13 컴포넌트 spec PNG
└── svg/                                 # was image_assets
    ├── icons/{18,24,32}/                # 65 × 3 = 195 SVG
    ├── file-icons/32/                   # 29 SVG
    └── logos/{polaris-office,nova}/
```

모든 파일명 kebab-case 영문 (한국어 `가로.svg` → `horizontal.svg`, Figma `Type=...` 자동 정규화).

### DESIGN.md 갱신

각 섹션에 figma-spec PNG 인라인 추가 (Color / Typography / Grid / Radius / Iconography / Button / Input). Iconography 섹션 신설.

### 검증

- pnpm -r build ✓ (8 entries)
- pnpm --filter @polaris/ui test ✓ (84 tests)
- pnpm --filter @polaris/lint test ✓ (50 + 11 codemod)
- pnpm --filter demo build ✓
- pnpm exec playwright test ✓ (30 baselines)
- pnpm -w lint ✓ (errors: 0; warns: 95 lucide migration suggestions)
