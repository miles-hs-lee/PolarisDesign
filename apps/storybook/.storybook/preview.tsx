import type { Preview } from '@storybook/react';
import { TooltipProvider, ToastProvider } from '@polaris/ui';
import './preview.css';

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true },
  },
  globalTypes: {
    theme: {
      description: 'Color theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: '☀ Light' },
          { value: 'dark', title: '🌙 Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, ctx) => {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', ctx.globals.theme || 'light');
      }
      return (
        <TooltipProvider>
          <ToastProvider>
            <div className="min-h-screen bg-surface-canvas text-fg-primary font-polaris p-8">
              <Story />
            </div>
          </ToastProvider>
        </TooltipProvider>
      );
    },
  ],
};

export default preview;
