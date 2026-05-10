#!/usr/bin/env node
/**
 * polaris-codemod-v08 — rewrites v0.7 deprecated alias tokens / Tailwind
 * classes / CSS variables to their v0.8 spec names.
 *
 * Usage:
 *   pnpm dlx @polaris/lint polaris-codemod-v08 [paths...]              # dry run
 *   pnpm dlx @polaris/lint polaris-codemod-v08 --apply [paths...]      # write
 *   pnpm dlx @polaris/lint polaris-codemod-v08 --check [paths...]      # CI mode
 *
 * Defaults to scanning the current directory. Skips node_modules, dist,
 * .turbo, .next and other build / vendor directories.
 *
 * What v0.8 removes (all targets covered here):
 *   - `text.*` namespace            → `label.*`
 *   - `surface.canvas/raised/sunken/border/borderStrong` → `background.base`
 *     / `layer.surface` / `fill.neutral` / `line.neutral` / `line.normal`.
 *     `surface.popover` / `surface.modal` (v0.7.5 elevation tier) STAY.
 *   - `brand.*` namespace           → `accentBrand.*` / `ai.*`
 *   - `primary.*` namespace         → `accentBrand.*`
 *   - `status.*` namespace          → `state.*` (`danger` → `error`)
 *   - `background.normal/alternative` → `background.base` / `fill.neutral`
 *   - typography legacy keys (`displayLg/Md`, `headingLg/Md/Sm`, `body`,
 *     `meta`, `tiny`, `bodyLg`, h1-h5) → spec keys.
 *   - `radius.full` / Tailwind `rounded-polaris-full` → `pill`.
 *   - bare ramp step `5` → `05` on every brand + supplementary palette.
 *
 * Component / prop renames (BREAKING in v0.8):
 *   - `<Button variant="outline">` → `<Button variant="tertiary">`
 *   - `hint` prop → `helperText` (Input / Textarea / Switch / Checkbox /
 *     FileInput / FileDropZone / DateTimeInput / TimeInput)
 *   - `<Progress tone=>` → `<Progress variant=>`
 *   - `<Stat deltaTone=>` → `<Stat deltaVariant=>`
 *   - `<HStack>` → `<Stack direction="row">`
 *   - `<VStack>` → `<Stack>` (column is the default)
 *
 * Idempotent: running twice on already-migrated v0.8 code is a no-op.
 *
 * The script is regex-based (no AST). It targets the high-volume
 * patterns documented in `docs/migration/v0.7-to-v0.8.md`. Dynamic
 * class strings (`text-${tone}-primary`), prop-passed token names,
 * and JSX tags spread across many lines may need manual review.
 */
import { readFileSync, writeFileSync, statSync, readdirSync } from 'node:fs';
import { join, resolve, extname, relative } from 'node:path';

const IGNORED_DIRS = new Set([
  'node_modules', 'dist', '.next', '.turbo', '.git', 'coverage',
  'build', 'out', '.cache', '.vercel', 'storybook-static',
]);
const SOURCE_EXTS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.css', '.scss', '.mdx',
]);

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const targets = args.filter((a) => !a.startsWith('--'));
const APPLY = flags.has('--apply');
const CHECK = flags.has('--check');
const VERBOSE = flags.has('--verbose');

if (flags.has('--help') || flags.has('-h')) {
  console.log(`polaris-codemod-v08 — v0.7 → v0.8 token rewriter

Usage:
  polaris-codemod-v08 [paths...]            Dry-run (default). Reports planned changes.
  polaris-codemod-v08 --apply [paths...]    Apply changes in place.
  polaris-codemod-v08 --check [paths...]    Exit non-zero if any change is needed (CI).
  polaris-codemod-v08 --verbose             Print every per-file change.

Paths default to '.' (current directory).
`);
  process.exit(0);
}

if (targets.length === 0) targets.push('.');

// ───── Rewrite tables ────────────────────────────────────────────────

/** TS / TSX / JS — token member access. Word-boundary aware so we don't
 *  rewrite e.g. `someText.primary` (only bare `text.primary`). Order
 *  matters — longer specific keys first, then short ones, so `brand.
 *  primaryHover` matches before `brand.primary`. */
