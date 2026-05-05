# Changesets

이 폴더는 [`@changesets/cli`](https://github.com/changesets/changesets)가 사용합니다.
폴라리스의 5개 패키지(`@polaris/ui`, `@polaris/lint`, `@polaris/plugin`, `polaris-template-next`, `demo`)는
**한 버전으로 묶여 있습니다** (`config.json`의 `fixed` 그룹). 즉 한 패키지가 bump되면 모두 같이 bump.

## 사용법

### PR 작성 시

변경 사항이 사용자에게 영향이 있다면 (= public API / 시각 동작 / 의존성):

```sh
pnpm changeset
```

대화형 prompt에서:
1. 영향 받는 패키지 선택 (스페이스로 토글)
2. bump 종류 — `major` / `minor` / `patch`
3. 변경 요약 (CHANGELOG에 들어갈 텍스트)

→ `.changeset/<random>.md` 생성됨. 같은 PR에 commit.

### 릴리스

`main`에 changeset이 모이면:

```sh
pnpm version    # 모든 패키지 version bump + CHANGELOG.md 갱신
git add . && git commit -m "vX.Y.Z" && git tag vX.Y.Z
git push origin main --tags
```

(향후 GitHub Action `release.yml`로 자동화 예정)

### 변경 사항이 사용자에게 영향 없을 때

내부 리팩터·테스트 추가·docs 정정 등은 changeset 안 만들어도 됨. PR 그대로 merge.

---

## 추가 자료

- [Changesets common questions](https://github.com/changesets/changesets/blob/main/docs/common-questions.md)
- [Fixed packages](https://github.com/changesets/changesets/blob/main/docs/config-file-options.md#fixed-array-of-arrays-of-package-names)
