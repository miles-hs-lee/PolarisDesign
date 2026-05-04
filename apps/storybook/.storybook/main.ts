import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../stories/*.stories.tsx'],
  addons: [],
  framework: { name: '@storybook/react-vite', options: {} },
  typescript: { reactDocgen: false },
  docs: { autodocs: false },
};

export default config;
