import { test, expect } from '@playwright/test';
import tags from '../test-data/test.json';

test.beforeEach(async({page}) => {
  // rout is used to mock the response of the api in /api/tags
  await page.route('*/**/api/tags', async route => {
    await route.fulfill({
      body: JSON.stringify(tags)
    });
  });

  await page.route('*/**/api/articles*', async route => {
    // finish the call and get the response
    const response = await route.fetch();
    const body = await response.json();
    body.articles[0].title = "Krif is the best test automation engineer";
    body.articles[0].description = "I love automation test with Selenium or Playwright.";

    await route.fulfill({
      body: JSON.stringify(body)
    });
  });

  await page.goto('https://conduit.bondaracademy.com/');
});

test('has title', async ({ page }) => {
  await expect(page.locator('.navbar-brand')).toHaveText('conduit');
  await expect(page.locator('app-article-preview h1').first()).toContainText('Krif is the best test automation engineer');
  await expect(page.locator('app-article-preview p').first()).toContainText('I love automation test with Selenium or Playwright.');
  await page.waitForTimeout(3000);
});
