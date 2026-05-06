export type ColorMode = 'light' | 'dark';
export type ColorPair = { readonly light: string; readonly dark: string };

// Light values from "Polaris Office Design System v1 (2026.05)" spec
// (PO Blue / Sheet Green / Slide Orange / PDF Red / AI Purple). Dark
// values are kept from the v0.6 best-effort scheme — design team has
// not supplied dark-mode hex yet, and the v0.6 dark values still pass
// our contrast checks against the new light values.
export const brandPalette = {
  blue:   { light: '#1D7FF9', dark: '#5C9FFF' },
  green:  { light: '#51B41B', dark: '#3FCB72' },
  orange: { light: '#FD8900', dark: '#FF8F4D' },
  red:    { light: '#F95C5C', dark: '#FF6962' },
  purple: { light: '#6F3AD0', dark: '#9B85FF' },
} as const satisfies Record<string, ColorPair>;

export const brand = {
  primary:         brandPalette.blue,
  primaryHover:    { light: '#1458AD', dark: '#7AA5F5' },  // PO Blue 70 (primary-strong)
  primarySubtle:   { light: '#E8F2FE', dark: '#1A2238' },  // PO Blue 5
  secondary:       brandPalette.purple,
  secondaryHover:  { light: '#511BB2', dark: '#A896FF' },  // AI Purple 70 (ai-strong)
  secondarySubtle: { light: '#F5F1FD', dark: '#2A2247' },  // AI Purple 5 (ai-hover)
} as const satisfies Record<string, ColorPair>;

export const fileType = {
  docx: brandPalette.blue,
  hwp:  brandPalette.blue,
  xlsx: brandPalette.green,
  pptx: brandPalette.orange,
  pdf:  brandPalette.red,
} as const satisfies Record<string, ColorPair>;

export const status = {
  success:      { light: '#16A34A', dark: '#3FCB72' },
  successHover: { light: '#138A3F', dark: '#58D788' },
  warning:      { light: '#EAB308', dark: '#FFD64A' },
  warningHover: { light: '#C99B0A', dark: '#FFE17A' },
  danger:       { light: '#DC2626', dark: '#FF6962' },
  dangerHover:  { light: '#B91C1C', dark: '#FF8782' },
  info:         { light: '#2563EB', dark: '#5C9FFF' },
  infoHover:    { light: '#1D4ED8', dark: '#7AB1FF' },
} as const satisfies Record<string, ColorPair>;

export const neutral = {
  '0':    { light: '#FFFFFF', dark: '#0B0B12' },
  '50':   { light: '#FAFAFB', dark: '#131320' },
  '100':  { light: '#F4F4F7', dark: '#1B1B2A' },
  '200':  { light: '#E8E8EE', dark: '#232336' },
  '300':  { light: '#D5D5DE', dark: '#2D2D45' },
  '400':  { light: '#B5B5C4', dark: '#4A4A66' },
  '500':  { light: '#8C8CA0', dark: '#6B6B85' },
  '600':  { light: '#6E6E84', dark: '#8B8BA3' },
  '700':  { light: '#4F4F63', dark: '#B4B4C8' },
  '800':  { light: '#2F2F40', dark: '#D5D5DE' },
  '900':  { light: '#1A1A26', dark: '#EDEDF2' },
  '1000': { light: '#0B0B12', dark: '#FFFFFF' },
} as const satisfies Record<string, ColorPair>;

export const surface = {
  canvas:       { light: neutral['50'].light,  dark: neutral['0'].dark },
  raised:       { light: neutral['0'].light,   dark: neutral['100'].dark },
  sunken:       { light: neutral['100'].light, dark: neutral['50'].dark },
  border:       { light: neutral['200'].light, dark: neutral['200'].dark },
  borderStrong: { light: neutral['300'].light, dark: neutral['300'].dark },
} as const satisfies Record<string, ColorPair>;

export const text = {
  primary:   { light: neutral['1000'].light, dark: neutral['1000'].dark },
  secondary: { light: neutral['700'].light,  dark: neutral['700'].dark },
  muted:     { light: neutral['500'].light,  dark: neutral['500'].dark },
  onBrand:   { light: '#FFFFFF', dark: '#FFFFFF' },
  onStatus:  { light: '#FFFFFF', dark: '#FFFFFF' },
} as const satisfies Record<string, ColorPair>;

