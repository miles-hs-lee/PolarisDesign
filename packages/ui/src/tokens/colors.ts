export type ColorMode = 'light' | 'dark';
export type ColorPair = { readonly light: string; readonly dark: string };

export const brandPalette = {
  blue:   { light: '#2B7FFF', dark: '#5C9FFF' },
  green:  { light: '#1FAE53', dark: '#3FCB72' },
  orange: { light: '#F37021', dark: '#FF8F4D' },
  red:    { light: '#E5413A', dark: '#FF6962' },
  purple: { light: '#7C5CFF', dark: '#9B85FF' },
} as const satisfies Record<string, ColorPair>;

export const brand = {
  primary:         brandPalette.blue,
  primaryHover:    { light: '#1E66DB', dark: '#7AA5F5' },
  primarySubtle:   { light: '#E8EFFF', dark: '#1A2238' },
  secondary:       brandPalette.purple,
  secondaryHover:  { light: '#6B47FF', dark: '#A896FF' },
  secondarySubtle: { light: '#F3EFFF', dark: '#2A2247' },
} as const satisfies Record<string, ColorPair>;

export const fileType = {
  docx: brandPalette.blue,
  hwp:  brandPalette.blue,
  xlsx: brandPalette.green,
  pptx: brandPalette.orange,
  pdf:  brandPalette.red,
} as const satisfies Record<string, ColorPair>;

export const status = {
  success: { light: '#16A34A', dark: '#3FCB72' },
  warning: { light: '#EAB308', dark: '#FFD64A' },
  danger:  { light: '#DC2626', dark: '#FF6962' },
  info:    { light: '#2563EB', dark: '#5C9FFF' },
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
