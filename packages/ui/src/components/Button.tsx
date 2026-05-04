import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-polaris-md font-polaris font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary',
  {
    variants: {
      variant: {
        primary: 'bg-brand-primary text-fg-on-brand hover:bg-brand-primary-hover',
        secondary: 'bg-brand-secondary text-fg-on-brand hover:bg-brand-secondary-hover',
        outline:
          'bg-surface-raised text-fg-primary border border-surface-border-strong hover:bg-brand-primary-subtle',
        ghost: 'bg-transparent text-fg-primary hover:bg-brand-primary-subtle',
        danger: 'bg-status-danger text-fg-on-brand hover:opacity-90',
      },
      size: {
        sm: 'text-polaris-body-sm h-8 px-3',
        md: 'text-polaris-body-sm h-10 px-4',
        lg: 'text-polaris-body-lg h-12 px-6',
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
