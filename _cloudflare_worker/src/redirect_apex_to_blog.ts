// eslint-disable-next-line @typescript-eslint/require-await
async function handleFetchBlogRedirect(request: Request): Promise<Response> {
    return new Response(`Redirect ${request.url} to https://blog.yonathan.org/`, {
        status: 301,
        headers: new Headers({
            Location: 'https://blog.yonathan.org/',
        }),
    });
}

addEventListener('fetch', (event) => {
    event.respondWith(handleFetchBlogRedirect(event.request));
});
