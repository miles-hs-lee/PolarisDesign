/**
 * Ribbon — toolbar pattern for editor-style products (Office docs, MD editor,
 * spreadsheet, presentation, PDF tools). Compact density, icon-first buttons,
 * grouped layout with vertical separators, optional tabs across the top.
 *
 * Composable primitives — use just what you need:
 * - `<Ribbon>` — root container
 * - `<RibbonTabs>` / `<RibbonTab>` / `<RibbonContent>` — tabbed mode (Office-style)
 * - `<RibbonGroup>` — vertical group with optional bottom label
 * - `<RibbonSeparator>` — vertical divider between groups
 * - `<RibbonButton>` — icon button (size: `sm` icon-only, `lg` icon-over-label)
 * - `<RibbonSplitButton>` — main action + dropdown chevron
 * - `<RibbonToggleGroup>` / `<RibbonToggleItem>` — single/multiple selection toggles
 *
 * Tab-less single-panel example (MD editor):
 * ```tsx
 * <Ribbon>
 *   <RibbonGroup label="서식">
 *     <RibbonToggleGroup type="multiple" value={marks} onValueChange={setMarks}>
 *       <RibbonToggleItem value="bold" icon={<Bold />} tooltip="굵게 (⌘B)" />
 *       <RibbonToggleItem value="italic" icon={<Italic />} tooltip="기울임 (⌘I)" />
 *     </RibbonToggleGroup>
 *   </RibbonGroup>
 * </Ribbon>
 * ```
 */
import { forwardRef, useState, type ReactNode } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { Slot } from '@radix-ui/react-slot';
import { ChevronDown } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';
import { SimpleTooltip } from '../components/Tooltip';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '../components/DropdownMenu';

/* ----- Root ----- */

export const Ribbon = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'font-polaris text-fg-primary bg-surface-raised border-b border-surface-border',
        className
      )}
      {...props}
    />
  )
);
Ribbon.displayName = 'Ribbon';

/* ----- Tabs (Office-style: 파일 / 홈 / 삽입 / ...) ----- */

export const RibbonTabs = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Root ref={ref} className={cn('flex flex-col', className)} {...props} />
));
RibbonTabs.displayName = 'RibbonTabs';

export const RibbonTabList = forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'flex items-center gap-4 px-4 h-9 border-b border-surface-border',
      className
    )}
    {...props}
  />
));
RibbonTabList.displayName = 'RibbonTabList';

export const RibbonTab = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'relative inline-flex items-center px-1 py-1.5 text-polaris-body-sm text-fg-muted transition-colors',
      'hover:text-fg-primary',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary',
      'data-[state=active]:text-fg-primary data-[state=active]:font-semibold',
      'data-[state=active]:after:absolute data-[state=active]:after:inset-x-0 data-[state=active]:after:-bottom-px data-[state=active]:after:h-0.5 data-[state=active]:after:bg-brand-primary',
      className
    )}
    {...props}
  />
));
RibbonTab.displayName = 'RibbonTab';

export const RibbonContent = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'flex items-stretch gap-1 px-2 py-1.5 overflow-x-auto',
      'focus-visible:outline-none',
      className
    )}
    {...props}
  />
));
RibbonContent.displayName = 'RibbonContent';

/* ----- Group + Separator ----- */

export interface RibbonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional small label rendered below the group items. */
  label?: ReactNode;
}

export const RibbonGroup = forwardRef<HTMLDivElement, RibbonGroupProps>(
  ({ className, label, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-stretch px-2 py-0.5 min-w-fit',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-1 flex-1">{children}</div>
      {label && (
        <div className="mt-0.5 text-center text-polaris-caption text-fg-muted leading-tight whitespace-pre-line">
          {label}
        </div>
      )}
    </div>
  )
);
RibbonGroup.displayName = 'RibbonGroup';

export const RibbonSeparator = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      aria-orientation="vertical"
      className={cn('mx-1 my-1 w-px bg-surface-border', className)}
      {...props}
    />
  )
);
RibbonSeparator.displayName = 'RibbonSeparator';

/* ----- RibbonButton ----- */

