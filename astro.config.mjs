// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Fonts are self-hosted from the Fontsource packages in node_modules, so versions are pinned
// by the lockfile and builds need no network. Astro generates metric-matched fallback faces
// so text doesn't shift when the web fonts finish loading. (Package exports block importing
// the .woff2 files by package name, hence project-relative paths.)
/** @param {string} pkg @param {string} file */
const fontFile = (pkg, file) => `./node_modules/${pkg}/files/${file}`;

export default defineConfig({
  site: 'https://jnewton.pro',
  trailingSlash: 'always',
  integrations: [sitemap()],
  // Prism highlights with CSS classes; the default (Shiki) uses inline styles the CSP blocks.
  // Add a Prism theme stylesheet when the first code block appears (e.g. in the blog).
  markdown: { syntaxHighlight: 'prism' },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'DM Sans',
      cssVariable: '--font-dm-sans',
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            src: [fontFile('@fontsource-variable/dm-sans', 'dm-sans-latin-wght-normal.woff2')],
            weight: '100 1000',
            style: 'normal',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Bebas Neue',
      cssVariable: '--font-bebas-neue',
      fallbacks: ['Impact', 'sans-serif'],
      options: {
        variants: [
          {
            src: [fontFile('@fontsource/bebas-neue', 'bebas-neue-latin-400-normal.woff2')],
            weight: '400',
            style: 'normal',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Space Mono',
      cssVariable: '--font-space-mono',
      fallbacks: ['ui-monospace', 'monospace'],
      options: {
        variants: [
          {
            src: [fontFile('@fontsource/space-mono', 'space-mono-latin-400-normal.woff2')],
            weight: '400',
            style: 'normal',
          },
          {
            src: [fontFile('@fontsource/space-mono', 'space-mono-latin-700-normal.woff2')],
            weight: '700',
            style: 'normal',
          },
        ],
      },
    },
  ],
  security: {
    // Astro hashes its own scripts and styles into a per-page CSP <meta>.
    // Header-only directives (frame-ancestors, HSTS) live in vercel.json.
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
    },
  },
});
