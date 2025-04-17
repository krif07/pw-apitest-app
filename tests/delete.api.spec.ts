import { test, expect, request } from '@playwright/test';
import loginData from '../test-data/loginData.json';
import article from '../test-data/article.json';

test.beforeEach(async({page}) => {
    await page.goto('https://conduit.bondaracademy.com/');
});

test.describe('Interact with the API and UI - Create with API, Delete with UI', () => {
    test.beforeEach(async({page, request}) => {
        const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
            data: loginData
        });
        let body = await response.json();
        const token = await body.user.token;
        expect(await body.user.username).toBe('cristian.davila');

        const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
            data: article,
            headers: {
                Authorization: `Token ${token}`
            }
        });
        body = await articleResponse.json();

        expect(articleResponse.status()).toEqual(201);
        expect(await body.article.title).toBe('Test Automation article with Playwright');
        expect(await body.article.description).toBe('This is an article for people who whants to learn to automatize tests.');
        expect(await body.article.body).toBe('Here we are going to learn how to write test with Playwright.');
        expect(await body.article.author.username).toBe('cristian.davila');
    });

    test('Delete an article', async({page}) => {
        await page.getByText('Global Feed').click();
        await page.getByText('Test Automation article with Playwright').click();
        await page.getByRole('button', {name: 'Delete Article'}).first().click();
        await page.getByText('Global Feed').click();

        await expect(page.locator('app-article-preview h1').first()).not.toContainText('Test Automation article with Playwright');
    });
});

let articleId = 0;
test.describe('Interact with the API and UI - Create with UI, Delete with API', () => {
    test.afterEach(async({page, request}) => {
        //Delete with the api
        const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
            data: loginData
        });
        const body = await response.json();
        const token = await body.user.token;
        expect(await body.user.username).toBe('cristian.davila');

        const deleteRequest = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${articleId}`, {
            headers: {
                Authorization: `Token ${token}`
            }
        });
        
        // test was deleted
        expect(deleteRequest.status()).toEqual(204);
    });

    test('Create an article', async({page}) => {
        await page.getByText('New Article').click();
        await page.getByPlaceholder('Article Title').fill('Artic Monkies');
        await page.locator('[formcontrolname="description"]').fill('Artic Mokies Description');
        await page.locator('[formcontrolname="body"]').fill('This is the article body');
        await page.locator('.btn').click();

        //intercep the post creation
        const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/');
        const articleBody = await articleResponse.json();
        articleId = articleBody.article.slug;

        await expect(page.locator('.article-page h1')).toContainText('Artic Monkies');

        await page.getByText('Home').click();
        await page.getByText('Global Feed').click();
        await expect(page.locator('.article-preview h1').first()).toContainText('Artic Monkies');
        
    });
});

