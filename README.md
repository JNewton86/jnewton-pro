# jnewton.pro

Portfolio and AI-consulting site for Jeff Newton — technical product manager and applied AI developer.

Built with [Astro](https://astro.build) as a static site (no client-side framework; the only JavaScript is a few lines that close the mobile menu). Hosted on Vercel.

## Local development

Requires Node 22.12 or later (see `.nvmrc`).

```sh
npm install
npm run dev       # http://localhost:4321
```

Before opening a pull request, run everything CI runs:

```sh
npm run verify    # formatting, lint (incl. accessibility rules), type-check, build, built-site checks
```

The Content Security Policy only applies to production builds, so check CSP-sensitive changes with `npm run build && npm run preview`.

## Where things live

| Path                        | What it is                                                                         |
| --------------------------- | ---------------------------------------------------------------------------------- |
| `src/site.config.ts`        | Identity (name, contact, social links) and the main navigation — edit details here |
| `src/data/resume.ts`        | Experience, education, certifications, skills, and stats shown on the home page    |
| `src/content/projects/*.md` | One file per project; the file name is the URL slug                                |
| `src/content.config.ts`     | The schema every project file must match (the build fails if one doesn't)          |
| `src/styles/global.css`     | Design tokens (colors, type scale, spacing) and shared styles                      |
| `src/components/`           | Page sections and reusable pieces                                                  |
| `src/pages/`                | Routes: home, projects list, project pages, 404, robots.txt                        |
| `public/assets/`            | Files served as-is, e.g. the résumé PDF                                            |
| `scripts/check-dist.mjs`    | Post-build checks: internal links and anchors, CSP coverage, no inline styles      |
| `vercel.json`               | Security headers, redirects from the old `.html` URLs, caching                     |

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
