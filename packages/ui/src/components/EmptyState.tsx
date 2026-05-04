import { forwardRef, type ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center justify-center text-center font-polaris',
        'rounded-polaris-lg border border-dashed border-surface-border-strong bg-surface-canvas',
        'px-6 py-12 gap-3',
        className
      )}
      {...props}
    >
      {icon && (
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-polaris-full bg-surface-sunken text-fg-muted [&>svg]:h-6 [&>svg]:w-6">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1 max-w-md">
        <h3 className="text-polaris-heading-sm text-fg-primary">{title}</h3>
        {description && (
          <p className="text-polaris-body-sm text-fg-secondary">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
);
EmptyState.displayName = 'EmptyState';
