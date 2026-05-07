# Polaris Design System

폴라리스오피스 **바이브코딩옵스**(LLM 기반 React/Next.js 자동 생성)에서 회사 단위 일관된 디자인을 강제하는 시스템. 토큰·컴포넌트·린트·Claude Code 플러그인 한 묶음.

> 권고가 아니라 **기본값 + 자동 차단**. 토큰 쓰는 게 가장 쉬운 길이 되도록 설계 — 모델이 우회할 수 있는 경로를 4 레이어(자산 / 시작점 / 검증 / 온보딩)에서 줄입니다.

## Live demo

GitHub Pages — **<https://polarisoffice.github.io/PolarisDesign/>**

| 라우트 | 내용 |
|---|---|
| `/` | 인덱스 + 아키텍처 |
| `/#/components` | 컴포넌트 카탈로그 (37개) |
| `/#/tokens` | 디자인 토큰 — 시맨틱·램프·서브 팔레트·Spacing·Radius·Shadow·Motion·Z-index·Breakpoint |
| `/#/icons` | 65 UI 아이콘 + 29 파일 + 4 로고 |
| `/#/nova` · `/#/crm/contract` · `/#/sign/contracts` · `/#/polaris-office` | 실제 제품 시나리오 (NOVA / CRM / Sign / Office Ribbon) |

## Architecture

```
packages/
├── ui/             @polaris/ui     — 토큰 + 37 컴포넌트 + Ribbon family + 65 아이콘 + 29 파일 + 로고
├── lint/           @polaris/lint   — ESLint 6 룰 + polaris-audit + polaris-codemod-v07
├── plugin/         polaris-design  — Claude Code 플러그인 (skill + 슬래시커맨드 + PostToolUse 훅)
└── template-next/  polaris-template-next — Next.js 15 부트스트랩 템플릿
apps/demo/                          — Vite 데모 (라이브 카탈로그 + 제품 시나리오)
assets/                             — 디자인팀 figma export (PNG spec + SVG 자산)
```

상세는 각 패키지 README 참조: [`packages/ui`](packages/ui/README.md) · [`packages/lint`](packages/lint/README.md) · [`packages/plugin`](packages/plugin/README.md).

## Quick start

### 모노레포 안에서 작업

```sh
git clone https://github.com/PolarisOffice/PolarisDesign.git
cd PolarisDesign
pnpm install                              # @polaris/ui prepare hook이 토큰/아이콘 source 자동 생성
pnpm --filter polaris-template-next dev   # → :3000 — 본인 앱 출발점
pnpm --filter demo dev                    # → :5173 — 컴포넌트/토큰/아이콘 카탈로그
```

> 사내 npm 레지스트리 publish 전이라 외부 클론은 `workspace:*` 의존성으로 install이 막힙니다. 그 전까지는 모노레포 내부에서 `apps/` 또는 `packages/` 아래 디렉터리를 추가해 작업하세요.

### Claude Code에서 부트스트랩

```
/polaris-init <name>          # 새 프로젝트
/polaris-migrate              # 기존 코드 점진 마이그레이션
/polaris-check                # 현재 상태 lint
```

### 기존 프로젝트에 토큰만 도입

```sh
pnpm add @polaris/ui @polaris/lint
```

`tailwind.config.ts`에 preset, `eslint.config.mjs`에 recommended config, 진입점에 `import '@polaris/ui/styles/tokens.css'`. 자세히 → [`packages/ui/README.md`](packages/ui/README.md).

## What's in v0.7

디자인팀 v1 (2026.05) 정의서 완전 정렬:

- **시맨틱 토큰 19개 신설** — `label.*` / `background.*` / `layer.*` / `interaction.*` / `fill.*` / `line.*` / `accentBrand.*` / `accentAction.*` / `focus.ring` / `staticColors.*` / `state.*`
- **컬러 primitive 확장** — 10단계 (`05`/`90`) × 11 family (브랜드 6 + Sky Blue/Blue/Violet/Cyan/Yellow + Gray)
- **Typography 11레벨 spec 명명** — `display`/`title`/`heading1-4`/`body1-3`/`caption1-2` + 모바일 자동 축소
- **새 토큰 시스템 4개** — Spacing (12 named) · Z-index (6) · Motion (duration + easing) · Breakpoint
- **디자인팀 SVG 자산 통합** — `@polaris/ui/icons` (65 × 3 사이즈) · `/file-icons` (29 타입) · `/logos` (Polaris + Nova)
- **자동 codemod** — `pnpm dlx @polaris/lint polaris-codemod-v07 --apply src` 로 v0.6 → v0.7 일괄 변환

