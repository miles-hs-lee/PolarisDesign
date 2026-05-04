---
description: 새 프로젝트에 폴라리스 디자인 시스템 통합 (의존성 + 설정 + 토큰 import)
---

이 프로젝트가 폴라리스 웹 서비스라면, 다음 단계를 순서대로 수행하세요. 사용자에게 따로 확인받지 말고 진행하세요 — 사용자가 이 명령을 호출했다는 사실 자체가 동의입니다.

### 1. 의존성 설치

```sh
pnpm add @polaris/ui @polaris/lint
pnpm add -D tailwindcss postcss autoprefixer eslint
```

### 2. `tailwind.config.ts` 생성/병합

없으면 새로 만들고, 이미 있으면 `presets: [polarisPreset]` 라인을 추가:

```ts
import polarisPreset from '@polaris/ui/tailwind';
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx,js,jsx}', './app/**/*.{ts,tsx}'],
  presets: [polarisPreset],
} satisfies Config;
```

### 3. `eslint.config.mjs` 생성

```js
import polaris from '@polaris/lint';

export default [
  ...polaris.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
];
```

### 4. 토큰 CSS 임포트

앱 진입점(Next.js의 `src/app/layout.tsx` 또는 Vite의 `src/main.tsx`)에 추가:

```ts
import '@polaris/ui/styles/tokens.css';
```

### 5. Pretendard 폰트 로드

Next.js라면 `next/font/local` 또는 CDN. 임시로 CDN을 쓰려면 `<head>`에:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />
```

### 6. 검증

```sh
pnpm exec eslint .
```

위반 0건이어야 합니다. 문제 없으면 사용자에게 "초기 세팅 완료, 이제 기능을 추가할 수 있습니다"라고 보고하세요.
