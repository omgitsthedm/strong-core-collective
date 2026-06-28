# Strong Core Collective AI-Ops Rules Header

Project Code:

LFNYC-SCC

Project Name:

Strong Core Collective

Business Line:

Client Projects under Little Fight NYC

Tier:

Tier 2 — live static brochure site with contact + booking forms (Netlify Forms markup present).

Risk:

Low–Medium — fitness/wellness studio site; no payments/regulated copy, but it has real contact/booking lead forms. NOTE: Netlify Forms is currently **"not enabled"** for this project, so form submissions may not be captured — verify before relying on it.

Canonical Path:

/Users/davidmarsh/Desktop/LiFi NYC/Clients/Strong Core Collective/strong-core-collective

Remote:

https://github.com/omgitsthedm/strong-core-collective.git  (default branch: `master`)

Host:

Netlify — **static site, `publish = "."`** (whole repo root), no build step. Internal files at repo root WOULD be publicly served at `publish="."`, so `.ai/`, `CLAUDE.md`, `AGENTS.md` are blocked via forced `404` redirects added to `netlify.toml` (`/.ai/*`, `/CLAUDE.md`, `/AGENTS.md`).

Live URL:

`https://strong-core-collective.netlify.app` (Netlify primary URL; no custom domain observed). Project name: `strong-core-collective`.

Stack:

Static HTML/CSS/JS. Multi-page (index + about/services/pricing(redirect)/book/contact/locations/thanks + 404). `netlify.toml` carries security headers (CSP, X-Frame-Options, etc.) and redirects. No framework, no build step, no `package.json`.

## Commands

- Dev / preview: serve the folder statically (e.g. `npx serve .` or Netlify dev); no build needed.
- Build: none (`publish = "."`, static).
- Deploy: `git push origin master` → Netlify (push = production deploy → gated by `APPROVE LIVE CHANGE`). If auto-deploy is unlinked, fallback is `netlify deploy --prod --dir=.`.
- Lint/format: none defined.

## Locked Rules

- Live client site — treat as production. Branch is `master`.
- **LiFi brand:** orange `#FE5800` (hover `#FF6B35`), teal `#0891B2`, midnight `#080b14` / cards `#0d1120`, text `#f0f0ec` / muted `#9da1b0`; fonts Lexend + Caveat 700. Footer on every site: "Designed, Hosted and Cared For by LittleFightNYC.com" in orange.
- **Never publish prices** unless explicitly client-approved (LFNYC pricing doctrine). Note: `/pricing` already 301-redirects to `/services/`.
- Contact/booking forms are real lead capture — **do not submit test leads against production.** Confirm Netlify Forms is enabled before trusting capture.
- Images `.webp` + explicit `width`/`height` + lazy-load below fold.
- Mobile-first, WCAG AA contrast, body text 16px+. Respect `prefers-reduced-motion`.
- `git push` (to `master`) = production deploy → **gated** by `APPROVE LIVE CHANGE`. `.env`/secrets never read.
- `.ai/`, `CLAUDE.md`, `AGENTS.md` stay private via the forced `404` redirects in `netlify.toml` (`publish="."` would otherwise serve them) — do not remove those redirects. Do not weaken the existing security headers / CSP without review.

## Strong Core Collective QA Harness Map

Observational (agent may run): `git status/log`, read source/config, static local serve, public GET to `strong-core-collective.netlify.app`, read-only Netlify deploy/forms metadata.

Transactional/gated (David-run / approved): `git push` / Netlify deploy; real contact/booking lead submissions; enabling Netlify Forms; DNS/domain/env changes; security-header/CSP changes.
