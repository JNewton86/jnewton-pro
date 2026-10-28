// Guards the client portal. /portal/ itself is public (it shows the sign-in form or, with a
// session, the overview); everything else under /portal/ and /api/portal/ needs a valid session
// cookie, which names the client. Only on-demand routes pass through here at request time; the
// static site is unaffected.
import { defineMiddleware } from 'astro:middleware';
import { readSession } from './lib/portal/auth';

const PORTAL_PATH = /^\/(api\/)?portal(\/.*)?$/;

export const onRequest = defineMiddleware(async (context, next) => {
  const match = PORTAL_PATH.exec(context.url.pathname);
  if (!match) return next();

  const isApi = Boolean(match[1]);
  const rest = match[2] ?? '/';
  const client = await readSession(context.cookies);

  if (client) {
    context.locals.client = client;
    return privateResponse(await next());
  }

  // The sign-in page is the only portal route that renders without a session
  if (!isApi && /^\/?$/.test(rest)) return privateResponse(await next());

  return isApi ? json({ error: 'unauthorized' }, 401) : context.redirect('/portal/', 303);
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
