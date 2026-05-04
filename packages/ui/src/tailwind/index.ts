import type { Config } from 'tailwindcss';

const polarisPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        'polaris-blue':   'var(--polaris-blue)',
        'polaris-green':  'var(--polaris-green)',
        'polaris-orange': 'var(--polaris-orange)',
        'polaris-red':    'var(--polaris-red)',
        'polaris-purple': 'var(--polaris-purple)',

        brand: {
          primary:            'var(--polaris-brand-primary)',
          'primary-hover':    'var(--polaris-brand-primary-hover)',
          'primary-subtle':   'var(--polaris-brand-primary-subtle)',
          secondary:          'var(--polaris-brand-secondary)',
          'secondary-hover':  'var(--polaris-brand-secondary-hover)',
          'secondary-subtle': 'var(--polaris-brand-secondary-subtle)',
        },

        file: {
          docx: 'var(--polaris-file-docx)',
          hwp:  'var(--polaris-file-hwp)',
          xlsx: 'var(--polaris-file-xlsx)',
          pptx: 'var(--polaris-file-pptx)',
          pdf:  'var(--polaris-file-pdf)',
        },

        status: {
          success: 'var(--polaris-status-success)',
          warning: 'var(--polaris-status-warning)',
          danger:  'var(--polaris-status-danger)',
          info:    'var(--polaris-status-info)',
        },

        surface: {
          canvas:          'var(--polaris-surface-canvas)',
          raised:          'var(--polaris-surface-raised)',
          sunken:          'var(--polaris-surface-sunken)',
          border:          'var(--polaris-surface-border)',
          'border-strong': 'var(--polaris-surface-border-strong)',
        },

        text: {
          primary:    'var(--polaris-text-primary)',
          secondary:  'var(--polaris-text-secondary)',
          muted:      'var(--polaris-text-muted)',
          'on-brand': 'var(--polaris-text-on-brand)',
        },

        neutral: {
          0:    'var(--polaris-neutral-0)',
          50:   'var(--polaris-neutral-50)',
          100:  'var(--polaris-neutral-100)',
          200:  'var(--polaris-neutral-200)',
          300:  'var(--polaris-neutral-300)',
          400:  'var(--polaris-neutral-400)',
          500:  'var(--polaris-neutral-500)',
          600:  'var(--polaris-neutral-600)',
          700:  'var(--polaris-neutral-700)',
          800:  'var(--polaris-neutral-800)',
          900:  'var(--polaris-neutral-900)',
          1000: 'var(--polaris-neutral-1000)',
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
