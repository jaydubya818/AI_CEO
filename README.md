# AI CEO

AI-powered executive decision support — a Next.js frontend for exploring and acting on executive-level decisions with agent-assisted workflows.

**Repository:** [github.com/jaydubya818/AI_CEO](https://github.com/jaydubya818/AI_CEO)

## Project layout

| Path | Purpose |
|------|---------|
| `web/` | Next.js app (App Router), Tailwind CSS, TypeScript |
| `.claude/` | Claude / GSD framework settings |
| `CLAUDE.md` | Project conventions and slash-command workflow hints |

## Prerequisites

- Node.js 20+ (recommended for Next.js 16)
- npm (or pnpm/yarn if you prefer)

## Local development

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other commands

```bash
cd web
npm run build   # production build
npm run lint    # ESLint
```

## Product context

The product focus is an **AI CEO Agent**–style experience: executive decision-support UI built with React, Tailwind, and Lucide icons. For day-to-day agent instructions, see `CLAUDE.md` in the repo root and `web/AGENTS.md` for workspace-specific notes.
