/**
 * @experimental — API may change in v0.5 based on feedback.
 *
 * Calendar — `react-day-picker` v9 wrapped with Polaris tokens.
 * Korean locale (`ko`) by default.
 *
 * For a popover-driven date input, see `<DatePicker>`.
 */
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker, type DayPickerProps } from 'react-day-picker';
import { cn } from '../lib/cn';

export type CalendarProps = DayPickerProps;

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  locale = ko,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={locale}
      className={cn('p-3 font-polaris text-polaris-body-sm text-fg-primary', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row gap-4',
        month: 'flex flex-col gap-3',
        month_caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-polaris-body-sm font-semibold',
        nav: 'flex items-center justify-between absolute inset-x-1 top-1',
        button_previous: cn(
          'inline-flex h-7 w-7 items-center justify-center rounded-polaris-sm text-fg-muted hover:bg-brand-primary-subtle hover:text-fg-primary',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary'
        ),
        button_next: cn(
          'inline-flex h-7 w-7 items-center justify-center rounded-polaris-sm text-fg-muted hover:bg-brand-primary-subtle hover:text-fg-primary',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary'
        ),
        month_grid: 'w-full border-collapse',
        weekdays: 'flex',
        weekday: 'text-fg-muted w-9 text-polaris-caption font-normal',
        week: 'flex w-full mt-1',
        day: 'relative p-0 text-center w-9 h-9',
        day_button: cn(
          'inline-flex h-9 w-9 items-center justify-center rounded-polaris-md text-polaris-body-sm font-normal transition-colors',
          'hover:bg-brand-primary-subtle hover:text-brand-primary',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary',
          'aria-selected:opacity-100'
        ),
        selected: '[&>button]:bg-brand-primary [&>button]:text-fg-on-brand [&>button]:hover:bg-brand-primary-hover [&>button]:hover:text-fg-on-brand',
        today: '[&>button]:font-semibold [&>button]:text-brand-primary',
        outside: '[&>button]:text-fg-muted [&>button]:opacity-50',
        disabled: '[&>button]:text-fg-muted [&>button]:opacity-50 [&>button]:pointer-events-none',
        range_start: '[&>button]:rounded-r-none',
        range_end: '[&>button]:rounded-l-none',
        range_middle: '[&>button]:rounded-none [&>button]:bg-brand-primary-subtle [&>button]:text-brand-primary',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === 'left' ? (
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';
