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

export const colors = {
  brandPalette,
  brand,
  fileType,
  status,
  neutral,
  surface,
  text,
} as const;
