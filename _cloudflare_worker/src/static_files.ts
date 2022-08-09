// based on https://developers.cloudflare.com/r2/examples/demo-worker/
// but converted from worker module to old-style worker script
// since cloudflare_worker_script does not support creating modules yet
// and I removed the PUT and object list functionality

interface Env {
    MY_BUCKET: R2Bucket;
}
function parseRange(
    encoded: string | null
): undefined | { offset: number; end: number; length: number } {
    if (encoded === null) {
        return;
    }

    const parts = encoded.split('bytes=')[1]?.split('-') ?? [];
    if (parts.length !== 2) {
        throw new Error('Not supported to skip specifying the beginning/ending byte at this time');
    }

    return {
        offset: Number(parts[0]),
        end: Number(parts[1]),
        length: Number(parts[1]) + 1 - Number(parts[0]),
    };
}

function objectNotFound(objectName: string): Response {
    return new Response(`<html><body>R2 object "<b>${objectName}</b>" not found</body></html>`, {
        status: 404,
        headers: {
            'content-type': 'text/html; charset=UTF-8',
        },
    });
}

function isR2ObjectBody(o: R2Object): o is R2ObjectBody {
    return (o as R2ObjectBody).body !== undefined;
}

async function onFetchStaticFile(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const ignoreLength = url.pathname.startsWith('/staging/') ? '/staging/'.length : '/'.length;
    const objectName =
        url.pathname.substring(ignoreLength) + (url.pathname.endsWith('/') ? 'index.html' : '');

    console.log(`${request.method} object ${objectName}: ${request.url}`);

    if (request.method === 'GET' || request.method === 'HEAD') {
        if (request.method === 'GET') {
            const range = parseRange(request.headers.get('range'));
            console.log(`GET: fetching from bucket onlyIf`, [...request.headers.entries()]);
            const object = await env.MY_BUCKET.get(objectName, {
                range,
                // TODO: put ifMatch caching back once this bug is fixed
                // https://github.com/cloudflare/cloudflare-docs/issues/5469
                // ifMatch: request.headers,
            });

            if (object === null) {
                return objectNotFound(objectName);
            }

            const headers = new Headers();
            object.writeHttpMetadata(headers);
            headers.set('etag', `"${object.etag}"`);
            if (range) {
                headers.set('content-range', `bytes ${range.offset}-${range.end}/${object.size}`);
            }
            console.log('get headers', headers);
            const status = isR2ObjectBody(object) ? (range ? 206 : 200) : 304;
            return new Response(isR2ObjectBody(object) ? object.body : undefined, {
                headers,
                status,
            });
        }

        const object = await env.MY_BUCKET.head(objectName);

        if (object === null) {
            return objectNotFound(objectName);
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);
        console.log('head headers', headers);
        return new Response(null, {
            headers,
        });
    }

    return new Response(`Unsupported method`, {
        status: 400,
    });
}

const env = this as unknown as Env;
addEventListener('fetch', (event) => {
    event.respondWith(onFetchStaticFile(event.request, env));
});
