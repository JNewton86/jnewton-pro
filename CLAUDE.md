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

## Hosting facts (as of 2026-10-17)

- Vercel project: `jnewton86s-projects/jnewton-pro` (Jeff's personal team — never `relaunch-with-ai`). Production branch `master`; PRs get preview deployments behind Vercel Deployment Protection (use `https://jnewton-pro.vercel.app` or the live domain for unauthenticated checks).
- Domains: `jnewton.pro` is primary; `www.jnewton.pro` 308-redirects to it. Certificates are issued and renewed by Vercel.
- DNS is at GoDaddy (nameservers `domaincontrol.com`). Website records: apex A → `216.198.79.1` and `64.29.17.1`; `www` CNAME → `78e15f2e774d4144.vercel-dns-017.com`.
- Email is Microsoft 365 through GoDaddy: MX `mx1/mx2-us1.ppe-hosted.com`, SPF TXT (`include:secureserver.net`), an `onmicrosoft.com` verification TXT, and `autodiscover`/`email`/`lyncdiscover` CNAMEs. **Never change these when editing DNS.**
- GoDaddy Website Builder has lapsed and is no longer used. GitHub Pages is disabled.
- Vercel actions (CLI or MCP) always prompt Jeff for approval, by his choice.

## Roadmap

- Phase 1 (done, PR #1): Astro foundation, accessibility fixes, CI, Vercel cutover.
- Phase 2: SEO/GEO — structured data from `site.config.ts`, OG images, Lighthouse/axe in CI.
- Phase 3: services section and case studies (dual audience), real contact form (Vercel function + Turnstile).
- Phase 4: AI-assisted blog (Markdown collection, RSS, draft/review skills in this repo).
