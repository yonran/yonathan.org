// eslint-disable-next-line @typescript-eslint/require-await
async function handleFetchHttpsRedirect(request: Request): Promise<Response> {
    const url = new URL(request.url);
    url.protocol = 'https';
    return new Response(`Redirect ${request.url} to https version ${url.toString()}`, {
        status: 301,
        headers: new Headers({
            Location: url.toString(),
        }),
    });
}

addEventListener('fetch', (event) => {
    event.respondWith(handleFetchHttpsRedirect(event.request));
});
