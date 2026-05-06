import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-polaris-pill px-2.5 py-0.5 text-polaris-caption1 font-semibold',
  {
    variants: {
      variant: {
        neutral: '',
        primary: '',
        secondary: '',
        success: '',
        warning: '',
        danger: '',
        info: '',
        docx: '',
        xlsx: '',
        pptx: '',
        pdf: '',
        hwp: '',
      },
      tone: {
        /** Tinted background + colored text. The default — works on calm
         *  surfaces (cards, body bg). Can disappear over photos / busy
         *  backgrounds because the bg uses ~15% alpha. */
        subtle: '',
        /** Filled bg + on-brand white text. Use over images, dark
         *  backgrounds, or anywhere maximum legibility matters. */
        solid: '',
      },
    },
    compoundVariants: [
      // Subtle (default)
      { variant: 'neutral',   tone: 'subtle', class: 'bg-neutral-100 text-label-neutral' },
      { variant: 'primary',   tone: 'subtle', class: 'bg-accent-brand-normal-subtle text-accent-brand-normal' },
      { variant: 'secondary', tone: 'subtle', class: 'bg-ai-hover text-ai-normal' },
      { variant: 'success',   tone: 'subtle', class: 'bg-status-success/15 text-status-success' },
      { variant: 'warning',   tone: 'subtle', class: 'bg-status-warning/20 text-status-warning' },
      { variant: 'danger',    tone: 'subtle', class: 'bg-status-danger/15 text-status-danger' },
      { variant: 'info',      tone: 'subtle', class: 'bg-status-info/15 text-status-info' },
      { variant: 'docx',      tone: 'subtle', class: 'bg-file-docx/15 text-file-docx' },
      { variant: 'xlsx',      tone: 'subtle', class: 'bg-file-xlsx/15 text-file-xlsx' },
      { variant: 'pptx',      tone: 'subtle', class: 'bg-file-pptx/15 text-file-pptx' },
      { variant: 'pdf',       tone: 'subtle', class: 'bg-file-pdf/15 text-file-pdf' },
      { variant: 'hwp',       tone: 'subtle', class: 'bg-file-hwp/15 text-file-hwp' },
      // Solid (filled)
      { variant: 'neutral',   tone: 'solid', class: 'bg-neutral-1000 text-neutral-0' },
      { variant: 'primary',   tone: 'solid', class: 'bg-accent-brand-normal text-label-inverse' },
      { variant: 'secondary', tone: 'solid', class: 'bg-ai-normal text-label-inverse' },
      { variant: 'success',   tone: 'solid', class: 'bg-status-success text-label-inverse' },
      { variant: 'warning',   tone: 'solid', class: 'bg-status-warning text-label-inverse' },
      { variant: 'danger',    tone: 'solid', class: 'bg-status-danger text-label-inverse' },
      { variant: 'info',      tone: 'solid', class: 'bg-status-info text-label-inverse' },
      { variant: 'docx',      tone: 'solid', class: 'bg-file-docx text-label-inverse' },
      { variant: 'xlsx',      tone: 'solid', class: 'bg-file-xlsx text-label-inverse' },
      { variant: 'pptx',      tone: 'solid', class: 'bg-file-pptx text-label-inverse' },
      { variant: 'pdf',       tone: 'solid', class: 'bg-file-pdf text-label-inverse' },
      { variant: 'hwp',       tone: 'solid', class: 'bg-file-hwp text-label-inverse' },
    ],
    defaultVariants: {
      variant: 'neutral',
      tone: 'subtle',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, tone, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant, tone }), className)} {...props} />
  )
);
Badge.displayName = 'Badge';

export { badgeVariants };
