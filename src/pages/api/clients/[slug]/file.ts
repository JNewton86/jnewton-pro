// Streams one gated file from the client's private Blob folder: GET /api/clients/<slug>/file/?name=…
// The name is a query parameter rather than a path segment so the URL never looks like a static
// asset (which some servers route differently). Session already checked by the middleware. Served
// inline (images and PDFs open in the browser); the files page offers a download link via the
// `download` attribute.
import type { APIRoute } from 'astro';
import { isSafeFileName, openFile } from '../../../../lib/portal/files';

export const prerender = false;

export const GET: APIRoute = async ({ locals, url }) => {
  const client = locals.client;
  const name = url.searchParams.get('name') ?? '';
  if (!client || !isSafeFileName(name)) return new Response('Not found', { status: 404 });

  const file = await openFile(client.slug, name);
  if (!file) return new Response('Not found', { status: 404 });

  return new Response(file.stream, {
    headers: {
      'Content-Type': file.contentType,
      'Content-Length': String(file.size),
      'Content-Disposition': `inline; filename="${name}"`,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};