const ribbonButtonStyles = cva(
  cn(
    'inline-flex items-center justify-center gap-1 rounded-polaris-sm text-fg-primary transition-colors',
    'hover:bg-brand-primary-subtle',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary',
    'disabled:opacity-40 disabled:pointer-events-none aria-disabled:opacity-40 aria-disabled:pointer-events-none',
    'data-[state=on]:bg-brand-primary-subtle data-[state=on]:text-brand-primary'
  ),
  {
    variants: {
      size: {
        sm: 'h-8 min-w-8 px-1.5 text-polaris-body-sm',
        md: 'h-9 min-w-9 px-2 text-polaris-body-sm',
        lg: 'flex-col h-14 min-w-14 px-2 py-1 text-polaris-caption gap-0.5',
      },
    },
    defaultVariants: { size: 'sm' },
  }
);

export interface RibbonButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ribbonButtonStyles> {
  /** Leading icon. For `size="lg"` it's stacked above the label. */
  icon?: ReactNode;
  /** Optional tooltip. Useful when the button is icon-only. */
  tooltip?: ReactNode;
  /** Render as the child element (e.g. for `<Link>` wrap). */
  asChild?: boolean;
}

export const RibbonButton = forwardRef<HTMLButtonElement, RibbonButtonProps>(
  ({ className, size, icon, tooltip, asChild, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const inner = (
      // eslint-disable-next-line @polaris/prefer-polaris-component -- primitive layer
      <Comp
        ref={ref as never}
        type={asChild ? undefined : 'button'}
        className={cn(ribbonButtonStyles({ size }), className)}
        {...props}
      >
        {icon}
        {children && (
          <span className={cn(size === 'lg' && 'leading-tight whitespace-pre-line text-center')}>{children}</span>
        )}
      </Comp>
    );
    if (tooltip) {
      return <SimpleTooltip label={tooltip}>{inner}</SimpleTooltip>;
    }
    return inner;
  }
);
RibbonButton.displayName = 'RibbonButton';

/* ----- RibbonSplitButton ----- */

export interface RibbonSplitButtonProps extends Omit<RibbonButtonProps, 'children'> {
  /** Main action button label / content. */
  children?: ReactNode;
  /** Dropdown panel content. */
  menu: ReactNode;
  /** Tooltip for the dropdown chevron specifically. */
  menuTooltip?: ReactNode;
  /** aria-label for the chevron when there's no visible label. */
  menuLabel?: string;
}

export const RibbonSplitButton = forwardRef<HTMLButtonElement, RibbonSplitButtonProps>(
  ({ className, size = 'sm', icon, tooltip, children, menu, menuTooltip, menuLabel = '더보기', onClick, ...props }, ref) => (
    <div className={cn('inline-flex rounded-polaris-sm hover:bg-brand-primary-subtle', className)}>
      <RibbonButton
        ref={ref}
        size={size}
        icon={icon}
        tooltip={tooltip}
        onClick={onClick}
        className="rounded-r-none hover:bg-transparent"
        {...props}
      >
        {children}
      </RibbonButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <RibbonButton
            size={size}
            tooltip={menuTooltip}
            aria-label={menuLabel}
            className="rounded-l-none px-1 hover:bg-transparent"
            icon={<ChevronDown className="h-3 w-3" aria-hidden="true" />}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">{menu}</DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
);
RibbonSplitButton.displayName = 'RibbonSplitButton';

/* ----- ToggleGroup / ToggleItem ----- */

type ToggleGroupRootProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>;

export const RibbonToggleGroup = forwardRef<HTMLDivElement, ToggleGroupRootProps>(
  ({ className, ...props }, ref) => {
    const Root = ToggleGroupPrimitive.Root as React.ForwardRefExoticComponent<
      ToggleGroupRootProps & React.RefAttributes<HTMLDivElement>
    >;
    return (
      <Root
        ref={ref}
        className={cn('inline-flex items-center gap-0.5', className)}
        {...props}
      />
    );
  }
);
RibbonToggleGroup.displayName = 'RibbonToggleGroup';

export interface RibbonToggleItemProps
  extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>,
    VariantProps<typeof ribbonButtonStyles> {
  icon?: ReactNode;
  tooltip?: ReactNode;
}

export const RibbonToggleItem = forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  RibbonToggleItemProps
>(({ className, size, icon, tooltip, children, ...props }, ref) => {
  const inner = (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(ribbonButtonStyles({ size }), className)}
      {...props}
    >
      {icon}
      {children}
    </ToggleGroupPrimitive.Item>
  );
  if (tooltip) {
    return <SimpleTooltip label={tooltip}>{inner}</SimpleTooltip>;
  }
  return inner;
});
RibbonToggleItem.displayName = 'RibbonToggleItem';

export { ribbonButtonStyles };
