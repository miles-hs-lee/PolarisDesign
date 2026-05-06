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

/** Builds a 10-step ramp object (`05` → `90`) for the Tailwind palette
 *  given a CSS-var prefix like `--polaris-blue`. Includes the legacy
 *  `5` (no leading zero) key as a deprecated alias of `05` so v0.7-rc.0
 *  classes (`bg-blue-5`) keep resolving. */
function ramp10(prefix: string) {
  return {
    '05': token(`${prefix}-05`),
    '10': token(`${prefix}-10`),
    '20': token(`${prefix}-20`),
    '30': token(`${prefix}-30`),
    '40': token(`${prefix}-40`),
    '50': token(`${prefix}-50`),
    '60': token(`${prefix}-60`),
    '70': token(`${prefix}-70`),
    '80': token(`${prefix}-80`),
    '90': token(`${prefix}-90`),
    /** @deprecated alias of `05`. v0.8 removes. */
    '5':  token(`${prefix}-5`),
  };
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
          /** v0.7-rc.1 NEW. */
          disabled:    token('--polaris-label-disabled'),
        },
        background: {
          /** v0.7-rc.1 — page-level base bg. */
          base:        token('--polaris-background-base'),
          /** v0.7-rc.1 NEW — disabled bg. */
          disabled:    token('--polaris-background-disabled'),
          /** @deprecated rc.0 alias of `base`. */
          normal:      token('--polaris-background-normal'),
          /** @deprecated rc.0 alias. Use `fill.neutral`. */
          alternative: token('--polaris-background-alternative'),
        },
        // v0.7-rc.1 NEW — layer.surface / layer.overlay
        layer: {
          surface: token('--polaris-layer-surface'),
          overlay: token('--polaris-layer-overlay'),
        },
        interaction: {
          hover:   token('--polaris-interaction-hover'),
          /** v0.7-rc.1 NEW. */
          pressed: token('--polaris-interaction-pressed'),
        },
        fill: {
          /** v0.7-rc.1 NEW. */
          neutral: token('--polaris-fill-neutral'),
          normal:  token('--polaris-fill-normal'),
          /** v0.7-rc.1 NEW. */
          strong:  token('--polaris-fill-strong'),
        },
        line: {
          neutral:  token('--polaris-line-neutral'),
          normal:   token('--polaris-line-normal'),
          /** v0.7-rc.1 NEW. */
          strong:   token('--polaris-line-strong'),
          /** v0.7-rc.1 NEW. */
          disabled: token('--polaris-line-disabled'),
        },
        // v0.7-rc.1 — accent.brand / accent.action
        'accent-brand': {
          normal:    token('--polaris-accent-brand-normal'),
          strong:    token('--polaris-accent-brand-strong'),
          /** v0.7-rc.1 NEW. */
          bg:        token('--polaris-accent-brand-bg'),
          /** v0.7-rc.1 NEW. */
          'bg-hover': token('--polaris-accent-brand-bg-hover'),
        },
        'accent-action': {
          normal: token('--polaris-accent-action-normal'),
          strong: token('--polaris-accent-action-strong'),
        },
        // v0.7-rc.1 NEW — focus, static, state
        focus: {
          ring: token('--polaris-focus-ring'),
        },
        static: {
          white: token('--polaris-static-white'),
          black: token('--polaris-static-black'),
        },
        state: {
          new:           token('--polaris-state-new'),
          success:       token('--polaris-state-success'),
          'success-bg':  token('--polaris-state-success-bg'),
          warning:       token('--polaris-state-warning'),
          'warning-bg':  token('--polaris-state-warning-bg'),
          error:         token('--polaris-state-error'),
          'error-bg':    token('--polaris-state-error-bg'),
          info:          token('--polaris-state-info'),
          'info-bg':     token('--polaris-state-info-bg'),
        },
        /** @deprecated rc.0 alias of `accent-brand`. */
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

        // 10-step primitive ramps. Class form: `bg-blue-50`, `text-purple-70`,
        // `bg-yellow-30`, etc. Each ramp covers 05 (lightest tint) → 90
        // (darkest shade); brand ramps inherit `--state-success/-warning/-error`
        // semantic aliases (e.g. green-50 == state-success).
        //
        // The `5` (no leading zero) key on each is a deprecated alias of
        // `05` — v0.7-rc.0 classes (`bg-blue-5`) still resolve. Codemod
        // rewrites them; v0.8 removes the alias.
        blue:                ramp10('--polaris-blue'),
        'dark-blue':         ramp10('--polaris-dark-blue'),
        green:               ramp10('--polaris-green'),
        orange:              ramp10('--polaris-orange'),
        red:                 ramp10('--polaris-red'),
        purple:              ramp10('--polaris-purple'),
        // Supplementary palettes (v0.7-rc.1) — chart categories, plan
        // badges, file-type extensions. Avoid mixing with brand colors
        // on the same surface.
        'sky-blue':          ramp10('--polaris-sky-blue'),
        'blue-supplementary': ramp10('--polaris-blue-supplementary'),
        violet:              ramp10('--polaris-violet'),
        cyan:                ramp10('--polaris-cyan'),
        yellow:              ramp10('--polaris-yellow'),
        // Gray runs 10 → 90 (no 05 in spec).
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