/* ================================================================== *
 * 9-step ramps (v1 spec, 2026.05)
 *
 * Each brand color now ships as a full 9-step ramp (5 / 10 / 20 / 30 /
 * 40 / 50 / 60 / 70 / 80). Step 50 matches `brandPalette.<name>.light`
 * — both are exported so consumers can pick whichever fits their
 * context (single-token alias for simple buttons, ramp for chart
 * categories or hover/pressed nuances).
 *
 * Light mode only — design team hasn't supplied a dark-mode ramp yet.
 * ================================================================== */

/**
 * 10-step ramp shape per v1 spec (`primitive-color-palette` reference).
 * Steps run `05` (lightest tint) → `90` (darkest shade). The leading-zero
 * `'05'` matches the spec sheet exactly so search/copy from the design
 * artefact lands on the right key.
 *
 * The `'5'` (no leading zero) key is preserved as a deprecated alias for
 * each ramp so v0.7-rc.0 callers keep compiling — codemod rewrites it.
 */
export type Ramp10 = Readonly<{
  '05': string;
  '10': string;
  '20': string;
  '30': string;
  '40': string;
  '50': string;
  '60': string;
  '70': string;
  '80': string;
  '90': string;
  /** @deprecated alias of `'05'`. Codemod rewrites `'5'` → `'05'`. */
  '5': string;
}>;

/** PO Blue — primary brand color, also the Word file-type accent. */
export const bluePalette = {
  '05': '#E8F2FE',
  '10': '#D9EAFF',
  '20': '#BBD8FD',
  '30': '#8EBFFC',
  '40': '#60A5FA',
  '50': '#1D7FF9',
  '60': '#186CD3',
  '70': '#1458AD',
  '80': '#0F4588',
  '90': '#0B3263',
  '5':  '#E8F2FE',
} as const satisfies Ramp10;

/** PO Dark Blue — BI / corporate communication only (not for UI). */
export const darkBluePalette = {
  '05': '#E5ECF8',
  '10': '#D1DFF7',
  '20': '#B2C7EA',
  '30': '#7FA2DC',
  '40': '#4C7DCE',
  '50': '#0046B9',
  '60': '#003B9D',
  '70': '#003081',
  '80': '#002665',
  '90': '#001C4A',
  '5':  '#E5ECF8',
} as const satisfies Ramp10;

/** Sheet — XLSX file-type accent. Also `--state-success` source. */
export const greenPalette = {
  '05': '#EDF7E8',
  '10': '#DCF1D1',
  '20': '#CAE8BA',
  '30': '#A8D98D',
  '40': '#85CA5F',
  '50': '#51B41B',
  '60': '#449916',
  '70': '#387D12',
  '80': '#2C620E',
  '90': '#20480A',
  '5':  '#EDF7E8',
} as const satisfies Ramp10;

/** Slide — PPTX file-type accent. Also `--state-warning` source. */
export const orangePalette = {
  '05': '#FEF3E5',
  '10': '#FDE5C8',
  '20': '#FEDBB2',
  '30': '#FEC47F',
  '40': '#FDAC4C',
  '50': '#FD8900',
  '60': '#D77400',
  '70': '#B05F00',
  '80': '#8A4B00',
  '90': '#653600',
  '5':  '#FEF3E5',
} as const satisfies Ramp10;

/** PDF — file-type accent. Also `--state-error` source. */
export const redPalette = {
  '05': '#FEEEEE',
  '10': '#FFE3E3',
  '20': '#FDCECE',
  '30': '#FCADAD',
  '40': '#FA8C8C',
  '50': '#F95C5C',
  '60': '#D34E4E',
  '70': '#AD4040',
  '80': '#883232',
  '90': '#632424',
  '5':  '#FEEEEE',
} as const satisfies Ramp10;

/** AI Purple — AI / NOVA surfaces only. Never use on general product UI. */
export const purplePalette = {
  '05': '#F5F1FD',
  '10': '#EDE5FE',
  '20': '#E0D1FF',
  '30': '#C6A9FF',
  '40': '#9D75EC',
  '50': '#6F3AD0',
  '60': '#602BC1',
  '70': '#511BB2',
  '80': '#3E0F8D',
  '90': '#20075C',
  '5':  '#F5F1FD',
} as const satisfies Ramp10;

/* ================================================================== *
 * Supplementary palettes (v1 spec, 2026.05)
 *
 * These are NOT brand colors — they're the secondary palette the
 * design team reserves for charts, plan badges, file-type extensions,
 * notes, and other accents that need their own hue without diluting
 * the five brand colors. Use sparingly.
 * ================================================================== */

