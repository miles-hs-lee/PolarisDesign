#!/usr/bin/env node
/**
 * verify — run every CI-equivalent check locally, in the same order CI does.
 *
 * Designed for `pnpm verify` (manual) and as a git pre-push hook
 * (auto, opt-in via `pnpm verify:install-hook`).
 *
 * Why a script and not just a script chain in package.json:
 *   1. Sequential streaming output (vs interleaved chaos with `&&`).
 *   2. Per-step duration printed — easy to spot the slow link.
 *   3. Skip e2e by default (slow, browser required) — opt-in via
 *      `--with-e2e` or `VERIFY_E2E=1`.
 *   4. Stops on first failure with a clean summary; exit 1 propagates to
 *      git hook so push is blocked.
 *
 * What's checked (mirrors `.github/workflows/ci.yml`):
 *   1. @polaris/ui build (token + DESIGN.md regen + tsup)
 *   2. token sync (committed tokens.css matches generator)
 *   3. DESIGN.md sync
 *   4. root version sync
 *   5. @polaris/lint build
 *   6. typecheck (all packages)
 *   7. @polaris/ui tests (vitest 89 + node:test 3)
 *   8. @polaris/lint tests (rule + codemod)
 *   9. @polaris/plugin tests (PostToolUse hook smoke)
 *  10. demo lint (warnings allowed, errors fail)
 *  11. template-next lint (--max-warnings=0 strict)
 *  12. demo build
 *  13. template-next build
 *  14. (optional) e2e visual regression
 *
 * Each step runs in a child process. We don't bypass the existing scripts
 * — we drive `pnpm` exactly the way CI does — so behavior stays in sync.
 */
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const withE2E = args.includes('--with-e2e') || process.env.VERIFY_E2E === '1';
const start = Date.now();

const STEPS = [
  ['Build @polaris/ui',                ['pnpm', '--filter', '@polaris/ui', 'build']],
  ['Verify token sync',                ['git', 'diff', '--exit-code', 'packages/ui/src/styles/tokens.css']],
  ['Verify DESIGN.md sync',            ['git', 'diff', '--exit-code', 'DESIGN.md']],
  ['Verify root version sync',         ['node', 'scripts/sync-root-version.mjs', '--check']],
  ['Build @polaris/lint',              ['pnpm', '--filter', '@polaris/lint', 'build']],
  ['Typecheck (all packages)',         ['pnpm', '-r', 'typecheck']],
  ['Test — @polaris/ui',               ['pnpm', '--filter', '@polaris/ui', 'test']],
  ['Test — @polaris/lint rules',       ['pnpm', '--filter', '@polaris/lint', 'test']],
  ['Test — @polaris/plugin hook',      ['pnpm', '--filter', '@polaris/plugin', 'test']],
  ['Lint — demo',                      ['pnpm', '--filter', 'demo', 'lint']],
  ['Lint — template-next (strict)',    ['pnpm', '--filter', 'polaris-template-next', 'lint']],
  ['Build — demo',                     ['pnpm', '--filter', 'demo', 'build']],
  ['Build — template-next',            ['pnpm', '--filter', 'polaris-template-next', 'build']],
];

if (withE2E) {
  STEPS.push(['E2E visual regression', ['pnpm', 'test:e2e']]);
}

const results = [];
let firstFailure = -1;

for (let i = 0; i < STEPS.length; i++) {
  const [label, cmd] = STEPS[i];
  process.stdout.write(`[${String(i + 1).padStart(2)}/${STEPS.length}] ${label} … `);
  const t0 = Date.now();
  const r = spawnSync(cmd[0], cmd.slice(1), {
    stdio: 'pipe',
    encoding: 'utf8',
  });
  const ms = Date.now() - t0;
  const ok = r.status === 0;
  results.push({ label, cmd: cmd.join(' '), ms, ok, stdout: r.stdout, stderr: r.stderr, code: r.status });
  process.stdout.write(`${ok ? '✓' : '✗'} (${(ms / 1000).toFixed(1)}s)\n`);
  if (!ok) {
    firstFailure = i;
    break;
  }
}

const total = ((Date.now() - start) / 1000).toFixed(1);

if (firstFailure === -1) {
  console.log(`\n✓ ${STEPS.length} checks passed in ${total}s${withE2E ? '' : ' (e2e skipped — pass --with-e2e to include)'}`);
  process.exit(0);
}

const failed = results[firstFailure];
console.log(`\n✗ FAILED at step ${firstFailure + 1}/${STEPS.length}: ${failed.label}\n`);
console.log(`Command: ${failed.cmd}`);
console.log(`Exit:    ${failed.code}\n`);
if (failed.stdout) {
  console.log('--- stdout (last 60 lines) ---');
  console.log(failed.stdout.split('\n').slice(-60).join('\n'));
}
if (failed.stderr) {
  console.log('\n--- stderr (last 30 lines) ---');
  console.log(failed.stderr.split('\n').slice(-30).join('\n'));
}
console.log(`\n${firstFailure} of ${STEPS.length} steps passed before failure (${total}s elapsed).`);
process.exit(1);
