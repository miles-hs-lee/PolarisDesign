import { forwardRef, useId } from 'react';
import { cn } from '../lib/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, label, hint, error, id: providedId, rows = 4, ...props }, ref) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;
    const messageId = error || hint ? `${id}-msg` : undefined;
    const isError = Boolean(error);

    return (
      <div className={cn('flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={id}
            className="text-polaris-body-sm font-medium text-label-normal"
          >
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          rows={rows}
          aria-invalid={isError || undefined}
          aria-describedby={messageId}
          className={cn(
            'px-3 py-2 rounded-polaris-md text-polaris-body-sm font-polaris',
            'bg-background-normal text-label-normal placeholder:text-label-alternative',
            'border border-line-normal resize-vertical',
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
              'text-polaris-meta',
              isError ? 'text-status-danger' : 'text-label-alternative'
            )}
          >
            {error ?? hint}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
