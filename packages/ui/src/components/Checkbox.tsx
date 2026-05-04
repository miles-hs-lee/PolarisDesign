import { forwardRef, useId } from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
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
        'peer inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-polaris-sm border border-surface-border-strong bg-surface-raised text-fg-on-brand transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary',
        'data-[state=indeterminate]:bg-brand-primary data-[state=indeterminate]:border-brand-primary',
        isError && 'border-status-danger focus-visible:outline-status-danger',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        {checked === 'indeterminate' ? (
          <Minus className="h-3 w-3" aria-hidden="true" />
        ) : (
          <Check className="h-3 w-3" aria-hidden="true" />
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
            className="text-polaris-body-sm text-fg-primary cursor-pointer select-none"
          >
            {label}
          </label>
        )}
        {(error || hint) && (
          <p
            id={messageId}
            className={cn(
              'text-polaris-caption',
              isError ? 'text-status-danger' : 'text-fg-muted'
            )}
          >
            {error ?? hint}
          </p>
        )}
      </div>
    </div>
  );
});
Checkbox.displayName = 'Checkbox';
