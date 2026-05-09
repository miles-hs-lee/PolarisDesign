import { forwardRef, useId } from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon, MinusIcon, ErrorIcon } from '../icons';
import { cn } from '../lib/cn';

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /** Visible label rendered to the right of the box. Wires up htmlFor. */
  label?: React.ReactNode;
  /** Helper text below the label. */
  hint?: React.ReactNode;
  /** Error message below the label. Sets aria-invalid and recolors text. */
  error?: React.ReactNode;
  /** Container class — applied to the wrapper, not the box itself. */
  containerClassName?: string;
}

export const Checkbox = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, containerClassName, checked, label, hint, error, id: providedId, ...props }, ref) => {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const messageId = error || hint ? `${id}-msg` : undefined;
  const isError = Boolean(error);

  const box = (
    <CheckboxPrimitive.Root
      id={id}
      ref={ref}
      checked={checked}
      aria-invalid={isError || undefined}
      aria-describedby={messageId}
      className={cn(
        'peer inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-polaris-sm border border-line-normal bg-background-normal text-label-inverse transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-accent-brand-normal data-[state=checked]:border-brand-primary',
        'data-[state=indeterminate]:bg-accent-brand-normal data-[state=indeterminate]:border-brand-primary',
        isError && 'border-state-error focus-visible:outline-state-error',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        {checked === 'indeterminate' ? (
          <MinusIcon size={12} aria-hidden="true" />
        ) : (
          <CheckIcon size={12} aria-hidden="true" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (!label && !hint && !error) return box;

  return (
    <div className={cn('flex items-start gap-2', containerClassName)}>
      {box}
      <div className="flex flex-col gap-0.5 -mt-0.5">
        {label && (
          <label
            htmlFor={id}
            className="text-polaris-body2 text-label-normal cursor-pointer select-none"
          >
            {label}
          </label>
        )}
        {(error || hint) && (
          // 에러: ErrorIcon 동반 (DESIGN.md §4 / WCAG 1.4.1)
          // 힌트: 텍스트만
          <p
            id={messageId}
            className={cn(
              'text-polaris-helper',
              isError ? 'flex items-start gap-polaris-3xs text-state-error' : 'text-label-alternative'
            )}
            role={isError ? 'alert' : undefined}
          >
            {isError && <ErrorIcon size={16} className="shrink-0 mt-px" aria-hidden="true" />}
            <span>{error ?? hint}</span>
          </p>
        )}
      </div>
    </div>
  );
});
Checkbox.displayName = 'Checkbox';
