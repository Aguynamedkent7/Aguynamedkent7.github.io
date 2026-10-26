import { expect, test } from '@playwright/test';
import { projects } from '../app/content';

test('page loads with the hero and every section', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Butaya');
  await expect(page.locator('.race-canvas, .race-poster').first()).toBeAttached();
  for (const id of ['work', 'experience', 'stack', 'contact']) await expect(page.locator(`#${id}`)).toBeAttached();
  for (const p of projects) await expect(page.locator('#work').getByText(p.name, { exact: true })).toBeAttached();
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('shows the poster and does not pin the hero', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.race--poster')).toBeVisible();
    await expect(page.locator('.race-canvas')).toHaveCount(0);
    await expect(page.locator('.poster-list li')).toHaveCount(projects.length);
    expect(await page.locator('.race-pin').evaluate((el) => getComputedStyle(el).position)).toBe('static');
  });
});
