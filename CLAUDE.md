# CLAUDE.md

Personal portfolio + AI-services pitch site for Jeff Newton, served at jnewton.pro.
Two audiences: hiring managers (TPM / Applied AI roles) and prospective clients for AI consulting work.
Copy changes should be checked against both — don't make the site read as job-seeker-only or sales-only.

**Working principle: quality over speed.** Always prefer the best-practice approach (accessibility, security, SEO, maintainability) over a quick fix, even when it takes longer.

**Never merge PRs or push to `master`.** Work on a branch and open a PR when asked; Jeff merges.

## Stack

- Astro 7, static output, TypeScript (strictest). No client framework; ship JS only when there's no HTML/CSS way.
- Hosted on Vercel (Pro). PRs get preview deployments; `master` deploys to production.
- Fonts are self-hosted from the Fontsource packages via Astro's `fonts` config (local provider): Bebas Neue (display), DM Sans (body), Space Mono (code only).
- Tooling: Prettier, ESLint (astro + jsx-a11y via `eslint-plugin-jsx-a11y-x`, because the original plugin doesn't support ESLint 10), `astro check`, and `scripts/check-dist.mjs`. CI runs all of them (`npm run verify` locally).
- TypeScript is pinned to 6.0: `@astrojs/check` and `typescript-eslint` don't support TS 7 yet.

## Layout

- `src/site.config.ts` — identity, contact, social links, nav. The one place to change who the site is about.
- `src/data/resume.ts` — experience, education, certifications, skills, stats.
- `src/content/projects/*.md` + `src/content.config.ts` — projects collection with a schema. File name = URL slug.
- `src/components/`, `src/layouts/BaseLayout.astro` (head/meta/fonts), `src/pages/`.
- `src/styles/global.css` — design tokens and shared styles; component styles are scoped in each component.
- `vercel.json` — security headers, redirects from old `.html` URLs, caching.

## Conventions

- **Content truthfulness:** project and résumé copy must come from Jeff or existing site copy. Never invent claims, metrics, or features — leave a gap and flag it instead.
- **Design direction (decided 2026-10-16):** keep the brand (navy grid, cyan primary, amber secondary, Bebas/DM Sans, terminal hero) but avoid generated-looking tells: no numbered section labels unless content is a real sequence, no all-caps eyebrow label above every heading, no scroll-reveal on every section, no hover lift on non-clickable things, no `→`/`↗` suffixes, no middle-dot meta strings. Monospace only for code (terminal, tech tags). The hero load sequence is the only animation.
- **Accessibility:** text colors are checked against WCAG AA on every background (see comments in `global.css`); font sizes in `rem`, never set on `html`; visible `:focus-visible` outlines; respect `prefers-reduced-motion`; layouts must reflow at 320px.
- **CSP:** Astro's `security.csp` hashes inline scripts/styles into a `<meta>`; header-only directives are in `vercel.json`. No inline `style=""`, no `define:vars`, no Shiki (Prism is configured — add a Prism theme when code blocks appear). Test CSP with `npm run build && npm run preview`, not `dev`.
- Before finishing UI work, look at it: build, preview, and screenshot at desktop and phone widths (headless Chrome's minimum window is 500px — use an iframe page for 390/320px).

## Hosting facts (as of 2026-10-16)

- DNS and email are at GoDaddy (nameservers `domaincontrol.com`; MX `mx1/mx2-us1.ppe-hosted.com`; SPF includes `secureserver.net`). When pointing the site at Vercel, change only the `@` A record and `www` CNAME — never the MX/TXT records.
- GitHub Pages is still enabled from `master` (legacy) at jnewton86.github.io/jnewton-pro/; disable it at cutover.

## Roadmap

- Phase 1 (this branch): Astro foundation, accessibility fixes, CI.
- Phase 2: SEO/GEO — structured data from `site.config.ts`, OG images, Lighthouse/axe in CI.
- Phase 3: services section and case studies (dual audience), real contact form (Vercel function + Turnstile).
- Phase 4: AI-assisted blog (Markdown collection, RSS, draft/review skills in this repo).
