/**
 * DESIGN.md generator — emits a Stitch-compatible spec
 * (https://stitch.withgoogle.com/docs/design-md/specification/)
 * from `src/tokens/*.ts`.
 *
 * Output: `<repo-root>/DESIGN.md`
 *
 * Why we ship this: the Stitch spec is W3C Design Token Format-aligned,
 * so any tool that understands the format (Stitch, Figma Tokens Studio,
 * Style Dictionary, future agents) can consume Polaris's tokens
 * directly. Single source of truth stays at `tokens.ts` — everything
 * downstream is generated.
 *
 * The token system is single-mode (light values only). Dark-mode pairs
 * stay in `tokens.ts` / `tokens.css`; we mention them in the prose.
 *
 * Run with `tsx`:
 *   pnpm --filter @polaris/ui build:design-md
 *
 * CI compares the committed `DESIGN.md` against this script's output —
 * see `.github/workflows/ci.yml`.
 */
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  brandPalette,
  brand,
  fileType,
  status,
  neutral,
  surface,
  text,
  radius,
  shadow,
  fontFamily,
  textStyle,
  spacing,
  bluePalette,
  greenPalette,
  orangePalette,
  redPalette,
  purplePalette,
  grayRamp,
} from '../src/tokens';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, '../../../DESIGN.md');

const camelToKebab = (s: string) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

/* ---------- YAML emission helpers ---------- */

function emitColors(): string {
  // Map Polaris's nested color groups to flat Stitch token names. Light
  // values only — dark pairs live in tokens.ts.
  // 9-step ramps go first so consumers see the full color system before
  // semantic aliases.
  const colors: Record<string, string> = {};

  const ramps: Array<[string, Record<string, string>]> = [
    ['blue',   bluePalette],
    ['green',  greenPalette],
    ['orange', orangePalette],
    ['red',    redPalette],
    ['purple', purplePalette],
    ['gray',   grayRamp],
  ];
  for (const [name, ramp] of ramps) {
    for (const [step, hex] of Object.entries(ramp)) {
      colors[`${name}-${step}`] = hex;
    }
  }

  // Base palette → primary/secondary/accent group names Stitch recommends.
  // Polaris's `brand.primary` (blue) becomes `primary`; `brand.secondary`
  // (purple, NOVA) becomes `secondary`. The 4-color file palette stays as
  // its own group.
  colors.primary = brand.primary.light;
  colors['primary-hover'] = brand.primaryHover.light;
  colors['primary-subtle'] = brand.primarySubtle.light;
  colors.secondary = brand.secondary.light;
  colors['secondary-hover'] = brand.secondaryHover.light;
  colors['secondary-subtle'] = brand.secondarySubtle.light;

  // File-type accents (stay grouped as they're brand-specific to Polaris)
  for (const [k, v] of Object.entries(fileType)) {
    colors[`file-${k}`] = v.light;
  }

  // Status
  for (const [k, v] of Object.entries(status)) {
    colors[`status-${camelToKebab(k)}`] = v.light;
  }

  // Neutral scale
  for (const [k, v] of Object.entries(neutral)) {
    colors[`neutral-${k}`] = v.light;
  }

  // Surface + text aliases
  for (const [k, v] of Object.entries(surface)) {
    colors[`surface-${camelToKebab(k)}`] = v.light;
  }
  for (const [k, v] of Object.entries(text)) {
    colors[`text-${camelToKebab(k)}`] = v.light;
  }

  // Brand palette base (raw color names — useful as a fallback alias)
  for (const [k, v] of Object.entries(brandPalette)) {
    colors[`palette-${k}`] = v.light;
  }

  return Object.entries(colors)
    .map(([k, v]) => `  ${k}: "${v}"`)
    .join('\n');
}

function emitTypography(): string {
  // Stitch typography tokens are composite objects.
  const lines: string[] = [];
  for (const [name, style] of Object.entries(textStyle)) {
    const tokenName = camelToKebab(name);
    // Convert lineHeight from "60px" against fontSize "48px" to a unitless
    // ratio, which is the recommended form.
    const fontSizePx = parseFloat(style.fontSize);
    const lineHeightPx = parseFloat(style.lineHeight);
    const ratio = (lineHeightPx / fontSizePx).toFixed(3).replace(/\.?0+$/, '');
    lines.push(`  ${tokenName}:`);
    lines.push(`    fontFamily: ${quoteIfNeeded(fontFamily.sans)}`);
    lines.push(`    fontSize: ${style.fontSize}`);
    lines.push(`    fontWeight: ${style.fontWeight}`);
    lines.push(`    lineHeight: ${ratio}`);
    if (style.letterSpacing && style.letterSpacing !== '0') {
      lines.push(`    letterSpacing: ${style.letterSpacing}`);
    }
  }
  return lines.join('\n');
}

