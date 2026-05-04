import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-polaris-full px-2.5 py-0.5 text-polaris-caption font-semibold',
  {
    variants: {
      variant: {
        neutral: 'bg-neutral-100 text-fg-secondary',
        primary: 'bg-brand-primary-subtle text-brand-primary',
        secondary: 'bg-brand-secondary-subtle text-brand-secondary',
        success: 'bg-status-success/15 text-status-success',
        warning: 'bg-status-warning/20 text-status-warning',
        danger: 'bg-status-danger/15 text-status-danger',
        info: 'bg-status-info/15 text-status-info',
        docx: 'bg-file-docx/15 text-file-docx',
        xlsx: 'bg-file-xlsx/15 text-file-xlsx',
        pptx: 'bg-file-pptx/15 text-file-pptx',
        pdf: 'bg-file-pdf/15 text-file-pdf',
        hwp: 'bg-file-hwp/15 text-file-hwp',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  )
);
Badge.displayName = 'Badge';

export { badgeVariants };
