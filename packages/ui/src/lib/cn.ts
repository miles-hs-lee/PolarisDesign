import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'polaris-display-lg',
            'polaris-display-md',
            'polaris-heading-lg',
            'polaris-heading-md',
            'polaris-heading-sm',
            'polaris-body-lg',
            'polaris-body-sm',
            'polaris-caption',
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
