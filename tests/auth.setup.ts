import { test as setup } from '@playwright/test';

const authFile = 'auth/user.json';

setup('authentication', async({page}) => {
    await page.goto('https://conduit.bondaracademy.com/');

    await page.getByText('Sign in').click();
    await page.getByPlaceholder('Email').fill('cristian.davila@gmail.com');
    await page.getByPlaceholder('Password').fill('cristian123');
    await page.locator('.btn').click();
    await page.waitForResponse('*/**/api/tags');

    await page.context().storageState({path: authFile});
});