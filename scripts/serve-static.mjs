// Serves the built static pages the way Vercel does (directory index files, trailing slashes,
// 404.html fallback). `astro preview` can't be used here: the Vercel adapter doesn't support it
// once the project has on-demand routes. Those routes (the client portal) are not served by this
// script; test them with `npm run dev` or on a Vercel preview deployment.
//
//   node scripts/serve-static.mjs [--port 4321]
//
// Also imported by scripts/lighthouse.mjs.
import { existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { extname, join, normalize } from 'node:path';

// With on-demand routes the Vercel adapter puts the static pages in dist/client; a fully static
// build keeps them in dist.
export const STATIC_DIR = existsSync('dist/client') ? 'dist/client' : 'dist';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.pdf': 'application/pdf',
};

const isFile = (path) => existsSync(path) && statSync(path).isFile();

function resolve(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath)).replaceAll('\\', '/');
  if (clean.includes('..')) return null;
  const base = join(STATIC_DIR, clean);
  if (clean.endsWith('/'))
    return isFile(join(base, 'index.html')) ? join(base, 'index.html') : null;
  if (isFile(base)) return base;
  // Vercel redirects /path to /path/ for directories; serving the index directly is equivalent
  // for local checks.
  if (isFile(join(base, 'index.html'))) return join(base, 'index.html');
  return null;
}

function send(response, file, status = 200) {
  response.writeHead(status, {
    'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  createReadStream(file).pipe(response);
}

/** Starts the server and resolves once it is listening. */
export function serveStatic(port) {
  const server = createServer((request, response) => {
    const { pathname } = new URL(request.url ?? '/', 'http://localhost');
    const file = resolve(pathname);
    if (file) return send(response, file);
    const notFound = join(STATIC_DIR, '404.html');
    if (isFile(notFound)) return send(response, notFound, 404);
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('Not found');
  });
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, () => resolve(server));
  });
}

if (process.argv[1]?.endsWith('serve-static.mjs')) {
  const portArg = process.argv.indexOf('--port');
  const port = portArg > -1 ? Number(process.argv[portArg + 1]) : 4321;
  await serveStatic(port);
  console.log(`Serving ${STATIC_DIR} at http://localhost:${port}/ (static pages only)`);
}
