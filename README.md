# AI_CEO

AI_CEO is the product/application layer for an AI-native executive decision system.

It is built to help a CEO, founder, chief of staff, or operator-led team turn a structured brief into a governed decision session with visible reasoning, durable memory, explicit review flows, and bounded promotion into external knowledge.

This repo is intentionally separate from:
- **Agentic Pi Harness**: runtime/control-plane/orchestration layer
- **Sofie**: bounded post-review/operator advisor inside the harness
- **Agentic-KB**: external authoritative knowledge and reviewed-ingest/canonical memory system

AI_CEO is not the control plane and not the canonical KB.

---

## Product overview

AI_CEO is a decision operating system, not a generic chat UI.

The current MVP focuses on:
- decision briefs
- executive decision packets
- board-style deliberation artifacts
- bounded specialist reasoning
- decision governance and approvals
- durable local history
- explicit reviewed writeback and reviewed ingest into Agentic-KB
- outcome/execution/cadence scaffolds

The goal of the MVP is to make decision-making:
- structured
- inspectable
- reviewable
- replayable
- governed
- incrementally learnable

---

## Current MVP capabilities

### Real decision-session flow
- submit a brief
- retrieve bounded AI_CEO repo context from Agentic-KB
- build a structured decision packet
- run bounded specialist reasoning
- render CEO frame, board outputs, final positions, tensions, risks, and next actions
- persist the resulting decision record locally

### Governance and review
- reviewer identity selection via local reviewer auth scaffold
- proposal creation for:
  - memory promotion
  - expertise promotion
- governance queue with filtering and actions
- explicit approval/rejection flow
- second-review enforcement for expertise proposals
- explicit writeback and explicit reviewed-ingest execution
- durable audit trail and timeline

### Specialist reasoning
- bounded one-pass specialist set:
  - Product Strategist
  - Revenue Agent
  - Technical Architect
  - Contrarian
- structured specialist outputs:
  - recommendation
  - strongest rationale
  - key risk
  - condition that changes the view
  - confidence
- specialist outputs influence:
  - CEO frame refinement
  - recommendation shaping
  - next actions
  - tensions
  - final positions where roles match
- provider-capable execution path with deterministic fallback

### Durable memory/history
- local file-backed decision history
- reopen prior decisions
- decision comparison view
- timeline/audit visibility
- proposal status visibility
- artifact diff snippets

### Explicit Agentic-KB integration
- reviewed writeback to repo-scoped review-export paths
- explicit reviewed-ingest invocation into Agentic-KB canonical learned area
- canonical merge logic stays in Agentic-KB

### Scaffolds now present
- execution follow-through scaffold
- outcome learning scaffold
- operating cadence grouping scaffold by cadence/topic key
- provider observability trace scaffold for specialist execution

---

## Architecture boundaries

### AI_CEO
This repo owns:
- product UX
- decision packet orchestration at the app layer
- local persistence/history
- reviewer/governance UX and APIs
- explicit writeback initiation
- explicit reviewed-ingest invocation
- specialist reasoning seam and packet-visible outputs
- bounded execution/outcome/cadence scaffolds

### Agentic Pi Harness
External runtime/control-plane layer.

It owns:
- frozen runtime/proof-path surfaces
- bounded orchestration logic
- Sofie runtime behavior
- replay/control-plane concerns

This repo should **not** become the harness.

### Sofie
Sofie remains a bounded post-review/operator advisor.

Sofie is **not** widened by this repo and is **not** a free-roaming orchestrator.

### Agentic-KB
External authoritative knowledge system.

It owns:
- repo-scoped knowledge retrieval
- reviewed export targets
- reviewed ingest
- canonical learned memory

AI_CEO does **not** write canonical KB content silently or directly outside explicit reviewed flows.

---

## Setup / environment requirements

### Repo location assumptions
Current local workflows assume sibling repos similar to:
- `~/Pi/AI_CEO`
- `~/Pi/Agentic-KB`
- `~/Pi/pi-multi-team-local/Agentic-Pi-Harness`

