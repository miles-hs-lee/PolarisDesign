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
          success:         token('--polaris-status-success'),
          'success-hover': token('--polaris-status-success-hover'),
          warning:         token('--polaris-status-warning'),
          'warning-hover': token('--polaris-status-warning-hover'),
          danger:          token('--polaris-status-danger'),
          'danger-hover':  token('--polaris-status-danger-hover'),
          info:            token('--polaris-status-info'),
          'info-hover':    token('--polaris-status-info-hover'),
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
          primary:     token('--polaris-text-primary'),
          secondary:   token('--polaris-text-secondary'),
          muted:       token('--polaris-text-muted'),
          'on-brand':  token('--polaris-text-on-brand'),
          'on-status': token('--polaris-text-on-status'),
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

        // ───── v1 spec semantic tokens (preferred for new code) ─────
        //
        // The v0.6 aliases above (`fg.*`, `surface.*`, `brand.*`) keep
        // working unchanged. New code should reach for these spec names
        // — they match the design team's Figma library and DESIGN.md.

        label: {
          normal:      token('--polaris-label-normal'),
          neutral:     token('--polaris-label-neutral'),
          alternative: token('--polaris-label-alternative'),
          assistive:   token('--polaris-label-assistive'),
          inverse:     token('--polaris-label-inverse'),
        },
        background: {
          normal:      token('--polaris-background-normal'),
          alternative: token('--polaris-background-alternative'),
        },
        line: {
          neutral: token('--polaris-line-neutral'),
          normal:  token('--polaris-line-normal'),
        },
        fill: {
          normal: token('--polaris-fill-normal'),
        },
        primary: {
          normal: token('--polaris-primary-normal'),
          strong: token('--polaris-primary-strong'),
        },
        ai: {
          normal:  token('--polaris-ai-normal'),
          strong:  token('--polaris-ai-strong'),
          hover:   token('--polaris-ai-hover'),
          pressed: token('--polaris-ai-pressed'),
        },

        // 9-step ramps — for chart categories, hover/pressed nuances,
        // or anywhere the semantic alias above isn't expressive enough.
        // Class form: `bg-blue-50`, `text-purple-70`, etc.
        blue: {
          5:  token('--polaris-blue-5'),
          10: token('--polaris-blue-10'),
          20: token('--polaris-blue-20'),
          30: token('--polaris-blue-30'),
          40: token('--polaris-blue-40'),
          50: token('--polaris-blue-50'),
          60: token('--polaris-blue-60'),
          70: token('--polaris-blue-70'),
          80: token('--polaris-blue-80'),
        },
        green: {
          5:  token('--polaris-green-5'),
          10: token('--polaris-green-10'),
          20: token('--polaris-green-20'),
          30: token('--polaris-green-30'),
          40: token('--polaris-green-40'),
          50: token('--polaris-green-50'),
          60: token('--polaris-green-60'),
          70: token('--polaris-green-70'),
          80: token('--polaris-green-80'),
        },
        orange: {
          5:  token('--polaris-orange-5'),
          10: token('--polaris-orange-10'),
          20: token('--polaris-orange-20'),
          30: token('--polaris-orange-30'),
          40: token('--polaris-orange-40'),
          50: token('--polaris-orange-50'),
          60: token('--polaris-orange-60'),
          70: token('--polaris-orange-70'),
          80: token('--polaris-orange-80'),
        },
        red: {
          5:  token('--polaris-red-5'),
          10: token('--polaris-red-10'),
          20: token('--polaris-red-20'),
          30: token('--polaris-red-30'),
          40: token('--polaris-red-40'),
          50: token('--polaris-red-50'),
          60: token('--polaris-red-60'),
          70: token('--polaris-red-70'),
          80: token('--polaris-red-80'),
        },
        purple: {
          5:  token('--polaris-purple-5'),
          10: token('--polaris-purple-10'),
          20: token('--polaris-purple-20'),
          30: token('--polaris-purple-30'),
          40: token('--polaris-purple-40'),
          50: token('--polaris-purple-50'),
          60: token('--polaris-purple-60'),
          70: token('--polaris-purple-70'),
          80: token('--polaris-purple-80'),
        },
        gray: {
          10: token('--polaris-gray-10'),
          20: token('--polaris-gray-20'),
          30: token('--polaris-gray-30'),
          40: token('--polaris-gray-40'),
          50: token('--polaris-gray-50'),
          60: token('--polaris-gray-60'),
          70: token('--polaris-gray-70'),
          80: token('--polaris-gray-80'),
          90: token('--polaris-gray-90'),
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
