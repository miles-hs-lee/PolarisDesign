# Tailwind v4 사용 가이드 (임시)

`@polaris/ui` v0.2 시점의 공식 Tailwind preset은 **v3 전용**입니다 (`tailwind.preset.ts`). v4-네이티브 preset은 별도 마일스톤(v0.3 예정)이며, 그전까지 v4 프로젝트에서 폴라리스를 쓰려면 아래 가이드를 따라 직접 매핑하세요.

> ⚠️ 핵심 차이: Tailwind v4는 `@theme inline { ... }` 블록에서 정의된 토큰만 utility class로 자동 생성합니다. v3 preset의 함수형 색상 값(callable color)은 v4가 지원하지 않으므로 **alpha modifier (`bg-status-success/15`)를 위해 색상은 반드시 직접 hex/rgb 또는 `color-mix()` 결과여야 합니다.**

---

## 1. CSS 진입점

`app/globals.css` (또는 진입 CSS):

```css
@import 'tailwindcss';
@import '@polaris/ui/styles/tokens.css';

@theme inline {
  /* === 브랜드 === */
  --color-brand-primary: var(--polaris-brand-primary);
  --color-brand-primary-hover: var(--polaris-brand-primary-hover);
  --color-brand-primary-subtle: var(--polaris-brand-primary-subtle);
  --color-brand-secondary: var(--polaris-brand-secondary);
  --color-brand-secondary-hover: var(--polaris-brand-secondary-hover);
  --color-brand-secondary-subtle: var(--polaris-brand-secondary-subtle);

  /* === 파일 타입 === */
  --color-file-docx: var(--polaris-file-docx);
  --color-file-hwp:  var(--polaris-file-hwp);
  --color-file-xlsx: var(--polaris-file-xlsx);
  --color-file-pptx: var(--polaris-file-pptx);
  --color-file-pdf:  var(--polaris-file-pdf);

  /* === 상태 === */
  --color-status-success: var(--polaris-status-success);
  --color-status-success-hover: var(--polaris-status-success-hover);
  --color-status-warning: var(--polaris-status-warning);
  --color-status-warning-hover: var(--polaris-status-warning-hover);
  --color-status-danger:  var(--polaris-status-danger);
  --color-status-danger-hover:  var(--polaris-status-danger-hover);
  --color-status-info:    var(--polaris-status-info);
  --color-status-info-hover:    var(--polaris-status-info-hover);

  /* === 표면 / 텍스트 === */
  --color-surface-canvas:        var(--polaris-surface-canvas);
  --color-surface-raised:        var(--polaris-surface-raised);
  --color-surface-sunken:        var(--polaris-surface-sunken);
  --color-surface-border:        var(--polaris-surface-border);
  --color-surface-border-strong: var(--polaris-surface-border-strong);

  --color-fg-primary:    var(--polaris-text-primary);
  --color-fg-secondary:  var(--polaris-text-secondary);
  --color-fg-muted:      var(--polaris-text-muted);
  --color-fg-on-brand:   var(--polaris-text-on-brand);
  --color-fg-on-status:  var(--polaris-text-on-status);

  /* === Neutral 12-step === */
  --color-neutral-0:    var(--polaris-neutral-0);
  --color-neutral-50:   var(--polaris-neutral-50);
  --color-neutral-100:  var(--polaris-neutral-100);
  --color-neutral-200:  var(--polaris-neutral-200);
  --color-neutral-300:  var(--polaris-neutral-300);
  --color-neutral-400:  var(--polaris-neutral-400);
  --color-neutral-500:  var(--polaris-neutral-500);
  --color-neutral-600:  var(--polaris-neutral-600);
  --color-neutral-700:  var(--polaris-neutral-700);
  --color-neutral-800:  var(--polaris-neutral-800);
  --color-neutral-900:  var(--polaris-neutral-900);
  --color-neutral-1000: var(--polaris-neutral-1000);

  /* === 반경 === */
  --radius-polaris-sm:   var(--polaris-radius-sm);
  --radius-polaris-md:   var(--polaris-radius-md);
  --radius-polaris-lg:   var(--polaris-radius-lg);
  --radius-polaris-xl:   var(--polaris-radius-xl);
  --radius-polaris-full: var(--polaris-radius-full);

  /* === 그림자 === */
  --shadow-polaris-xs: var(--polaris-shadow-xs);
  --shadow-polaris-sm: var(--polaris-shadow-sm);
  --shadow-polaris-md: var(--polaris-shadow-md);
  --shadow-polaris-lg: var(--polaris-shadow-lg);

  /* === 폰트 패밀리 === */
  --font-polaris:      var(--polaris-font-sans);
  --font-polaris-mono: var(--polaris-font-mono);

  /* === 폰트 사이즈 ===
   * v4는 폰트사이즈와 함께 line-height/weight/letter-spacing을 묶지 못하므로
   * 각각 분리 정의가 필요합니다. 가장 흔히 쓰는 매핑만 예시로 둡니다.
   */
  --text-polaris-display-md: 36px;
  --text-polaris-display-md--line-height: 44px;
  --text-polaris-display-md--font-weight: 700;
  --text-polaris-display-md--letter-spacing: -0.02em;

  --text-polaris-heading-lg: 24px;
  --text-polaris-heading-lg--line-height: 32px;
  --text-polaris-heading-lg--font-weight: 600;

  --text-polaris-heading-md: 20px;
  --text-polaris-heading-md--line-height: 28px;
  --text-polaris-heading-md--font-weight: 600;

  --text-polaris-heading-sm: 16px;
  --text-polaris-heading-sm--line-height: 24px;
  --text-polaris-heading-sm--font-weight: 600;

  --text-polaris-body-lg: 16px;
  --text-polaris-body-lg--line-height: 24px;

  --text-polaris-body-sm: 14px;
  --text-polaris-body-sm--line-height: 20px;

  --text-polaris-caption: 12px;
  --text-polaris-caption--line-height: 16px;
}
```

