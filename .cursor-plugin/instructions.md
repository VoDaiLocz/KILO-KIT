# Kilo-Kit — Cursor Plugin

> Entry point for Cursor IDE integration.

## Mandatory Brainstorming Gate

For every substantive task, invoke the real `/brainstorming` workflow before analysis, implementation, debugging, refactoring, review, publishing, project commands, or file edits.

Use `productivity/brainstorming` as the active gate: explore project context, ask clarifying questions one at a time, propose 2-3 approaches, present the design, and get user approval before implementation. Do not use C4 `missingInfo` as a separate questionnaire.

After the user approves the brainstorming direction, call `kilo_orchestrate_task` with `brainstormingApproved=true` to log/route the approved task, then load the next selected skill with `kilo_get_skill`.

If analysis starts before `/brainstorming`, stop immediately, state that the brainstorming gate was skipped, invoke `productivity/brainstorming`, and restart automatically.

## Setup

This directory enables Kilo-Kit as a plugin for **Cursor IDE**.

To activate, reference the master skill in your Cursor configuration:

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

*Kilo-Kit Cursor Plugin v1.3.1*
