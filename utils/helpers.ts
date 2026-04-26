import { Page } from '@playwright/test';

export async function clearAndFill(page: Page, selector: string, value: string): Promise<void> {
  await page.locator(selector).clear();
  await page.locator(selector).fill(value);
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export async function waitForNavigation(page: Page, url: string | RegExp): Promise<void> {
  await page.waitForURL(url, { timeout: 10_000 });
}
