# jnewton.pro

Portfolio and AI-consulting site for Jeff Newton — technical product manager and applied AI developer.

Built with [Astro](https://astro.build) as a static site (no client-side framework; the public pages ship only a few lines of JavaScript to close the mobile menu). Hosted on Vercel. A small passcode-gated client portal under `/clients/` renders on demand through the Vercel adapter.

## Local development

Requires Node 22.19 or later (see `.nvmrc`).

```sh
npm install
npm run dev       # http://localhost:4321
```

Before opening a pull request, run everything CI runs:

```sh
npm run verify       # formatting, lint (incl. accessibility rules), type-check, build, built-site checks
npm run lighthouse   # after a build: Lighthouse budgets on key pages (needs Chrome installed)
```

`npm run lighthouse -- --url https://jnewton.pro` runs the same budgets against the live site.

The Content Security Policy only applies to production builds, so check CSP-sensitive changes with `npm run build && npm run preview` (static pages; the portal's on-demand pages are checked on a Vercel preview deployment).

## Client portal

Each consulting client gets a private space at `/clients/<slug>/` with a project overview, a discovery board whose notes save server-side, and gated files. It is passcode-protected, `noindex`, and excluded from `robots.txt` and the sitemap.

- Register a client in `src/data/clients/` (see `aaplus/`). The slug is the URL.
- Set the environment variables in `.env.example` (locally in `.env`, on Vercel in the project settings): a session secret, the passcode for each slug, Upstash Redis for notes, and a private Vercel Blob store for files.
- Upload files to Blob under `clients/<slug>/<file-name>`; they appear on the client's Files page. Nothing client-specific is committed to this public repo or placed in `public/`.

## Search and AI visibility

Generated at build time from `src/site.config.ts`, `src/data/resume.ts`, and the projects collection, so they never drift from what the pages say:

- **Structured data** (schema.org JSON-LD, `src/lib/structured-data.ts`): `Person`, `WebSite`, and `ProfilePage` on the home page; `CreativeWork` and `BreadcrumbList` on project pages. Validate changes with Google's Rich Results Test or validator.schema.org.
- **Link-preview images** (`src/lib/og-image.ts` → `/og/*.png`): one 1200×630 card per page, rendered with Satori and resvg using the site's fonts.
- **`/llms.txt`**: a plain-text summary for AI assistants.
- **`/sitemap-index.xml`** and **`/robots.txt`** (all crawlers allowed, including AI search crawlers).

## Where things live

| Path                        | What it is                                                                                      |
| --------------------------- | ----------------------------------------------------------------------------------------------- |
| `src/site.config.ts`        | Identity (name, contact, social links) and the main navigation — edit details here              |
| `src/data/resume.ts`        | Experience, education, certifications, skills, and stats shown on the home page                 |
| `src/content/projects/*.md` | One file per project; the file name is the URL slug                                             |
| `src/content.config.ts`     | The schema every project file must match (the build fails if one doesn't)                       |
| `src/styles/global.css`     | Design tokens (colors, type scale, spacing) and shared styles                                   |
| `src/components/`           | Page sections and reusable pieces                                                               |
| `src/pages/`                | Routes: home, projects, project pages, 404, robots.txt, llms.txt, preview images, client portal |
| `src/lib/`                  | Structured data and link-preview image builders                                                 |
| `public/assets/`            | Files served as-is, e.g. the résumé PDF                                                         |
| `src/middleware.ts`         | Passcode gate for the client portal                                                             |
| `src/data/clients/`         | Client portal registry and per-client content (discovery questions)                             |
| `src/lib/portal/`           | Portal sessions, note storage (Upstash Redis), gated files (Vercel Blob)                        |
| `scripts/serve-static.mjs`  | Local server for the built static pages (`npm run preview`); used by Lighthouse                 |
| `scripts/check-dist.mjs`    | Post-build checks: links, anchors, CSP coverage, inline styles, JSON-LD, og:image               |
| `scripts/lighthouse.mjs`    | Lighthouse budgets (accessibility/SEO/best practices 100, performance ≥ 95)                     |
| `vercel.json`               | Security headers, redirects from the old `.html` URLs, caching                                  |

## Adding a project

1. Create `src/content/projects/<slug>.md`. Copy an existing project for the frontmatter fields.
2. Write the overview as the Markdown body.
3. Run `npm run dev` and check `/projects/<slug>/`.

The home page and projects list pick it up automatically. Set `featured: true` on at most one project to show it as the large card on the home page; `order` controls the sequence.

## Design and accessibility rules

- Colors come from the tokens in `global.css`. Text colors are checked against WCAG AA on every background — re-check contrast when changing one.
- Font sizes use `rem` (never `px`, and never set a font size on `html`), so text follows the reader's browser and OS text size.
- No inline `style` attributes or `define:vars` — the CSP blocks them. `npm run check:dist` catches this.
- Motion: the hero load sequence is the only animation, and it's off for anyone with reduced motion turned on.
- Monospace is reserved for things that are literally code: the terminal card and tech tags.

## Deployment

Vercel builds every pull request as a preview and deploys `master` to production. No environment variables are needed.

## Domain and email notes

The domain is registered at GoDaddy. The registration is separate from the Website Builder subscription, so the builder can be cancelled once DNS points at Vercel. To keep `jeff@jnewton.pro` working without GoDaddy:

- **Cloudflare Email Routing** (free, receive only): forwards mail to another inbox. Requires moving DNS to Cloudflare.
- **Zoho Mail** (free for one user, send and receive): adds MX records to the domain's DNS. Better if the address is used for professional correspondence.

Whichever is used, keep the MX and SPF/DKIM records intact when changing DNS for Vercel.
