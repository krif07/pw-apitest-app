import { test, expect, request } from '@playwright/test';

test('Like counter increase', async({page}) => {
    await page.goto('https://conduit.bondaracademy.com/');
    await page.getByText('Global Feed').click();
    const firstLikeBtn = page.locator('app-favorite-button').first().locator('button');

    await expect(firstLikeBtn).toHaveText('0');
    await firstLikeBtn.click();
    await expect(firstLikeBtn).toHaveText('1');
    await page.waitForTimeout(3000);
});