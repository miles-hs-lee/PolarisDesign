import { forwardRef } from 'react';
import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '../lib/cn';

export const DropdownMenu = DropdownPrimitive.Root;
export const DropdownMenuTrigger = DropdownPrimitive.Trigger;
export const DropdownMenuPortal = DropdownPrimitive.Portal;
export const DropdownMenuGroup = DropdownPrimitive.Group;
export const DropdownMenuRadioGroup = DropdownPrimitive.RadioGroup;
export const DropdownMenuSub = DropdownPrimitive.Sub;

const itemBase =
  'relative flex cursor-pointer select-none items-center gap-2 rounded-polaris-sm px-2.5 py-1.5 text-polaris-body-sm font-polaris text-fg-primary outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-brand-primary-subtle data-[highlighted]:text-brand-primary';

export const DropdownMenuContent = forwardRef<
  React.ElementRef<typeof DropdownPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <DropdownPrimitive.Portal>
    <DropdownPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[10rem] overflow-hidden rounded-polaris-md border border-surface-border bg-surface-raised p-1 shadow-polaris-md',
        'text-fg-primary',
        className
      )}
      {...props}
    />
  </DropdownPrimitive.Portal>
));
DropdownMenuContent.displayName = 'DropdownMenuContent';

export interface DropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Item> {
  /** Render the item with status-danger color (for delete / destructive actions). */
  destructive?: boolean;
}

export const DropdownMenuItem = forwardRef<
  React.ElementRef<typeof DropdownPrimitive.Item>,
  DropdownMenuItemProps
>(({ className, destructive, ...props }, ref) => (
  <DropdownPrimitive.Item
    ref={ref}
    className={cn(
      itemBase,
      destructive && 'text-status-danger data-[highlighted]:bg-status-danger/10 data-[highlighted]:text-status-danger',
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = 'DropdownMenuItem';

export const DropdownMenuLabel = forwardRef<
  React.ElementRef<typeof DropdownPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Label>
>(({ className, ...props }, ref) => (
  <DropdownPrimitive.Label
    ref={ref}
    className={cn('px-2.5 py-1.5 text-polaris-caption font-semibold uppercase tracking-wider text-fg-muted', className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

export const DropdownMenuSeparator = forwardRef<
  React.ElementRef<typeof DropdownPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-surface-border', className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

export const DropdownMenuCheckboxItem = forwardRef<
  React.ElementRef<typeof DropdownPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownPrimitive.CheckboxItem
    ref={ref}
    checked={checked}
    className={cn(itemBase, 'pl-7', className)}
    {...props}
  >
    <span className="absolute left-2 inline-flex h-3.5 w-3.5 items-center justify-center">
      <DropdownPrimitive.ItemIndicator>
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
      </DropdownPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';

export const DropdownMenuRadioItem = forwardRef<
  React.ElementRef<typeof DropdownPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownPrimitive.RadioItem ref={ref} className={cn(itemBase, 'pl-7', className)} {...props}>
    <span className="absolute left-2 inline-flex h-3.5 w-3.5 items-center justify-center">
      <DropdownPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" aria-hidden="true" />
      </DropdownPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';

export const DropdownMenuSubTrigger = forwardRef<
  React.ElementRef<typeof DropdownPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.SubTrigger>
>(({ className, children, ...props }, ref) => (
  <DropdownPrimitive.SubTrigger ref={ref} className={cn(itemBase, className)} {...props}>
    {children}
    <ChevronRight className="ml-auto h-4 w-4" aria-hidden="true" />
  </DropdownPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger';

export const DropdownMenuSubContent = forwardRef<
  React.ElementRef<typeof DropdownPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-[10rem] overflow-hidden rounded-polaris-md border border-surface-border bg-surface-raised p-1 shadow-polaris-md',
      className
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = 'DropdownMenuSubContent';

/**
 * `DropdownMenuFormItem` — a menu item whose action is a form submit
 * (typical for Next.js App Router server actions: signOut, deleteSession).
 *
 * Race condition this solves: a plain `<DropdownMenuItem>` calls Radix's
 * close behavior on click, which can unmount the form before the submit
 * fires. We `event.preventDefault()` the close on Item.onSelect, then
 * trigger the form submit via the inner button's native click. Radix
 * receives focus return after submission completes.
 *
 * Usage:
 * ```tsx
 * <DropdownMenuFormItem
 *   action={signOut}                   // server action
 *   destructive
 *   icon={<LogOut className="h-4 w-4" />}
 * >
 *   로그아웃
 * </DropdownMenuFormItem>
 * ```
 */
export interface DropdownMenuFormItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Item>, 'onSelect' | 'asChild'> {
  /** Form action — string URL or server action function. */
  action: string | ((formData: FormData) => void | Promise<void>);
  /** HTTP method for string-URL actions. Default: `post`. */
  method?: 'get' | 'post';
  /** Render with status-danger color (matches DropdownMenuItem `destructive`). */
  destructive?: boolean;
  /** Icon rendered before children. */
  icon?: React.ReactNode;
  /** Form className passthrough — rare, mainly for hidden-input wrapping needs. */
  formClassName?: string;
}

export const DropdownMenuFormItem = forwardRef<
  React.ElementRef<typeof DropdownPrimitive.Item>,
  DropdownMenuFormItemProps
>(({ className, formClassName, action, method = 'post', destructive, icon, children, ...props }, ref) => (
  <DropdownPrimitive.Item
    ref={ref}
    onSelect={(e) => e.preventDefault()}
    asChild
    className={cn(
      itemBase,
      destructive && 'text-status-danger data-[highlighted]:bg-status-danger/10 data-[highlighted]:text-status-danger',
      className
    )}
    {...props}
  >
    <form
      action={action as never}
      method={typeof action === 'string' ? method : undefined}
      className={cn('m-0 w-full', formClassName)}
    >
      <button
        type="submit"
        className="flex w-full items-center gap-2 bg-transparent border-0 p-0 text-inherit cursor-pointer text-left font-inherit"
      >
        {icon}
        {children}
      </button>
    </form>
  </DropdownPrimitive.Item>
));
DropdownMenuFormItem.displayName = 'DropdownMenuFormItem';
