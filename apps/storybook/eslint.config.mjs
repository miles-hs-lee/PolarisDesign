import polaris from '@polaris/lint';

export default [
  ...polaris.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    ignores: ['storybook-static/**', 'node_modules/**'],
  },
];