### Node / packages
- use the package manager already present in `web/`
- install dependencies in `web/`

### Required / useful environment variables
#### Agentic-KB integration
- `AGENTIC_KB_URL`
  - default local expectation: `http://localhost:3002`
- `AGENTIC_KB_PATH`
  - optional local path override for explicit reviewed export writeback

#### Specialist reasoning
- `AI_CEO_SPECIALIST_ENABLED`
  - `0` disables specialist reasoning
- `AI_CEO_SPECIALIST_PROVIDER`
  - `stub` (default)
  - `openai-compatible`
  - `disabled`
- `AI_CEO_SPECIALIST_ALLOW_LIVE`
  - `1` to allow live provider use
- `AI_CEO_SPECIALIST_DISABLED_ROLES`
  - comma-separated role names to disable
- `AI_CEO_SPECIALIST_BASE_URL`
  - base URL for OpenAI-compatible provider
- `AI_CEO_SPECIALIST_API_KEY`
  - provider API key
- `AI_CEO_SPECIALIST_MODEL`
  - model name, defaults to `gpt-4o-mini`

### Reviewer/auth model
Reviewer identity is currently local/MVP-oriented:
- cookie-backed reviewer selection
- optional header-based resolution for API calls
- roles:
  - `reviewer`
  - `governance-admin`

This is not production auth yet.

---

## Dev commands

Run from `web/`:

```bash
npm install
npm run test
npm run build
npm run dev
```

