import type { ESLint, Linter } from 'eslint';
import tsParser from '@typescript-eslint/parser';
import noHardcodedColor from './rules/no-hardcoded-color';
import noArbitraryTailwind from './rules/no-arbitrary-tailwind';
import noDirectFontFamily from './rules/no-direct-font-family';
import preferPolarisComponent from './rules/prefer-polaris-component';
import stateColorWithIcon from './rules/state-color-with-icon';
import preferPolarisIcon from './rules/prefer-polaris-icon';

const meta = {
  name: '@polaris/lint',
  version: '0.5.0',
} as const;

const rules = {
  'no-hardcoded-color': noHardcodedColor,
  'no-arbitrary-tailwind': noArbitraryTailwind,
  'no-direct-font-family': noDirectFontFamily,
  'prefer-polaris-component': preferPolarisComponent,
  'state-color-with-icon': stateColorWithIcon,
  'prefer-polaris-icon': preferPolarisIcon,
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
      '@polaris/prefer-polaris-component': 'error',
      // v0.7-rc.1: warn (not error) — heuristic; suppress per-line if
      // an icon companion is present but undetected.
      '@polaris/state-color-with-icon': 'warn',
      // v0.7-rc.2: warn — lucide-react is still installed for icons
      // polaris doesn't cover. Suppress per-line where needed.
      '@polaris/prefer-polaris-icon': 'warn',
    },
  },
];

plugin.configs = { recommended };

export default plugin;
