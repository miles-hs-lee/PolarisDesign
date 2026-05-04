# polaris-design (Claude Code plugin)

폴라리스 디자인 시스템 준수를 모델 측에서 강제하는 [Claude Code](https://claude.com/claude-code) 플러그인. 스킬·슬래시커맨드·PostToolUse 훅을 한 묶음으로 제공합니다.

루트 [README](../../README.md)에 전체 시스템 설명이 있습니다.

## 설치

### 옵션 A: 로컬 심링크 (개발 / 파일럿)

```sh
mkdir -p ~/.claude/plugins
ln -s "$(pwd)/packages/plugin" ~/.claude/plugins/polaris-design
```

Claude Code 세션을 재시작하면 자동으로 로드됩니다.

### 옵션 B: 마켓플레이스 (배포 단계)

사내 Git/마켓플레이스에 publish한 뒤:

```
/plugin marketplace add <git-url>
/plugin install polaris-design
```

## 구성

### 스킬 — `polaris-web`

설명: "Use when creating, editing, or adding features to a Polaris Office web service."

폴라리스 웹 서비스를 만들/수정할 때 자동 트리거되어 모델에게 다음을 강제합니다:
- 신규는 `/polaris-init`, 기존은 `/polaris-migrate`로 시작
- UI 요소는 `@polaris/ui` 컴포넌트 우선
- 색상/폰트/스페이싱은 토큰만 (hex·rgb·임의값 금지)
- AI/NOVA 컨텍스트는 `bg-brand-secondary`, 일반은 `bg-brand-primary`
- 변경 후 `/polaris-check`로 검증

### 슬래시커맨드

| 커맨드 | 용도 |
|---|---|
| `/polaris-init <name>` | 새 프로젝트를 `template-next`로 1줄 부트스트랩 |
| `/polaris-migrate` | 기존 프로젝트 점진적 마이그레이션 (audit → fix → enforce) |
| `/polaris-check` | 현재 프로젝트의 lint 위반 검증 |
| `/polaris-component <이름>` | 컴포넌트 사용/추가 가이드 |

### PostToolUse 훅

`Edit`/`Write`/`MultiEdit` 발생 시 변경 파일에 `npx eslint`를 실행해서 결과를 다음 턴 모델 컨텍스트에 주입합니다.

| eslint 결과 | 훅 동작 |
|---|---|
| 0 (clean) | 무동작 (silent) |
| 1 (violations) | `additionalContext`에 위반 내역 + 수정 가이드 주입 |
| 2 (config error) | 1시간당 1회 "ESLint 미설정" 안내 (cwd 해시 기반 marker) |

훅 스크립트: `scripts/post-edit-lint.mjs`. 스모크 테스트: `pnpm --filter @polaris/plugin test` (17건).

## 동작 흐름 예시

1. 모델이 `<div style={{ color: '#FF0000' }}>` 작성
2. `Edit` 도구 호출 후 PostToolUse 훅 발화
3. ESLint가 `no-hardcoded-color` 위반 탐지 (hex `#FF0000`)
4. 훅이 다음 턴 컨텍스트에 위반 내역 + 수정 가이드 주입
5. 다음 턴에 모델이 자동으로 `var(--polaris-status-danger)` 또는 적절한 토큰으로 교체

이 루프가 모델이 매 토큰 결정마다 SKILL을 떠올릴 필요를 없애주는 핵심 메커니즘입니다.

## 의존성 (대상 프로젝트 측)

이 플러그인은 PostToolUse 훅에서 `npx eslint`를 호출합니다. 대상 프로젝트에 다음이 필요:

- `eslint` 설치
- `@polaris/lint` 설치
- `eslint.config.mjs`에 `polaris.configs.recommended` 적용

`/polaris-init`이 자동 세팅하지만, 기존 프로젝트는 `/polaris-migrate`의 1단계가 이를 처리합니다.
