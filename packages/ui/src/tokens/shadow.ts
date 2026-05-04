export type ShadowScale = {
  readonly xs: string;
  readonly sm: string;
  readonly md: string;
  readonly lg: string;
};

export const shadow = {
  light: {
    xs: '0 1px 2px rgba(15, 15, 35, 0.06)',
    sm: '0 2px 6px rgba(15, 15, 35, 0.08)',
    md: '0 8px 20px rgba(15, 15, 35, 0.10)',
    lg: '0 20px 40px rgba(15, 15, 35, 0.14)',
  },
  dark: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.40)',
    sm: '0 2px 6px rgba(0, 0, 0, 0.45)',
    md: '0 8px 20px rgba(0, 0, 0, 0.50)',
    lg: '0 20px 40px rgba(0, 0, 0, 0.60)',
  },
} as const satisfies Record<'light' | 'dark', ShadowScale>;