/** Sky Blue — plan badges and accents (lighter, friendlier than PO Blue). */
export const skyBluePalette = {
  '05': '#E9F7FD',
  '10': '#D6F0FE',
  '20': '#BFE7FB',
  '30': '#95D7F9',
  '40': '#6AC7F7',
  '50': '#2BAFF4',
  '60': '#2494CF',
  '70': '#1E7AAA',
  '80': '#176085',
  '90': '#114661',
  '5':  '#E9F7FD',
} as const satisfies Ramp10;

/** Blue (supplementary) — links and accents in dense UIs. Distinct from
 *  PO Blue (`bluePalette`); reach for this when PO Blue would visually
 *  conflict with brand-strong elements on the same surface. */
export const blueSupplementaryPalette = {
  '05': '#EDEEFC',
  '10': '#DEE0FF',
  '20': '#C9CDF7',
  '30': '#A5ADF2',
  '40': '#818CEC',
  '50': '#4C5BE5',
  '60': '#404DC2',
  '70': '#353F9F',
  '80': '#29317D',
  '90': '#1E245B',
  '5':  '#EDEEFC',
} as const satisfies Ramp10;

/** Violet — supplementary purple for charts and tags. Distinct from
 *  AI Purple (`purplePalette`); never use Violet for AI / NOVA. */
export const violetPalette = {
  '05': '#EEECF9',
  '10': '#E0DAF8',
  '20': '#CEC7ED',
  '30': '#ADA3E2',
  '40': '#8C7ED7',
  '50': '#5C47C6',
  '60': '#4E3CA8',
  '70': '#40318A',
  '80': '#32266C',
  '90': '#241C4F',
  '5':  '#EEECF9',
} as const satisfies Ramp10;

/** Cyan — image format and media-related accents. */
export const cyanPalette = {
  '05': '#E6F9FD',
  '10': '#D2F4FA',
  '20': '#ABEBF6',
  '30': '#66DAF2',
  '40': '#33CDED',
  '50': '#00BADB',
  '60': '#0095B1',
  '70': '#00758E',
  '80': '#005C70',
  '90': '#003F4D',
  '5':  '#E6F9FD',
} as const satisfies Ramp10;

/** Yellow — note format and highlight colors. Reserved: do NOT use
 *  for `--state-warning` (orange owns that role). */
export const yellowPalette = {
  '05': '#FFFAEB',
  '10': '#FCEFCA',
  '20': '#FAE6AF',
  '30': '#FCDA7B',
  '40': '#F8C22E',
  '50': '#F2B50B',
  '60': '#D79E00',
  '70': '#B08100',
  '80': '#8A6500',
  '90': '#654A00',
  '5':  '#FFFAEB',
} as const satisfies Ramp10;

/** Gray ramp — UI backbone (text, lines, surfaces, interaction states).
 *  9 steps, 10 (lightest) → 90 (darkest). Note this scale uses different
 *  step numbers from the legacy `neutral` 12-step scale — both exports
 *  coexist; `grayRamp` matches the v1 design spec, `neutral` is kept for
 *  backward compatibility. New code should prefer `grayRamp`. */
export const grayRamp = {
  '10': '#F7F8F9',
  '20': '#F2F4F6',
  '30': '#E8EBED',
  '40': '#C9CDD2',
  '50': '#B3B8BD',
  '60': '#9EA4AA',
  '70': '#72787F',
  '80': '#454C53',
  '90': '#26282B',
} as const satisfies Record<string, string>;

/* ================================================================== *
 * v1 spec semantic tokens (2026.05)
 *
 * Aligned with the design team's `DESIGN.md` reference (v0.7-rc.1).
 * Dark-mode hex uses the spec's grayscale-centered palette, replacing
 * the rc.0 purple-tinted scale (`#1B1B2A` etc.).
 *
 * Token groups in spec order:
 *   label.*         text + icon foreground
 *   background.*    page-level base, disabled
 *   layer.*         surface/overlay (NEW in rc.1)
 *   interaction.*   hover, pressed
 *   fill.*          tinted surfaces (neutral / normal / strong)
 *   line.*          borders + dividers (neutral / normal / strong / disabled)
 *   accentBrand.*   PO Blue brand accent + bg variants
 *   accentAction.*  Black "action" button (NEW in rc.1)
 *   focus.*         focus-ring
 *   staticColors.*  mode-invariant white/black
 *   state.*         success / warning / error / info / new + bg variants
 *
 * Legacy v0.7-rc.0 groups (`primary.*`, `ai.*`) are kept as aliases.
 * ================================================================== */

