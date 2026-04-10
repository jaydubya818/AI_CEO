# AI_CEO

AI_CEO is an AI-native executive decision platform designed to turn **uncertainty in → decisions out**.

It is built to help founders, CEOs, chiefs of staff, product leaders, engineering leaders, and operator-led teams run structured, inspectable, repeatable decision sessions instead of relying on fragmented context, ad hoc chats, and vague AI summaries.

This repo is the **product/application layer** of the system.

It works with:
- **Agentic Pi Harness** — orchestration/runtime/control plane
- **Sofie** — bounded reviewer/operator/advisor inside the harness
- **Agentic-KB** — authoritative external knowledge graph, memory, retrieval, and reviewed-ingest target

---

## What AI_CEO is

AI_CEO is not a generic chatbot.

It is a product for:
- structured executive decision sessions
- reusable decision briefs
- CEO framing
- specialist reasoning
- board-style deliberation artifacts
- durable decision memory
- governance and review flows
- reviewed writeback and canonical ingest into Agentic-KB

The goal is to create a system where:
- a user submits a brief
- a decision packet is built
- specialist/board reasoning is applied
- structured outputs are generated
- history is preserved
- outcomes are tracked
- approved learnings are promoted into governed organizational memory

---

## System architecture

### Repo roles

#### AI_CEO
This repo. Responsible for:
- product/app UX
- decision packet generation
- history and persistence
- governance queue
- promotion review flows
- reviewed writeback initiation
- reviewed-ingest invocation into Agentic-KB
- local reviewer identity scaffolding
- runtime expertise shaping
- future specialist reasoning entry seam

#### Agentic Pi Harness
External runtime/orchestration/control plane. Responsible for:
- bounded orchestration
- session/runtime artifacts
- replayable decision/session flows
- Sofie integration
- proof-path and canonical golden protections

#### Sofie
Bounded advisor/reviewer/operator helper. Responsible for:
- bounded review/closure/scoping guidance
- artifact interpretation
- escalation for true blockers
- post-deliberation/operator support

Sofie is **not** a second orchestrator.

#### Agentic-KB
External and authoritative knowledge/memory system. Responsible for:
- knowledge retrieval
- reviewed ingest
- canonical learned docs
- repo-scoped reviewed memory storage
- authoritative knowledge context

AI_CEO does **not** absorb Agentic-KB canonical state.

---

## Current MVP status

AI_CEO currently includes a bounded MVP that supports:
- real decision packet generation
- structured decision packet types
- API-backed decision packet flow
- durable decision/session storage
- decision history retrieval
- reopen previous decisions
- simple decision comparison
- outcome tracking scaffold
- memory promotion proposal scaffold
- expertise promotion proposal scaffold
- governance queue state and actions
- reviewed writeback execution
- reviewed-ingest invocation into Agentic-KB
- reviewer identity scaffolding
- runtime expertise shaping
- artifact/timeline/audit visibility
- model-backed specialist reasoning entry seam

---

## Current capabilities

### 1. Decision packet flow

AI_CEO generates a real server-backed decision packet that can include:
- brief
- structured deliberation result
- final positions
- tensions
- recommendation
- risks
- next actions
- KB evidence references
- outcome scaffold
- promotion scaffolds

### 2. Durable decision memory

AI_CEO persists decision history locally. Current storage includes:
- brief
- full decision packet
- deliberation result
- final positions, tensions, recommendation, risks, next actions
- evidence references
- outcome state
- proposal state
- audit events
- timeline events

### 3. Governance and review

AI_CEO supports governed promotion flows for memory and expertise, including:
- proposal creation, review, approval/rejection
- second-review transitions
- explicit writeback execution
- explicit reviewed-ingest execution
- auditability
- visible queue state

### 4. Reviewed writeback + reviewed ingest

AI_CEO can explicitly:
1. generate approved payloads
2. write reviewed export files into Agentic-KB review-export paths
3. invoke Agentic-KB reviewed-ingest routes
4. receive canonical ingest results back

This path is explicit, inspectable, review-gated, non-silent, and auditable.

### 5. Runtime expertise shaping

Approved expertise can affect live packet/runtime behavior in a bounded, visible, reversible way. Current bounded effects include shaping:
- CEO frame augmentation
- next-action generation
- packet-level expertise application narrative
- specialist reasoning entry seam context

### 6. Artifact exploration

AI_CEO surfaces:
- timeline events
- audit events
- proposal state transitions
- writeback execution visibility
- reviewed-ingest execution visibility
- recommendation diff surface
- changed-since-decision display

---

## Governance model

### Proposal kinds
- memory promotion
- expertise promotion

### Governance states
- `proposed` → `under_review` → `approved` / `rejected` → `executed`

### Reviewer model
Roles: `reviewer`, `governance-admin`

Expertise proposals require two approvals before reaching approved state.

---

## APIs

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/decision-packet` | POST | Build a structured decision packet |
| `/api/decision-history` | GET | Return stored decision/session history |
| `/api/decision-outcome` | POST | Update a stored decision outcome (`executed`, `deferred`, `reversed`, `validated`, `invalidated`) |
| `/api/memory-promotion` | POST | Create/update memory promotion proposal |
| `/api/expertise-promotion` | POST | Create/update expertise promotion proposal |
| `/api/promotion-review` | POST | Handle approve/reject and review-state transitions |
| `/api/governance-queue` | GET | Return governance queue state |
| `/api/writeback-execute` | POST | Execute reviewed export/writeback into Agentic-KB |
| `/api/reviewed-ingest-execute` | POST | Invoke Agentic-KB reviewed-ingest after explicit review/writeback |
| `/api/runtime-expertise` | GET | Return current bounded runtime expertise state |
| `/api/auth/reviewer` | GET / POST | Read/set the current local reviewer identity scaffold |

---

## File/data model

Local durable storage: `web/.data/decision-history.json`

Key product objects:
- decision packet, stored decision record, deliberation result
- final position, tension record, decision summary
- outcome record, memory promotion proposal, expertise promotion proposal
- audit event, governance queue item, runtime expertise state

---

## Specialist reasoning direction

AI_CEO includes a bounded entry seam for future model-backed specialist reasoning. The current direction:
- specialist config is explicit
- runtime injection is visible
- future reasoning must remain inspectable and bounded
- future reasoning must not silently widen authority

Planned first specialist set: Product Strategist, Revenue Agent, Technical Architect, Contrarian

Optional next layer: Compounder, Moonshot

---

## Repo separation guarantees

**AI_CEO does:**
- product UX, decision memory, governance, proposal review, audit
- explicit writeback initiation and reviewed-ingest invocation
- runtime shaping

**AI_CEO does not:**
- become the canonical KB or absorb Agentic-KB canonical state
- replace the harness runtime or widen Sofie into orchestration

---

## Safety and boundedness

AI_CEO is intentionally bounded. Current rules:
- no silent writeback or automatic canonical promotion
- no hidden repo collapse or silent governance bypass
- no hidden expertise behavior or broad execution/task automation
- no widening of Sofie authority from this repo

---

## Project layout

| Path | Purpose |
|------|---------|
| `web/` | Next.js app (App Router), Tailwind CSS, TypeScript |
| `web/.data/` | Local durable decision/session storage |
| `CLAUDE.md` | Project conventions and GSD workflow |

---

## Local development

```bash
cd web
npm install
npm run dev       # http://localhost:3001
npm run build     # production build
npm run lint      # ESLint
```
