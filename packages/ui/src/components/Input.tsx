import { forwardRef, useId, useState, useImperativeHandle, useRef, type FocusEvent, type ChangeEvent } from 'react';
import { ErrorIcon } from '../icons';
import { cn } from '../lib/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Floating title — appears as a small label inside the input on focus
   *  or when the field has a value. Replaces the rc.0 above-input label
   *  per DESIGN.md §4. */
  label?: string;
  hint?: string;
  /** Error message — automatically rendered below the input with a
   *  mandatory ⚠️ icon (WCAG 1.4.1: never communicate state via color
   *  alone). Pass `null` / `undefined` to clear. */
  error?: string;
  containerClassName?: string;
}

/**
 * Input — v0.7-rc.1 spec (DESIGN.md §4).
 *
 *   height       52px
 *   h-padding    20px
 *   radius       8px (sm)
 *   font         body2 (14 / Regular)
 *   border       line-neutral (default), accent-brand-normal (focus),
 *                state-error (error)
 *   placeholder  label-assistive
 *
 * Floating title pattern: when `label` is provided, the label sits
 * inside the input. Empty + blurred → label centered (placeholder-style).
 * Focus or filled → label shrinks + lifts to the top of the input,
 * leaving room for the user-typed value below.
 *
 * Error text: when `error` is provided, the input border turns red AND
 * an icon-prefixed error message renders below. The icon is mandatory
 * (WCAG 1.4.1) — never rely on color alone to signal state.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, containerClassName, label, hint, error, id: providedId, onFocus, onBlur, onChange, value, defaultValue, placeholder, ...props }, forwardedRef) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;
    const messageId = error || hint ? `${id}-msg` : undefined;
    const isError = Boolean(error);

    // Track focus + value presence for floating-label behavior.
    // We don't fully control the input — just observe enough to know
    // whether the label should float.
    const localRef = useRef<HTMLInputElement | null>(null);
    useImperativeHandle(forwardedRef, () => localRef.current as HTMLInputElement);
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(
      value !== undefined ? Boolean(value) : Boolean(defaultValue)
    );
    const labelFloating = focused || hasValue;

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(e);
    };
    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      onBlur?.(e);
    };
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setHasValue(Boolean(e.target.value));
      onChange?.(e);
    };

    return (
      <div className={cn('flex flex-col gap-polaris-3xs', containerClassName)}>
        <div className="relative">
          {label && (
            <label
              htmlFor={id}
              className={cn(
                'pointer-events-none absolute left-5 font-polaris transition-all duration-polaris-fast ease-polaris-out',
                labelFloating
                  ? 'top-2 text-polaris-caption1 text-label-assistive'
                  : 'top-1/2 -translate-y-1/2 text-polaris-body2 text-label-assistive'
              )}
            >
              {label}
            </label>
          )}
          <input
            id={id}
            ref={localRef}
            aria-invalid={isError || undefined}
            aria-describedby={messageId}
            placeholder={labelFloating || !label ? placeholder : ''}
            value={value}
            defaultValue={defaultValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            className={cn(
              // 52px height + 20px h-padding + sm radius (8) per spec.
              // pt-5/pb-1 when label is floating reserves space for it.
              'h-[52px] w-full rounded-polaris-sm font-polaris text-polaris-body2',
              label ? 'pt-5 pb-1 px-5' : 'px-5',
              'bg-background-base text-label-normal placeholder:text-label-assistive',
              'border border-line-neutral',
              'transition-colors duration-polaris-fast',
              'focus-visible:outline-none focus-visible:border-accent-brand-normal',
              'disabled:bg-background-disabled disabled:border-line-disabled disabled:text-label-disabled disabled:cursor-not-allowed',
              isError && 'border-state-error focus-visible:border-state-error',
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <p
            id={messageId}
            className="flex items-start gap-polaris-3xs text-polaris-caption1 text-state-error"
            role="alert"
          >
            <ErrorIcon size={16} className="shrink-0 mt-px" aria-hidden="true" />
            <span>{error}</span>
          </p>
        ) : hint ? (
          <p id={messageId} className="text-polaris-caption1 text-label-alternative">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';
