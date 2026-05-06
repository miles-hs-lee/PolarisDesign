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

      // 8-level v1 spec scale + `full` deprecated alias for `pill`.
      // Class form: `rounded-polaris-md`, `rounded-polaris-pill`, etc.
      borderRadius: {
        'polaris-2xs':  'var(--polaris-radius-2xs)',
        'polaris-xs':   'var(--polaris-radius-xs)',
        'polaris-sm':   'var(--polaris-radius-sm)',
        'polaris-md':   'var(--polaris-radius-md)',
        'polaris-lg':   'var(--polaris-radius-lg)',
        'polaris-xl':   'var(--polaris-radius-xl)',
        'polaris-2xl':  'var(--polaris-radius-2xl)',
        'polaris-pill': 'var(--polaris-radius-pill)',
        /** @deprecated Use `polaris-pill` (codemod target). */
        'polaris-full': 'var(--polaris-radius-full)',
      },

      boxShadow: {
        'polaris-xs': 'var(--polaris-shadow-xs)',
        'polaris-sm': 'var(--polaris-shadow-sm)',
        'polaris-md': 'var(--polaris-shadow-md)',
        'polaris-lg': 'var(--polaris-shadow-lg)',
        // AI Purple glow — for prompt composers / response cards only.
        'polaris-ai': 'var(--polaris-shadow-ai)',
      },

      fontFamily: {
        polaris:        ['var(--polaris-font-sans)'],
        'polaris-mono': ['var(--polaris-font-mono)'],
      },

      // Type scale — v1 spec keys are the preferred form. Class form:
      // `text-polaris-h1`, `text-polaris-body`, `text-polaris-meta`, etc.
      // The v0.6 keys (`polaris-display-lg`, `polaris-heading-lg`, …) are
      // kept as deprecated aliases that resolve to the same spec values
      // — visuals match, codemod rewrites the names, v0.8 removes them.
      fontSize: {
        // ───── v1 spec ─────
        'polaris-display':    ['60px', { lineHeight: '72px', fontWeight: '700', letterSpacing: '-0.020em' }],
        'polaris-h1':         ['40px', { lineHeight: '52px', fontWeight: '700', letterSpacing: '-0.018em' }],
        'polaris-h2':         ['32px', { lineHeight: '42px', fontWeight: '700', letterSpacing: '-0.012em' }],
        'polaris-h3':         ['28px', { lineHeight: '36px', fontWeight: '700', letterSpacing: '-0.010em' }],
        'polaris-h4':         ['24px', { lineHeight: '32px', fontWeight: '700', letterSpacing: '-0.005em' }],
        'polaris-h5':         ['20px', { lineHeight: '28px', fontWeight: '700', letterSpacing: '-0.005em' }],
        'polaris-body':       ['16px', { lineHeight: '24px', fontWeight: '400', letterSpacing: '-0.002em' }],
        'polaris-body-sm':    ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'polaris-detail':     ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'polaris-meta':       ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'polaris-tiny':       ['10px', { lineHeight: '14px', fontWeight: '400' }],

        // ───── v0.6 deprecated aliases (codemod target) ─────
        'polaris-display-lg': ['60px', { lineHeight: '72px', fontWeight: '700', letterSpacing: '-0.020em' }],
        'polaris-display-md': ['32px', { lineHeight: '42px', fontWeight: '700', letterSpacing: '-0.012em' }],
        'polaris-heading-lg': ['24px', { lineHeight: '32px', fontWeight: '700', letterSpacing: '-0.005em' }],
        'polaris-heading-md': ['20px', { lineHeight: '28px', fontWeight: '700', letterSpacing: '-0.005em' }],
        'polaris-heading-sm': ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'polaris-body-lg':    ['16px', { lineHeight: '24px', fontWeight: '400', letterSpacing: '-0.002em' }],
        'polaris-caption':    ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },
    },
  },
};

export default polarisPreset;
