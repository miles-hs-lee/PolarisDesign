/**
 * Smoke tests for the v0.7 → v0.8 codemod.
 *
 * Builds a temp directory with sample TSX / CSS, runs the codemod with
 * --apply, and asserts that the v0.7 deprecated alias names are gone
 * and the v0.8 spec names appear. Stops short of asserting exact byte
 * equivalence to keep the fixture readable.
 *
 * Run via: node --test test/codemod-v08.test.mjs
 */
import { mkdtempSync, writeFileSync, readFileSync, rmSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import assert from 'node:assert/strict';

const __dirname = dirname(fileURLToPath(import.meta.url));
const codemod = resolve(__dirname, '../bin/polaris-codemod-v08.mjs');

function runCodemod(dir, args = []) {
  return spawnSync('node', [codemod, ...args, dir], { encoding: 'utf8' });
}

function setup() {
  const dir = mkdtempSync(join(tmpdir(), 'polaris-codemod-v08-'));
  return dir;
}

function cleanup(dir) {
  rmSync(dir, { recursive: true, force: true });
}

test('rewrites Tailwind classes (v0.7 deprecated → v0.8 spec)', () => {
  const dir = setup();
  try {
    writeFileSync(join(dir, 'a.tsx'), `
      export const X = () => (
        <div className="bg-background-normal text-fg-primary border-surface-border-strong rounded-polaris-full bg-brand-primary text-brand-secondary bg-status-danger" />
      );
    `);
    const r = runCodemod(dir, ['--apply']);
    assert.equal(r.status, 0, r.stderr);
    const out = readFileSync(join(dir, 'a.tsx'), 'utf8');
    assert.match(out, /bg-background-base/);
    assert.match(out, /text-label-normal/);
    assert.match(out, /border-line-normal/);
    assert.match(out, /rounded-polaris-pill/);
    assert.match(out, /bg-accent-brand-normal/);
    assert.match(out, /text-ai-normal/);
    assert.match(out, /bg-state-error/);    // danger → error
    // legacy names must be gone
    assert.doesNotMatch(out, /bg-background-normal/);
    assert.doesNotMatch(out, /text-fg-primary/);
    assert.doesNotMatch(out, /rounded-polaris-full/);
    assert.doesNotMatch(out, /bg-brand-primary/);
    assert.doesNotMatch(out, /bg-status-danger/);
  } finally { cleanup(dir); }
});

test('rewrites typography utility classes (v0.7 → v0.8)', () => {
  const dir = setup();
  try {
    writeFileSync(join(dir, 'b.tsx'), `
      <h1 className="text-polaris-display-lg" />
      <h2 className="text-polaris-heading-lg" />
      <h3 className="text-polaris-heading-sm" />
      <p className="text-polaris-body-lg" />
      <small className="text-polaris-caption" />
      <span className="text-polaris-h1" />
      <span className="text-polaris-h5" />
      <span className="text-polaris-body" />
      <span className="text-polaris-meta" />
      <span className="text-polaris-tiny" />
    `);
    runCodemod(dir, ['--apply']);
    const out = readFileSync(join(dir, 'b.tsx'), 'utf8');
    assert.match(out, /text-polaris-display\b/);
    assert.match(out, /text-polaris-heading2\b/);   // heading-lg → heading2
    assert.match(out, /text-polaris-heading4\b/);   // heading-sm → heading4
    assert.match(out, /text-polaris-body1\b/);      // body-lg → body1
    assert.match(out, /text-polaris-caption1\b/);   // caption → caption1
    assert.match(out, /text-polaris-display\b/);    // h1 → display
    assert.match(out, /text-polaris-heading4\b/);   // h5 → heading4
    assert.match(out, /text-polaris-body1\b/);      // body → body1
    assert.match(out, /text-polaris-caption1\b/);   // meta → caption1
    assert.match(out, /text-polaris-caption2\b/);   // tiny → caption2
    assert.doesNotMatch(out, /text-polaris-display-lg/);
    assert.doesNotMatch(out, /text-polaris-heading-sm/);
    assert.doesNotMatch(out, /text-polaris-h1/);
    assert.doesNotMatch(out, /text-polaris-meta\b/);
    assert.doesNotMatch(out, /text-polaris-tiny\b/);
  } finally { cleanup(dir); }
});

test('rewrites status-* classes (danger → error, hover → base)', () => {
  const dir = setup();
  try {
    writeFileSync(join(dir, 's.tsx'), `
      <div className="bg-status-success bg-status-warning bg-status-danger bg-status-info" />
      <div className="text-status-success-hover text-status-danger-hover" />
      <div className="border-status-info border-status-warning-hover" />
    `);
    runCodemod(dir, ['--apply']);
    const out = readFileSync(join(dir, 's.tsx'), 'utf8');
    assert.match(out, /bg-state-success/);
    assert.match(out, /bg-state-warning/);
    assert.match(out, /bg-state-error/);   // danger → error
    assert.match(out, /bg-state-info/);
    assert.match(out, /text-state-success/);
    assert.match(out, /text-state-error/);
    assert.match(out, /border-state-info/);
    assert.match(out, /border-state-warning/);
    assert.doesNotMatch(out, /-status-/);
    assert.doesNotMatch(out, /-hover\b/); // hover variants folded
  } finally { cleanup(dir); }
});

test('rewrites TS member access on text/surface/brand/status/primary', () => {
  const dir = setup();
  try {
    writeFileSync(join(dir, 'c.ts'), `
      const a = text.primary;
      const b = surface.canvas;
      const r = surface.raised;
      const c = brand.secondary;
      const d = brand.primaryHover;
      const e = status.danger;
      const f = status.successHover;
      const g = primary.normal;
      const h = primary.strong;
    `);
    runCodemod(dir, ['--apply']);
    const out = readFileSync(join(dir, 'c.ts'), 'utf8');
    assert.match(out, /label\.normal/);
    assert.match(out, /background\.base/);
    assert.match(out, /layer\.surface/);
    assert.match(out, /ai\.normal/);
    assert.match(out, /accentBrand\.strong/);
    assert.match(out, /state\.error/);            // status.danger → state.error
    assert.match(out, /state\.success/);          // hover folded
    assert.match(out, /accentBrand\.normal/);     // primary.normal
    assert.match(out, /accentBrand\.strong/);     // primary.strong
    assert.doesNotMatch(out, /\btext\.primary\b/);
    assert.doesNotMatch(out, /\bsurface\.canvas\b/);
  } finally { cleanup(dir); }
});

test('preserves surface.popover / surface.modal (v0.7.5 elevation tier)', () => {
  const dir = setup();
  try {
    writeFileSync(join(dir, 'e.ts'), `
      const a = surface.popover;
      const b = surface.modal;
      const c = surface.canvas;
    `);
    runCodemod(dir, ['--apply']);
    const out = readFileSync(join(dir, 'e.ts'), 'utf8');
    assert.match(out, /surface\.popover/);     // unchanged
    assert.match(out, /surface\.modal/);       // unchanged
    assert.match(out, /background\.base/);     // canvas → background.base
    assert.doesNotMatch(out, /surface\.canvas/);
  } finally { cleanup(dir); }
});

test('rewrites bare ramp step `5` → `05` (negative lookahead)', () => {
  const dir = setup();
  try {
    writeFileSync(join(dir, 'r.tsx'), `
      <div className="bg-blue-5 text-purple-5 ring-green-5 bg-blue-50 bg-blue-500 mt-5 gap-5" />
    `);
    runCodemod(dir, ['--apply']);
    const out = readFileSync(join(dir, 'r.tsx'), 'utf8');
    assert.match(out, /bg-blue-05\b/);
    assert.match(out, /text-purple-05\b/);
    assert.match(out, /ring-green-05\b/);
    // unrelated `5`s untouched
    assert.match(out, /bg-blue-50\b/);
    assert.match(out, /bg-blue-500\b/);
    assert.match(out, /\bmt-5\b/);
    assert.match(out, /\bgap-5\b/);
  } finally { cleanup(dir); }
});

test('rewrites CSS custom properties', () => {
  const dir = setup();
  try {
    writeFileSync(join(dir, 'd.css'), `
      .x {
        color: var(--polaris-text-primary);
        background: var(--polaris-surface-raised);
        border: 1px solid var(--polaris-surface-border-strong);
        accent: var(--polaris-brand-primary);
        box-shadow: 0 0 var(--polaris-status-danger);
        page: var(--polaris-background-normal);
        radius: var(--polaris-radius-full);
      }
    `);
    runCodemod(dir, ['--apply']);
    const out = readFileSync(join(dir, 'd.css'), 'utf8');
    assert.match(out, /--polaris-label-normal/);
    assert.match(out, /--polaris-layer-surface/);
    assert.match(out, /--polaris-line-normal/);
    assert.match(out, /--polaris-accent-brand-normal/);
    assert.match(out, /--polaris-state-error/);
    assert.match(out, /--polaris-background-base/);
    assert.match(out, /--polaris-radius-pill/);
    assert.doesNotMatch(out, /--polaris-text-primary/);
    assert.doesNotMatch(out, /--polaris-surface-raised/);
    assert.doesNotMatch(out, /--polaris-radius-full/);
  } finally { cleanup(dir); }
});

test('idempotent — running twice produces no further changes', () => {
  const dir = setup();
  try {
    writeFileSync(join(dir, 'i.tsx'), `<div className="bg-layer-surface text-label-normal bg-state-error" />`);
    const r1 = runCodemod(dir, ['--apply']);
    assert.equal(r1.status, 0);
    const r2 = runCodemod(dir, ['--check']);
    assert.equal(r2.status, 0, '--check should pass on already-migrated code');
  } finally { cleanup(dir); }
});

test('--check exits non-zero when changes are needed', () => {
  const dir = setup();
  try {
    writeFileSync(join(dir, 'e.tsx'), `<div className="bg-background-normal" />`);
    const r = runCodemod(dir, ['--check']);
    assert.equal(r.status, 1);
  } finally { cleanup(dir); }
});

test('--check exits zero when no changes needed', () => {
  const dir = setup();
  try {
    writeFileSync(join(dir, 'f.tsx'), `<div className="bg-background-base" />`);
    const r = runCodemod(dir, ['--check']);
    assert.equal(r.status, 0);
  } finally { cleanup(dir); }
});

test('rewrites <Button variant="outline"> → variant="tertiary"', () => {
  const dir = setup();
  try {
    writeFileSync(join(dir, 'btn.tsx'), `
      <Button variant="outline">Cancel</Button>
      <Button variant='outline' size="lg">Discard</Button>
      <Button variant="primary">Save</Button>
    `);
    runCodemod(dir, ['--apply']);
    const out = readFileSync(join(dir, 'btn.tsx'), 'utf8');
    assert.match(out, /<Button variant="tertiary">Cancel<\/Button>/);
    assert.match(out, /<Button variant="tertiary" size="lg">/);
    assert.match(out, /<Button variant="primary">Save<\/Button>/);  // untouched
    assert.doesNotMatch(out, /variant=["']outline["']/);
  } finally { cleanup(dir); }
});

test('rewrites hint → helperText (Input / Textarea / Switch / Checkbox / FileInput / DateTimeInput / TimeInput)', () => {
  const dir = setup();
  try {
    writeFileSync(join(dir, 'forms.tsx'), `
      <Input label="이름" hint="2자 이상" />
      <Textarea label="메모" hint="최대 500자" rows={4} />
      <Switch label="알림" hint="중요한 변경만 푸시" />
      <Checkbox label="동의" hint="마케팅 수신" />
      <FileInput label="첨부" hint="최대 5MB" />
      <FileDropZone hint="이미지를 끌어다 놓으세요" />
      <DateTimeInput hint="브라우저 시간대" />
      <TimeInput hint="24시간 형식" />
      <CustomThing hint="should NOT change" />
    `);
    runCodemod(dir, ['--apply']);
    const out = readFileSync(join(dir, 'forms.tsx'), 'utf8');
    assert.match(out, /<Input label="이름" helperText="2자 이상" \/>/);
    assert.match(out, /<Textarea[^>]*helperText="최대 500자"/);
    assert.match(out, /<Switch[^>]*helperText="중요한 변경만 푸시"/);
    assert.match(out, /<Checkbox[^>]*helperText="마케팅 수신"/);
    assert.match(out, /<FileInput[^>]*helperText="최대 5MB"/);
    assert.match(out, /<FileDropZone helperText="이미지를 끌어다 놓으세요"/);
    assert.match(out, /<DateTimeInput helperText="브라우저 시간대"/);
    assert.match(out, /<TimeInput helperText="24시간 형식"/);
    // Unknown components retain `hint=` (we only rewrite known ones)
    assert.match(out, /<CustomThing hint="should NOT change"/);
  } finally { cleanup(dir); }
});

test('rewrites <Progress tone=> → variant= and <Stat deltaTone=> → deltaVariant=', () => {
  const dir = setup();
  try {
    writeFileSync(join(dir, 'pg.tsx'), `
      <Progress value={40} tone="success" />
      <Stat label="조회" value={1234} delta="+12%" deltaTone="positive" />
      <Stat label="구독" value={42} deltaTone='accent' delta="+1" />
    `);
    runCodemod(dir, ['--apply']);
    const out = readFileSync(join(dir, 'pg.tsx'), 'utf8');
    assert.match(out, /<Progress value=\{40\} variant="success"/);
    assert.match(out, /deltaVariant="positive"/);
    assert.match(out, /deltaVariant='accent'/);
    assert.doesNotMatch(out, /\btone=["']/);
    assert.doesNotMatch(out, /\bdeltaTone=/);
  } finally { cleanup(dir); }
});

test('rewrites <HStack> / <VStack> → <Stack direction="row"> / <Stack>', () => {
  const dir = setup();
  try {
    writeFileSync(join(dir, 'stk.tsx'), `
      import { HStack, VStack, Box } from '@polaris/ui';
      export const X = () => (
        <VStack gap="md">
          <HStack align="center" gap="sm">
            <Box />
            <Box />
          </HStack>
          <HStack />
          <VStack />
        </VStack>
      );
    `);
    runCodemod(dir, ['--apply']);
    const out = readFileSync(join(dir, 'stk.tsx'), 'utf8');
    // Tag rewrites
    assert.match(out, /<Stack direction="row" align="center" gap="sm">/);
    assert.match(out, /<\/Stack>/);
    assert.match(out, /<Stack direction="row" \/>/);
    assert.match(out, /<Stack gap="md">/);
    assert.match(out, /<Stack \/>/);
    // Import rewrite
    assert.match(out, /import \{[^}]*Stack[^}]*\} from '@polaris\/ui'/);
    assert.doesNotMatch(out, /\bHStack\b/);
    assert.doesNotMatch(out, /\bVStack\b/);
  } finally { cleanup(dir); }
});

test('skips ignored directories (node_modules)', () => {
  const dir = setup();
  try {
    mkdirSync(join(dir, 'node_modules'), { recursive: true });
    writeFileSync(join(dir, 'node_modules/skip.tsx'), `<div className="bg-background-normal" />`);
    writeFileSync(join(dir, 'src.tsx'), `<div className="bg-background-normal" />`);
    runCodemod(dir, ['--apply']);
    const skipped = readFileSync(join(dir, 'node_modules/skip.tsx'), 'utf8');
    const rewritten = readFileSync(join(dir, 'src.tsx'), 'utf8');
    assert.match(skipped, /bg-background-normal/);   // untouched
    assert.match(rewritten, /bg-background-base/);
  } finally { cleanup(dir); }
});
