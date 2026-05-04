import { forwardRef } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '../lib/cn';

export const Pagination = forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      role="navigation"
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1 font-polaris', className)}
      {...props}
    />
  )
);
Pagination.displayName = 'Pagination';

export interface PaginationItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const PaginationItem = forwardRef<HTMLButtonElement, PaginationItemProps>(
  ({ className, active, children, ...props }, ref) => (
    // eslint-disable-next-line @polaris/prefer-polaris-component -- primitive layer
    <button
      ref={ref}
      type="button"
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex h-9 min-w-9 items-center justify-center rounded-polaris-md px-3 text-polaris-body-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas',
        'disabled:opacity-50 disabled:pointer-events-none',
        active
          ? 'bg-brand-primary text-fg-on-brand'
          : 'text-fg-primary hover:bg-brand-primary-subtle',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
PaginationItem.displayName = 'PaginationItem';

export const PaginationPrev = forwardRef<HTMLButtonElement, Omit<PaginationItemProps, 'active'>>(
  ({ className, children, ...props }, ref) => (
    <PaginationItem ref={ref} className={className} aria-label="이전 페이지" {...props}>
      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      {children}
    </PaginationItem>
  )
);
PaginationPrev.displayName = 'PaginationPrev';

export const PaginationNext = forwardRef<HTMLButtonElement, Omit<PaginationItemProps, 'active'>>(
  ({ className, children, ...props }, ref) => (
    <PaginationItem ref={ref} className={className} aria-label="다음 페이지" {...props}>
      {children}
      <ChevronRight className="h-4 w-4" aria-hidden="true" />
    </PaginationItem>
  )
);
PaginationNext.displayName = 'PaginationNext';

export const PaginationEllipsis = forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn('inline-flex h-9 min-w-9 items-center justify-center text-fg-muted', className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
);
PaginationEllipsis.displayName = 'PaginationEllipsis';
