import { defineConfig } from '@playwright/test';

// Smoke tests against the static export. Run `npm run build` first.
// CHROME_PATH points at a system Chrome when Playwright's own browser is not installed.
export default defineConfig({
  testDir: 'tests',
  webServer: { command: 'npx serve out -l 4310', url: 'http://localhost:4310', reuseExistingServer: true },
  use: {
    baseURL: 'http://localhost:4310',
    launchOptions: { executablePath: process.env.CHROME_PATH || undefined },
  },
});
