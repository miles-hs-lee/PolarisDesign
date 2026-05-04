import { forwardRef } from 'react';
import { cn } from '../lib/cn';

export interface DescriptionListProps extends React.HTMLAttributes<HTMLDListElement> {
  /**
   * `inline` (default) — `<dt>`/`<dd>` pair on the same row (label left, value right).
   * `stacked` — label above value.
   */
  layout?: 'inline' | 'stacked';
}

/**
 * Key-value list semantically built on `<dl>`/`<dt>`/`<dd>`.
 *
 * Use for "details" panels — customer cards, contract metadata, profile pages.
 * The `inline` layout uses CSS grid so labels align across rows; `stacked` is
 * better when values are long or wrap.
 */
export const DescriptionList = forwardRef<HTMLDListElement, DescriptionListProps>(
  ({ className, layout = 'inline', ...props }, ref) => (
    <dl
      ref={ref}
      data-layout={layout}
      className={cn(
        'font-polaris text-polaris-body-sm',
        layout === 'inline'
          ? 'grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2'
          : 'flex flex-col gap-3',
        className
      )}
      {...props}
    />
  )
);
DescriptionList.displayName = 'DescriptionList';

export const DescriptionTerm = forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <dt
      ref={ref as never}
      className={cn('text-fg-muted', className)}
      {...props}
    />
  )
);
DescriptionTerm.displayName = 'DescriptionTerm';

export const DescriptionDetails = forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <dd
      ref={ref as never}
      className={cn('text-fg-primary', className)}
      {...props}
    />
  )
);
DescriptionDetails.displayName = 'DescriptionDetails';
