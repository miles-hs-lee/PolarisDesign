#!/usr/bin/env node
/**
 * Claude Code PostToolUse hook: lint files edited by the model.
 *
 * Reads hook event JSON from stdin, runs eslint on the edited file, and
 * surfaces violations back to the model via additionalContext so it can
 * self-correct on the next turn.
 *
 * Silent on:
 *   - non-source extensions (only ts/tsx/js/jsx/mjs/cjs)
 *   - eslint not configured (status=2) — we don't want to spam every edit
 *     in projects that haven't run /polaris-init yet
 */
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { extname } from 'node:path';

const SUPPORTED_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);

function readStdin() {
  try {
    return JSON.parse(readFileSync(0, 'utf-8'));
  } catch {
    return null;
  }
}

function getFilePaths(input) {
  if (!input) return [];
  const ti = input.tool_input ?? {};
  if (typeof ti.file_path === 'string') return [ti.file_path];
  if (Array.isArray(ti.edits) && ti.edits.length > 0 && typeof ti.file_path === 'string') {
    return [ti.file_path];
  }
  return [];
}

function lintFile(filePath) {
  const result = spawnSync(
    'npx',
    ['--no-install', 'eslint', '--no-warn-ignored', filePath],
    { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] }
  );
  return {
    status: result.status,
    stdout: (result.stdout || '').trim(),
    stderr: (result.stderr || '').trim(),
  };
}

function main() {
  const input = readStdin();
  const filePaths = getFilePaths(input);
  if (filePaths.length === 0) process.exit(0);

  const violationReports = [];
  for (const fp of filePaths) {
    if (!SUPPORTED_EXTS.has(extname(fp))) continue;
    const r = lintFile(fp);
    if (r.status === 0 || r.status === null) continue;
    if (r.status === 2) continue;
    if (r.stdout) violationReports.push({ file: fp, output: r.stdout });
  }

  if (violationReports.length === 0) process.exit(0);

  const blocks = violationReports.map(
    (v) => `📄 ${v.file}\n${v.output}`
  ).join('\n\n');

  const message = `[polaris-design] 디자인 토큰 위반이 감지되었습니다:

${blocks}

수정 가이드:
- hex 색상 → var(--polaris-*) 또는 bg-brand-* / text-text-* / border-surface-* 클래스
- Tailwind 임의값 (bg-[#xxx], p-[13px]) → 토큰 기반 클래스
- font-family 직접 지정 → var(--polaris-font-sans) 또는 font-polaris
- font-['...'] Tailwind 임의값 → font-polaris

자동 수정 가능 항목: pnpm exec eslint --fix <file>

이 위반들이 모두 해결될 때까지 작업 완료를 보고하지 마세요.`;

  const output = {
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
      additionalContext: message,
    },
  };
  process.stdout.write(JSON.stringify(output));
  process.exit(0);
}

main();
