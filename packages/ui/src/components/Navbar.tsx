import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../lib/cn';

export const Navbar = forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => (
    <header
      ref={ref}
      className={cn(
        'flex items-center gap-4 h-14 px-4',
        'bg-background-normal border-b border-line-neutral',
        className
      )}
      {...props}
    >
      {children}
    </header>
  )
);
Navbar.displayName = 'Navbar';

export interface NavbarBrandProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Render the child element instead of `<div>`. Useful for Link wrapping. */
  asChild?: boolean;
}

export const NavbarBrand = forwardRef<HTMLDivElement, NavbarBrandProps>(
  ({ className, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return <Comp ref={ref} className={cn('flex items-center gap-2 shrink-0', className)} {...props} />;
  }
);
NavbarBrand.displayName = 'NavbarBrand';

export const NavbarNav = forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <nav ref={ref} className={cn('flex items-center gap-1 flex-1 min-w-0 overflow-x-auto', className)} {...props} />
  )
);
NavbarNav.displayName = 'NavbarNav';

export const NavbarActions = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-2 shrink-0 ml-auto', className)} {...props} />
  )
);
NavbarActions.displayName = 'NavbarActions';
