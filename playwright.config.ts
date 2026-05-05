import { defineConfig, devices } from '@playwright/test';

/**
 * Visual regression suite for the Polaris demo.
 *
 * What it covers:
 * - Each demo route at desktop + mobile viewport: full-page screenshot diff
 * - Ribbon tab transitions: home / insert / layout / review / ai-tools panel snapshots
 * - Components catalog: section-by-section snapshots so a single tweak
 *   surfaces visually instead of waiting for users to notice
 *
 * Why we picked this over Chromatic: free, runs locally, ships in CI
 * without a SaaS account. Trade-off: cross-browser/cross-OS rendering
 * differences are real — keep snapshots tied to a single platform
 * (Linux Chromium) and update them on the same OS.
 */
export default defineConfig({
  testDir: './e2e',
  // Boot the demo dev server before tests; reuse if already running.
  webServer: {
    command: 'pnpm --filter demo dev --port 5173',
    url: 'http://localhost:5173/',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  // Compare snapshots across runs with a small tolerance — anti-aliasing
  // and font hinting can drift a pixel or two.
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01 },
  },
  projects: [
    {
      name: 'desktop-chrome',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  // Snapshots are partitioned by project (desktop / mobile) and platform
  // so macOS dev and Linux CI don't fight over the same baseline file.
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}-{platform}/{testFilePath}/{arg}{ext}',
  reporter: [['list'], ['html', { open: 'never' }]],
  // CI is more sensitive to flakes — single retry, single worker.
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
});
