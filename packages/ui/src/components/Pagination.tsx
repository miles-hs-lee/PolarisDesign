import { forwardRef, type ElementType } from 'react';
import { Slot } from '@radix-ui/react-slot';
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
  /** Current page indicator. Renders `aria-current="page"`. */
  active?: boolean;
  /**
   * Render the child element instead of a `<button>`. Useful for URL-driven
   * pagination in Next.js App Router:
   * `<PaginationItem asChild active={n === current}><Link href={`?page=${n}`}>{n}</Link></PaginationItem>`
   */
  asChild?: boolean;
}

export const PaginationItem = forwardRef<HTMLElement, PaginationItemProps>(
  ({ className, active, asChild, children, ...props }, ref) => {
    const Comp: ElementType = asChild ? Slot : 'button';
    const buttonProps = asChild ? {} : { type: 'button' as const };
    return (
      // eslint-disable-next-line @polaris/prefer-polaris-component -- primitive layer
      <Comp
        ref={ref as never}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'inline-flex h-9 min-w-9 items-center justify-center rounded-polaris-md px-3 text-polaris-body-sm font-medium transition-colors',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary',
          'disabled:opacity-50 disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:pointer-events-none',
          active
            ? 'bg-brand-primary text-fg-on-brand'
            : 'text-fg-primary hover:bg-brand-primary-subtle',
          className
        )}
        {...buttonProps}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
PaginationItem.displayName = 'PaginationItem';

export const PaginationPrev = forwardRef<HTMLElement, PaginationItemProps>(
  ({ className, children, ...props }, ref) => (
    <PaginationItem ref={ref} className={className} aria-label="이전 페이지" {...props}>
      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      {children}
    </PaginationItem>
  )
);
PaginationPrev.displayName = 'PaginationPrev';

export const PaginationNext = forwardRef<HTMLElement, PaginationItemProps>(
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
