---
description: @polaris/ui 컴포넌트 사용/추가 가이드
argument-hint: <컴포넌트 이름>
---

요청한 컴포넌트: $ARGUMENTS

### 1. @polaris/ui에 이미 있는지 확인

```sh
grep -E "^export (const|function|interface|type) $ARGUMENTS\b" node_modules/@polaris/ui/dist/index.d.ts || echo "Not found"
```

또는 데모(`/components` 페이지)나 [Storybook](https://miles-hs-lee.github.io/PolarisDesign/storybook/)에서 컴포넌트 카탈로그 시각 확인.

### 2. 있다면 — 그대로 import

```tsx
import { $ARGUMENTS } from '@polaris/ui';
```

prop이나 variants를 임의로 추가하지 말 것. 부족하다고 느끼면 4번으로.

### 3. 없다면 — 인라인으로 만들되 토큰만 사용

이 프로젝트에서 한 번만 쓰는 단순 컴포넌트라면 로컬 파일에 만들어도 됩니다. 단:
- 색상 → `bg-brand-*`, `text-fg-*`, `border-surface-*` 등 토큰 클래스만
- 폰트 → `font-polaris`, `text-polaris-heading-md` 등
- 스페이싱 → Tailwind 기본 (`p-4`, `gap-2`)
- 반경/그림자 → `rounded-polaris-*`, `shadow-polaris-*`

`@polaris/ui` 안에 들어가야 할 정도로 재사용성이 있다면 4번으로.

### 4. @polaris/ui에 추가가 필요하면

사용자에게 알리세요: "이 컴포넌트는 재사용 가치가 있어서 `@polaris/ui` 패키지에 추가하는 게 좋겠습니다. 추가 PR을 띄울까요?"

단독 프로젝트에서 임의로 만들고 끝내지 말 것 — 다음 프로젝트에서 또 누군가가 같은 걸 만들면 결국 일관성이 깨집니다.
