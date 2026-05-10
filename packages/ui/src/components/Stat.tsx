import { forwardRef, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

/**
 * Stat — KPI / metric tile.
 *
 * Use for the top-of-dashboard counters that summarize an entity:
 * "조회수 1,234 / +12%". Three slots, all optional except `value`:
 *
 *   - `label`     — what the number measures (e.g. "조회수")
 *   - `value`     — the headline number (string or node — pre-format on the
 *                   call site so locale/units stay your concern)
 *   - `delta`     — change indicator (e.g. "+12%"); `tone` colors it
 *   - `icon`      — leading icon (16-24 px)
 *   - `helper`    — small text below the value (e.g. comparison window)
 *
 * Tones for the `delta` indicator:
 *   - `neutral`  — `label-neutral` (default)
 *   - `positive` — `state-success`  (e.g. "+12%")
 *   - `negative` — `state-error`    (e.g. "-3%")
 *   - `accent`   — `accent-brand-normal`
 *
 * Stat does NOT render its own card. Wrap in a `<Card>` (or compose
 * a grid of Stats) to get the surface — keeps composition flexible
 * for dashboard layouts that need their own border/spacing.
 *
 * Always pair the visual delta with a sign (+/-) so negative values
 * are conveyed via more than the red color alone (WCAG 1.4.1).
 *
 * @example
 * ```tsx
 * <Card variant="padded">
 *   <Stat label="조회수" value="1,234" delta="+12%" deltaTone="positive" />
 * </Card>
 * ```
 *
 * @example Grid of stats
 * ```tsx
 * <div className="grid grid-cols-2 md:grid-cols-4 gap-polaris-md">
 *   <Card variant="padded"><Stat label="조회" value={views} /></Card>
 *   <Card variant="padded"><Stat label="고유 방문" value={unique} /></Card>
 *   <Card variant="padded"><Stat label="다운로드" value={downloads} /></Card>
 *   <Card variant="padded"><Stat label="차단" value={denied} deltaTone="negative" /></Card>
 * </div>
 * ```
 */

const deltaVariants = cva(
  'inline-flex items-center gap-polaris-4xs text-polaris-helper font-medium',
  {
    variants: {
      tone: {
        neutral:  'text-label-neutral',
        positive: 'text-state-success',
        negative: 'text-state-error',
        accent:   'text-accent-brand-normal',
      },
    },
    defaultVariants: { tone: 'neutral' },
  }
);

export interface StatProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** What the value measures (e.g. "조회수"). */
  label: ReactNode;
  /** The headline number. Pre-format strings on the call site. */
  value: ReactNode;
  /** Change indicator (e.g. "+12%"). Color via `deltaTone`. */
  delta?: ReactNode;
  /** Color tone for `delta`. Default: `"neutral"`. */
  deltaTone?: VariantProps<typeof deltaVariants>['tone'];
  /** Leading icon (16-24px). Renders to the left of the label. */
  icon?: ReactNode;
  /** Small text below the value (e.g. comparison window: "지난 7일 기준"). */
  helper?: ReactNode;
}

export const Stat = forwardRef<HTMLDivElement, StatProps>(
  ({ className, label, value, delta, deltaTone, icon, helper, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col gap-polaris-3xs font-polaris', className)}
        {...props}
      >
        <div className="flex items-center gap-polaris-3xs text-polaris-body2 text-label-neutral">
          {icon && (
            <span className="inline-flex items-center justify-center text-label-alternative [&>svg]:h-4 [&>svg]:w-4" aria-hidden="true">
              {icon}
            </span>
          )}
          <span>{label}</span>
        </div>
        <div className="flex items-baseline gap-polaris-2xs">
          <span className="text-polaris-heading1 text-label-normal">{value}</span>
          {delta && (
            <span className={cn(deltaVariants({ tone: deltaTone }))}>{delta}</span>
          )}
        </div>
        {helper && (
          <p className="text-polaris-helper text-label-alternative">{helper}</p>
        )}
      </div>
    );
  }
);
Stat.displayName = 'Stat';
