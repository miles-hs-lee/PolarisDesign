import type { ESLint, Linter } from 'eslint';
import tsParser from '@typescript-eslint/parser';
import noHardcodedColor from './rules/no-hardcoded-color';
import noArbitraryTailwind from './rules/no-arbitrary-tailwind';
import noDirectFontFamily from './rules/no-direct-font-family';

const meta = {
  name: '@polaris/lint',
  version: '0.0.1',
} as const;

const rules = {
  'no-hardcoded-color': noHardcodedColor,
  'no-arbitrary-tailwind': noArbitraryTailwind,
  'no-direct-font-family': noDirectFontFamily,
} as const;

const plugin: ESLint.Plugin = {
  meta,
  rules,
};

const recommended: Linter.Config[] = [
  {
    name: '@polaris/lint:typescript',
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parser: tsParser as Linter.Parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    name: '@polaris/lint:rules',
    plugins: { '@polaris': plugin },
    rules: {
      '@polaris/no-hardcoded-color': 'error',
      '@polaris/no-arbitrary-tailwind': 'error',
      '@polaris/no-direct-font-family': 'error',
    },
  },
];

plugin.configs = { recommended };

export default plugin;
