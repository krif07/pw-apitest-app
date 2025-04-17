import { test as setup } from '@playwright/test';
import loginData from '../test-data/loginData.json';
import user from '../.auth/user.json';
import fs from 'fs';

const authFile = '.auth/user.json';

setup('authentication', async({request}) => {
    // await page.goto('https://conduit.bondaracademy.com/');

    // await page.getByText('Sign in').click();
    // await page.getByPlaceholder('Email').fill('cristian.davila@gmail.com');
    // await page.getByPlaceholder('Password').fill('cristian123');
    // await page.locator('.btn').click();
    // await page.waitForResponse('*/**/api/tags');

    // await page.context().storageState({path: authFile});

    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: loginData
    });
    const body = await response.json();
    const token = await body.user.token;
    user.origins[0].localStorage[0].value = token;
    fs.writeFileSync(authFile, JSON.stringify(user));

    process.env['ACCESS_TOKEN'] = token;
});