function emitRounded(): string {
  return Object.entries(radius)
    .map(([k, v]) => `  ${k}: ${v}`)
    .join('\n');
}

function emitSpacing(): string {
  // Map Polaris's full Tailwind scale to Stitch's named-level convention.
  // We pick representative values for the canonical xs/sm/md/lg/xl + gutter.
  const map: Record<string, string> = {
    xs: spacing['1'],
    sm: spacing['2'],
    md: spacing['4'],
    lg: spacing['8'],
    xl: spacing['16'],
    gutter: spacing['6'],
  };
  return Object.entries(map)
    .map(([k, v]) => `  ${k}: ${v}`)
    .join('\n');
}

function emitComponents(): string {
  // Curated subset — the controls every Polaris consumer touches first.
  // Stitch lets us reference colors/rounded by token name.
  return `  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-on-brand}"
    rounded: "{rounded.md}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.secondary-subtle}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.md}"
    padding: 12px
  card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: 20px
  input:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: 8px
  badge:
    backgroundColor: "{colors.primary-subtle}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: 4px`;
}

function quoteIfNeeded(s: string): string {
  // YAML strings with commas / quotes / colons need quoting.
  if (/[,'":#]|^\s|\s$/.test(s)) return `"${s.replace(/"/g, '\\"')}"`;
  return s;
}

const yamlBlock = `---
version: alpha
name: Polaris Design System
description: Internal design system for Polaris Office's vibe-coding-ops React/Next.js services. 4-color brand palette + NOVA purple, Pretendard typography, Tailwind 4px spacing baseline, Radix UI primitives.

colors:
${emitColors()}

typography:
${emitTypography()}

rounded:
${emitRounded()}

spacing:
${emitSpacing()}

components:
${emitComponents()}
---`;

const proseBlock = `# Polaris Design System

> **Auto-generated.** This file is produced by \`packages/ui/scripts/build-design-md.ts\` from \`packages/ui/src/tokens/*.ts\`. Edit those source modules instead — CI fails on drift.
>
> The spec follows the [Stitch DESIGN.md format](https://stitch.withgoogle.com/docs/design-md/specification/) so any agent or tool that consumes the format (Stitch, Figma Tokens Studio, Style Dictionary downstream) can use Polaris's tokens directly.

## Overview

Polaris is the design system shared across Polaris Office's vibe-coding-ops services — services that LLMs help generate. The system's promise is **token-first, anti-bypass**: model output is constrained by tokens, components, and lint rules so screens stay visually consistent across every service in the company.

The tone is calm and professional with a 4-color brand identity (blue / green / orange / red — same palette the Polaris Office logo uses) plus a single NOVA purple reserved for AI / generative contexts. Documents always feel like Polaris.

## Colors

The palette is rooted in Polaris's 4-color brand identity. Each base color doubles as its file-type signal (DOCX = blue, XLSX = green, PPTX = orange, PDF = red). A NOVA purple is reserved for AI features.

- **Primary (Polaris Blue, #2B7FFF):** Headlines of action — buttons, links, focus, active nav. Same hex as \`fileType.docx\`.
- **Secondary (NOVA Purple, #7C5CFF):** AI / generative contexts only. Pairs with sparkle iconography. Never mix primary and secondary on the same screen — pick by context.
- **Status (success / warning / danger / info):** Reserved for system feedback. Each has a hover variant.
- **Neutral (12 steps, 0 → 1000):** Light/dark inverted by \`data-theme\`. \`surface.canvas\` (page bg), \`surface.raised\` (cards/modals), \`text.primary\` / \`text.secondary\` / \`text.muted\` are the everyday aliases; reach for those before the raw scale.

Do not mix file-type colors as decorative accents — they carry semantic meaning (document type signals).

## Typography

Pretendard Variable for both display and body. Korean / Latin / numerals all use the same family. JetBrains Mono for code.

Eleven named levels (v0.7-rc.1 spec): \`display\` (40), \`title\` (32), \`heading1\` (28), \`heading2\` (24), \`heading3\` (20), \`heading4\` (18) for heading hierarchy, \`body1\` (16), \`body2\` (14), \`body3\` (13) for paragraph copy, \`caption1\` (12), \`caption2\` (11) for labels and chrome. All headings + captions are weight 700 (Bold). Body is weight 400 (Regular).

Legacy rc.0 names (\`h1\`-\`h5\`, \`body\`, \`detail\`, \`meta\`, \`tiny\`) and v0.6 names (\`display-lg\`, \`heading-lg\`, \`body-lg\`, \`caption\`) are kept as deprecated aliases. Codemod rewrites them.

Line-heights: 1.4 headings, 1.5 body, 1.3 captions. NO letter-spacing — Pretendard's optical metrics are calibrated at the typeface level.

Mobile (≤ 767px): every level shifts down one step (Display 40→32, Title 32→28, etc.). Body3 / Caption1 / Caption2 unchanged. Auto-applied via media query in \`tokens.css\`.

Use \`text-polaris-*\` Tailwind utilities — never inline \`font-family\` or arbitrary \`text-[14px]\`. The lint rule \`no-direct-font-family\` blocks both.

## Layout

4px base scale, Tailwind defaults. Container widths cap at 1200px (xl). Mobile-first; \`sm: 640\`, \`md: 768\`, \`lg: 1024\`, \`xl: 1280\`, \`2xl: 1536\`.

No semantic spacing tokens (e.g., \`spacing.gutter\`, \`spacing.section-y\`) — Tailwind's numeric scale is already the standard, and abstracting on top of it raises the bar without payoff. Arbitrary values like \`p-[13px]\` are blocked by lint.

## Elevation & Depth

Four shadow levels for light mode (\`xs\`, \`sm\`, \`md\`, \`lg\`) plus a darker dark-mode pair. The \`shadow-polaris-*\` Tailwind utilities pick the right pair via \`data-theme\`. Use \`xs\` for hover lifts, \`sm\` for cards, \`md\` for menus / toasts, \`lg\` for modals.

In dark mode, shadows alone don't carry hierarchy — pair with \`surface.raised\` tonal layers (cards sit on a slightly lighter surface than the canvas).

## Shapes

Eight radius levels (v1 spec, 2026.05): \`2xs\` (2) / \`xs\` (4) / \`sm\` (6) / \`md\` (8) / \`lg\` (12) / \`xl\` (16) / \`2xl\` (24) / \`pill\` (9999). Inputs / buttons use \`md\` (8px). Cards use \`lg\` (12px). Modals use \`xl\` (16px) or \`2xl\` (24px). \`pill\` for pills, avatars, switch thumbs (the legacy \`full\` alias keeps working).

Avoid mixing rounded and sharp corners in the same component. Don't introduce new \`px\` values — extend the scale instead.

## Components

The component layer is the \`@polaris/ui\` package — 37 React components built on Radix UI primitives. Tokens in this file describe the **base atoms** (button / card / input / badge); the package contains the full set (Dialog / Tabs / Form / FileCard / Toast / Tooltip / Sidebar / Navbar / Ribbon / etc.).

Reach for the package first. If a primitive is missing, compose with token-only inline styling — never reach for raw hex or styled-components.

For editor / document products, the \`@polaris/ui/ribbon\` subpath ships an Office-style ribbon family (Tabs / Group / Stack / Row / Button / SplitButton / MenuButton / ToggleGroup / Separator / RowDivider).

## Do's and Don'ts

- **Do** import from \`@polaris/ui\`, \`@polaris/ui/form\`, or \`@polaris/ui/ribbon\` — every component is token-correct out of the box.
- **Do** use the \`text.primary\` / \`surface.raised\` / \`brand.primary\` style aliases. The raw \`neutral.700\` / \`palette-blue\` exist for advanced cases only.
- **Do** pair status colors with their hover variants for any interactive surface (buttons, cells).
- **Do** use \`brand.secondary\` (NOVA purple) only inside AI features. Mixing it with \`brand.primary\` on the same screen muddies hierarchy.
- **Don't** introduce raw hex values, \`rgb(...)\`, or named CSS colors — \`@polaris/lint\`'s \`no-hardcoded-color\` blocks them.
- **Don't** use Tailwind arbitrary values (\`bg-[#xxx]\`, \`p-[13px]\`, \`font-['Inter']\`) — the lint rule \`no-arbitrary-tailwind\` blocks them.
- **Don't** write native \`<button>\` / \`<input>\` / \`<dialog>\` in feature code — \`prefer-polaris-component\` requires the Polaris equivalents.
- **Don't** edit this file by hand. Edit \`packages/ui/src/tokens/*.ts\` and run \`pnpm --filter @polaris/ui build:design-md\`.
`;

const final = `${yamlBlock}\n\n${proseBlock}`;

writeFileSync(OUTPUT, final);
console.log(`✓ wrote ${OUTPUT.replace(process.cwd() + '/', '')}`);