/** Text + icon foreground tokens (spec: "label"). */
export const label = {
  /** 1차 텍스트 (primary copy, headlines). */
  normal:      { light: '#26282B', dark: '#D8D8D8' },
  /** 본문 / 2차 (body copy, secondary text). */
  neutral:     { light: '#454C53', dark: '#9E9E9E' },
  /** 3차 (tertiary, captions). 14px 본문 4.46:1 (15px+ 권장). */
  alternative: { light: '#72787F', dark: '#797979' },
  /** Placeholder, hint (assistive). */
  assistive:   { light: '#9EA4AA', dark: '#6B6B6B' },
  /** 진한 배경 위 텍스트 (on dark / on-brand surfaces). */
  inverse:     { light: '#FFFFFF', dark: '#232323' },
  /** v0.7-rc.1 NEW — disabled label / icon. */
  disabled:    { light: '#C9CDD2', dark: '#595959' },
} as const satisfies Record<string, ColorPair>;

/** Page-level background tokens (spec: "background"). */
export const background = {
  /** v0.7-rc.1 — page / canvas root background. Was `normal` in rc.0. */
  base:        { light: '#FFFFFF', dark: '#232323' },
  /** v0.7-rc.1 NEW — disabled button / input background. */
  disabled:    { light: '#F2F4F6', dark: '#2D2D2D' },
  /** @deprecated rc.0 alias of `base`. */
  normal:      { light: '#FFFFFF', dark: '#232323' },
  /** @deprecated rc.0 alias. Use `fill.neutral` for tinted page backgrounds. */
  alternative: { light: '#F7F8F9', dark: '#2D2D2D' },
} as const satisfies Record<string, ColorPair>;

/** Layer tokens (spec: "layer"). v0.7-rc.1 NEW — separates raised
 *  surfaces (cards, dialogs, dropdowns) from the page background. */
export const layer = {
  /** Cards, dialogs, dropdowns, popovers. */
  surface: { light: '#FFFFFF', dark: '#282828' },
  /** Modal / popup dim layer. Same hex in both modes per spec. */
  overlay: { light: 'rgba(0, 0, 0, 0.5)', dark: 'rgba(0, 0, 0, 0.5)' },
} as const satisfies Record<string, ColorPair>;

/** Interaction state tokens (spec: "interaction"). */
export const interaction = {
  /** Hover surface. */
  hover:   { light: '#F2F4F6', dark: '#4A4A4A' },
  /** v0.7-rc.1 NEW — pressed / active surface. */
  pressed: { light: '#E8EBED', dark: '#595959' },
} as const satisfies Record<string, ColorPair>;

/** Fill tokens (spec: "fill") — three intensities of tinted surfaces. */
export const fill = {
  /** v0.7-rc.1 NEW — base tinted surface (sidebars, chrome wells). */
  neutral: { light: '#F7F8F9', dark: '#2D2D2D' },
  /** Generic component bg (Tertiary buttons, filled chips). */
  normal:  { light: '#F2F4F6', dark: '#3B3B3B' },
  /** v0.7-rc.1 NEW — emphasized fill (selected items, strong surfaces). */
  strong:  { light: '#E8EBED', dark: '#595959' },
} as const satisfies Record<string, ColorPair>;

/** Border / divider tokens (spec: "line") — four intensities. */
export const line = {
  /** 약한 구분선 (list separators, subtle dividers). */
  neutral:  { light: '#E8EBED', dark: '#3B3B3B' },
  /** 일반 보더 (inputs, default borders). */
  normal:   { light: '#C9CDD2', dark: '#595959' },
  /** v0.7-rc.1 NEW — strong divider, prominent borders. */
  strong:   { light: '#B3B8BD', dark: '#6B6B6B' },
  /** v0.7-rc.1 NEW — disabled border. */
  disabled: { light: '#F2F4F6', dark: '#2D2D2D' },
} as const satisfies Record<string, ColorPair>;

/** Brand accent tokens (spec: "accent.brand"). PO Blue.
 *  v0.7-rc.0 used `primary.*`; that namespace is kept as an alias below. */
export const accentBrand = {
  /** PO Blue — 기본 강조색 (CTAs, links, focus). 3.85:1 — 14px 이하 본문 단독 사용 금지. */
  normal:  { light: '#1D7FF9', dark: '#1D7FF9' },
  /** PO Blue strong — hover / pressed. */
  strong:  { light: '#1458AD', dark: '#60A5FA' },
  /** v0.7-rc.1 NEW — Secondary button background (brand tint). */
  bg:      { light: '#D9EAFF', dark: '#0B3263' },
  /** v0.7-rc.1 NEW — Secondary button hover. */
  bgHover: { light: '#BBD8FD', dark: '#0F4588' },
} as const satisfies Record<string, ColorPair>;

