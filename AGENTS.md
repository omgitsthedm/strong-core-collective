# AI Tool Entry

Read `.ai/RULES.md` and `.ai/STATE.md` before working, then `CLAUDE.md`.
The shared project rules live in `.ai/RULES.md`; current state in `.ai/STATE.md`.

Live static client site (`publish="."`, branch `master`). Do not push/deploy, submit real contact/booking leads, weaken the security headers/CSP, modify secrets, or mutate production without the required gate (`APPROVE LIVE CHANGE`). `git push` to `master` = production deploy. Keep the forced `404` redirects for `/.ai/*`, `/CLAUDE.md`, `/AGENTS.md` (they keep internal docs private under `publish="."`).
