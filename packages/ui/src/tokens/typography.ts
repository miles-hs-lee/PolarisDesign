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

export const textStyle = {
  displayLg: { fontSize: '48px', lineHeight: '60px', fontWeight: fontWeight.bold,     letterSpacing: '-0.025em' },
  displayMd: { fontSize: '36px', lineHeight: '44px', fontWeight: fontWeight.bold,     letterSpacing: '-0.02em' },
  headingLg: { fontSize: '24px', lineHeight: '32px', fontWeight: fontWeight.semibold, letterSpacing: '-0.01em' },
  headingMd: { fontSize: '20px', lineHeight: '28px', fontWeight: fontWeight.semibold, letterSpacing: '-0.005em' },
  headingSm: { fontSize: '16px', lineHeight: '24px', fontWeight: fontWeight.semibold, letterSpacing: '0' },
  bodyLg:    { fontSize: '16px', lineHeight: '24px', fontWeight: fontWeight.regular,  letterSpacing: '0' },
  bodySm:    { fontSize: '14px', lineHeight: '20px', fontWeight: fontWeight.regular,  letterSpacing: '0' },
  caption:   { fontSize: '12px', lineHeight: '16px', fontWeight: fontWeight.regular,  letterSpacing: '0' },
} as const satisfies Record<string, TextStyle>;
