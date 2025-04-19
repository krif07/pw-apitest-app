import { test as setup, expect } from '@playwright/test';

setup('delete article', async({request}) => {
    const articleId = process.env['ARTICLE_ID'];
    const deleteRequest = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${articleId}`);
    expect(deleteRequest.status()).toEqual(204);
});