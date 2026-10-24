// Guards the client portal. Everything under /clients/<slug>/ and /api/clients/<slug>/ needs a
// valid session cookie for that slug, except the unlock page that creates one. Only on-demand
// routes pass through here at request time; the static site is unaffected.
import { defineMiddleware } from 'astro:middleware';
import { getClient } from './data/clients';
import { hasSession } from './lib/portal/auth';

const PORTAL_PATH = /^\/(api\/)?clients\/([^/]+)(\/.*)?$/;

export const onRequest = defineMiddleware(async (context, next) => {
  const match = PORTAL_PATH.exec(context.url.pathname);
  if (!match) return next();

  const isApi = Boolean(match[1]);
  const slug = match[2] ?? '';
  const rest = match[3] ?? '/';
  const client = getClient(slug);

  if (!client) {
    // A 404 response from here makes Astro serve the site's prerendered 404 page.
    return isApi ? json({ error: 'not found' }, 404) : new Response(null, { status: 404 });
  }

  if (!isApi && /^\/unlock\/?$/.test(rest)) {
    context.locals.client = client;
    return privateResponse(await next());
  }

  if (!(await hasSession(context.cookies, slug))) {
    return isApi
      ? json({ error: 'unauthorized' }, 401)
      : context.redirect(`/clients/${slug}/unlock/`, 303);
  }

  context.locals.client = client;
  context.locals.authenticated = true;
  return privateResponse(await next());
});

/** Portal pages are per-client and must never be cached or indexed. */
function privateResponse(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'private, no-store');
  headers.set('X-Robots-Tag', 'noindex, nofollow');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
