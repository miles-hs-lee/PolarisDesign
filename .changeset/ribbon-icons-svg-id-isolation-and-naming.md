---
'@polaris/ui': patch
'@polaris/lint': patch
'@polaris/plugin': patch
'polaris-template-next': patch
'demo': patch
---

릴리즈 게이트 통과 — RC 후속 정정 (SVG id 격리, 컴포넌트 네이밍, 폰트 weight, 린트 게이트).

**`@polaris/ui` — SVG id 충돌 방지 (P1):**

`build-{icons,file-icons,logos,ribbon-icons}` 4종 generator가 각 SVG 본문에 등장하는 `id="..."` 정의와 모든 `url(#...)`/`href="#..."`/`xlink:href="#..."` 참조를 슬러그 prefix(`<slug>__<sanitized-id>`)로 다시 작성. Figma export의 자동 ID(`clip0_0_31035`, `Mask`, `Group_2` 등)가 다른 아이콘 사이에 충돌하면서 두 번째 인스턴스의 clip-path / mask / linear gradient가 첫 번째 정의로 잘못 resolve 되는 문제 해소.

검증: `wordcount.tsx`의 `clip0_0_31035` → `wordcount__clip0_0_31035`. Korean / 공백 같은 URL 부적합 문자도 `[A-Za-z0-9_-]`로 sanitize.

**`@polaris/ui/ribbon-icons` — 컴포넌트 네이밍 정리 (P1, public API freeze 직전):**

Figma export 파일명이 compound concat(예: `aligncenter`, `textcolor`, `rotateright90`)된 슬러그를 사람이 읽기 좋은 kebab-case로 정규화하는 `SLUG_REWRITES` 맵을 generator에 추가. 결과:

- `AligncenterIcon` → `AlignCenterIcon`
- `TextcolorIcon` → `TextColorIcon`
- `Rotateright90Icon` → `RotateRight90Icon`
- `DocuprotectionIcon` → `DocuProtectionIcon`
- `LinespacingIcon` → `LineSpacingIcon`
- `WordcountIcon` → `WordCountIcon`
- 등 30여 종

source SVG 파일명은 그대로 두고 normalize 단계에서만 rewrite — 향후 Figma 재-export 시에도 자동 적용. 추가 entry는 안전(추가만), 제거/변경은 0.7.1 이후 breaking이므로 `@polaris/ui/ribbon-icons` 첫 publish 직전인 RC 단계에서 정리.

**`@polaris/ui/ribbon` — 폰트 weight 정정:**

`text-polaris-caption1`은 spec에 따라 weight 700(굵게)이지만 Office 실제 lg 리본 버튼 라벨(붙여넣기 / 페이지 설정 / …)은 regular 400. `RibbonButton` lg variant + `RibbonStack` 라벨에 `font-normal` 명시 추가. `RibbonTab` active 상태에서 `font-semibold` 제거 — underline accent + label-normal 색만으로 충분.

**`apps/demo` 시각 회귀 baseline 갱신:**

위 변경(font-normal lg 라벨, ID prefix가 들어간 ribbon 아이콘 SVG, RC ARIA wrapper)들이 픽셀 차이를 만들어 `pnpm test:e2e` 28건 중 12건이 실패. `pnpm test:e2e:update` 로 baseline 재기준선화. 이번 변경분이 이 픽셀 차이의 원인이며, 결과 모두 의도된 시각 변경.

**CI / lint 게이트 정정:**

- `polaris-template-next`(npm-publish 대상) lint script에 `--max-warnings=0` 추가. 기존 3 warnings(`Plus`, `Search`, `Image as ImageIcon`)는 polaris 등가물(`PlusIcon`, `SearchIcon`, `ImageIcon`)로 swap.
- `apps/demo`(local sandbox)는 80여 lucide chrome 아이콘 warning을 일단 허용하되 CI step 이름을 "showcase, warnings allowed"로 정정 — 이전엔 "must be 0 violations"라 표시됐지만 실제로는 enforce되지 않던 기만 문구.
