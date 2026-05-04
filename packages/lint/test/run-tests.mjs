import { RuleTester } from 'eslint';
import polaris from '../dist/index.js';

let passed = 0;
let failed = 0;
const failures = [];

RuleTester.it = (name, fn) => {
  try {
    fn();
    passed++;
  } catch (err) {
    failed++;
    failures.push({ name, err });
  }
};
RuleTester.itOnly = RuleTester.it;
RuleTester.describe = (name, fn) => fn();

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

// ============================================================
// no-hardcoded-color
// ============================================================
tester.run('no-hardcoded-color', polaris.rules['no-hardcoded-color'], {
  valid: [
    { code: `const c = "var(--polaris-brand-primary)";` },
    { code: `const c = "currentColor";` },
    { code: `const x = 42;` },
    { code: `const c = \`color: var(--polaris-text-primary);\`;` },
    // 2-letter strings starting with # are not colors
    { code: `const id = "#x1";` },
  ],
  invalid: [
    {
      code: `const c = "#1D4ED8";`,
      errors: [{ messageId: 'hex' }],
    },
    {
      code: `const c = "#fff";`,
      errors: [{ messageId: 'hex' }],
    },
    {
      code: `const style = { color: "#FF6962" };`,
      errors: [{ messageId: 'hex' }],
    },
    {
      code: `const c = "rgb(255, 0, 0)";`,
      errors: [{ messageId: 'fn' }],
    },
    {
      code: `const c = "hsla(220, 50%, 50%, 0.8)";`,
      errors: [{ messageId: 'fn' }],
    },
    {
      code: `const c = \`background: #2B7FFF;\`;`,
      errors: [{ messageId: 'hex' }],
    },
    {
      // Multiple violations in one string
      code: `const css = "color: #fff; background: #000;";`,
      errors: [{ messageId: 'hex' }, { messageId: 'hex' }],
    },
  ],
});

// ============================================================
// no-arbitrary-tailwind
// ============================================================
tester.run('no-arbitrary-tailwind', polaris.rules['no-arbitrary-tailwind'], {
  valid: [
    { code: `const cls = "bg-brand-primary p-4 rounded-polaris-md";` },
    { code: `const cls = "text-text-primary font-polaris";` },
    { code: `const cls = \`bg-surface-canvas \${active && 'ring-brand-primary'}\`;` },
    { code: `const x = "[1, 2, 3]";` },
  ],
  invalid: [
    {
      code: `const cls = "bg-[#1D4ED8] p-4";`,
      errors: [{ messageId: 'arbitrary' }],
    },
    {
      code: `const cls = "p-[13px] m-[7px]";`,
      errors: [{ messageId: 'arbitrary' }, { messageId: 'arbitrary' }],
    },
    {
      code: `const cls = "text-[24px] leading-[32px] tracking-[-0.02em]";`,
      errors: [
        { messageId: 'arbitrary' },
        { messageId: 'arbitrary' },
        { messageId: 'arbitrary' },
      ],
    },
    {
      code: `const cls = \`rounded-[14px] \${variant}\`;`,
      errors: [{ messageId: 'arbitrary' }],
    },
  ],
});

// ============================================================
// no-direct-font-family
// ============================================================
tester.run('no-direct-font-family', polaris.rules['no-direct-font-family'], {
  valid: [
    {
      code: `const s = { fontFamily: "var(--polaris-font-sans)" };`,
    },
    {
      code: `const css = \`font-family: var(--polaris-font-mono);\`;`,
    },
    { code: `const cls = "font-polaris";` },
    { code: `const x = { color: "var(--polaris-text-primary)" };` },
  ],
  invalid: [
    {
      code: `const s = { fontFamily: "Pretendard, sans-serif" };`,
      errors: [{ messageId: 'jsxFontFamily' }],
    },
    {
      code: `const s = { fontFamily: 'Helvetica' };`,
      errors: [{ messageId: 'jsxFontFamily' }],
    },
    {
      code: `const css = \`font-family: Pretendard, sans-serif;\`;`,
      errors: [{ messageId: 'cssFontFamily' }],
    },
    {
      code: `const cls = "font-['Helvetica']";`,
      errors: [{ messageId: 'tailwindFontArbitrary' }],
    },
  ],
});

// ============================================================
// Report
// ============================================================
if (failed > 0) {
  console.error(`\n✗ ${failed} test(s) failed:\n`);
  for (const f of failures) {
    console.error(`  • ${f.name}`);
    console.error(`    ${f.err.message?.split('\n').slice(0, 4).join('\n    ')}`);
  }
  console.error(`\n${passed} passed, ${failed} failed`);
  process.exit(1);
}
console.log(`\n✓ ${passed} test(s) passed`);
