import { forwardRef } from 'react';
import { cn } from '../lib/cn';

export const Skeleton = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('animate-pulse rounded-polaris-md bg-background-alternative', className)}
      {...props}
    />
  )
);
Skeleton.displayName = 'Skeleton';