/** Action accent tokens (spec: "accent.action"). v0.7-rc.1 NEW.
 *  Black variant for high-contrast "Primary Dark" buttons (e.g. final
 *  submit, "Get started" CTAs). Auto-inverts in dark mode. */
export const accentAction = {
  normal: { light: '#000000', dark: '#FFFFFF' },
  strong: { light: '#454C53', dark: '#F2F4F6' },
} as const satisfies Record<string, ColorPair>;

/** Focus ring (spec: "focus"). v0.7-rc.1 NEW — dedicated semantic.
 *  Same hex both modes (lighter than accent.brand to read on either
 *  light or dark surfaces). */
export const focus = {
  ring: { light: '#60A5FA', dark: '#60A5FA' },
} as const satisfies Record<string, ColorPair>;

/** Mode-invariant colors (spec: "static"). v0.7-rc.1 NEW.
 *  Use when a color should NEVER swap with the theme — e.g. a brand
 *  logo on a colored background, a "white" send button on AI Purple. */
export const staticColors = {
  white: { light: '#FFFFFF', dark: '#FFFFFF' },
  black: { light: '#000000', dark: '#000000' },
} as const satisfies Record<string, ColorPair>;

/** State tokens (spec: "state") — success / warning / error / info /
 *  new. v0.7-rc.1 adds the `bg` variants and the `new` notification dot.
 *  Replaces / supersedes the legacy `status.*` group. */
export const state = {
  /** v0.7-rc.1 NEW — only for "new" notification dots. NOT for error UI. */
  new:        { light: '#FB4949', dark: '#FB4949' },
  /** Success text + icon. 2.66:1 — body 단독 사용 금지, 아이콘/뱃지/18px+ Bold만. */
  success:    { light: '#51B41B', dark: '#51B41B' },
  /** v0.7-rc.1 NEW — success banner / toast background tint. */
  successBg:  { light: '#EDF7E8', dark: '#20480A' },
  /** Warning text + icon. 2.40:1 — body 단독 사용 절대 금지. */
  warning:    { light: '#FD8900', dark: '#FD8900' },
  /** v0.7-rc.1 NEW — warning banner / toast background tint. */
  warningBg:  { light: '#FEF3E5', dark: '#653600' },
  /** Error text + icon. 3.13:1 — 14px 이하는 아이콘 동반 필수 (WCAG 1.4.1). */
  error:      { light: '#F95C5C', dark: '#F95C5C' },
  /** v0.7-rc.1 NEW — error banner / toast background tint. */
  errorBg:    { light: '#FEEEEE', dark: '#632424' },
  /** Info text + icon. Same hex as accent.brand.normal. */
  info:       { light: '#1D7FF9', dark: '#1D7FF9' },
  /** v0.7-rc.1 NEW — info banner / toast background tint. */
  infoBg:     { light: '#E8F2FE', dark: '#0B3263' },
} as const satisfies Record<string, ColorPair>;

/** @deprecated v0.7-rc.0 alias. Use `accentBrand.*` instead. */
export const primary = {
  normal: accentBrand.normal,
  strong: accentBrand.strong,
} as const satisfies Record<string, ColorPair>;

/** AI surface tokens (Polaris-specific extension — not in DESIGN.md
 *  but kept for NovaInput / AI buttons). Wraps AI Purple. */
export const ai = {
  /** AI Purple — AI 액션 버튼, 링크, 강조. */
  normal:  brand.secondary,
  /** AI Purple strong — hover / pressed. */
  strong:  brand.secondaryHover,
  /** AI hover 표면 (light tint). */
  hover:   brand.secondarySubtle,
  /** AI pressed 표면. */
  pressed: { light: '#E0D1FF', dark: '#3E0F8D' },
} as const satisfies Record<string, ColorPair>;

export const colors = {
  brandPalette,
  brand,
  fileType,
  status,
  neutral,
  surface,
  text,
  // 10-step ramps (brand)
  bluePalette,
  darkBluePalette,
  greenPalette,
  orangePalette,
  redPalette,
  purplePalette,
  // 10-step ramps (supplementary, v0.7-rc.1)
  skyBluePalette,
  blueSupplementaryPalette,
  violetPalette,
  cyanPalette,
  yellowPalette,
  // gray (9 steps, 10–90)
  grayRamp,
  // v1 semantic tokens (v0.7-rc.1 expanded)
  label,
  background,
  layer,
  interaction,
  fill,
  line,
  accentBrand,
  accentAction,
  focus,
  staticColors,
  state,
  // legacy / Polaris-specific
  primary,
  ai,
} as const;
