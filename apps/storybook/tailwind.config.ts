import polarisPreset from '@polaris/ui/tailwind';
import type { Config } from 'tailwindcss';

export default {
  content: [
    '../../packages/ui/src/**/*.{ts,tsx}',
    './.storybook/**/*.{ts,tsx}',
    './stories/**/*.{ts,tsx}',
  ],
  presets: [polarisPreset],
} satisfies Config;