const TS_TOKEN_RENAMES = [
  // ───── text.* → label.* ─────
  [/\btext\.primary\b/g,        'label.normal'],
  [/\btext\.secondary\b/g,      'label.neutral'],
  [/\btext\.muted\b/g,          'label.alternative'],
  [/\btext\.onBrand\b/g,        'label.inverse'],
  [/\btext\.onStatus\b/g,       'label.inverse'],

  // ───── surface.* → split (deprecated keys only — popover/modal stay) ─────
  [/\bsurface\.canvas\b/g,       'background.base'],
  [/\bsurface\.raised\b/g,       'layer.surface'],
  [/\bsurface\.sunken\b/g,       'fill.neutral'],
  [/\bsurface\.borderStrong\b/g, 'line.normal'],
  [/\bsurface\.border\b/g,       'line.neutral'],
  // surface.popover / surface.modal — intentionally NOT rewritten.

  // ───── brand.* → accentBrand.* / ai.* ─────
  [/\bbrand\.primaryHover\b/g,    'accentBrand.strong'],
  [/\bbrand\.primarySubtle\b/g,   'accentBrand.bg'],
  [/\bbrand\.primary\b/g,         'accentBrand.normal'],
  [/\bbrand\.secondaryHover\b/g,  'ai.strong'],
  [/\bbrand\.secondarySubtle\b/g, 'ai.hover'],
  [/\bbrand\.secondary\b/g,       'ai.normal'],

  // ───── primary.* (rc.0 alias) → accentBrand.* ─────
  [/\bprimary\.normal\b/g, 'accentBrand.normal'],
  [/\bprimary\.strong\b/g, 'accentBrand.strong'],

  // ───── status.* → state.* (danger → error, *Hover folded into base) ─────
  [/\bstatus\.successHover\b/g, 'state.success'],
  [/\bstatus\.warningHover\b/g, 'state.warning'],
  [/\bstatus\.dangerHover\b/g,  'state.error'],
  [/\bstatus\.infoHover\b/g,    'state.info'],
  [/\bstatus\.danger\b/g,       'state.error'],
  [/\bstatus\.success\b/g,      'state.success'],
  [/\bstatus\.warning\b/g,      'state.warning'],
  [/\bstatus\.info\b/g,         'state.info'],

  // ───── typography legacy keys → spec keys ─────
  // (e.g. inside `textStyle.<key>` member-access or destructured imports)
  // displayLg/Md and headingLg/Md/Sm have no other meaning, safe to global-
  // replace. `body` / `meta` / `tiny` are unsafe as bare words (overlap with
  // HTML tags / variable names), so we only touch them inside `textStyle.`.
  [/\bdisplayLg\b/g, 'display'],
  [/\bdisplayMd\b/g, 'title'],
  [/\bheadingLg\b/g, 'heading2'],
  [/\bheadingMd\b/g, 'heading3'],
  [/\bheadingSm\b/g, 'heading4'],
  [/\btextStyle\.body\b(?!\d|Sm|Lg)/g, 'textStyle.body1'],
  [/\btextStyle\.bodySm\b/g,           'textStyle.body2'],
  [/\btextStyle\.bodyLg\b/g,           'textStyle.body1'],
  [/\btextStyle\.meta\b/g,             'textStyle.caption1'],
  [/\btextStyle\.tiny\b/g,             'textStyle.caption2'],
  [/\btextStyle\.h1\b/g,               'textStyle.display'],
  [/\btextStyle\.h2\b/g,               'textStyle.title'],
  [/\btextStyle\.h3\b/g,               'textStyle.heading1'],
  [/\btextStyle\.h4\b/g,               'textStyle.heading2'],
  [/\btextStyle\.h5\b/g,               'textStyle.heading3'],
  [/\btextStyle\.detail\b/g,           'textStyle.body2'],
  [/\btextStyle\.caption\b(?!\d)/g,    'textStyle.caption1'],

  // ───── named-imports cleanup — { brand } / { status } / { text } / { primary } ─────
  // Runs last so the member-access rewrites above have already landed.
  // Targets both `@polaris/ui` (root barrel) and `@polaris/ui/tokens`
  // (the recommended path for token namespaces). Walks the named-import
  // list so mixed imports (`import { text, label } from '@polaris/ui'`)
  // are partially rewritten without false-positives on `text` / `brand` /
  // `status` / `primary` identifiers used elsewhere in the file.
  //
  // NOTE on `brand` — rc.0 `brand.primary` (→ `accentBrand.normal`) and
  // `brand.secondary` (→ `ai.normal`) split into TWO namespaces. The
  // import rename only adds `accentBrand`; if the consumer used
  // `brand.secondary`, member-access rewrites will reference `ai.*`,
  // and TypeScript will flag the missing `ai` import on the next build.
  // Reviewers add `, ai` by hand. This is documented in the migration
  // guide caveat list.
  [/(import\s*(?:type\s+)?\{)([^}]+)(\}\s*from\s*['"]@polaris\/ui(?:\/tokens)?['"])/g,
    rewritePolarisTokenImport],
];

/** Renames inside a `@polaris/ui` / `@polaris/ui/tokens` named-import list.
 *  Replaces deprecated namespace bindings (`text` / `brand` / `status` /
 *  `primary`) with their v0.8 names. Per-identifier so mixed imports
 *  rewrite cleanly. */
const TOKEN_IMPORT_IDENT_RENAMES = {
  text:    'label',
  brand:   'accentBrand',
  status:  'state',
  primary: 'accentBrand',
};

function rewritePolarisTokenImport(_match, p1Open, body, p3Close) {
  const renamedBody = body
    .split(',')
    .map((part) => {
      // Match the leading identifier (preserves leading whitespace +
      // any trailing `as Alias` / type-only modifiers).
      const ident = part.match(/^(\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\b/);
      if (!ident) return part;
      const next = TOKEN_IMPORT_IDENT_RENAMES[ident[2]];
      if (!next) return part;
      return ident[1] + next + part.slice(ident[0].length);
    })
    .join(',');
  return `${p1Open}${renamedBody}${p3Close}`;
}

/** Tailwind class renames. Match on full class names with hyphenated
 *  prefixes so we don't accidentally rewrite substrings inside larger
 *  identifiers. Idempotent on already-migrated classes. */
const TAILWIND_RENAMES = [
  // ───── foreground (text) tokens ─────
  [/\btext-fg-primary\b/g,    'text-label-normal'],
  [/\btext-fg-secondary\b/g,  'text-label-neutral'],
  [/\btext-fg-muted\b/g,      'text-label-alternative'],
  [/\btext-fg-on-brand\b/g,   'text-label-inverse'],
  [/\btext-fg-on-status\b/g,  'text-label-inverse'],

  // ───── surface utilities → background / layer / fill / line ─────
  [/\bbg-surface-canvas\b/g,            'bg-background-base'],
  [/\bbg-surface-raised\b/g,            'bg-layer-surface'],
  [/\bbg-surface-sunken\b/g,            'bg-fill-neutral'],
  // `surface-border-strong` / `surface-border` show up across more
  // utility prefixes than border-* (v0.7 components used `bg-` for thin
  // separators, `divide-` for table dividers, `ring-` for focus halos).
  // Catch them all in one sweep — the line-* family takes the same set
  // of utility prefixes downstream so a single rewrite is safe.
  [/\b(bg|border|divide|ring|outline|fill|stroke|caret|accent|placeholder|from|via|to)-surface-border-strong\b/g,
    '$1-line-normal'],
  [/\b(bg|border|divide|ring|outline|fill|stroke|caret|accent|placeholder|from|via|to)-surface-border\b/g,
    '$1-line-neutral'],
  // surface-popover / surface-modal stay (v0.7.5 elevation tier).

  // ───── brand-* family (incl. all utility prefixes) → accent-brand-* / ai-* ─────
  [/\bbg-brand-primary-hover\b/g,        'bg-accent-brand-strong'],
  [/\btext-brand-primary-hover\b/g,      'text-accent-brand-strong'],
  [/\bborder-brand-primary-hover\b/g,    'border-accent-brand-strong'],
  [/\bring-brand-primary-hover\b/g,      'ring-accent-brand-strong'],
  [/\boutline-brand-primary-hover\b/g,   'outline-accent-brand-strong'],
  [/\bfill-brand-primary-hover\b/g,      'fill-accent-brand-strong'],
  [/\bstroke-brand-primary-hover\b/g,    'stroke-accent-brand-strong'],
  [/\bbg-brand-primary-subtle\b/g,       'bg-accent-brand-bg'],
  [/\btext-brand-primary-subtle\b/g,     'text-accent-brand-bg'],
  [/\bborder-brand-primary-subtle\b/g,   'border-accent-brand-bg'],
  [/\bbg-brand-primary\b/g,              'bg-accent-brand-normal'],
  [/\btext-brand-primary\b/g,            'text-accent-brand-normal'],
  [/\bborder-brand-primary\b/g,          'border-accent-brand-normal'],
  [/\bring-brand-primary\b/g,            'ring-accent-brand-normal'],
  [/\boutline-brand-primary\b/g,         'outline-accent-brand-normal'],
  [/\bfill-brand-primary\b/g,            'fill-accent-brand-normal'],
  [/\bstroke-brand-primary\b/g,          'stroke-accent-brand-normal'],
  [/\bbg-brand-secondary-hover\b/g,      'bg-ai-strong'],
  [/\btext-brand-secondary-hover\b/g,    'text-ai-strong'],
  [/\bborder-brand-secondary-hover\b/g,  'border-ai-strong'],
  [/\bbg-brand-secondary-subtle\b/g,     'bg-ai-hover'],
  [/\btext-brand-secondary-subtle\b/g,   'text-ai-hover'],
  [/\bborder-brand-secondary-subtle\b/g, 'border-ai-hover'],
  [/\bbg-brand-secondary\b/g,            'bg-ai-normal'],
  [/\btext-brand-secondary\b/g,          'text-ai-normal'],
  [/\bborder-brand-secondary\b/g,        'border-ai-normal'],
  [/\bring-brand-secondary\b/g,          'ring-ai-normal'],
  [/\boutline-brand-secondary\b/g,       'outline-ai-normal'],

  // ───── status-* → state-* (danger → error, hover variants folded in) ─────
  [/\bbg-status-success-hover\b/g,   'bg-state-success'],
  [/\bbg-status-warning-hover\b/g,   'bg-state-warning'],
  [/\bbg-status-danger-hover\b/g,    'bg-state-error'],
  [/\bbg-status-info-hover\b/g,      'bg-state-info'],
  [/\btext-status-success-hover\b/g, 'text-state-success'],
  [/\btext-status-warning-hover\b/g, 'text-state-warning'],
  [/\btext-status-danger-hover\b/g,  'text-state-error'],
  [/\btext-status-info-hover\b/g,    'text-state-info'],
  [/\bborder-status-success-hover\b/g, 'border-state-success'],
  [/\bborder-status-warning-hover\b/g, 'border-state-warning'],
  [/\bborder-status-danger-hover\b/g,  'border-state-error'],
  [/\bborder-status-info-hover\b/g,    'border-state-info'],
  [/\bbg-status-success\b/g,    'bg-state-success'],
  [/\bbg-status-warning\b/g,    'bg-state-warning'],
  [/\bbg-status-danger\b/g,     'bg-state-error'],
  [/\bbg-status-info\b/g,       'bg-state-info'],
  [/\btext-status-success\b/g,  'text-state-success'],
  [/\btext-status-warning\b/g,  'text-state-warning'],
  [/\btext-status-danger\b/g,   'text-state-error'],
  [/\btext-status-info\b/g,     'text-state-info'],
  [/\bborder-status-success\b/g, 'border-state-success'],
  [/\bborder-status-warning\b/g, 'border-state-warning'],
  [/\bborder-status-danger\b/g,  'border-state-error'],
  [/\bborder-status-info\b/g,    'border-state-info'],

  // ───── background-{normal,alternative} → split ─────
  // `background-normal` was the de-facto raised/card surface in rc.0 +
  // some v0.7 code. v0.8 spec uses `background-base` for the page root,
  // and components that lifted off the page use `layer-surface`. The
  // most-common usage in our workspace is "card-like elevation on white",
  // so `background-base` is the safer default; reviewers should spot-
  // check elevated cards and switch them to `bg-layer-surface` manually.
  [/\bbg-background-normal\b/g,      'bg-background-base'],
  [/\bbg-background-alternative\b/g, 'bg-fill-neutral'],

  // ───── primary-* (rc.0 alias) → accent-brand-* ─────
  [/\bbg-primary-normal\b/g,     'bg-accent-brand-normal'],
  [/\bbg-primary-strong\b/g,     'bg-accent-brand-strong'],
  [/\btext-primary-normal\b/g,   'text-accent-brand-normal'],
  [/\btext-primary-strong\b/g,   'text-accent-brand-strong'],
  [/\bborder-primary-normal\b/g, 'border-accent-brand-normal'],
  [/\bborder-primary-strong\b/g, 'border-accent-brand-strong'],

  // ───── typography utilities → spec names ─────
  [/\btext-polaris-display-lg\b/g, 'text-polaris-display'],
  [/\btext-polaris-display-md\b/g, 'text-polaris-title'],
  [/\btext-polaris-heading-lg\b/g, 'text-polaris-heading2'],
  [/\btext-polaris-heading-md\b/g, 'text-polaris-heading3'],
  [/\btext-polaris-heading-sm\b/g, 'text-polaris-heading4'],
  [/\btext-polaris-h1\b/g,         'text-polaris-display'],
  [/\btext-polaris-h2\b/g,         'text-polaris-title'],
  [/\btext-polaris-h3\b/g,         'text-polaris-heading1'],
  [/\btext-polaris-h4\b/g,         'text-polaris-heading2'],
  [/\btext-polaris-h5\b/g,         'text-polaris-heading4'], // h5 absorbed into h4 (no spec equivalent for 20px elsewhere; closest by role)
  [/\btext-polaris-body-lg\b/g,    'text-polaris-body1'],
  [/\btext-polaris-body-sm\b/g,    'text-polaris-body2'],
  [/\btext-polaris-body\b(?!-|\d)/g, 'text-polaris-body1'],
  [/\btext-polaris-meta\b/g,       'text-polaris-caption1'],
  [/\btext-polaris-tiny\b/g,       'text-polaris-caption2'],
  [/\btext-polaris-caption\b(?!\d)/g, 'text-polaris-caption1'],

  // ───── radius ─────
  [/\brounded-polaris-full\b/g, 'rounded-polaris-pill'],

  // ───── primitive ramp step `5` → `05` ─────
  // (bg|text|...)-(blue|green|orange|red|purple|sky-blue|blue-supplementary|
  // violet|cyan|yellow|dark-blue)-5 → -05. Negative lookahead avoids
  // matching `-50`, `-500`, etc. Gray ramp is 10–90 only (no 5 or 05),
  // so it's excluded.
  [/\b(bg|text|border|fill|stroke|outline|ring|shadow|from|via|to|caret|accent|placeholder|divide)-(blue|dark-blue|green|orange|red|purple|sky-blue|blue-supplementary|violet|cyan|yellow)-5\b(?!\d)/g,
    '$1-$2-05'],
];

/** CSS custom property renames. Apply to *.css / *.scss only. */
const CSS_VAR_RENAMES = [
  // text-* → label-*
  [/--polaris-text-primary\b/g,           '--polaris-label-normal'],
  [/--polaris-text-secondary\b/g,         '--polaris-label-neutral'],
  [/--polaris-text-muted\b/g,             '--polaris-label-alternative'],
  [/--polaris-text-on-brand\b/g,          '--polaris-label-inverse'],
  [/--polaris-text-on-status\b/g,         '--polaris-label-inverse'],
  // surface-* → background / layer / fill / line
  [/--polaris-surface-canvas\b/g,         '--polaris-background-base'],
  [/--polaris-surface-raised\b/g,         '--polaris-layer-surface'],
  [/--polaris-surface-sunken\b/g,         '--polaris-fill-neutral'],
  [/--polaris-surface-border-strong\b/g,  '--polaris-line-normal'],
  [/--polaris-surface-border\b/g,         '--polaris-line-neutral'],
  // surface-popover / surface-modal stay.
  // brand-* → accent-brand-* / ai-*
  [/--polaris-brand-primary-hover\b/g,    '--polaris-accent-brand-strong'],
  [/--polaris-brand-primary-subtle\b/g,   '--polaris-accent-brand-bg'],
  [/--polaris-brand-primary\b/g,          '--polaris-accent-brand-normal'],
  [/--polaris-brand-secondary-hover\b/g,  '--polaris-ai-strong'],
  [/--polaris-brand-secondary-subtle\b/g, '--polaris-ai-hover'],
  [/--polaris-brand-secondary\b/g,        '--polaris-ai-normal'],
  // primary-* (rc.0) → accent-brand-*
  [/--polaris-primary-normal\b/g,         '--polaris-accent-brand-normal'],
  [/--polaris-primary-strong\b/g,         '--polaris-accent-brand-strong'],
  // status-* → state-* (danger → error, hover folded in)
  [/--polaris-status-success-hover\b/g,   '--polaris-state-success'],
  [/--polaris-status-warning-hover\b/g,   '--polaris-state-warning'],
  [/--polaris-status-danger-hover\b/g,    '--polaris-state-error'],
  [/--polaris-status-info-hover\b/g,      '--polaris-state-info'],
  [/--polaris-status-success\b/g,         '--polaris-state-success'],
  [/--polaris-status-warning\b/g,         '--polaris-state-warning'],
  [/--polaris-status-danger\b/g,          '--polaris-state-error'],
  [/--polaris-status-info\b/g,            '--polaris-state-info'],
  // background-normal/alternative → background-base / fill-neutral
  [/--polaris-background-normal\b/g,      '--polaris-background-base'],
  [/--polaris-background-alternative\b/g, '--polaris-fill-neutral'],
  // radius-full → radius-pill
  [/--polaris-radius-full\b/g,            '--polaris-radius-pill'],
  // ramp `5` → `05`
  [/--polaris-(blue|dark-blue|green|orange|red|purple|sky-blue|blue-supplementary|violet|cyan|yellow)-5\b(?!\d)/g,
    '--polaris-$1-05'],
];

/** JSX prop / component renames. Applied to .tsx / .jsx / .mdx only —
 *  these patterns target opening-tag attributes and component identifiers,
 *  which only appear in JSX-bearing files.
 *
 *  Caveats (regex limitations, not AST):
 *   - Opening-tag patterns (`<Component … prop=`) match within a single
 *     `>`-free run. JSX tags split across many lines with `>` characters
 *     in attribute values may slip through — reviewers should grep for
 *     residual `hint=`, `tone=`, `deltaTone=`, `variant="outline"` after
 *     a run.
 *   - Import lines: we rewrite bare `HStack` / `VStack` identifiers to
 *     `Stack` after JSX tag rewrites. If a file already imports `Stack`
 *     alongside `HStack`/`VStack`, the result has a duplicate import name
 *     that TypeScript will flag — fix by hand. */
const JSX_RENAMES = [
  // Button: variant="outline" → variant="tertiary"
  [/(<Button\b[^>]*?\bvariant=)["']outline["']/g, '$1"tertiary"'],

  // hint → helperText (form components — keep this list in sync with
  // packages/ui/src/components/* SharedProps definitions).
  [/(<(?:Input|Textarea|Switch|Checkbox|FileInput|FileDropZone|DateTimeInput|TimeInput)\b[^>]*?)\bhint=/g,
    '$1helperText='],

  // Progress: tone → variant
  [/(<Progress\b[^>]*?)\btone=/g, '$1variant='],

  // Stat: deltaTone → deltaVariant
  [/(<Stat\b[^>]*?)\bdeltaTone=/g, '$1deltaVariant='],

  // HStack → <Stack direction="row">. Match opening tag only — we add
  // `direction="row"` so the row layout is preserved. Closing tag is
  // handled by a separate pattern below.
  [/<HStack(\s+[^>]*?)?(\s*\/?>)/g, (_m, attrs, close) => {
    // Insert `direction="row"` as the first attribute so JSX prop
    // ordering reads: <Stack direction="row" gap="…" align="…" />.
    const trailing = attrs ? attrs : '';
    return `<Stack direction="row"${trailing}${close}`;
  }],
  [/<\/HStack>/g, '</Stack>'],

  // VStack → <Stack> (column is the default direction in v0.8).
  [/<VStack(\s+[^>]*?)?(\s*\/?>)/g, (_m, attrs, close) => {
    const trailing = attrs ? attrs : '';
    return `<Stack${trailing}${close}`;
  }],
  [/<\/VStack>/g, '</Stack>'],

  // Import-line cleanup: rename `HStack` / `VStack` named-import bindings
  // to `Stack`. Only touches identifiers within `import { … } from
  // '@polaris/ui'` lines so we don't accidentally rename a local variable.
  [/(import\s*\{[^}]*?\b)HStack(\b[^}]*?\}\s*from\s*['"]@polaris\/ui['"])/g, '$1Stack$2'],
  [/(import\s*\{[^}]*?\b)VStack(\b[^}]*?\}\s*from\s*['"]@polaris\/ui['"])/g, '$1Stack$2'],
];

// ───── Walker ────────────────────────────────────────────────────────

function* walk(start) {
  const stack = [resolve(start)];
  while (stack.length) {
    const path = stack.pop();
    let stat;
    try { stat = statSync(path); } catch { continue; }
    if (stat.isDirectory()) {
      const base = path.split('/').pop();
      if (IGNORED_DIRS.has(base)) continue;
      for (const child of readdirSync(path)) stack.push(join(path, child));
    } else if (stat.isFile()) {
      const ext = extname(path);
      if (SOURCE_EXTS.has(ext)) yield path;
    }
  }
}

function transform(content, filePath) {
  const ext = extname(filePath);
  let out = content;
  let changes = 0;
  const apply = (table) => {
    for (const [re, repl] of table) {
      const before = out;
      out = out.replace(re, repl);
      if (out !== before) changes += (before.match(re) ?? []).length;
    }
  };
  if (ext === '.css' || ext === '.scss') {
    apply(CSS_VAR_RENAMES);
    apply(TAILWIND_RENAMES);
  } else if (ext === '.mdx') {
    // MDX: skip TS member-access rewrites (would mangle prose like
    // "the text primary"); apply Tailwind class names + CSS var refs.
    apply(TAILWIND_RENAMES);
    apply(CSS_VAR_RENAMES);
    apply(JSX_RENAMES);
  } else if (ext === '.tsx' || ext === '.jsx') {
    // .tsx / .jsx — full rewrite set incl. JSX tag/prop renames.
    apply(TS_TOKEN_RENAMES);
    apply(TAILWIND_RENAMES);
    apply(CSS_VAR_RENAMES);
    apply(JSX_RENAMES);
    const after = normalizePolarisImports(out);
    if (after !== out) changes += 1;
    out = after;
  } else {
    // .ts / .js / .mjs / .cjs — token / class-string only (no JSX).
    apply(TS_TOKEN_RENAMES);
    apply(TAILWIND_RENAMES);
    apply(CSS_VAR_RENAMES);
    const after = normalizePolarisImports(out);
    if (after !== out) changes += 1;
    out = after;
  }
  return { out, changes };
}

/** Post-pass: keep `@polaris/ui` / `@polaris/ui/tokens` named-import lines
 *  in sync with the namespaces actually used in the file body.
 *
 *  The motivating case: `brand.secondary*` member-access rewrites to
 *  `ai.*`, but the import-line rewrite only renames the binding to
 *  `accentBrand`. Result: `import { accentBrand } …; const x = ai.normal;`
 *  → consumer build breaks (`ai is not defined`). This pass scans the
 *  file body for `\b<namespace>\.` usage and appends any namespace that
 *  isn't yet imported to the FIRST `@polaris/ui[/tokens]` import line.
 *
 *  Caveats (regex-based, not AST):
 *   - Local variables named like a v0.8 token namespace (e.g.
 *     `const ai = …`) would be detected as "used" and trigger an
 *     unnecessary import addition. Rare in practice for these names —
 *     listed in the migration guide.
 *   - Idempotent: a second run sees the namespace already imported and
 *     adds nothing. */
function normalizePolarisImports(content) {
  // Match `import { ... } from '@polaris/ui'` or `'@polaris/ui/tokens'`.
  const POLARIS_IMPORT_RE =
    /import\s*(?:type\s+)?\{([^}]+)\}\s*from\s*['"]@polaris\/ui(?:\/tokens)?['"];?/g;

  // v0.8 token namespaces that may appear via member-access rewrites
  // (especially `brand.secondary*` → `ai.*`, `text.*` → `label.*`,
  // `status.*` → `state.*`, `primary.*` → `accentBrand.*`).
  const NAMESPACES_TO_CHECK = ['ai', 'accentBrand', 'state', 'label'];

  const usedInBody = new Set(
    NAMESPACES_TO_CHECK.filter((ns) =>
      // Require an identifier character after the dot — excludes prose
      // like "navigation state." in JSDoc comments, where `state.` is
      // sentence punctuation rather than a member access.
      new RegExp(`\\b${ns}\\.[a-zA-Z_$]`).test(content)
    )
  );
  if (usedInBody.size === 0) return content;

  const matches = [...content.matchAll(POLARIS_IMPORT_RE)];
  if (matches.length === 0) return content;

  const importedNames = new Set();
  for (const m of matches) {
    for (const part of m[1].split(',')) {
      const ident = part.trim().match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)/);
      if (ident) importedNames.add(ident[1]);
    }
  }

  const missing = [...usedInBody].filter((ns) => !importedNames.has(ns));
  if (missing.length === 0) return content;

  // Append to the first polaris import line; sibling lines unchanged.
  let added = false;
  return content.replace(POLARIS_IMPORT_RE, (match, body) => {
    if (added) return match;
    added = true;
    const trimmed = body.trim();
    const sep = trimmed ? ', ' : '';
    return match.replace(`{${body}}`, `{ ${trimmed}${sep}${missing.join(', ')} }`);
  });
}

// ───── Main ──────────────────────────────────────────────────────────

let totalChanges = 0;
let totalFiles = 0;
const changedFiles = [];

for (const target of targets) {
  for (const file of walk(target)) {
    let content;
    try { content = readFileSync(file, 'utf8'); } catch { continue; }
    const { out, changes } = transform(content, file);
    if (changes === 0) continue;
    totalChanges += changes;
    totalFiles += 1;
    changedFiles.push({ file, changes });
    if (APPLY) writeFileSync(file, out);
    if (VERBOSE) {
      console.log(`  ${relative(process.cwd(), file)} — ${changes} ${changes === 1 ? 'rename' : 'renames'}`);
    }
  }
}

const verb = APPLY ? 'rewrote' : (CHECK ? 'would rewrite' : 'would rewrite');
console.log(`\npolaris-codemod-v08: ${verb} ${totalChanges} occurrences in ${totalFiles} files.`);

if (!APPLY && !CHECK && totalFiles > 0) {
  console.log('\nDry run. Re-run with --apply to write changes.');
  console.log('Top files:');
  changedFiles
    .sort((a, b) => b.changes - a.changes)
    .slice(0, 10)
    .forEach(({ file, changes }) => {
      console.log(`  ${changes.toString().padStart(4)} · ${relative(process.cwd(), file)}`);
    });
}

if (CHECK && totalChanges > 0) {
  console.error('\n--check: codemod is needed. Re-run with --apply.');
  process.exit(1);
}
