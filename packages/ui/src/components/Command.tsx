/**
 * @experimental — API may change in v0.5 based on feedback.
 *
 * Command palette built on `cmdk`. Use `CommandDialog` for the standard Ctrl+K
 * pattern, or compose primitives directly for inline command lists.
 *
 * Pattern (Ctrl+K palette):
 * ```tsx
 * const [open, setOpen] = useState(false);
 * useEffect(() => {
 *   const onKey = (e: KeyboardEvent) => {
 *     if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen((o) => !o); }
 *   };
 *   document.addEventListener('keydown', onKey);
 *   return () => document.removeEventListener('keydown', onKey);
 * }, []);
 *
 * <CommandDialog open={open} onOpenChange={setOpen}>
 *   <CommandInput placeholder="명령 또는 페이지 검색" />
 *   <CommandList>
 *     <CommandEmpty>결과 없음</CommandEmpty>
 *     <CommandGroup heading="자주 쓰는 페이지">
 *       <CommandItem onSelect={() => navigate('/dashboard')}>대시보드</CommandItem>
 *       <CommandItem onSelect={() => navigate('/contracts')}>계약 목록</CommandItem>
 *     </CommandGroup>
 *   </CommandList>
 * </CommandDialog>
 * ```
 */
import { forwardRef } from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '../lib/cn';

export const Command = forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'flex h-full w-full flex-col overflow-hidden rounded-polaris-md bg-surface-raised text-fg-primary font-polaris',
      className
    )}
    {...props}
  />
));
Command.displayName = 'Command';

export interface CommandDialogProps extends DialogPrimitive.DialogProps {
  /** Localized placeholder for the search input. */
  placeholder?: string;
  /** Localized empty-state message. */
  emptyLabel?: string;
}

/**
 * Modal dialog wrapping a `<Command>`. Standard Ctrl+K palette UX. Children
 * are the command list (`<CommandList>`, `<CommandGroup>`, `<CommandItem>`s).
 */
export const CommandDialog = ({
  children,
  placeholder = '명령 또는 페이지 검색',
  emptyLabel,
  ...props
}: CommandDialogProps) => (
  <DialogPrimitive.Root {...props}>
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
          'data-[state=open]:opacity-100 data-[state=closed]:opacity-0 transition-opacity duration-150'
        )}
      />
      <DialogPrimitive.Content
        className={cn(
          'fixed left-1/2 top-[20%] z-50 -translate-x-1/2',
          'w-[calc(100vw-2rem)] max-w-lg overflow-hidden',
          'bg-surface-raised border border-surface-border rounded-polaris-xl shadow-polaris-lg',
          'focus:outline-none'
        )}
      >
        <DialogPrimitive.Title className="sr-only">{placeholder}</DialogPrimitive.Title>
        <Command>
          {/* Caller composes CommandInput / CommandList inside */}
          {children ?? null}
        </Command>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>
);

export const CommandInput = forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b border-surface-border px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 text-fg-muted" aria-hidden="true" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'flex h-11 w-full bg-transparent py-3 text-polaris-body-sm outline-none',
        'placeholder:text-fg-muted disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = 'CommandInput';

export const CommandList = forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn('max-h-80 overflow-y-auto overflow-x-hidden p-1', className)}
    {...props}
  />
));
CommandList.displayName = 'CommandList';

export const CommandEmpty = forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className={cn('py-6 text-center text-polaris-body-sm text-fg-muted', className)}
    {...props}
  />
));
CommandEmpty.displayName = 'CommandEmpty';

export const CommandGroup = forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'overflow-hidden text-fg-primary',
      '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-polaris-caption [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-fg-muted',
      className
    )}
    {...props}
  />
));
CommandGroup.displayName = 'CommandGroup';

export const CommandSeparator = forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-surface-border', className)}
    {...props}
  />
));
CommandSeparator.displayName = 'CommandSeparator';

export const CommandItem = forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center gap-2 rounded-polaris-sm px-2.5 py-1.5 text-polaris-body-sm outline-none',
      'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
      'data-[selected=true]:bg-brand-primary-subtle data-[selected=true]:text-brand-primary',
      className
    )}
    {...props}
  />
));
CommandItem.displayName = 'CommandItem';

export const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      'ml-auto text-polaris-caption tracking-widest text-fg-muted',
      className
    )}
    {...props}
  />
);
CommandShortcut.displayName = 'CommandShortcut';