마이그레이션 가이드: [`docs/migration/v0.6-to-v0.7.md`](docs/migration/v0.6-to-v0.7.md). 변경 자세히: 각 패키지의 [CHANGELOG.md](packages/ui/CHANGELOG.md).

## 핵심 원칙

**4색 + NOVA = 브랜드 아이덴티티**
폴라리스 로고 4색(파·초·주·빨)이 동시에 파일 타입(DOCX·XLSX·PPTX·PDF). 토큰에서도 분리하지 않고 별칭으로 묶음(`accentBrand.normal` ≡ `fileType.docx`). NOVA 보라(`ai.*`)는 AI 컨텍스트 전용.

**권고 → 기본값 + 자동 차단**
- 자산 — 토큰을 import만 하면 자동 준수
- 시작점 — `/polaris-init` + `template-next` 가 처음부터 정렬
- 검증 — `@polaris/lint` 6 룰 + PostToolUse 훅이 우회를 즉시 잡음
- 온보딩 — `/polaris-migrate` + `polaris-audit` + `polaris-codemod-v07`

## 개발

```sh
pnpm install                       # prepare 훅이 토큰/아이콘 source 생성
pnpm --filter @polaris/ui build    # tsup dist (consumer가 dist 의존)
pnpm --filter demo dev             # 라이브 카탈로그 (ui source HMR)

pnpm -r typecheck                  # 5 패키지
pnpm --filter @polaris/ui test     # 84
pnpm --filter @polaris/lint test   # 50 + 11 codemod
pnpm -w lint                       # 워크스페이스 ESLint
pnpm exec playwright test          # 28 visual baselines

# 변경사항 기록
pnpm changeset                     # PR마다 사용자 영향 있는 변경에 첨부
```

CI는 `.github/workflows/ci.yml`, 데모 배포는 `.github/workflows/deploy.yml` (main push 시 GitHub Pages).

## 문서

- [DESIGN.md](DESIGN.md) — 토큰·타이포·컴포넌트 spec (auto-generated, Stitch 형식)
- [AGENTS.md](AGENTS.md) — Codex/Cursor 등 비-Claude 에이전트 절차
- [docs/roadmap.md](docs/roadmap.md) — 릴리즈별 계획
- [docs/migration/](docs/migration/) — 버전별 마이그레이션 가이드
- [assets/README.md](assets/README.md) — Figma export 갱신 절차

## 로드맵 — 한눈에

| 버전 | 핵심 |
|---|---|
| v0.5.0 | Ribbon family (subpath `@polaris/ui/ribbon`) |
| v0.6.0 | Ribbon 정비 + 데모 SPA 통합 + Vite source alias HMR |
| v0.7.0 | DESIGN.md 완전 정렬 + 19 시맨틱 토큰 + 4 토큰 시스템 + 디자인팀 SVG 자산 통합 |
| **v0.7.1 (현재)** | **`@polaris/ui/ribbon-icons` 91종 (57 big × 32 + 34 small × 16) + 폴라리스 오피스 데모 재구성 + SVG id 격리** |
| v0.7.x | DataPagination, lucide → polaris 아이콘 잔여 마이그레이션 (template-next 완료, demo 진행 중) |
| v0.8.0 | v0.6/rc/v0.7 deprecated alias 제거, Pretendard local |
| v1.0 | Combobox, NumberInput, AvatarGroup, Slider, CodeBlock 안정화, Badge variant BREAKING, 사인오프 |

자세히 → [docs/roadmap.md](docs/roadmap.md).

## License

사내용 — Polaris Office. 외부 공개 시 라이선스 정책 별도 결정.
