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
            className="text-polaris-body-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          aria-invalid={isError || undefined}
          aria-describedby={messageId}
          className={cn(
            'h-10 px-3 rounded-polaris-md text-polaris-body-sm font-polaris',
            'bg-surface-raised text-text-primary placeholder:text-text-muted',
            'border border-surface-border-strong',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:border-brand-primary',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            isError && 'border-status-danger focus-visible:ring-status-danger focus-visible:border-status-danger',
            className
          )}
          {...props}
        />
        {(error || hint) && (
          <p
            id={messageId}
            className={cn(
              'text-polaris-caption',
              isError ? 'text-status-danger' : 'text-text-muted'
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
