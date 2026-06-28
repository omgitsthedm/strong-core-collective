# AI-Ops Project Rules

Rules Version: 2026-06-27-aiops-foundation-v1
Generated date/time: 2026-06-28T02:28:37-0700
Source Base: /Users/davidmarsh/AI-OPS/TEMPLATES/RULES_BASE.md
Source Header: /Users/davidmarsh/Desktop/LiFi NYC/Clients/Strong Core Collective/strong-core-collective/.ai/RULES_HEADER.md
<!-- AI-OPS-GENERATED: edit RULES_HEADER.md or RULES_BASE.md, then rerun generate-rules. -->
<!-- AI-OPS-CONTENT-CHECKSUM: 1129816007:9792 -->

<!-- AI-OPS-CONTENT-BEGIN -->
## Project Rules Header

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

## Shared Rules Base

# AI-Ops Shared Rules Base

This is the canonical shared behavior contract for Little Fight NYC AI-Ops work.

Keep truth in the repo. Store only what Git cannot know. Maintain shared rules once. Automate facts. Have AI propose judgment. Safety overrides forward motion.

## Command Words

Agents must recognize these exact commands:

- `SESSION START`
- `SESSION CLOSEOUT`
- `APPROVE LIVE CHANGE`
- `STOP`
- `HALT`

## Operating Contract

- Repo truth beats chat truth.
- Git knows code history.
- Deployment/build metadata knows what shipped.
- `.ai/STATE.md` stores what Git cannot know.
- Ideas go to inbox before becoming rules.
- Production QA must separate observation from transaction.
- Autonomy is useful until risk appears.
- Safety overrides forward motion.

## SESSION START Protocol

When starting work:

1. Read `.ai/RULES.md`.
2. Read `.ai/STATE.md`.
3. Check the current branch, worktree, and git status.
4. Check recent commits relevant to the requested work.
5. Check whether `.ai/STATE.md` is stale against Git, deploy metadata, or current task context.
6. Check `QA-PENDING` before claiming anything is complete.
7. State the current branch, dirty files, active risk level, and intended first action.

Do not rely on chat memory when the repo has a newer source of truth.

## SESSION CLOSEOUT Protocol

Before ending a work session:

1. Update `.ai/STATE.md` with facts Git cannot know.
2. Record unresolved `QA-PENDING` items.
3. Record proposed rule changes in the inbox rather than editing generated rules directly.
4. Report branch, files created, files modified, verification run, warnings, and next-agent directive.
5. Do not claim production QA passed unless production QA was actually run and stayed observational or was properly approved.

## Emergency Mode

Emergency Mode applies when production, client data, billing, secrets, auth, DNS, deployments, or irreversible operations may be affected.

In Emergency Mode:

- Stop forward feature work.
- Preserve evidence.
- Do the smallest reversible action.
- Ask David before destructive or transactional action.
- Prefer observation, rollback, and containment over new behavior.

## STOP / HALT Protocol

`STOP` means pause all work and report current state.

`HALT` means stop immediately, avoid further file or system changes, and report the last completed action plus the next safest recovery step.

If a STOP or HALT conflicts with automation, human instruction wins.

## APPROVE LIVE CHANGE Protocol

`APPROVE LIVE CHANGE` is required before any live transactional action unless the action is sandboxed, staged, explicitly David-run, or already protected by a project-specific approved safe path.

Approval must be scoped to a specific action. It does not authorize unrelated live changes.

## Proposed Changes / Inbox

Rules are not rewritten ad hoc.

Put candidate changes in `.ai/STATE.md` under `Proposed Changes / Inbox` with:

- Proposal
- Reason
- Risk
- Source evidence
- Suggested owner

Promote proposals into `.ai/RULES_HEADER.md` or `~/AI-OPS/TEMPLATES/RULES_BASE.md` only after review.

## Tactical Visibility Before >3 Source File Edits

Before editing more than three source files, report:

- Goal
- Files expected to change
- Risk
- Verification plan
- Rollback plan

Documentation, generated rules, and state files still require visibility when they affect agent behavior.

## Observational vs Transactional QA Split

Observational production QA is allowed when it only reads public or authorized state and does not create, mutate, submit, send, buy, book, upload, export, or persist anything.

Transactional production QA is not allowed unless sandboxed, staged, explicitly David-run, or gated by `APPROVE LIVE CHANGE` plus a safe test path.

If a `qa:prod` harness exists, run it instead of improvising checks.

Transactional actions include:

- live checkout orders
- live payments
- real appointment bookings
- real lead form submissions
- real client emails
- real database writes
- real uploads into client workflows
- PHC bid/export actions that could alter client data
- anything that pollutes client records, calendars, inboxes, analytics, orders, or production data

## Dangerous Operation Gate

Do not perform dangerous operations without explicit approval.

Dangerous operations include:

- pushing to protected branches
- deploying
- deleting files or cloud resources
- modifying secrets, `.env`, DNS, auth, or billing
- mutating production data
- running live transactional QA
- changing production infrastructure

The required approval phrase for live danger is `APPROVE LIVE CHANGE`.

No standing autonomy, Emergency Mode, or "do it all / don't ask" instruction elevates past this gate. Transactional production actions always require `APPROVE LIVE CHANGE`, scoped to the single action.

## Stale State Protocol

If `.ai/STATE.md` conflicts with Git, deploy metadata, logs, or current source files:

1. Treat the state as stale.
2. Use repo/deploy facts as the higher source of truth.
3. Update `.ai/STATE.md` during closeout with the corrected fact and evidence.
4. Do not silently carry stale assumptions forward.

## QA-PENDING Protocol

`QA-PENDING` means work is not verified enough to claim done.

Each pending item must include:

- What needs verification
- Why it matters
- Safe verification path
- Whether it is observational or transactional
- Current owner

Do not collapse QA-PENDING into success language.

## Collision Detection

Before editing, check for collisions:

- current branch
- current worktree
- `git status --short`
- recent commits
- existing lock file if the project uses one
- whether Claude Code, Codex, or another agent is likely active on the same branch or files

If a collision appears likely, stop and report the risk before writing.

## Optional Lock File Protocol

Projects may use `.ai/LOCK.md` for coordination.

If present, read it before edits. If creating one, include:

- Agent
- Branch
- Files or area claimed
- Start time
- Expected closeout
- Recovery note

Do not use a lock file as permission to bypass safety gates.

## Session History Compaction

Keep durable state short and factual.

Use `.ai/STATE.md` for current operational truth, not transcripts. Summarize long histories into recent decisions, unresolved risks, next steps, and evidence pointers.

## Safety Override

Safety overrides forward motion.
<!-- AI-OPS-CONTENT-END -->
