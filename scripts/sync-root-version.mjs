#!/usr/bin/env node
/**
 * Sync the version of files outside Changesets' direct control to the
 * workspace's fixed-group version (source: `packages/ui/package.json`,
 * since the 5 workspace packages move in lockstep).
 *
 * Targets:
 *   - root `package.json` — historically the only target; "sync-root"
 *   - `packages/plugin/.claude-plugin/plugin.json` — Claude Code plugin
 *     manifest version. Lives outside the npm package.json that
 *     Changesets bumps, so it would drift on every release otherwise.
 *
 * Run automatically by `pnpm version` (after `changeset version` updates
 * the workspace packages). Also used by CI to verify nothing drifted
 * between releases.
 *
 * Usage:
 *   node scripts/sync-root-version.mjs           # write the sync
 *   node scripts/sync-root-version.mjs --check   # exit 1 if any drifted
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SOURCE_PKG = resolve(ROOT, 'packages/ui/package.json');

const check = process.argv.includes('--check');
const target = JSON.parse(readFileSync(SOURCE_PKG, 'utf8')).version;

/**
 * Files whose `version` field should mirror @polaris/ui's. Each is a
 * JSON file with a top-level `version` string. Add to this list when
 * a new place needs to track the workspace version.
 */
const TARGETS = [
  resolve(ROOT, 'package.json'),
  resolve(ROOT, 'packages/plugin/.claude-plugin/plugin.json'),
];

let drifted = 0;
let synced = 0;

for (const file of TARGETS) {
  const rel = relative(ROOT, file);
  const data = JSON.parse(readFileSync(file, 'utf8'));
  if (data.version === target) {
    console.log(`✓ ${rel} already in sync (${target})`);
    continue;
  }
  if (check) {
    console.error(`✗ ${rel} (${data.version}) differs from @polaris/ui (${target})`);
    drifted++;
    continue;
  }
  const before = data.version;
  data.version = target;
  writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  console.log(`✓ ${rel} synced ${before} → ${target}`);
  synced++;
}

if (check && drifted > 0) {
  console.error(`\nRun \`node scripts/sync-root-version.mjs\` to fix.`);
  process.exit(1);
}
