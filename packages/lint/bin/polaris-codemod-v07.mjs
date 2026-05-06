#!/usr/bin/env node
/**
 * polaris-codemod-v07 — rewrites v0.6 tokens / Tailwind classes / CSS
 * variables to their v0.7 spec names.
 *
 * Usage:
 *   pnpm dlx @polaris/lint polaris-codemod-v07 [paths...]              # dry run
 *   pnpm dlx @polaris/lint polaris-codemod-v07 --apply [paths...]      # write
 *   pnpm dlx @polaris/lint polaris-codemod-v07 --check [paths...]      # CI mode
 *
 * Defaults to scanning the current directory. Skips node_modules, dist,
 * .turbo, .next and any path matching .gitignore-style patterns by
 * never recursing into directories with names listed in IGNORED_DIRS.
 *
 * The script is regex-based (no AST). It targets the high-volume
 * patterns documented in `docs/migration/v0.6-to-v0.7.md`. Dynamic
 * class strings (`text-${tone}-primary`) and prop-passed token names
 * are NOT rewritten — flag them in CR.
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
  console.log(`polaris-codemod-v07 — v0.6 → v0.7 token rewriter

Usage:
  polaris-codemod-v07 [paths...]            Dry-run (default). Reports planned changes.
  polaris-codemod-v07 --apply [paths...]    Apply changes in place.
  polaris-codemod-v07 --check [paths...]    Exit non-zero if any change is needed (CI).
  polaris-codemod-v07 --verbose             Print every per-file change.

Paths default to '.' (current directory).
`);
  process.exit(0);
}

if (targets.length === 0) targets.push('.');

// ───── Rewrite tables ────────────────────────────────────────────────

/** TS/TSX/JS — token member access. Word-boundary aware so we don't
 *  rewrite `someText.primary` (only `text.primary`). */
const TS_TOKEN_RENAMES = [
  // text.* → label.*
  [/\btext\.primary\b/g,        'label.normal'],
  [/\btext\.secondary\b/g,      'label.neutral'],
  [/\btext\.muted\b/g,          'label.alternative'],
  [/\btext\.onBrand\b/g,        'label.inverse'],
  [/\btext\.onStatus\b/g,       'label.inverse'],
  // surface.* → background.* / line.*
  [/\bsurface\.canvas\b/g,       'background.alternative'],
  [/\bsurface\.raised\b/g,       'background.normal'],
  [/\bsurface\.sunken\b/g,       'background.alternative'],
  [/\bsurface\.borderStrong\b/g, 'line.normal'],
  [/\bsurface\.border\b/g,       'line.neutral'],
  // brand.* → primary.* / ai.*
  [/\bbrand\.primaryHover\b/g,    'primary.strong'],
  [/\bbrand\.primarySubtle\b/g,   'primary.subtle'], // no v1 exact match — keep for review
  [/\bbrand\.primary\b/g,         'primary.normal'],
  [/\bbrand\.secondaryHover\b/g,  'ai.strong'],
  [/\bbrand\.secondarySubtle\b/g, 'ai.hover'],
  [/\bbrand\.secondary\b/g,       'ai.normal'],
  // typography keys
  [/\bdisplayLg\b/g, 'display'],
  [/\bdisplayMd\b/g, 'h2'],
  [/\bheadingLg\b/g, 'h4'],
  [/\bheadingMd\b/g, 'h5'],
  // headingSm intentionally NOT renamed — no clean spec equivalent
  [/\bbodyLg\b/g,    'body'],
  // bodySm stays the same in v0.7
  [/\bcaption\b/g,   'meta'],
];

/** Tailwind class renames. Match on full class names with hyphenated
 *  prefixes so we don't accidentally rewrite substrings inside larger
 *  identifiers. */
