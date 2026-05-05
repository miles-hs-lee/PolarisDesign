#!/usr/bin/env node
/**
 * Sync root package.json version to match the workspace's fixed-group
 * version (read from packages/ui/package.json, since all five workspace
 * packages move in lockstep).
 *
 * Run automatically by `pnpm version` (after `changeset version` updates
 * the workspace packages). Also used by CI to verify the root didn't
 * drift between releases.
 *
 * Usage:
 *   node scripts/sync-root-version.mjs        # write the sync
 *   node scripts/sync-root-version.mjs --check # exit 1 if root drifted
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const ROOT_PKG = resolve(ROOT, 'package.json');
const SOURCE_PKG = resolve(ROOT, 'packages/ui/package.json');

const check = process.argv.includes('--check');

const target = JSON.parse(readFileSync(SOURCE_PKG, 'utf8')).version;
const root = JSON.parse(readFileSync(ROOT_PKG, 'utf8'));

if (root.version === target) {
  console.log(`✓ root version already in sync (${target})`);
  process.exit(0);
}

if (check) {
  console.error(`✗ root version (${root.version}) differs from @polaris/ui (${target})`);
  console.error(`  Run \`node scripts/sync-root-version.mjs\` to fix.`);
  process.exit(1);
}

root.version = target;
writeFileSync(ROOT_PKG, JSON.stringify(root, null, 2) + '\n');
console.log(`✓ root version synced ${root.version} → ${target}`);
