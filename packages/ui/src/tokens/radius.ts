/**
 * Border-radius scale aligned with the v1 design spec.
 *
 * v1 (8 steps): 2xs / xs / sm / md / lg★ / xl / 2xl / pill
 *   ★ lg = 12px is the default for cards.
 *
 * v0.6 backward-compat aliases are kept so existing code keeps
 * compiling — `radius.full` (9999px) is now an alias for `pill`.
 * Note: `radius.md` changes from 10px → 8px between v0.6 and v0.7;
 * `radius.lg` changes from 14px → 12px. Codemod handles renames in
 * Tailwind class names (`rounded-polaris-md`/`-lg`) but visual values
 * shift slightly.
 *
 * @deprecated `full` will be removed in v0.8 — migrate to `pill`.
 */
export const radius = {
  '2xs': '2px',
  xs:    '4px',
  sm:    '6px',
  md:    '8px',
  lg:    '12px',
  xl:    '16px',
  '2xl': '24px',
  pill:  '9999px',
  /** @deprecated Use `pill` (semantically identical, 9999px). */
  full:  '9999px',
} as const;