Available scripts:
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run test`

Notes:
- `lint` exists and is practical to run when needed
- there is no separate standalone typecheck script; `next build` covers TypeScript checks

---

## Key APIs/routes that exist now

Under `web/app/api/`:

- `/api/auth/reviewer`
  - GET/POST
  - read/set local reviewer identity scaffold
- `/api/decision-packet`
  - POST
  - build the decision packet for a submitted brief
- `/api/decision-history`
  - GET
  - return stored decision history + comparison rows
- `/api/decision-outcome`
  - POST
  - update outcome status/notes/change summary
- `/api/memory-promotion`
  - POST
  - create/update memory promotion proposal
- `/api/expertise-promotion`
  - POST
  - create/update expertise proposal
- `/api/promotion-review`
  - POST
  - apply governance review transitions/policy
- `/api/governance-queue`
  - GET
  - return governance queue state with filters
- `/api/writeback-execute`
  - POST
  - execute explicit reviewed export writeback to Agentic-KB review-export namespace
- `/api/reviewed-ingest-execute`
  - POST
  - invoke Agentic-KB reviewed-ingest after explicit reviewed export exists
- `/api/runtime-expertise`
  - GET
  - expose current active expertise-derived runtime state

---

## Key modules that exist now

Important app-layer modules under `web/lib/`:

- `persistence.ts`
  - durable local decision storage
  - governance state updates
  - writeback/ingest audit recording
- `auth.ts`
  - reviewer identity scaffold
- `agenticKbClient.ts`
  - AI_CEO -> Agentic-KB reviewed-ingest invocation
- `kbWriteback.ts`
  - explicit reviewed export writeback
- `reasoningEntry.ts`
  - specialist reasoning provider/config seam
- `specialistPolicy.ts`
  - specialist execution policy resolution and validation
- `specialistProvider.ts`
  - live OpenAI-compatible provider call path
- `specialistReasoning.ts`
  - bounded specialist execution and packet refinement
- `runtimeExpertise.ts`
  - visible, bounded runtime expertise shaping

Important UI sections:
- `components/sections/BriefingsSection.tsx`
- `components/sections/DeliberationSection.tsx`
- `components/sections/DecisionsSection.tsx`

---

## Governance model

### Proposal kinds
- memory
- expertise

### Governance states
- `proposed`
- `under_review`
- `approved`
- `rejected`
- `executed`

### Reviewer roles
- `reviewer`
- `governance-admin`

### Current policy behavior
- explicit reviewer identity is recorded for governance actions
- expertise proposals require two approvals before becoming approved
- governance-admin role has stronger approval authority
- approvals, writeback, and ingest are all auditable

This is an MVP governance system, not a production authz system.

---

## Reviewed writeback + reviewed-ingest flow with Agentic-KB

Current explicit flow:

1. AI_CEO creates/approves a proposal
2. AI_CEO builds an approved payload with explicit target path/contract
3. AI_CEO executes reviewed export writeback into Agentic-KB review-export namespace
4. AI_CEO explicitly invokes reviewed ingest
5. Agentic-KB ingests into:
   - repo-scoped reviewed-ingest record
   - repo-scoped canonical learned doc

Properties of this flow:
- explicit
- inspectable
- review-gated
- auditable
- externalized to Agentic-KB
- reversible by path/file operations, not hidden mutation

There are **no silent canonical writes** from AI_CEO into Agentic-KB.

---

## Specialist reasoning layer

### Bounded specialist set
Current specialists:
- Product Strategist
- Revenue Agent
- Technical Architect
- Contrarian

### Provider behavior
Specialist execution supports:
- `stub`
  - deterministic fallback/default
- `openai-compatible`
  - real provider-backed path when env/config is present and live use is allowed
- `disabled`
  - specialist reasoning blocked by policy

### Output shape
Every specialist must return:
- `recommendation`
- `strongest rationale`
- `key risk`
- `condition that changes the view`
- `confidence`

### Policy and fallback behavior
Specialist execution policy determines:
- whether reasoning is enabled
- which specialists are allowed
- whether live provider use is allowed
- whether fallback is used
- when execution is blocked

If provider config is missing or live calls fail, the system falls back to deterministic outputs.

### Observability
Packet artifacts include a specialist execution trace with:
- provider
- mode (`blocked` / `fallback` / `live`)
- model
- latency
- fallback use
- blocked reason

### Boundaries
This layer is intentionally bounded:
- one pass only
- fixed specialist set only
- no debate swarm
- no recursive orchestration
- no hidden autonomy creep

---

## Execution / outcome / cadence scaffolds

### Execution follow-through
Stored decision records now include a bounded follow-through scaffold:
- owner
- status (`planned`, `in_progress`, `done`)
- next checkpoint

### Outcome learning
Stored decision records include a bounded learning scaffold:
- learning summary
- promoted flag

### Operating cadence
Stored decision records include a derived cadence/topic key so related decisions can be grouped over time.

This is a scaffold, not a full recurring operating cadence system yet.

---

## Quality gates / available verification

Relevant quality gates currently practical for this repo:

```bash
cd web
npm run test
npm run build
```

`npm run lint` is also available.

At the time of updating this README, the product has repeatedly been verified through tests/builds in the current MVP cycle.

---

## Known limitations / caveats

This repo is **not yet production-proven**.

Important caveats:
- reviewer identity is local/MVP-grade, not production auth
- governance policy is explicit but still simplified
- specialist provider path is real but may remain unverified live if creds/config are unavailable
- deterministic fallback is heavily relied on for stability and tests
- browser-interactive governance behavior is not fully proven unless manually exercised in a real browser session
- writeback/ingest flows are explicit and bounded, but broader enterprise auth/audit hardening is still missing
- execution follow-through, outcome learning, and operating cadence are scaffolds, not full production loops
- Agentic Pi Harness remains frozen for proof-path/runtime surfaces and should not be treated as app-layer mutable infrastructure from this repo

---

## MVP status

### What is real now
- structured decision packets
- bounded specialist reasoning seam
- provider-capable specialist execution path
- deterministic fallback
- governance queue and reviewer model scaffold
- explicit writeback and reviewed-ingest flow with Agentic-KB
- durable history and comparison
- audit/timeline visibility
- bounded runtime expertise shaping
- execution/outcome/cadence scaffolds

### What is not complete yet
- production-grade authn/authz
- fully proven live provider operation in all environments
- full artifact explorer/version diff UX
- full execution/follow-through/outcome automation
- full PRD-level operating cadence across the business

AI_CEO is currently a **bounded, working MVP foundation**, not a production-complete operating system.
