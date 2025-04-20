import { request, expect } from "@playwright/test";

async function globalTeardown() {
    const context = await request.newContext();

    const articleId = process.env.GLOBAL_ARTICLE_ID;
    const deleteRequest = await context.delete(`https://conduit-api.bondaracademy.com/api/articles/${articleId}`, {
        headers: {
            Authorization: `Token ${process.env.ACCESS_TOKEN}`
        }
    });
    expect(deleteRequest.status()).toEqual(204);
}

export default globalTeardown;