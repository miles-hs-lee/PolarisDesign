import { forwardRef, useState, useId } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { cn } from '../lib/cn';

export interface NovaInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onSubmit'> {
  /** Called when the user presses Enter or clicks the send button. Empty values are ignored. */
  onSubmit?: (value: string) => void;
  /** Show the sparkle icon at the start. Defaults true. */
  showIcon?: boolean;
  /** Class applied to the outer rounded container (border / bg / padding). */
  containerClassName?: string;
  /** Accessible label for the send button. */
  sendLabel?: string;
}

export const NovaInput = forwardRef<HTMLInputElement, NovaInputProps>(
  (
    {
      className,
      containerClassName,
      onSubmit,
      onKeyDown,
      onChange,
      value: controlledValue,
      defaultValue,
      placeholder = 'NOVA에게 무엇이든 물어보기',
      showIcon = true,
      sendLabel = 'Send',
      disabled,
      id: providedId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;
    const isControlled = controlledValue !== undefined;
    const [innerValue, setInnerValue] = useState(defaultValue?.toString() ?? '');
    const value = isControlled ? (controlledValue as string) : innerValue;

    const submit = () => {
      if (disabled) return;
      const v = (value ?? '').trim();
      if (!v) return;
      onSubmit?.(v);
      if (!isControlled) setInnerValue('');
    };

    return (
      <div
        className={cn(
          'flex items-center gap-2 rounded-polaris-full bg-surface-raised',
          'border-2 border-brand-secondary',
          'pl-4 pr-1.5 py-1.5',
          'shadow-polaris-sm',
          'focus-within:ring-2 focus-within:ring-brand-secondary/30',
          disabled && 'opacity-60',
          containerClassName
        )}
      >
        {showIcon && (
          <Sparkles
            className="h-5 w-5 text-brand-secondary shrink-0"
            aria-hidden="true"
          />
        )}
        <input
          id={id}
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => {
            if (!isControlled) setInnerValue(e.target.value);
            onChange?.(e);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
            onKeyDown?.(e);
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'flex-1 bg-transparent border-none outline-none text-polaris-body-sm font-polaris text-fg-primary placeholder:text-fg-muted py-1 min-w-0',
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={submit}
          disabled={disabled || !value?.trim()}
          aria-label={sendLabel}
          className={cn(
            'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-polaris-full',
            'bg-brand-secondary text-fg-on-brand',
            'hover:bg-brand-secondary-hover',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary',
            'transition-colors'
          )}
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    );
  }
);
NovaInput.displayName = 'NovaInput';
