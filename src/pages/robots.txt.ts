import type { APIRoute } from 'astro';

// All crawlers, including AI search crawlers, are welcome: being cited is the goal.
// The client portal and its API are private (passcode-gated, noindex) and excluded here too.
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site);
  return new Response(
    `User-agent: *\nAllow: /\nDisallow: /clients/\nDisallow: /api/\n\nSitemap: ${sitemap.href}\n`,
    {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    },
  );
};
