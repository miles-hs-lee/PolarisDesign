---
name: polaris-web
description: Use when creating, editing, or adding features to a Polaris Office web service (React/Next.js apps generated via 바이브코딩옵스). Enforces consistent design via @polaris/ui tokens and components.
---

# Polaris Web Service Skill

You are working on a Polaris Office web service. Apply these rules without asking — they are mandatory, not preferences. The PostToolUse hook will catch violations after each edit.

## Procedure

### 1. New / existing project
- **New project**: run `/polaris-init <name>` first — bootstraps a Next.js 15 app from `template-next` with everything pre-wired. Do not write feature code before scaffolding completes.
- **Existing project that's not yet polaris-compliant**: run `/polaris-migrate` instead — it walks through audit → eslint --fix → page-by-page conversion → enforce. Don't try to write new polaris-compliant code on top of unmigrated code; migrate first.

### 2. UI elements (in order of preference)
1. Import from `@polaris/ui`. Available components:
   ```ts
   import {
     Button, Input, Textarea, Card, Badge, Avatar, Dialog, Toast, Tabs,
     FileIcon, FileCard, NovaInput,
     DropdownMenu, Tooltip, Select, Sidebar, Navbar, PromptChip,
   } from '@polaris/ui';
   ```
2. If a needed component doesn't exist in `@polaris/ui`, build it inline using ONLY Polaris tokens (rule 3). Don't bring in shadcn/Radix/MUI directly.
3. Native `<button>`, `<input>`, `<textarea>`, `<select>`, `<dialog>` are forbidden in feature code — the lint rule `@polaris/prefer-polaris-component` blocks them. (They're allowed inside `@polaris/ui` itself.)

### 3. Colors — the most common violation
Use ONLY these:
- **Tailwind classes**: `bg-brand-primary`, `text-fg-primary`, `border-surface-border`, `bg-status-danger`, `text-file-pdf`, `bg-neutral-100`
- **CSS variables**: `var(--polaris-brand-primary)`, `var(--polaris-text-primary)`
- **TS imports**: `import { brand, status, fileType } from '@polaris/ui/tokens';`

NEVER write any of:
- Hex colors: `#fff`, `#1D4ED8`
- CSS color functions: `rgb(...)`, `rgba(...)`, `hsl(...)`
- Tailwind arbitrary values: `bg-[#fff]`, `text-[red]`, `border-[#ccc]`

### 4. AI / NOVA contexts
- AI features (generation, summarization, NOVA entry points) → `bg-brand-secondary` (purple)
- Everything else → `bg-brand-primary` (blue)
- Don't mix primary and secondary on the same screen.

### 5. File-type contexts (Polaris-specific)
- DOCX/HWP files → `text-file-docx` (blue)
- XLSX → `text-file-xlsx` (green)
- PPTX → `text-file-pptx` (orange)
- PDF → `text-file-pdf` (red)

These colors are reserved for representing files. Don't reuse them for unrelated UI.

### 6. Typography
- Family: `font-polaris` (Tailwind) or `var(--polaris-font-sans)` (CSS)
- Scale: `text-polaris-display-lg`, `text-polaris-heading-md`, `text-polaris-body-lg`, `text-polaris-caption`. Don't set fontSize/lineHeight/letterSpacing manually.
- NEVER `font-family: ...` directly anywhere.
- NEVER `font-['Inter']` Tailwind arbitrary.

### 7. Spacing / radius / shadow
- Spacing: Tailwind defaults (`p-4`, `m-6`, `gap-2`). Never `p-[13px]`.
- Radius: `rounded-polaris-sm/md/lg/xl/full`.
- Shadow: `shadow-polaris-xs/sm/md/lg`.

### 8. Verify before reporting done
After meaningful changes, run `/polaris-check`. Don't tell the user the task is complete while violations remain.

## Single source of truth

Color/font/radius values live ONLY in `@polaris/ui`. If you genuinely need a token that doesn't exist, propose it in `tokens.md` first; do not invent values in component code.

## Anti-patterns to actively avoid

- "I'll just hardcode #FF5500 since the user mentioned it" — wrong. Use the closest token; if none fits, ask before adding.
- "Material/shadcn has a nice X component, let me use it" — wrong. Wrap in `@polaris/ui` first or build inline with tokens.
- "I'll disable the lint rule for this one case" — wrong. Disabling rules defeats the purpose. Fix the root cause.
- "The arbitrary value is shorter to write" — irrelevant. Token classes are mandatory regardless of brevity.
