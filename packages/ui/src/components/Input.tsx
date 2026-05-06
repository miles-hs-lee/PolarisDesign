import { forwardRef, useId } from 'react';
import { cn } from '../lib/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, containerClassName, label, hint, error, id: providedId, ...props }, ref) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;
    const messageId = error || hint ? `${id}-msg` : undefined;
    const isError = Boolean(error);

    return (
      <div className={cn('flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={id}
            className="text-polaris-body-sm font-medium text-fg-primary"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          aria-invalid={isError || undefined}
          aria-describedby={messageId}
          // v1 spec (2026.05): 36px height, 8px radius, 1px line.normal
          // border, focus = 1px PO Blue + 3px outer glow at 25% alpha.
          className={cn(
            'h-9 px-3 rounded-polaris-md text-polaris-body-sm font-polaris',
            'bg-surface-raised text-fg-primary placeholder:text-fg-muted',
            'border border-line-normal',
            'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-primary/25 focus-visible:border-brand-primary',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            isError && 'border-status-danger focus-visible:ring-status-danger/25 focus-visible:border-status-danger',
            className
          )}
          {...props}
        />
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
    );
  }
);
Input.displayName = 'Input';
