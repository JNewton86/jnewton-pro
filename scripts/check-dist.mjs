// Post-build checks on the generated site in dist/. Exits non-zero on any problem.
//  1. Every internal link and #fragment resolves to a built page and an existing id.
//  2. Every inline <script>/<style> is covered by a hash in that page's CSP <meta>,
//     so the browser won't silently block it.
//  3. No inline style="" attributes (CSP without 'unsafe-inline' blocks them).
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';
const problems = [];

const htmlFiles = (function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return walk(path);
    return path.endsWith('.html') ? [path] : [];
  });
})(DIST);

const pages = new Map(htmlFiles.map((file) => [file, readFileSync(file, 'utf8')]));
const idsByFile = new Map(
  [...pages].map(([file, html]) => [
    file,
    new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])),
  ]),
);

// Map a URL path to the file Astro would serve for it.
function resolvePath(urlPath) {
  const clean = decodeURIComponent(urlPath);
  const candidates = clean.endsWith('/')
    ? [join(DIST, clean, 'index.html')]
    : [join(DIST, clean), join(DIST, `${clean}.html`), join(DIST, clean, 'index.html')];
  return candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile());
}

const urlPathOf = (file) =>
  '/' +
  relative(DIST, file)
    .split(sep)
    .join('/')
    .replace(/index\.html$/, '');
const sha256 = (text) => `'sha256-${createHash('sha256').update(text).digest('base64')}'`;

for (const [file, html] of pages) {
  const where = relative(DIST, file);

  // 1. Internal links
  for (const [, raw] of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const value = raw.replaceAll('&amp;', '&');
    if (/^(?:[a-z]+:|\/\/)/i.test(value)) continue; // external, mailto:, tel:, data:
    const url = new URL(value, `https://site.invalid${urlPathOf(file)}`);
    const target =
      url.pathname === urlPathOf(file) && value.startsWith('#') ? file : resolvePath(url.pathname);
    if (!target) {
      problems.push(`${where}: broken link ${value}`);
      continue;
    }
    if (url.hash && target.endsWith('.html')) {
      const id = decodeURIComponent(url.hash.slice(1));
      if (!idsByFile.get(target)?.has(id)) problems.push(`${where}: missing anchor ${value}`);
    }
  }

  // 2. CSP coverage
  const csp = html.match(/<meta http-equiv="content-security-policy" content="([^"]+)"/)?.[1];
  if (!csp) {
    problems.push(`${where}: no CSP <meta>`);
  } else {
    const directive = (name) => csp.match(new RegExp(`${name} ([^;]+)`))?.[1].split(/\s+/) ?? [];
    const allowed = {
      script: new Set(directive('script-src')),
      style: new Set(directive('style-src')),
    };
    for (const kind of ['script', 'style']) {
      for (const [, attrs, body] of html.matchAll(
        new RegExp(`<${kind}(\\s[^>]*)?>([\\s\\S]*?)</${kind}>`, 'g'),
      )) {
        if (/\ssrc=/.test(attrs ?? '') || body.trim() === '') continue;
        // JSON-LD is a data block, never executed, so CSP doesn't apply (checked in 4. instead).
        if (/type="application\/ld\+json"/.test(attrs ?? '')) continue;
        if (!allowed[kind].has(sha256(body)))
          problems.push(`${where}: inline <${kind}> not covered by CSP hash`);
      }
    }
  }

  // 3. Inline style attributes
  if (/\sstyle="/.test(html)) problems.push(`${where}: inline style="" attribute (blocked by CSP)`);

  // 4. Structured data parses and declares a schema.org context
  for (const [, body] of html.matchAll(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  )) {
    try {
      const data = JSON.parse(body);
      if (data['@context'] !== 'https://schema.org')
        problems.push(`${where}: JSON-LD missing schema.org @context`);
    } catch {
      problems.push(`${where}: JSON-LD is not valid JSON`);
    }
  }

  // 5. The link-preview image exists in the build
  const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  if (!ogImage) {
    problems.push(`${where}: no og:image`);
  } else if (!existsSync(join(DIST, new URL(ogImage).pathname))) {
    problems.push(`${where}: og:image ${ogImage} not found in dist/`);
  }
}

if (problems.length) {
  console.error(`check-dist found ${problems.length} problem(s):\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(
  `check-dist: ${pages.size} pages OK (links, anchors, CSP coverage, no inline styles, JSON-LD, og:image).`,
);