이 매핑이 끝나면 v3 preset 사용처와 **동일한 클래스명**(`bg-brand-primary`, `text-fg-primary`, `rounded-polaris-md`, …)이 그대로 작동합니다.

---

## 2. 다크 모드

`@polaris/ui/styles/tokens.css`는 `[data-theme="dark"]` 셀렉터로 다크 토큰을 덮어쓰는 방식입니다. v4에서도 그대로 동작하지만, Tailwind의 `dark:` variant를 [data-theme]에 묶고 싶다면:

```css
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
```

이걸 globals.css에 한 줄 추가하면 `dark:bg-surface-raised` 같은 표현이 우리 토큰 다크 모드와 일치합니다.

---

## 3. Alpha modifier (`bg-status-success/15`)

v4는 **CSS 변수가 그 자체로 색상 값**일 때만 `/15` 같은 alpha modifier를 인식합니다. 즉 `var(--polaris-status-success)`가 hex로 평가되면 OK이고, `color-mix(...)`나 함수 호출이 들어가면 동작하지 않습니다.

다행히 `tokens.css`의 `--polaris-status-*`는 모두 단순 hex로 정의되어 있으므로 v4에서도 `bg-status-success/15`가 자동으로 `color-mix(in oklab, var(--color-status-success) 15%, transparent)`로 컴파일됩니다.

---

## 4. Layout 임의값

폴라리스 lint 룰 `no-arbitrary-tailwind`는 `grid-cols-[1fr_180px_120px]` 같은 layout 패턴을 화이트리스트로 허용합니다. v4에서도 동일하게 허용됩니다.

---

## 5. v3 preset과의 차이 (요약)

| 항목 | v3 preset | v4 + 이 가이드 |
|---|---|---|
| 진입점 | `tailwind.config.ts` `presets: [polarisPreset]` | `globals.css`의 `@theme inline { ... }` |
| 색상 토큰 정의 방식 | callable function (alpha 지원용) | 직접 `var(--polaris-*)` |
| 폰트 사이즈 묶음 | `fontSize: ['Npx', { lineHeight, fontWeight, letterSpacing }]` | `--text-*` + 별도 `--text-*--line-height` 등 |
| 다크 변형 | tokens.css의 `[data-theme="dark"]` | 동일 (선택적으로 `@custom-variant dark`) |
| `bg-*/15` alpha modifier | callable color로 지원 | hex 토큰이므로 자동 지원 |

---

## 6. 한계 / TODO

- **로드맵**: v0.3에서 `@polaris/ui/tailwind-v4` 별도 export를 추가해 한 줄 import로 끝낼 수 있도록 정리할 예정.
- **컴포넌트 자체는 v3·v4 모두에서 동일하게 동작**합니다 — 토큰 이름이 같기 때문. 컴포넌트 import는 현재처럼 `@polaris/ui`에서 그대로 받으면 됩니다.
- 이슈 트래킹: 새 v4 프로젝트에서 이 가이드대로 했는데 안 되는 클래스가 있다면 사내 이슈 채널에 클래스명 + screenshot으로 신고해주세요.