const TAILWIND_RENAMES = [
  // foreground (text) tokens — class form `text-fg-*`
  [/\btext-fg-primary\b/g,    'text-label-normal'],
  [/\btext-fg-secondary\b/g,  'text-label-neutral'],
  [/\btext-fg-muted\b/g,      'text-label-alternative'],
  [/\btext-fg-on-brand\b/g,   'text-label-inverse'],
  [/\btext-fg-on-status\b/g,  'text-label-inverse'],
  // surface → background / line / fill
  [/\bbg-surface-canvas\b/g,         'bg-background-alternative'],
  [/\bbg-surface-raised\b/g,         'bg-background-normal'],
  [/\bbg-surface-sunken\b/g,         'bg-background-alternative'],
  [/\bborder-surface-border-strong\b/g, 'border-line-normal'],
  [/\bborder-surface-border\b/g,        'border-line-neutral'],
  // brand → primary / ai
  [/\bbg-brand-primary-hover\b/g,    'bg-primary-strong'],
  [/\btext-brand-primary-hover\b/g,  'text-primary-strong'],
  [/\bbg-brand-primary\b/g,          'bg-primary-normal'],
  [/\btext-brand-primary\b/g,        'text-primary-normal'],
  [/\bbg-brand-secondary-hover\b/g,  'bg-ai-strong'],
  [/\btext-brand-secondary-hover\b/g,'text-ai-strong'],
  [/\bbg-brand-secondary-subtle\b/g, 'bg-ai-hover'],
  [/\bbg-brand-secondary\b/g,        'bg-ai-normal'],
  [/\btext-brand-secondary\b/g,      'text-ai-normal'],
  // typography utilities
  [/\btext-polaris-display-lg\b/g, 'text-polaris-display'],
  [/\btext-polaris-display-md\b/g, 'text-polaris-h2'],
  [/\btext-polaris-heading-lg\b/g, 'text-polaris-h4'],
  [/\btext-polaris-heading-md\b/g, 'text-polaris-h5'],
  // text-polaris-heading-sm intentionally NOT renamed (no clean equivalent)
  [/\btext-polaris-body-lg\b/g,    'text-polaris-body'],
  // text-polaris-body-sm stays
  [/\btext-polaris-caption\b/g,    'text-polaris-meta'],
  // radius
  [/\brounded-polaris-full\b/g,    'rounded-polaris-pill'],
];

/** CSS custom property renames. Apply to *.css / *.scss only. */
const CSS_VAR_RENAMES = [
  [/--polaris-text-primary\b/g,           '--polaris-label-normal'],
  [/--polaris-text-secondary\b/g,         '--polaris-label-neutral'],
  [/--polaris-text-muted\b/g,             '--polaris-label-alternative'],
  [/--polaris-text-on-brand\b/g,          '--polaris-label-inverse'],
  [/--polaris-text-on-status\b/g,         '--polaris-label-inverse'],
  [/--polaris-surface-canvas\b/g,         '--polaris-background-alternative'],
  [/--polaris-surface-raised\b/g,         '--polaris-background-normal'],
  [/--polaris-surface-sunken\b/g,         '--polaris-background-alternative'],
  [/--polaris-surface-border-strong\b/g,  '--polaris-line-normal'],
  [/--polaris-surface-border\b/g,         '--polaris-line-neutral'],
  [/--polaris-brand-primary-hover\b/g,    '--polaris-primary-strong'],
  [/--polaris-brand-primary-subtle\b/g,   '--polaris-primary-subtle'],
  [/--polaris-brand-primary\b/g,          '--polaris-primary-normal'],
  [/--polaris-brand-secondary-hover\b/g,  '--polaris-ai-strong'],
  [/--polaris-brand-secondary-subtle\b/g, '--polaris-ai-hover'],
  [/--polaris-brand-secondary\b/g,        '--polaris-ai-normal'],
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
  // CSS / SCSS: only the var renames + the Tailwind set if the file is
  // imported as a class string (rare). Apply both to be safe; the
  // Tailwind regexes are non-overlapping with raw CSS hex values.
  if (ext === '.css' || ext === '.scss') {
    apply(CSS_VAR_RENAMES);
    apply(TAILWIND_RENAMES);
  } else if (ext === '.mdx') {
    // MDX may contain JSX class names AND plain prose. Apply
    // Tailwind renames; skip TS token renames to avoid rewriting
    // similarly-spelled words inside prose.
    apply(TAILWIND_RENAMES);
  } else {
    // .ts / .tsx / .js / .jsx / .mjs / .cjs — both tables.
    apply(TS_TOKEN_RENAMES);
    apply(TAILWIND_RENAMES);
  }
  return { out, changes };
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
console.log(`\npolaris-codemod-v07: ${verb} ${totalChanges} occurrences in ${totalFiles} files.`);

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
