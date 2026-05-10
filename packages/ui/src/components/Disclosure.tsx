import { forwardRef, type ReactNode } from 'react';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/cn';

/**
 * Disclosure — single show/hide section, built on Radix Collapsible.
 *
 * Use for sectional reveal patterns where one toggle controls one
 * region: "고급 설정", "문서 묶음 생성", FAQ items, optional fieldsets.
 * For grouped multi-item reveal (one open at a time / multiple open),
 * use a future Accordion — Disclosure is the single-item primitive.
 *
 * Accessibility:
 *   - Trigger renders as a `<button>` with `aria-expanded`/`aria-controls`
 *     wired by Radix. Keyboard: Enter/Space toggles.
 *   - Content unmounts when closed by default. Pass `forceMount` on the
 *     content (Radix prop) if you need to keep DOM around (form fields).
 *
 * Three usage modes — pick whichever matches your call-site complexity:
 *
 * @example High-level (recommended) — single import, minimal markup
 * ```tsx
 * <Disclosure title="고급 설정">
 *   <Stack gap={2}>
 *     <Input label="비밀번호" />
 *     <Input label="만료일" />
 *   </Stack>
 * </Disclosure>
 * ```
 *
 * @example Compound (when you need a custom trigger or summary text)
 * ```tsx
 * <DisclosureRoot>
 *   <DisclosureTrigger asChild>
 *     <Button variant="ghost">옵션 보기</Button>
 *   </DisclosureTrigger>
 *   <DisclosureContent>...</DisclosureContent>
 * </DisclosureRoot>
 * ```
 *
 * @example Controlled
 * ```tsx
 * const [open, setOpen] = useState(false);
 * <Disclosure title="..." open={open} onOpenChange={setOpen}>...</Disclosure>
 * ```
 */

/** Compound — alias the Radix primitive so consumers can build a custom trigger. */
export const DisclosureRoot = CollapsiblePrimitive.Root;

export interface DisclosureTriggerProps
  extends React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger> {
  /** Hide the chevron icon. Default: false. */
  hideChevron?: boolean;
}

/** Default trigger: full-width row with a chevron that rotates 180° on open. */
export const DisclosureTrigger = forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Trigger>,
  DisclosureTriggerProps
>(({ className, children, hideChevron, ...props }, ref) => (
  <CollapsiblePrimitive.Trigger
    ref={ref}
    className={cn(
      'group flex w-full items-center justify-between gap-polaris-2xs',
      'rounded-polaris-md px-polaris-md py-polaris-2xs font-polaris text-polaris-body2 text-label-normal',
      'transition-colors hover:bg-interaction-hover',
      'focus-visible:outline-none focus-visible:shadow-polaris-focus',
      'data-[disabled]:opacity-50 data-[disabled]:pointer-events-none',
      className
    )}
    {...props}
  >
    <span className="flex-1 text-left">{children}</span>
    {!hideChevron && (
      <ChevronDown
        className={cn(
          'h-4 w-4 shrink-0 text-label-alternative transition-transform duration-polaris-fast',
          'group-data-[state=open]:rotate-180'
        )}
        aria-hidden="true"
      />
    )}
  </CollapsiblePrimitive.Trigger>
));
DisclosureTrigger.displayName = 'DisclosureTrigger';

/** Content wrapper — pass-through of Radix Collapsible.Content. */
export const DisclosureContent = forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.Content
    ref={ref}
    className={cn(
      'px-polaris-md pb-polaris-2xs pt-polaris-3xs',
      'overflow-hidden',
      className
    )}
    {...props}
  />
));
DisclosureContent.displayName = 'DisclosureContent';

export interface DisclosureProps
  // Omit native `title` (string-typed HTML attribute) so we can accept ReactNode.
  extends Omit<React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>, 'title'> {
  /** Trigger label. */
  title: ReactNode;
  /** Hide the chevron icon on the default trigger. */
  hideChevron?: boolean;
  /** Tailwind class for the trigger row. */
  triggerClassName?: string;
  /** Tailwind class for the content wrapper. */
  contentClassName?: string;
}

/**
 * Convenience wrapper: `<Disclosure title="...">children</Disclosure>` renders
 * Root + default Trigger + Content in one go. Drop down to the compound API
 * (`DisclosureRoot`/`DisclosureTrigger`/`DisclosureContent`) if you need a
 * custom trigger element.
 */
export const Disclosure = forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Root>,
  DisclosureProps
>(
  (
    { title, hideChevron, children, className, triggerClassName, contentClassName, ...rootProps },
    ref
  ) => (
    <CollapsiblePrimitive.Root ref={ref} className={cn('font-polaris', className)} {...rootProps}>
      <DisclosureTrigger hideChevron={hideChevron} className={triggerClassName}>
        {title}
      </DisclosureTrigger>
      <DisclosureContent className={contentClassName}>{children}</DisclosureContent>
    </CollapsiblePrimitive.Root>
  )
);
Disclosure.displayName = 'Disclosure';
