# REAL-PROJECT-PLAYBOOK

## Goal
Run the existing Agentic Pi Harness against `AI_CEO` without embedding `AI_CEO` into the harness repo and without changing canonical session artifacts, contracts, or goldens.

## Frozen harness assumptions
Frozen means:
- keep session artifacts under the harness repo: `.runtime/sessions/<id>/`
- keep current artifact contracts unchanged
- keep current session summary / changed-files / artifacts / policy-violations / topology outputs unchanged
- keep approval/policy behavior unchanged
- avoid adding new harness features

The only harness-side adaptation allowed for this setup is selecting an alternate config file that points reads at an external target repo.

## Harness config for external target
Use:
- `config/multi-team.external-target.yaml`

This config keeps harness-owned writes inside the harness repo while targeting:
- repo root: `../AI_CEO`
- explicit agent workdir: `../AI_CEO/web`
- frontend-only engineering write path: `../AI_CEO/web`

For safety, the external-target config removes harness-local backend engineering write paths for this validation target and keeps only the frontend worker able to mutate the target repo.

## How to run from the harness repo
From `pi-multi-team-local/`:

### 1) sanity-check harness environment
```bash
npm run check-env
```

### 2) optional frozen harness self-checks
```bash
npm run typecheck
npm run lint
npm test
```

### 3) run against AI_CEO in mock mode first
Use the supported frozen noninteractive smoke path:
```bash
PI_MULTI_CONFIG=config/multi-team.external-target.yaml PI_MOCK=1 npm run demo
```

### 4) run against AI_CEO in live mode
Run only in a real terminal:
```bash
PI_MULTI_CONFIG=config/multi-team.external-target.yaml npm run start
```

All agents in this external-target setup use `../AI_CEO/web` as workdir so relative tool activity resolves inside the chosen frontend validation target.

If `npm run start` is launched without an interactive TTY/raw-mode-capable stdin, the harness now fails closed with an explicit message pointing to the supported paths above.

## Suggested prompts for bounded validation
- `@validation inspect ../AI_CEO/web and report validation blockers for install, lint, build, and runtime smoke`
- `@engineering inspect the AI_CEO frontend and propose the smallest changes needed to make lint and build pass`
- `validation-only: evaluate whether AI_CEO is ready for bounded CLI validation and list blockers vs enhancements`

## What artifacts to inspect
In harness session output under `.runtime/sessions/<id>/` inspect:
- `summary.md`
- `events.jsonl`
- `routing-decisions.jsonl`
- `topology.json`
- `changed-files.json`
- `artifacts.json`
- `policy-violations.json`
- `timing.json`
- `git-diff.patch`
- files under `artifacts/`
- optional files under `plans/` and `validation/`

## Review guidance
### Blocker
A finding is a blocker if it prevents real bounded validation now, such as:
- dependency install failure
- build failure
- hard runtime crash on startup
- policy/config mismatch that prevents safe targeting
- session artifacts missing or unusable

### Enhancement
A finding is an enhancement if validation can still proceed, for example:
- lint warnings or non-fatal lint cleanup
- build warnings that do not block execution
- lack of tests where bounded smoke validation is still possible
- better docs, scripts, or ergonomics

## Friction categories
Record friction under these categories:
- `CONFIGURATION`
- `DEPENDENCIES`
- `POLICY / ACCESS`
- `BUILD / TYPECHECK`
- `LINT`
- `RUNTIME / DEV SERVER`
- `ARTIFACTS / OBSERVABILITY`
- `UX / DOCS`
- `SCOPE / MISMATCH`

## Safety notes
- keep `AI_CEO` as a sibling repo, not nested into the harness
- do not move harness artifacts into `AI_CEO`
- do not alter canonical contracts or session artifact names
- prefer config selection over code changes
- keep any target-repo docs practical and disposable
