@AGENTS.md


---

## gstack Integration

> Profile: `product-ui` | gstack at: `~/.claude/skills/gstack`
> Obsidian docs: `02 - Projects/gstack/`

### Active Skills for This Repo

| Skill | Trigger |
|-------|---------|
| `/session-start` | Every session open |
| `/autoplan` | Before any feature |
| `/test-gen` | After plan, before code |
| `/review --dual-model` | Before any PR |
| `/qa` | After any UI change — persistent Chromium |
| `/document-release` | Before every PR merge |
| `/progress` | Every session close |

**Disabled:** `/ship`, `/land-and-deploy`

### .gstackrc (already at repo root)
```
telemetry=off
browser-sandbox=strict
auto-ship=disabled
auto-deploy=disabled
profile=product-ui
```
