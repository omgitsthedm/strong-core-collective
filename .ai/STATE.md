# Strong Core Collective AI-Ops State

## Identity

- Project Code: LFNYC-SCC
- Name: Strong Core Collective
- Tier: Tier 2 · Risk: Low–Medium (live static site + contact/booking lead forms)
- Canonical Path: /Users/davidmarsh/Desktop/LiFi NYC/Clients/Strong Core Collective/strong-core-collective
- Git-backed: yes · Remote: https://github.com/omgitsthedm/strong-core-collective.git · Default branch: `master`

## Current Stamp

- Updated: 2026-06-28
- Updated By: Claude
- Basis: AI-Ops onboarding (handoff-ready). Read-only scope + exposure-prep redirects.
- Git HEAD at onboarding: 52c92c1

## Rules Version

- 2026-06-27-aiops-foundation-v1

## State Confidence

- High for path/repo/branch/remote/stack/commands and live domain (`strong-core-collective.netlify.app`, repo-evidenced `publish="."`).

## Current Live Truth

- Live URL: `https://strong-core-collective.netlify.app` (Netlify primary; current deploy state: ready). No custom domain observed.
- Host: Netlify, static `publish = "."`, no build. Security headers + redirects defined in `netlify.toml`.
- Forms: contact + booking forms have Netlify Forms markup (index/about/services), BUT Netlify reports Forms **"not enabled"** for this project — submissions may not be captured.
- `.ai/`, `CLAUDE.md`, `AGENTS.md` now blocked from public serving via forced `404` redirects added to `netlify.toml`.
- Production QA status: not run by AI-Ops.

## Repo State

- Branch `master`, in sync with origin at onboarding; clean working tree (before AI-Ops files).
- Pages: index + about/ services/ pricing(→/services/) book/ contact/ locations/ thanks/ + 404.html. assets/, components/, robots.txt, sitemap.xml present.

## Risk / Compliance

- Low–Medium. No payments/regulated copy. Real lead forms = transactional.
- LFNYC pricing doctrine applies (prices not published; `/pricing` 301s to `/services/`).

## QA-PENDING

- Confirm Netlify Forms enablement (markup present but project shows "not enabled") so contact/booking leads are actually captured + notified.
- After next deploy, verify `/.ai/STATE.md`, `/CLAUDE.md`, `/AGENTS.md` return 404 on live.
- Optional: confirm all images are `.webp` with `width`/`height` + lazy-load.
- Confirm whether a custom domain is planned (currently netlify subdomain only).

## Do Not Touch

- `.env`/secrets.
- The forced `404` redirects for `/.ai/*`, `/CLAUDE.md`, `/AGENTS.md` (keep internal docs private under `publish="."`).
- The existing security headers / CSP in `netlify.toml` (no weakening without review).
- `git push` to `master` (= production deploy) without `APPROVE LIVE CHANGE`.

## Proposed Changes / Inbox

- None yet.

## Next Steps Queue

- Enable/verify Netlify Forms; confirm lead notifications route to the client.
- Verify internal-docs 404s on live after deploy.

## Recent Session History

- 2026-06-28: Claude onboarded Strong Core Collective to AI-Ops (handoff-ready). Created `.ai/{LOCK,RULES_HEADER,RULES,STATE}.md` + `AGENTS.md` + `CLAUDE.md` (Commands + AI-Ops pointer). EXPOSURE PREP: added forced `404` redirects for `/.ai/*`, `/CLAUDE.md`, `/AGENTS.md` to `netlify.toml` (site is `publish="."`). No site content/source changed. Flagged Netlify Forms "not enabled".

## Next Agent Directive

Read `.ai/RULES.md` + `.ai/STATE.md` + `CLAUDE.md` first. Live static site on `master`, `publish="."`. Real contact/booking lead forms — don't submit test leads to production; confirm Netlify Forms is enabled. `git push` to `master` = production deploy (gated). Keep the `/.ai/*` + `/CLAUDE.md` + `/AGENTS.md` → 404 redirects and the existing CSP/headers. Don't read `.env`/secrets.

## Emergency / Bypass Notes

- No bypass for deploy/push/lead-form/production mutations.
- Bypass/YOLO is only an execution accelerator for approved local setup and read-only verification.
- Emergency mode: stop, preserve evidence, smallest reversible action.
