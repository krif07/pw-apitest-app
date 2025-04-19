import { test as setup, expect } from '@playwright/test';
import article from '../test-data/article.json';

setup('create new article', async({request}) => {
    const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: article,
    });
    expect(articleResponse.status()).toEqual(201);
    const body = await articleResponse.json();
    const articleId = body.article.slug;
    process.env['ARTICLE_ID'] = articleId;
});