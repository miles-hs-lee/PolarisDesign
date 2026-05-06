import { forwardRef, createContext, useContext } from 'react';
import { cn } from '../lib/cn';

/**
 * Polaris table primitive — semantic `<table>` with token-driven styling and
 * a `density` axis. Sorting / virtualization / column-defs are out of scope
 * (planned as `DataTable` in v0.4 on top of this primitive).
 *
 * The density context propagates to TableRow/TableCell so callers don't have
 * to thread a prop through every cell.
 */

type Density = 'compact' | 'comfortable' | 'relaxed';

const DensityContext = createContext<Density>('comfortable');

const ROW_PAD: Record<Density, string> = {
  compact:     'py-1.5',
  comfortable: 'py-2.5',
  relaxed:     'py-4',
};

const CELL_PAD_X = 'px-3';

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  /** Vertical row padding. Default: `comfortable`. */
  density?: Density;
  /** Container className — applied to the wrapper that handles overflow. */
  containerClassName?: string;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, containerClassName, density = 'comfortable', ...props }, ref) => (
    <div
      className={cn(
        'w-full overflow-x-auto rounded-polaris-md border border-line-neutral',
        containerClassName
      )}
    >
      <DensityContext.Provider value={density}>
        <table
          ref={ref}
          data-density={density}
          className={cn('w-full text-polaris-body2 font-polaris', className)}
          {...props}
        />
      </DensityContext.Provider>
    </div>
  )
);
Table.displayName = 'Table';

export const TableHeader = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn('bg-background-alternative text-label-neutral', className)}
      {...props}
    />
  )
);
TableHeader.displayName = 'TableHeader';

export const TableBody = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn('divide-y divide-surface-border', className)}
      {...props}
    />
  )
);
TableBody.displayName = 'TableBody';

export const TableFooter = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn('bg-background-alternative text-label-neutral border-t border-line-neutral', className)}
      {...props}
    />
  )
);
TableFooter.displayName = 'TableFooter';

export const TableRow = forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn('hover:bg-background-alternative/50 transition-colors', className)}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

export const TableHead = forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => {
    const density = useContext(DensityContext);
    return (
      <th
        ref={ref}
        scope="col"
        className={cn(
          CELL_PAD_X,
          ROW_PAD[density],
          'text-left font-semibold text-polaris-caption1 uppercase tracking-wider',
          className
        )}
        {...props}
      />
    );
  }
);
TableHead.displayName = 'TableHead';

export const TableCell = forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => {
    const density = useContext(DensityContext);
    return (
      <td
        ref={ref}
        className={cn(CELL_PAD_X, ROW_PAD[density], 'text-label-normal', className)}
        {...props}
      />
    );
  }
);
TableCell.displayName = 'TableCell';

export const TableCaption = forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn('mt-2 text-polaris-caption1 text-label-alternative', className)}
      {...props}
    />
  )
);
TableCaption.displayName = 'TableCaption';
