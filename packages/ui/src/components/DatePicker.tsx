/**
 * @experimental — API may change in v0.5 based on feedback.
 *
 * DatePicker — Input + Calendar in a Popover. Single-date version.
 * Korean locale by default; format via `date-fns`.
 *
 * For range, see `<DateRangePicker>`.
 */
import { forwardRef, useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import type { Locale } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { Popover, PopoverTrigger, PopoverContent } from './Popover';
import { Calendar } from './Calendar';
import { Button } from './Button';
import { cn } from '../lib/cn';

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  /** Display format (date-fns). Default: `yyyy-MM-dd`. */
  formatStr?: string;
  locale?: Locale;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** aria-label for the trigger. */
  ariaLabel?: string;
}

export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
  ({
    value,
    onChange,
    formatStr = 'yyyy-MM-dd',
    locale = ko,
    placeholder = '날짜 선택',
    disabled,
    className,
    ariaLabel = '날짜 선택',
  }, ref) => {
    const [open, setOpen] = useState(false);
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="tertiary"
            disabled={disabled}
            aria-label={ariaLabel}
            className={cn('w-full justify-start font-normal', !value && 'text-label-alternative', className)}
          >
            <CalendarIcon className="h-4 w-4" />
            {value ? format(value, formatStr, { locale }) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(d) => {
              onChange?.(d);
              if (d) setOpen(false);
            }}
            locale={locale}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    );
  }
);
DatePicker.displayName = 'DatePicker';

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  formatStr?: string;
  locale?: Locale;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const DateRangePicker = forwardRef<HTMLButtonElement, DateRangePickerProps>(
  ({
    value,
    onChange,
    formatStr = 'yyyy-MM-dd',
    locale = ko,
    placeholder = '기간 선택',
    disabled,
    className,
    ariaLabel = '기간 선택',
  }, ref) => {
    const [open, setOpen] = useState(false);
    const display = value?.from
      ? value.to
        ? `${format(value.from, formatStr, { locale })} ~ ${format(value.to, formatStr, { locale })}`
        : format(value.from, formatStr, { locale })
      : placeholder;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="tertiary"
            disabled={disabled}
            aria-label={ariaLabel}
            className={cn('w-full justify-start font-normal', !value?.from && 'text-label-alternative', className)}
          >
            <CalendarIcon className="h-4 w-4" />
            {display}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start">
          <Calendar
            mode="range"
            selected={value}
            onSelect={onChange}
            locale={locale}
            numberOfMonths={2}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    );
  }
);
DateRangePicker.displayName = 'DateRangePicker';
