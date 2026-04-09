# FRICTION-LOG

## Use
Capture real friction observed while validating `AI_CEO` with the frozen Agentic Pi Harness.

## Severity rules
- **Blocker**: stops real bounded validation now.
- **Enhancement**: does not stop validation; would improve speed, confidence, or clarity.

## Categories
- CONFIGURATION
- DEPENDENCIES
- POLICY / ACCESS
- BUILD / TYPECHECK
- LINT
- RUNTIME / DEV SERVER
- ARTIFACTS / OBSERVABILITY
- UX / DOCS
- SCOPE / MISMATCH

## Initial entries
| ID | Severity | Category | Finding | Evidence | Suggested disposition |
|---|---|---|---|---|---|
| F-001 | Blocker | LINT | `npm run lint` fails due to synchronous `setState` inside an effect in `web/app/page.tsx`. | ESLint error: `react-hooks/set-state-in-effect` at line 90. | Fix before using lint-pass as validation gate. |
| F-002 | Enhancement | LINT | Unused `Badge` import in `web/components/sections/OverviewSection.tsx`. | ESLint warning from current lint run. | Clean up during lint-fix pass. |
| F-003 | Enhancement | BUILD / TYPECHECK | Next.js warns that workspace root was inferred from a higher-level lockfile. | `npm run build` warning about `/Users/jaywest/package-lock.json`. | Optionally set `turbopack.root` or normalize lockfiles. |
| F-004 | Enhancement | SCOPE / MISMATCH | No automated tests or browser automation config detected. | No Jest/Vitest/Playwright config or test files found. | Keep validation scope bounded to install/lint/build/runtime smoke. |
| F-005 | Blocker | RUNTIME / DEV SERVER | Non-interactive piped `npm run start` harness session failed before running due to Ink raw-mode requirement. | Error: `Raw mode is not supported on the current process.stdin` when piping input into the TUI start command. | For automated smoke, use `PI_MOCK=1 npm run demo`; for true interactive sessions, run `npm run start` in a real terminal. |
| F-006 | Enhancement | ARTIFACTS / OBSERVABILITY | Mock external-target session showed artifact containment was correct: session artifacts stayed in harness `.runtime/sessions`, no target-repo file mutations were recorded. | Session `2026-04-09T19-39-35-f2uBgnSy`: `changed-files.json` empty, `git-diff.patch` = `# no diff`, `policy-violations.json` empty. | Keep as evidence that the frozen harness can target a sibling repo without artifact drift in mock mode. |
| F-007 | Resolved | LINT | Frontend lint blocker in `web/app/page.tsx` was fixed by moving URL-param-derived state initialization into `useState` initializers. | Post-fix `cd web && npm run lint` passes. | Closed. |
| F-008 | Enhancement | BUILD / TYPECHECK | Build still emits a non-blocking Next.js workspace-root warning caused by a higher-level lockfile. | Post-fix `cd web && npm run build` passes with warning only. | Optional future cleanup; not a blocker. |
| F-009 | Enhancement | RUNTIME / DEV SERVER | Live harness validation could not be exercised because no `ANTHROPIC_API_KEY` was present. | Env check returned `NO_LIVE_KEY`. | Run live mode later in a real terminal with credentials. |
| F-010 | Resolved | UX / DOCS | Noninteractive/headless `start` failure is now deterministic and operator-guiding instead of surfacing an Ink stack trace. | `printf 'x\n' | PI_MULTI_CONFIG=config/multi-team.external-target.yaml npm run start` now exits with a clear TTY/raw-mode message and points to `PI_MOCK=1 npm run demo`. | Closed as operational hardening only; no new CLI mode added. |

## Template
| ID | Severity | Category | Finding | Evidence | Suggested disposition |
|---|---|---|---|---|---|
| F-XXX | Blocker/Enhancement | CATEGORY | Short statement | command / file / artifact | fix now / defer / document |
