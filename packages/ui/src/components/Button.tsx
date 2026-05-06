import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/cn';

// v1 spec (2026.05): 6 variants × 3 sizes.
// - Sizes follow spec heights (26 / 32 / 40px) with matching radius and
//   font scale. Each size's radius is applied at the size level so cva
//   can vary it without a base override.
// - The new `ai` variant uses AI Purple tokens for AI-context buttons
//   (NOVA chat, prompt actions). Never use it on general product UI.
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-polaris font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary',
  {
    variants: {
      variant: {
        primary:   'bg-primary-normal text-label-inverse hover:bg-primary-strong',
        secondary: 'bg-ai-normal text-label-inverse hover:bg-ai-strong',
        ai:        'bg-ai-normal text-label-inverse hover:bg-ai-strong focus-visible:outline-ai-normal',
        outline:   'bg-background-normal text-label-normal border border-line-normal hover:bg-fill-normal',
        ghost:     'bg-transparent text-label-normal hover:bg-fill-normal',
        danger:    'bg-status-danger text-label-inverse hover:bg-status-danger-hover',
      },
      size: {
        // 26 / 10 / radius 6 / 12px
        sm: 'h-[26px] px-2.5 rounded-polaris-sm text-polaris-meta',
        // 32 / 14 / radius 8 / 14px
        md: 'h-8 px-3.5 rounded-polaris-md text-polaris-body-sm',
        // 40 / 18 / radius 8 / 14px
        lg: 'h-10 px-[18px] rounded-polaris-md text-polaris-body-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render the underlying element provided as children (e.g. <Link>) instead of <button>. */
  asChild?: boolean;
  /** Show a spinner before the children and disable interaction. */
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { buttonVariants };
