/**
 * Visual baseline suite. Each test snapshots a stable page state — no
 * pointer hover, no animations in flight — so future regressions
 * (height drift, color drift, layout shifts) trip the diff.
 *
 * Update workflow:
 *   pnpm exec playwright test --update-snapshots
 * Only update when an intentional change is being shipped — and check
 * that the diff matches the change.
 */
import { test, expect } from '@playwright/test';

const ROUTES = [
  { path: '/#/', name: 'home' },
  { path: '/#/components', name: 'components-catalog' },
  { path: '/#/tokens', name: 'tokens' },
  { path: '/#/icons', name: 'icons-catalog' },
  { path: '/#/assets', name: 'assets' },
  { path: '/#/polaris-office', name: 'polaris-office' },
  { path: '/#/proposal-platform', name: 'proposal-platform' },
  { path: '/#/nova', name: 'nova-workspace' },
  { path: '/#/crm/contract', name: 'crm-contract' },
  { path: '/#/sign/contracts', name: 'sign-contracts' },
] as const;

for (const { path, name } of ROUTES) {
  test(`${name} page baseline`, async ({ page }) => {
    await page.goto(path);
    // Ensure fonts are loaded before snapshotting — Pretendard is a web
    // font and a 50ms delta in load order causes a pixel diff.
    await page.evaluate(() => document.fonts.ready);
    // Settle any layout (sticky bars, animations, etc.)
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
  });
}

test.describe('Polaris Office ribbon tabs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/polaris-office');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
  });

  // Each ribbon tab gets its own snapshot — locks panel height, group
  // widths, scrollbar visibility, and cluster dividers.
  for (const tab of ['홈', '삽입', '레이아웃', '검토', 'AI 도구']) {
    test(`ribbon tab: ${tab}`, async ({ page }) => {
      await page.getByRole('tab', { name: tab }).click();
      await page.waitForTimeout(150);
      // Snapshot the ribbon region only — canvas content underneath
      // doesn't change between tabs.
      //
      // Locator strategy: `[data-polaris-ribbon]` is a stable attribute
      // emitted by `<Ribbon>` itself (see packages/ui/src/ribbon/Ribbon.tsx).
      // The previous version locked onto `div.bg-background-normal` which
      // broke at v0.8 (alias removed) and produced timeouts. Attribute-
      // based selectors survive class-name churn.
      const ribbon = page.locator('[data-polaris-ribbon]').first();
      await expect(ribbon).toHaveScreenshot(`ribbon-${tab}.png`);
    });
  }
});
