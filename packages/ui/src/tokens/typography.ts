/**
 * Typography scale.
 *
 * v1 spec (2026.05) replaces the v0.6 ad-hoc heading scale with a
 * design-team-defined hierarchy: Display → H1 → H2 → H3 → H4 → H5,
 * Body / Body-sm, plus three "ancillary" levels Detail / Meta / Tiny
 * for fine print, captions, and chrome labels.
 *
 * All headings shift to weight=700 (Bold) per the v1 spec — v0.6 used
 * weight=600 (SemiBold) at H4/H5. Body picks up a small -0.002em
 * letter-spacing.
 *
 * The legacy v0.6 keys (`displayLg`, `headingLg`, `bodyLg`, `caption`,
 * etc.) are kept as deprecated aliases that resolve to the new spec
 * values — existing code keeps compiling and the v0.7 codemod will
 * rename them. Aliases will be removed in v0.8.
 */
export const fontFamily = {
  sans: '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif',
  mono: '"JetBrains Mono", "D2Coding", ui-monospace, monospace',
} as const;

export const fontWeight = {
  regular:  400,
  medium:   500,
  semibold: 600,
  bold:     700,
} as const;

export type TextStyle = {
  readonly fontSize: string;
  readonly lineHeight: string;
  readonly fontWeight: number;
  readonly letterSpacing: string;
};

/**
 * Spec-aligned text styles. New code should use these names — they
 * match the design team's Figma library and DESIGN.md.
 */
export const textStyle = {
  // ───── v1 spec (preferred for new code) ─────
  /** Display — hero / marketing pages. 60px Bold. */
  display: { fontSize: '60px', lineHeight: '72px', fontWeight: fontWeight.bold,    letterSpacing: '-0.020em' },
  /** H1 — top-level page heading. 40px Bold. */
  h1:      { fontSize: '40px', lineHeight: '52px', fontWeight: fontWeight.bold,    letterSpacing: '-0.018em' },
  /** H2 — section heading. 32px Bold. */
  h2:      { fontSize: '32px', lineHeight: '42px', fontWeight: fontWeight.bold,    letterSpacing: '-0.012em' },
  /** H3 — sub-section heading. 28px Bold. */
  h3:      { fontSize: '28px', lineHeight: '36px', fontWeight: fontWeight.bold,    letterSpacing: '-0.010em' },
  /** H4 — card / dialog heading. 24px Bold. */
  h4:      { fontSize: '24px', lineHeight: '32px', fontWeight: fontWeight.bold,    letterSpacing: '-0.005em' },
  /** H5 — small heading / list-section title. 20px Bold. */
  h5:      { fontSize: '20px', lineHeight: '28px', fontWeight: fontWeight.bold,    letterSpacing: '-0.005em' },
  /** Body — default paragraph copy. 16px Regular, slight tightening. */
  body:    { fontSize: '16px', lineHeight: '24px', fontWeight: fontWeight.regular, letterSpacing: '-0.002em' },
  /** Body-sm — secondary copy / dense lists. 14px Regular. */
  bodySm:  { fontSize: '14px', lineHeight: '20px', fontWeight: fontWeight.regular, letterSpacing: '0' },
  /** Detail — emphasized fine print / labels. 14px Medium. */
  detail:  { fontSize: '14px', lineHeight: '20px', fontWeight: fontWeight.medium,  letterSpacing: '0' },
  /** Meta — captions, timestamps, chip labels. 12px Regular. */
  meta:    { fontSize: '12px', lineHeight: '16px', fontWeight: fontWeight.regular, letterSpacing: '0' },
  /** Tiny — chrome labels, badges, breadcrumb separators. 10px Regular. */
  tiny:    { fontSize: '10px', lineHeight: '14px', fontWeight: fontWeight.regular, letterSpacing: '0' },

  // ───── v0.6 deprecated aliases (kept for compile compat) ─────
  // Resolve to the same values as the v1 spec keys above so consumers
  // get the new visuals immediately. The v0.7 codemod rewrites these
  // to the spec names and v0.8 will remove them.

  /** @deprecated Use `display`. */
  displayLg: { fontSize: '60px', lineHeight: '72px', fontWeight: fontWeight.bold,    letterSpacing: '-0.020em' },
  /** @deprecated Use `h2`. */
  displayMd: { fontSize: '32px', lineHeight: '42px', fontWeight: fontWeight.bold,    letterSpacing: '-0.012em' },
  /** @deprecated Use `h4`. */
  headingLg: { fontSize: '24px', lineHeight: '32px', fontWeight: fontWeight.bold,    letterSpacing: '-0.005em' },
  /** @deprecated Use `h5`. */
  headingMd: { fontSize: '20px', lineHeight: '28px', fontWeight: fontWeight.bold,    letterSpacing: '-0.005em' },
  /** @deprecated No direct spec equivalent — use `body` with `font-semibold`,
   *  or `h5` for a true small heading. */
  headingSm: { fontSize: '16px', lineHeight: '24px', fontWeight: fontWeight.semibold, letterSpacing: '0' },
  /** @deprecated Use `body`. */
  bodyLg:    { fontSize: '16px', lineHeight: '24px', fontWeight: fontWeight.regular, letterSpacing: '-0.002em' },
  /** @deprecated Use `meta`. */
  caption:   { fontSize: '12px', lineHeight: '16px', fontWeight: fontWeight.regular, letterSpacing: '0' },
} as const satisfies Record<string, TextStyle>;
