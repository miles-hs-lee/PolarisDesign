import { forwardRef, useEffect, useState, type ReactNode } from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '../lib/cn';

export const ToastProvider = ToastPrimitive.Provider;

export const ToastViewport = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      'fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full outline-none',
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = 'ToastViewport';

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center gap-3 overflow-hidden rounded-polaris-md border-l-[3px] p-4 pr-8 shadow-polaris-md font-polaris',
  {
    variants: {
      variant: {
        info: 'bg-status-info/10 border-status-info text-fg-primary',
        success: 'bg-status-success/10 border-status-success text-fg-primary',
        warning: 'bg-status-warning/15 border-status-warning text-fg-primary',
        danger: 'bg-status-danger/10 border-status-danger text-fg-primary',
        neutral: 'bg-surface-raised border-surface-border-strong text-fg-primary',
      },
    },
    defaultVariants: { variant: 'neutral' },
  }
);

export interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>,
    VariantProps<typeof toastVariants> {}

export const Toast = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  ToastProps
>(({ className, variant, ...props }, ref) => (
  <ToastPrimitive.Root
    ref={ref}
    className={cn(toastVariants({ variant }), className)}
    {...props}
  />
));
Toast.displayName = 'Toast';

export const ToastTitle = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn('text-polaris-body-sm font-semibold', className)}
    {...props}
  />
));
ToastTitle.displayName = 'ToastTitle';

export const ToastDescription = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn('text-polaris-caption opacity-90', className)}
    {...props}
  />
));
ToastDescription.displayName = 'ToastDescription';

export const ToastAction = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={cn(
      'ml-auto inline-flex h-8 shrink-0 items-center justify-center rounded-polaris-md border border-current px-3 text-polaris-caption font-semibold hover:bg-current/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current',
      className
    )}
    {...props}
  />
));
ToastAction.displayName = 'ToastAction';

export const ToastClose = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    aria-label="Close"
    className={cn(
      'absolute right-2 top-2 rounded-polaris-sm p-1 opacity-60 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current',
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" aria-hidden="true" />
  </ToastPrimitive.Close>
));
ToastClose.displayName = 'ToastClose';

export { toastVariants };

/* ----------------------------------------------------------------------------
 * Imperative API: useToast() hook + Toaster component
 *
 * Module-level store (shadcn-style) — keeps Toaster usage to a single line
 * inside ToastProvider, so callers anywhere in the tree can fire toasts via
 * `toast({ title, description, variant })` without lifting state.
 * ------------------------------------------------------------------------- */

type ToastVariant = NonNullable<VariantProps<typeof toastVariants>['variant']>;

export interface ToastInput {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastEntry extends ToastInput {
  id: string;
  open: boolean;
}

type ToastListener = (toasts: ToastEntry[]) => void;

let toastIdCounter = 0;
let toastQueue: ToastEntry[] = [];
const toastListeners = new Set<ToastListener>();
const TOAST_LIMIT = 5;

function emit() {
  for (const listener of toastListeners) listener(toastQueue);
}

export function toast(input: ToastInput): { id: string; dismiss: () => void } {
  const id = `polaris-toast-${++toastIdCounter}`;
  const entry: ToastEntry = { ...input, id, open: true };
  toastQueue = [entry, ...toastQueue].slice(0, TOAST_LIMIT);
  emit();
  return {
    id,
    dismiss: () => dismissToast(id),
  };
}

export function dismissToast(id?: string) {
  toastQueue = toastQueue.map((t) => (id === undefined || t.id === id ? { ...t, open: false } : t));
  emit();
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastEntry[]>(toastQueue);
  useEffect(() => {
    const listener: ToastListener = (next) => setToasts([...next]);
    toastListeners.add(listener);
    return () => {
      toastListeners.delete(listener);
    };
  }, []);
  return { toasts, toast, dismiss: dismissToast };
}

/**
 * Render once near the root of your app, *inside* a `<ToastProvider>` and next
 * to a `<ToastViewport>`. Then call `toast({ title, description })` anywhere.
 *
 * ```tsx
 * <ToastProvider>
 *   <App />
 *   <Toaster />
 *   <ToastViewport />
 * </ToastProvider>
 * ```
 */
export function Toaster() {
  const { toasts, dismiss } = useToast();
  return (
    <>
      {toasts.map((t) => (
        <Toast
          key={t.id}
          variant={t.variant}
          duration={t.duration}
          open={t.open}
          onOpenChange={(open) => {
            if (!open) dismiss(t.id);
          }}
        >
          <div className="flex-1 min-w-0">
            {t.title && <ToastTitle>{t.title}</ToastTitle>}
            {t.description && <ToastDescription>{t.description}</ToastDescription>}
          </div>
          {t.action}
          <ToastClose />
        </Toast>
      ))}
    </>
  );
}
