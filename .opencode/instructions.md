# Kilo-Kit — OpenCode Plugin

> Entry point for OpenCode integration.

## Setup

This directory enables Kilo-Kit as a plugin for **OpenCode**.

To activate, reference the master skill in your OpenCode configuration:

```
src/core/KILO_MASTER.md
```

## Skill Loading

Skills are loaded from `skills/kilo-kit/` based on intent matching:

| Task Keywords | Skill |
|---------------|-------|
| `bug, error, fix, debug` | `skills/kilo-kit/debugging/systematic/` |
| `root cause, why` | `skills/kilo-kit/debugging/root-cause/` |
| `verify, confirm` | `skills/kilo-kit/debugging/verification/` |
| `review, PR, code review` | `skills/kilo-kit/quality/code-review/` |
| `test, TDD, testing` | `skills/kilo-kit/quality/testing/` |
| `security, auth, OWASP` | `skills/kilo-kit/development/security/` |
| `API, backend, server` | `skills/kilo-kit/development/backend/` |

## Commands

Workflow commands are in `commands/`:
- `commands/quality-gate.md` — Quality gate workflow
- `commands/init-skill.md` — Create new skills
- `commands/validate-skill.md` — Validate skill structure

## Architecture

See `src/core/KILO_MASTER.md` for the full Cognitive Flow Architecture.

---

*Kilo-Kit OpenCode Plugin v1.0.0*
