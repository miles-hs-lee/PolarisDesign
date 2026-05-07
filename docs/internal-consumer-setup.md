# 사내 제품 repo에서 `@polaris/ui` 쓰기 — 5분 셋업

PolarisDesign이 사내 npm registry에 publish되기 전 단계에서, 외부 제품 repo가 디자인 시스템을 install하는 표준 절차입니다. **GitHub Release 타르볼**을 직접 dependency URL로 받아서 씁니다.

> PolarisDesign은 public GitHub repo이므로 **인증/PAT 셋업 불필요**. `pnpm install`만으로 동작합니다.

---

## 1. `package.json`에 의존성 추가

각 `v0.X.Y` 태그마다 GitHub Release에 `polaris-ui-0.X.Y.tgz`와 `polaris-lint-0.X.Y.tgz`가 자동 첨부됩니다. 사용하고 싶은 버전의 URL을 그대로 박으세요:

```jsonc
{
  "dependencies": {
    "@polaris/ui": "https://github.com/PolarisOffice/PolarisDesign/releases/download/v0.7.2/polaris-ui-0.7.2.tgz"
  },
  "devDependencies": {
    "@polaris/lint": "https://github.com/PolarisOffice/PolarisDesign/releases/download/v0.7.2/polaris-lint-0.7.2.tgz"
  }
}
```

`pnpm install` 실행하면 끝.

> ⚠️ **`^0.7.2` 같은 semver range는 동작하지 않습니다.** URL이 정확히 박힙니다. 새 버전을 받으려면 URL의 두 군데(`v0.7.2` / `0.7.2`)를 직접 갱신하세요. → 자동화는 [Renovate](#renovate-자동-업그레이드-옵션) 섹션 참고.

---

## 2. Tailwind preset 연결 (`@polaris/ui` 쓸 때 필수)

```js
// tailwind.config.js
import polarisPreset from '@polaris/ui/tailwind';

export default {
  presets: [polarisPreset],
  content: [
    './src/**/*.{ts,tsx}',
    // node_modules에 install된 @polaris/ui도 스캔 대상에 포함 — 컴포넌트
    // 안에서 사용된 token-based class를 Tailwind가 보지 못하면 PurgeCSS
    // 단계에서 잘려 나갑니다.
    './node_modules/@polaris/ui/dist/**/*.{js,cjs}',
  ],
  // 나머지는 preset이 다 들고 옴 (theme tokens / dark mode / radius / shadow / …)
};
```

토큰 CSS 변수도 import:

```css
/* src/app/globals.css 또는 src/styles/index.css */
@import '@polaris/ui/styles/tokens.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 3. `@polaris/lint` ESLint config 연결

```js
// eslint.config.js (flat config — ESLint 9+)
import polaris from '@polaris/lint';

export default [
  ...polaris.configs.recommended,
  // 프로젝트별 추가 룰 / overrides
];
```

상세 룰 / 자동 수정 옵션은 [`@polaris/lint` README](https://github.com/PolarisOffice/PolarisDesign/blob/main/packages/lint/README.md) 참고.

---

## 4. 동작 확인

```tsx
// src/app/page.tsx (또는 임의의 React 컴포넌트)
import { Button, Card } from '@polaris/ui';

export default function Page() {
  return (
    <Card variant="padded">
      <Button variant="primary">테스트</Button>
    </Card>
  );
}
```

`pnpm dev` → 디자인 토큰 적용된 버튼이 보이면 성공.

---

## 5. 무결성 검증 (선택)

각 Release에 `SHA256SUMS.txt`도 같이 업로드됩니다. 사내 보안 정책상 supply-chain 검증이 필요하면:

```bash
curl -L -o /tmp/SHA256SUMS.txt \
  https://github.com/PolarisOffice/PolarisDesign/releases/download/v0.7.2/SHA256SUMS.txt
cd ~/.local/share/pnpm/store/v3/files   # pnpm cache 위치는 환경마다 다름
sha256sum polaris-ui-0.7.2.tgz | grep -f /tmp/SHA256SUMS.txt
```

---

## Renovate 자동 업그레이드 옵션

URL 직접 갱신 부담을 줄이려면 [Renovate](https://docs.renovatebot.com/) 활성화. `renovate.json`에 한 블록 추가:

```jsonc
{
  "extends": ["config:recommended"],
  "customManagers": [
    {
      "customType": "regex",
      "fileMatch": ["(^|/)package\\.json$"],
      "matchStrings": [
        "https://github\\.com/PolarisOffice/PolarisDesign/releases/download/(?<currentValue>v[^/]+)/polaris-(?<depName>ui|lint)-[^.]+\\.tgz"
      ],
      "datasourceTemplate": "github-releases",
      "depNameTemplate": "PolarisOffice/PolarisDesign",
      "extractVersionTemplate": "^v(?<version>.+)$"
    }
  ]
}
```

이렇게 하면 새 `v*` 태그가 publish될 때마다 Renovate가 자동 PR을 만들어 URL을 갱신합니다.

---

## 트러블슈팅

| 증상 | 원인 / 해결 |
|---|---|
| `pnpm install` 후 `404 Not Found` | 태그 오타 / 아직 publish 안 된 버전. [Releases 페이지](https://github.com/PolarisOffice/PolarisDesign/releases)에서 정확한 URL 확인. |
| `Cannot find module '@polaris/ui'` 컴파일 에러 | install 됐는지 `pnpm list @polaris/ui` 확인. tarball 다운로드는 됐는데 `dist`가 비어 있다면 release 타르볼 자체가 깨진 것 — `SHA256SUMS.txt`로 검증. |
| Tailwind 토큰 클래스가 적용되지 않음 | `tailwind.config.js`의 `content` 배열에 `./node_modules/@polaris/ui/dist/**/*.{js,cjs}`가 빠진 경우. 위 2번 다시 확인. |
| 다크 모드 색이 안 바뀜 | `@import '@polaris/ui/styles/tokens.css'`가 누락 / 잘못된 위치. CSS reset 전에 import해야 함. |

---

## 향후 — 사내 npm registry 등장 시

사내 표준 npm registry(JFrog/Nexus/Verdaccio 등)가 셋업되면 위 URL 의존성을 표준 semver로 교체 가능:

```diff
- "@polaris/ui": "https://github.com/PolarisOffice/PolarisDesign/releases/download/v0.7.2/polaris-ui-0.7.2.tgz"
+ "@polaris/ui": "^0.7.2"
```

전환 비용은 각 컨슈머 `package.json` 한 줄 + `.npmrc`에 registry URL 한 줄 추가. 그 외에는 import / 사용 코드 무변경.
