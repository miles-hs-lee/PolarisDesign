import { forwardRef } from 'react';
import { cn } from '../lib/cn';

export interface PromptChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Optional icon shown at the start (typically a lucide icon at h-4 w-4). */
  icon?: React.ReactNode;
}

/**
 * Polaris-specific suggestion chip used under NovaInput.
 *
 *   <PromptChip icon={<Search className="h-4 w-4" />}>
 *     2025년 소비자 트렌드를 산업별로 심층 조사해줘
 *   </PromptChip>
 */
export const PromptChip = forwardRef<HTMLButtonElement, PromptChipProps>(
  ({ className, icon, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        'group inline-flex items-start gap-2 rounded-polaris-lg',
        'bg-surface-raised border border-surface-border px-4 py-3 text-left',
        'text-polaris-body-sm font-polaris text-fg-primary',
        'hover:border-brand-secondary hover:bg-brand-secondary-subtle transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary',
        'shadow-polaris-xs',
        'min-h-12',
        className
      )}
      {...props}
    >
      {icon && (
        <span
          className={cn(
            'inline-flex h-5 w-5 items-center justify-center text-fg-muted shrink-0 mt-0.5',
            'group-hover:text-brand-secondary transition-colors'
          )}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <span className="flex-1 leading-snug">{children}</span>
    </button>
  )
);
PromptChip.displayName = 'PromptChip';
