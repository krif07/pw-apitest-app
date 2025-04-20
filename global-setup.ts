import { request, expect } from "@playwright/test";
import loginData from './test-data/loginData.json';
import article from './test-data/global-article.json';
import user from './.auth/user.json';
import fs from 'fs';

async function globalSetup() {
    const authFile = '.auth/user.json';
    const context = await request.newContext();

    const responseToken = await context.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: loginData
    });
    const bodyToken = await responseToken.json();
    const token = await bodyToken.user.token;
    user.origins[0].localStorage[0].value = token;
    fs.writeFileSync(authFile, JSON.stringify(user));

    process.env['ACCESS_TOKEN'] = token;

    const articleResponse = await context.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: article,
        headers: {
            Authorization: `Token ${process.env.ACCESS_TOKEN}`
        }
    });
    expect(articleResponse.status()).toEqual(201);
    const body = await articleResponse.json();
    const articleId = body.article.slug;
    process.env['GLOBAL_ARTICLE_ID'] = articleId;
}

export default globalSetup;