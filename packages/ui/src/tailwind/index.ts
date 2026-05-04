import type { Config } from 'tailwindcss';

/**
 * Returns a Tailwind color value that supports both opaque and alpha-modified
 * forms (e.g. `bg-status-success` vs `bg-status-success/15`).
 *
 * Without this, plain `'var(--polaris-status-success)'` strings cause Tailwind
 * to drop the alpha modifier silently — the rule for `bg-status-success/15`
 * never gets generated and the tinted background disappears at runtime. The
 * function form lets us produce `color-mix()` for the alpha case.
 *
 * `color-mix(in srgb, ...)` is supported in Chrome 111+, Safari 16.2+,
 * Firefox 113+ which covers our target browsers.
 */
function token(varName: string): string {
  const fn = ({ opacityValue }: { opacityValue?: string } = {}) => {
    if (opacityValue !== undefined && opacityValue !== '1') {
      return `color-mix(in srgb, var(${varName}) calc(${opacityValue} * 100%), transparent)`;
    }
    return `var(${varName})`;
  };
  // Tailwind accepts callable color values at runtime; the public TS types
  // only expose `string | RecursiveKeyValuePair<string, string>`. Cast here
  // so the preset typechecks while still resolving alpha modifiers correctly.
  return fn as unknown as string;
}

const polarisPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        'polaris-blue':   token('--polaris-blue'),
        'polaris-green':  token('--polaris-green'),
        'polaris-orange': token('--polaris-orange'),
        'polaris-red':    token('--polaris-red'),
        'polaris-purple': token('--polaris-purple'),

        brand: {
          primary:            token('--polaris-brand-primary'),
          'primary-hover':    token('--polaris-brand-primary-hover'),
          'primary-subtle':   token('--polaris-brand-primary-subtle'),
          secondary:          token('--polaris-brand-secondary'),
          'secondary-hover':  token('--polaris-brand-secondary-hover'),
          'secondary-subtle': token('--polaris-brand-secondary-subtle'),
        },

        file: {
          docx: token('--polaris-file-docx'),
          hwp:  token('--polaris-file-hwp'),
          xlsx: token('--polaris-file-xlsx'),
          pptx: token('--polaris-file-pptx'),
          pdf:  token('--polaris-file-pdf'),
        },

        status: {
          success: token('--polaris-status-success'),
          warning: token('--polaris-status-warning'),
          danger:  token('--polaris-status-danger'),
          info:    token('--polaris-status-info'),
        },

        surface: {
          canvas:          token('--polaris-surface-canvas'),
          raised:          token('--polaris-surface-raised'),
          sunken:          token('--polaris-surface-sunken'),
          border:          token('--polaris-surface-border'),
          'border-strong': token('--polaris-surface-border-strong'),
        },

        // Foreground (text) color tokens. Class form: `text-fg-primary`,
        // `text-fg-on-brand`, etc. We use `fg` instead of `text` to avoid
        // tailwind-merge confusion with the `text-` font-size utility prefix.
        fg: {
          primary:    token('--polaris-text-primary'),
          secondary:  token('--polaris-text-secondary'),
          muted:      token('--polaris-text-muted'),
          'on-brand': token('--polaris-text-on-brand'),
        },

        neutral: {
          0:    token('--polaris-neutral-0'),
          50:   token('--polaris-neutral-50'),
          100:  token('--polaris-neutral-100'),
          200:  token('--polaris-neutral-200'),
          300:  token('--polaris-neutral-300'),
          400:  token('--polaris-neutral-400'),
          500:  token('--polaris-neutral-500'),
          600:  token('--polaris-neutral-600'),
          700:  token('--polaris-neutral-700'),
          800:  token('--polaris-neutral-800'),
          900:  token('--polaris-neutral-900'),
          1000: token('--polaris-neutral-1000'),
        },
      },

      borderRadius: {
        'polaris-sm':   'var(--polaris-radius-sm)',
        'polaris-md':   'var(--polaris-radius-md)',
        'polaris-lg':   'var(--polaris-radius-lg)',
        'polaris-xl':   'var(--polaris-radius-xl)',
        'polaris-full': 'var(--polaris-radius-full)',
      },

      boxShadow: {
        'polaris-xs': 'var(--polaris-shadow-xs)',
        'polaris-sm': 'var(--polaris-shadow-sm)',
        'polaris-md': 'var(--polaris-shadow-md)',
        'polaris-lg': 'var(--polaris-shadow-lg)',
      },

      fontFamily: {
        polaris:        ['var(--polaris-font-sans)'],
        'polaris-mono': ['var(--polaris-font-mono)'],
      },

      fontSize: {
        'polaris-display-lg': ['48px', { lineHeight: '60px', fontWeight: '700', letterSpacing: '-0.025em' }],
        'polaris-display-md': ['36px', { lineHeight: '44px', fontWeight: '700', letterSpacing: '-0.02em' }],
        'polaris-heading-lg': ['24px', { lineHeight: '32px', fontWeight: '600', letterSpacing: '-0.01em' }],
        'polaris-heading-md': ['20px', { lineHeight: '28px', fontWeight: '600', letterSpacing: '-0.005em' }],
        'polaris-heading-sm': ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'polaris-body-lg':    ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'polaris-body-sm':    ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'polaris-caption':    ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },
    },
  },
};

export default polarisPreset;
