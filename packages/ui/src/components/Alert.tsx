import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { cn } from '../lib/cn';

const alertVariants = cva(
  'relative w-full rounded-polaris-md border-l-[3px] p-4 font-polaris flex gap-3',
  {
    variants: {
      variant: {
        info:    'bg-status-info/10 border-status-info text-fg-primary',
        success: 'bg-status-success/10 border-status-success text-fg-primary',
        warning: 'bg-status-warning/15 border-status-warning text-fg-primary',
        danger:  'bg-status-danger/10 border-status-danger text-fg-primary',
        neutral: 'bg-surface-raised border-surface-border-strong text-fg-primary',
      },
    },
    defaultVariants: { variant: 'info' },
  }
);

const ICONS: Record<NonNullable<VariantProps<typeof alertVariants>['variant']>, typeof Info | null> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
  neutral: null,
};

const ICON_COLORS: Record<NonNullable<VariantProps<typeof alertVariants>['variant']>, string> = {
  info:    'text-status-info',
  success: 'text-status-success',
  warning: 'text-status-warning',
  danger:  'text-status-danger',
  neutral: 'text-fg-secondary',
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  /** Hide the leading icon. Defaults to false. */
  hideIcon?: boolean;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, hideIcon = false, children, ...props }, ref) => {
    const v = variant ?? 'info';
    const Icon = ICONS[v];
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant: v }), className)}
        {...props}
      >
        {!hideIcon && Icon && (
          <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', ICON_COLORS[v])} aria-hidden="true" />
        )}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    );
  }
);
Alert.displayName = 'Alert';

export const AlertTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn('text-polaris-body-sm font-semibold mb-0.5', className)}
      {...props}
    />
  )
);
AlertTitle.displayName = 'AlertTitle';

export const AlertDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-polaris-body-sm text-fg-secondary', className)}
      {...props}
    />
  )
);
AlertDescription.displayName = 'AlertDescription';

export { alertVariants };
