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

export type Ramp9 = Readonly<{
  '5':  string;
  '10': string;
  '20': string;
  '30': string;
  '40': string;
  '50': string;
  '60': string;
  '70': string;
  '80': string;
}>;

/** PO Blue — primary brand color, also the Word file-type accent. */
export const bluePalette = {
  '5':  '#E8F2FE',
  '10': '#D9EAFF',
  '20': '#BBD8FD',
  '30': '#8EBFFC',
  '40': '#60A5FA',
  '50': '#1D7FF9',
  '60': '#186CD3',
  '70': '#1458AD',
  '80': '#0F4588',
} as const satisfies Ramp9;

/** PO Dark Blue — BI / corporate communication only (not for UI). */
export const darkBluePalette = {
  '5':  '#E5ECF8',
  '10': '#D1DFF7',
  '20': '#B2C7EA',
  '30': '#7FA2DC',
  '40': '#4C70CE',
  '50': '#0046B9',
  '60': '#003B9D',
  '70': '#003081',
  '80': '#002665',
} as const satisfies Ramp9;

/** Sheet — XLSX file-type accent. */
export const greenPalette = {
  '5':  '#EDF7E8',
  '10': '#DCF1D1',
  '20': '#CAE8BA',
  '30': '#A8D98D',
  '40': '#B5CA5F',
  '50': '#51B41B',
  '60': '#449916',
  '70': '#387D12',
  '80': '#2C620E',
} as const satisfies Ramp9;

/** Slide — PPTX file-type accent. */
export const orangePalette = {
  '5':  '#FEF3E5',
  '10': '#FDE5C8',
  '20': '#FEDBB2',
  '30': '#FEC47F',
  '40': '#FDAC4C',
  '50': '#FD8900',
  '60': '#D77400',
  '70': '#B05F00',
  '80': '#8A4B00',
} as const satisfies Ramp9;

/** PDF — file-type accent. */
export const redPalette = {
  '5':  '#FEEEEE',
  '10': '#FFE3E3',
  '20': '#FDCECE',
  '30': '#FCADAD',
  '40': '#FA8C8C',
  '50': '#F95C5C',
  '60': '#D34E4E',
  '70': '#AD4040',
  '80': '#883232',
} as const satisfies Ramp9;

/** AI Purple — AI / NOVA surfaces only. Never use on general product UI. */
export const purplePalette = {
  '5':  '#F5F1FD',
  '10': '#EDE5FE',
  '20': '#E0D1FF',
  '30': '#C6A9FF',
  '40': '#9075EC',
  '50': '#6F3AD0',
  '60': '#602BC1',
  '70': '#511BB2',
  '80': '#3E0F8D',
} as const satisfies Ramp9;

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

export const colors = {
  brandPalette,
  brand,
  fileType,
  status,
  neutral,
  surface,
  text,
  // 9-step ramps
  bluePalette,
  darkBluePalette,
  greenPalette,
  orangePalette,
  redPalette,
  purplePalette,
  grayRamp,
} as const;
