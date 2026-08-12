import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  // Per-component variant loops navigate + screenshot 10-15 pages per test;
  // under parallel load those exceed the 30s default. 120s keeps the suite
  // green (failures were all timeouts, never assertions).
  timeout: 120_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.TEST_BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command:
      process.env.TEST_SERVER_CMD ||
      'pnpm --filter @quasar-testing-harness/app dev',
    port: parseInt(process.env.TEST_SERVER_PORT || '3000'),
    timeout: 120_000,
    reuseExistingServer: true,
    stdout: 'pipe',
    stderr: 'pipe'
  }
})
