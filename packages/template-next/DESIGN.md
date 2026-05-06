---
version: alpha
name: My Polaris App
description: Replace this template with the actual product spec. Inherits Polaris's system tokens; overrides only what's product-specific.

# Most products inherit Polaris's color palette as-is. Override only the
# tokens that are genuinely product-specific (e.g., a single domain
# accent color for status pills your product uses everywhere).
#
# Polaris's full color set lives in the root /DESIGN.md — reference it
# from your prose ("uses Polaris primary") rather than duplicating
# every value here.
colors:
  primary: "{polaris.colors.primary}"           # Polaris blue — same hex
  secondary: "{polaris.colors.secondary}"       # NOVA purple (only if your product has AI features)
  surface-canvas: "{polaris.colors.surface-canvas}"
  surface-raised: "{polaris.colors.surface-raised}"
  text-primary: "{polaris.colors.text-primary}"
  # Add product-specific accents below if needed:
  # contract-active: "#16A34A"   # status.success
  # contract-warning: "#EAB308"  # status.warning

# Most products use Polaris's full typography scale unchanged. List the
# levels your product actually uses; the rest are still available via
# the @polaris/ui Tailwind preset.
typography:
  display-md: "{polaris.typography.display-md}"
  heading-lg: "{polaris.typography.heading-lg}"
  heading-md: "{polaris.typography.heading-md}"
  body-lg: "{polaris.typography.body-lg}"
  body-sm: "{polaris.typography.body-sm}"
  caption: "{polaris.typography.caption}"

# Polaris's radius scale unchanged in 95% of cases.
rounded:
  sm: "{polaris.rounded.sm}"
  md: "{polaris.rounded.md}"
  lg: "{polaris.rounded.lg}"
  xl: "{polaris.rounded.xl}"
  full: "{polaris.rounded.full}"

spacing:
  xs: "{polaris.spacing.xs}"
  sm: "{polaris.spacing.sm}"
  md: "{polaris.spacing.md}"
  lg: "{polaris.spacing.lg}"
  xl: "{polaris.spacing.xl}"
  gutter: "{polaris.spacing.gutter}"

# Define product-specific composite components here. Atoms (button /
# card / input / badge) are already defined in Polaris's DESIGN.md —
# no need to redefine them.
components:
  # Example: a contract status pill specific to this product
  # contract-status-pill:
  #   backgroundColor: "{colors.contract-active}"
  #   textColor: "{colors.text-on-brand}"
  #   rounded: "{rounded.full}"
  #   padding: 4px
---

# My Polaris App — Design Spec

> This file is the **product-level** design spec. It inherits the
> [Polaris design system](../../DESIGN.md) (system-level tokens +
> primitive components) and adds anything specific to this product.
>
> Edit this file by hand — it is **not** auto-generated.
> Reference Polaris tokens with `{polaris.<group>.<name>}`. Define
> only what's genuinely product-specific.

## Overview

Replace this section with a one-paragraph description of the product.

What is the product? Who uses it? What's the dominant tone — calm /
energetic / dense / spacious? What problem does it solve in the Polaris
ecosystem?

> **Example for the Polaris CRM product:**
> Polaris 영업관리 is a B2B contract management dashboard. Sales reps and
> approvers spend 4+ hours/day in the app — density and quick scanning
> matter more than visual flair. Tone is professional but warm; the layout
> uses Polaris's standard cards and tables, with a single accent color
> (status.success / warning / danger) for contract states.

## Colors

Inherits Polaris's full palette. Add product-specific notes here:

- The product's primary action is **contract approval** — uses
  `{polaris.colors.primary}` (Polaris blue) for the approve button on
  every contract detail page.
- Contract states map to Polaris status colors: 진행중 → `status.info`,
  완료 → `status.success`, 만료 → `status.danger`, 결재 대기 → `status.warning`.
- No new color tokens introduced in this product.

## Typography

Inherits Polaris's 8-level scale. The product uses:

- `display-md` for page titles (e.g., "계약 상세")
- `heading-lg` / `heading-md` for sections (e.g., "결재선", "첨부 파일")
- `body-lg` / `body-sm` for content
- `caption` for metadata (작성일, 결재자, 파일 크기)

## Layout

Polaris's 4px Tailwind base. Product-specific decisions:

- Contract detail page uses a 3-column grid on desktop (`lg:grid-cols-3`):
  main content (2 cols) + side panel (1 col, sticky).
- Mobile collapses to single column with a tab nav.
- Maximum content width: 1200px (Polaris `container.xl`).

## Components

Inherits all Polaris primitives. Product-specific composite components:

- **ContractStatusPill** — wraps `<Badge variant="success|warning|danger|info">`
  with consistent contract state mapping. Avoids each page deciding
  state-to-variant mapping ad hoc.
- **ApprovalLine** — vertical timeline of approvers using `<Card>` +
  `<Avatar>` + `<Badge>`. Reused on contract detail / approval inbox /
  notification email previews.

## Do's and Don'ts

- **Do** import Polaris atoms from `@polaris/ui`. Custom components live
  in this product's `components/` directory and document themselves
  here.
- **Do** reuse `ContractStatusPill` and `ApprovalLine` everywhere a
  contract state or approver list appears.
- **Don't** introduce new colors outside Polaris's palette. If a need
  emerges, raise it for inclusion in Polaris itself rather than forking.
- **Don't** override Polaris primitives (Button, Card, etc.) — wrap or
  compose. Style customization belongs in this product's component
  layer, not in Polaris's.
