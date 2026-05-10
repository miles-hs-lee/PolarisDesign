import { forwardRef, useId, type ElementType, type ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { MoreHorizontal } from 'lucide-react';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './Select';
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
          'inline-flex h-9 min-w-9 items-center justify-center rounded-polaris-md px-3 text-polaris-body2 font-medium transition-colors',
          'focus-visible:outline-none focus-visible:shadow-polaris-focus',
          'disabled:opacity-50 disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:pointer-events-none',
          active
            ? 'bg-accent-brand-normal text-label-inverse'
            : 'text-label-normal hover:bg-accent-brand-normal-subtle',
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
      <ChevronLeftIcon size={16} aria-hidden="true" />
      {children}
    </PaginationItem>
  )
);
PaginationPrev.displayName = 'PaginationPrev';

export const PaginationNext = forwardRef<HTMLElement, PaginationStepProps>(
  ({ className, children, label = '다음 페이지', ...props }, ref) => (
    <PaginationItem ref={ref} className={className} aria-label={label} {...props}>
      {children}
      <ChevronRightIcon size={16} aria-hidden="true" />
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

/* ================================================================== *
 * PaginationFooter — high-level wrapper                  v0.7.5 NEW
 * ================================================================== *
 *
 * `<Pagination>` + helpers cover navigation buttons, but most tables
 * also need (a) a "rows per page" selector and (b) a "X-Y of N" total
 * indicator. Consumers were reaching for `<Select>` separately and
 * laying out the row by hand on every page. `PaginationFooter` bundles
 * the standard pattern.
 *
 * Layout (left → right):
 *
 *   [ "X-Y of N" 인디케이터 ]   …   [ pageSize Select ]   [ ‹ 1 2 … N › ]
 *
 * Each region is independently optional — pass `showTotal={false}` /
 * `pageSizeOptions={undefined}` to hide.
 *
 * Controlled component: parent owns `page` + `pageSize` state and
 * receives `onPageChange` / `onPageSizeChange` callbacks. The page number
 * sequence with ellipses is computed from `pageNumberItems(page, totalPages)`.
 *
 * @example
 * ```tsx
 * <PaginationFooter
 *   page={page}
 *   pageSize={pageSize}
 *   total={total}
 *   onPageChange={setPage}
 *   onPageSizeChange={(n) => { setPageSize(n); setPage(1); }}
 *   pageSizeOptions={[10, 25, 50, 100]}
 * />
 * ```
 */

export interface PaginationFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current page (1-based). */
  page: number;
  /** Total item count (used for the `X-Y of N` indicator and to derive `totalPages`). */
  total: number;
  /** Page size. */
  pageSize: number;
  /** Page size options for the selector. Default: `[10, 25, 50, 100]`. */
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  /** Required to show the page-size selector — passing this opts in. Typically also resets the page to 1. */
  onPageSizeChange?: (pageSize: number) => void;
  /**
   * Show the page-size selector. Default: `true` *iff* `onPageSizeChange`
   * is provided (the selector is meaningless without a change handler).
   *
   * Pass `false` explicitly to hide the selector even when
   * `onPageSizeChange` is set — useful when an external control owns
   * the page-size choice (e.g. a Settings panel) and the footer should
   * stay info-only.
   *
   * Previously the only way to hide was passing `pageSizeOptions={undefined}`
   * which read like "no options" rather than "hide". This explicit
   * boolean is preferred; the old behavior still works as a fallback.
   */
  showPageSize?: boolean;
  /** Hide the `X-Y of N` indicator. */
  showTotal?: boolean;
  /** Sibling pages on each side of the current page. Default: 2. */
  siblings?: number;
  /** Localized label parts. */
  labels?: {
    /** Receives a function that interpolates start, end, total — render the
     *  "X-Y of N" indicator. Default: `"{start}-{end} / {total}"`. */
    total?: (start: number, end: number, total: number) => ReactNode;
    /** Label for the page-size selector. Default: "페이지당". */
    pageSize?: ReactNode;
  };
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const PaginationFooter = forwardRef<HTMLDivElement, PaginationFooterProps>(
  (
    {
      page,
      total,
      pageSize,
      pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
      onPageChange,
      onPageSizeChange,
      showPageSize,
      showTotal = true,
      siblings = 2,
      labels,
      className,
      ...props
    },
    ref
  ) => {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(page, 1), totalPages);
    const start = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
    const end = Math.min(safePage * pageSize, total);
    const items = pageNumberItems(safePage, totalPages, siblings);
    const pageSizeId = useId();

    const totalLabel =
      labels?.total ?? ((s, e, t) => `${s}-${e} / ${t.toLocaleString()}`);
    const pageSizeLabel = labels?.pageSize ?? '페이지당';

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-wrap items-center justify-between gap-polaris-sm font-polaris',
          className
        )}
        {...props}
      >
        {showTotal ? (
          <p className="text-polaris-body3 text-label-alternative">
            {totalLabel(start, end, total)}
          </p>
        ) : (
          <span aria-hidden="true" />
        )}

        <div className="flex items-center gap-polaris-sm">
          {/* Resolve showPageSize: explicit boolean wins; otherwise default
            *  to "show iff change-handler + options are present" (legacy).
            *  Passing `pageSizeOptions={undefined}` still hides the selector
            *  for backwards-compat with v0.7.5 callers, but is no longer
            *  the recommended way (`showPageSize={false}` reads better). */}
          {(showPageSize ?? Boolean(pageSizeOptions && onPageSizeChange)) && pageSizeOptions && onPageSizeChange ? (
            <div className="flex items-center gap-polaris-2xs">
              <label
                htmlFor={pageSizeId}
                className="text-polaris-body3 text-label-alternative"
              >
                {pageSizeLabel}
              </label>
              <Select
                value={String(pageSize)}
                onValueChange={(v) => onPageSizeChange(Number(v))}
              >
                <SelectTrigger id={pageSizeId} className="h-9 w-[5.5rem]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          <Pagination>
            <PaginationPrev
              disabled={safePage <= 1}
              onClick={() => onPageChange(safePage - 1)}
            />
            {items.map((it, i) =>
              it === PAGE_ELLIPSIS ? (
                <PaginationEllipsis key={`ellipsis-${i}`} />
              ) : (
                <PaginationItem
                  key={it}
                  active={it === safePage}
                  onClick={() => onPageChange(it)}
                >
                  {it}
                </PaginationItem>
              )
            )}
            <PaginationNext
              disabled={safePage >= totalPages}
              onClick={() => onPageChange(safePage + 1)}
            />
          </Pagination>
        </div>
      </div>
    );
  }
);
PaginationFooter.displayName = 'PaginationFooter';
