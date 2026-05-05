# @polaris/plugin

## 0.6.1

### Patch Changes

- v0.6.1 — ribbon polish, infra hardening, and design assets reference

  Ribbon (@polaris/ui/ribbon)

  - `RibbonSplitButton` no longer mounts a `DropdownMenu` when `disabled`,
    so the chevron half can't open the menu (Radix asChild + native
    disabled wasn't enough). Verified by a Vitest case in the new ribbon
    suite.
  - `RibbonContent` panel pinned to `min-h-20` (80px). Tabs that pair an
    `lg` button with a multi-row `sm` stack no longer change ribbon
    height when the active tab switches.
  - `overflow-x-auto overflow-y-clip` — kills the stray vertical
    scrollbar that the implicit `overflow-y: auto` would otherwise add.
  - Horizontal scrollbar visible on mobile (`<md`), hidden on desktop
    (Office pattern). `RibbonTabList` mirrors the same behavior.
  - `RibbonContent` honors `data-[state=inactive]:hidden` so inactive
    panels collapse to 0 height instead of claiming `py-1` padding.

  Tests (@polaris/ui)

  - 14 new component test files (Card / Input / Textarea / Toast /
    Tooltip / Select / Checkbox / Switch / Badge / Avatar / Alert /
    Pagination / NovaInput) plus first suites for `@polaris/ui/ribbon`
    and `@polaris/ui/form`. Coverage went from 17% to ~60%, total
    21 files / 82 tests.

  Tokens

  - `packages/ui/scripts/build-tokens.ts` is now the single source for
    `src/styles/tokens.css`. Hand-editing the CSS is blocked by a CI
    drift check. Includes color, radius, shadow, AND font-family
    variables — the latter was missed in the first generator pass and
    broke `font-polaris` / `font-polaris-mono` utilities until fixed.
  - `tokens.md` rewritten to match `tokens.ts` 1-for-1 (was missing
    status hover variants, `text.onStatus`, full spacing scale, dark
    shadow column, and used dotted names where the code uses camelCase).

  Demo

  - New `/#/assets` route under "시스템 레퍼런스" — surfaces Polaris's
    own logos, icons, and AI-model marks (sourced from
    `polink-static-contents.polarisoffice.com`) alongside a curated
    lucide-react grid. Goal: contributors check the existing brand
    assets before pulling in new lucide imports.
  - New `/#/tokens` route — replaces the static `swatches.html` with a
    React page that imports straight from `@polaris/ui/tokens`. Token
    changes show up automatically.
  - Polaris Office demo: top-bar action labels collapse responsively
    below md/lg, document title now `truncate`s. EditorChrome stays
    one row on phones.
  - vite.config aliases `@polaris/ui` and its subpaths directly to
    source so dev HMR no longer needs a separate tsup build between
    package edits.

  Infra (root + CI)

  - `@changesets/cli` introduced with all five workspace packages in a
    `fixed` group. Releases now run via `pnpm version` (no more sed-bumping
    six package.json files) + `scripts/sync-root-version.mjs` keeps the
    root pkg in lockstep too, with a CI `--check` step.
  - Playwright visual regression suite — desktop + mobile baselines for
    every demo route plus per-tab ribbon snapshots. 26 baseline PNGs
    committed; `pnpm test:e2e` is the diff gate, `pnpm test:e2e:update`
    refreshes after intentional changes.
  - Turbo `test` task now depends on `^build` AND `build` — no more
    race between a package's own build and its node:test reading
    `dist/`.
  - CI `pnpm changeset status` step uses `fetch-depth: 0` and the
    actual base ref (`github.base_ref`); fails loudly on ref errors
    instead of `|| true`-swallowing them.
  - `AGENTS.md` and plugin commands updated to use `pnpm lint` —
    `pnpm exec eslint .` was failing at the root because there's no
    eslint binary there. Leftover `/storybook/` links scrubbed.

  No public API was added or removed in this release — all changes are
  fixes, infra, or new demo routes. Bumping minor would have been
  defensible for the new test/visual/token-generator infra, but every
  behavior change is backward compatible, so going with patch.
