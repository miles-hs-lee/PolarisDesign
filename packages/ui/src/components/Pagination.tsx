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
            ? 'bg-primary-normal text-label-inverse'
            : 'text-label-normal hover:bg-primary-normal-subtle',
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

export interface PaginationStepProps extends PaginationItemProps {
  /** aria-label override. Default: `이전 페이지` / `다음 페이지`. */
  label?: string;
}

export const PaginationPrev = forwardRef<HTMLElement, PaginationStepProps>(
  ({ className, children, label = '이전 페이지', ...props }, ref) => (
    <PaginationItem ref={ref} className={className} aria-label={label} {...props}>
      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      {children}
    </PaginationItem>
  )
);
PaginationPrev.displayName = 'PaginationPrev';

export const PaginationNext = forwardRef<HTMLElement, PaginationStepProps>(
  ({ className, children, label = '다음 페이지', ...props }, ref) => (
    <PaginationItem ref={ref} className={className} aria-label={label} {...props}>
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
      className={cn('inline-flex h-9 min-w-9 items-center justify-center text-label-alternative', className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

/** Sentinel value indicating an ellipsis position in `pageNumberItems()` output. */
export const PAGE_ELLIPSIS = '…' as const;
export type PageNumberItem = number | typeof PAGE_ELLIPSIS;

/**
 * Compute the visible page-number sequence with ellipses around the current
 * page. Returns numbers for clickable items and `PAGE_ELLIPSIS` for gaps.
 *
 * Example: `pageNumberItems(7, 20)` → `[1, '…', 5, 6, 7, 8, 9, '…', 20]`
 *
 * @param current   Current page (1-based).
 * @param total     Total page count.
 * @param siblings  Pages shown on each side of `current`. Default: 2.
 */
export function pageNumberItems(current: number, total: number, siblings = 2): PageNumberItem[] {
  if (total <= 0) return [];
  if (total <= 7 + (siblings - 2) * 2) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const start = Math.max(2, current - siblings);
  const end = Math.min(total - 1, current + siblings);
  const items: PageNumberItem[] = [1];
  if (start > 2) items.push(PAGE_ELLIPSIS);
  for (let p = start; p <= end; p++) items.push(p);
  if (end < total - 1) items.push(PAGE_ELLIPSIS);
  items.push(total);
  return items;
}
