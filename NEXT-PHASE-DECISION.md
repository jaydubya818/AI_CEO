# NEXT-PHASE-DECISION

## Current decision
**The external-target workflow is hardened enough for repeated bounded use in mock mode and in live mode from a real terminal; remaining live limitations are environmental, not workflow ambiguity.**

## Why
- install succeeded
- lint now succeeds
- production build succeeds
- mock external-target harness run contained artifacts correctly
- no accidental target-repo mutations were recorded in mock smoke
- external-target setup is now narrowed to frontend-only workdirs/writes

## Evidence
- Mock session: `.runtime/sessions/2026-04-09T19-39-35-f2uBgnSy`
- Hardened mock session: `.runtime/sessions/2026-04-09T19-49-47-1BQ7f9n_`
- `changed-files.json` reported no changed files in `AI_CEO`
- `git-diff.patch` reported `# no diff`
- `policy-violations.json` reported no violations
- replay dump confirmed only planning/engineering(validation frontend-only)/validation paths were exercised in mock flow
- noninteractive `start` now fails closed with deterministic operator guidance instead of an Ink stack trace
- post-fix validation:
  - `cd web && npm run lint` ✅
  - `cd web && npm run build` ✅ (warning only)

## Immediate blockers
1. Live harness validation was not executable here because `ANTHROPIC_API_KEY` is absent.
2. Fully interactive harness `start` sessions still require a real terminal by design; unsupported piped/headless invocation now fails early and explicitly.

## Non-blocking gaps
1. no automated tests
2. build-root warning from higher-level lockfile
3. browser/runtime smoke still desirable for stronger confidence

## Recommended next phase
### Phase 6
In a real terminal with credentials available:
- run `PI_MULTI_CONFIG=config/multi-team.external-target.yaml npm run start`
- execute one validation-focused prompt against `../AI_CEO/web`
- inspect resulting session artifacts for any target writes, approvals, or policy events
- optionally run a browser smoke against the dev server for UI confidence

No further harness-side hardening is recommended unless a true blocker emerges in a real-terminal live run.

## Go / no-go rule
- **Go** if live external-target session artifacts remain contained and any target writes are limited to intended frontend paths.
- **No-go** if live mode introduces artifact drift, unintended harness-local app-code writes, or unsafe writes outside `../AI_CEO/web`.

## Success criteria for next phase
- live harness session runs in a real terminal
- artifacts remain in harness repo
- no contract or golden drift
- target writes, if any, are limited to intended frontend files under `../AI_CEO/web`
- blocker vs enhancement classification remains evidence-based
