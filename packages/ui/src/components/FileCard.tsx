import { forwardRef } from 'react';
import { cn } from '../lib/cn';
import { FileIcon, type FileType } from './FileIcon';

export interface FileCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  type: FileType;
  name: string;
  meta?: React.ReactNode;
  trailing?: React.ReactNode;
  asLink?: boolean;
  href?: string;
}

export const FileCard = forwardRef<HTMLDivElement, FileCardProps>(
  ({ className, type, name, meta, trailing, asLink, href, onClick, ...props }, ref) => {
    const interactive = Boolean(asLink || href || onClick);
    const Comp: any = asLink || href ? 'a' : 'div';

    return (
      <Comp
        ref={ref}
        href={href}
        onClick={onClick}
        className={cn(
          'flex items-center gap-3 rounded-polaris-md bg-surface-raised border border-surface-border p-3',
          interactive &&
            'hover:bg-brand-primary-subtle hover:border-surface-border-strong transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
          className
        )}
        {...props}
      >
        <FileIcon type={type} size="md" />
        <div className="flex-1 min-w-0">
          <div className="text-polaris-body-sm font-medium text-text-primary truncate">{name}</div>
          {meta && (
            <div className="text-polaris-caption text-text-muted truncate mt-0.5">{meta}</div>
          )}
        </div>
        {trailing && <div className="shrink-0">{trailing}</div>}
      </Comp>
    );
  }
);
FileCard.displayName = 'FileCard';
