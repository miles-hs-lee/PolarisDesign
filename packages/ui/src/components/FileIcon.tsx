import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

export type FileType = 'docx' | 'hwp' | 'xlsx' | 'pptx' | 'pdf';

const fileIconVariants = cva(
  'inline-flex items-center justify-center font-bold text-text-on-brand select-none shrink-0 font-polaris tracking-tight',
  {
    variants: {
      type: {
        docx: 'bg-file-docx',
        hwp: 'bg-file-hwp',
        xlsx: 'bg-file-xlsx',
        pptx: 'bg-file-pptx',
        pdf: 'bg-file-pdf',
      },
      size: {
        sm: 'h-7 w-7 rounded-polaris-sm text-[9px]',
        md: 'h-10 w-10 rounded-polaris-md text-[11px]',
        lg: 'h-12 w-12 rounded-polaris-lg text-polaris-caption',
      },
    },
    defaultVariants: { size: 'md' },
  }
);

export interface FileIconProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'type'>,
    VariantProps<typeof fileIconVariants> {
  type: FileType;
}

const LABEL: Record<FileType, string> = {
  docx: 'DOCX',
  hwp: 'HWP',
  xlsx: 'XLSX',
  pptx: 'PPTX',
  pdf: 'PDF',
};

export const FileIcon = forwardRef<HTMLDivElement, FileIconProps>(
  ({ className, type, size, ...props }, ref) => (
    <div
      ref={ref}
      role="img"
      aria-label={`${LABEL[type]} file`}
      className={cn(fileIconVariants({ type, size }), className)}
      {...props}
    >
      {LABEL[type]}
    </div>
  )
);
FileIcon.displayName = 'FileIcon';

export { fileIconVariants };
