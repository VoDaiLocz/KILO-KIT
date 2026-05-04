# Kilo-Kit — Codex Plugin

> Entry point for OpenAI Codex / ChatGPT integration.

## Setup

This directory enables Kilo-Kit as a plugin for **OpenAI Codex**.

To activate, reference the master skill in your Codex configuration:

```
src/core/KILO_MASTER.md
```

## Skill Loading

`skills/` is the canonical workflow surface for Codex:

- Use `skills/SKILLS_INDEX.md` for fast discovery.
- Load the exact `skills/<category>/<skill>/SKILL.md` file needed for the task.
- Keep `skills/kilo-kit/` as the core framework pack.
- Use category folders such as `skills/engineering/`, `skills/productivity/`, and `skills/problem-solving/` for the imported Codex skill library.

Core Kilo-Kit skills are loaded from `skills/kilo-kit/` based on intent matching:

| Task Keywords | Skill |
|---------------|-------|
| `bug, error, fix, debug` | `skills/kilo-kit/debugging/systematic/` |
| `root cause, why` | `skills/kilo-kit/debugging/root-cause/` |
| `verify, confirm` | `skills/kilo-kit/debugging/verification/` |
| `review, PR, code review` | `skills/kilo-kit/quality/code-review/` |
| `test, TDD, testing` | `skills/kilo-kit/quality/testing/` |
| `security, auth, OWASP` | `skills/kilo-kit/development/security/` |
| `API, backend, server` | `skills/kilo-kit/development/backend/` |

For the broader imported library, prefer `skills/SKILLS_INDEX.md` over scanning all skill bodies.

## Commands

Workflow commands are in `commands/`:
- `commands/quality-gate.md` — Quality gate workflow
- `commands/init-skill.md` — Create new skills
- `commands/validate-skill.md` — Validate skill structure

## Architecture

See `src/core/KILO_MASTER.md` for the full Cognitive Flow Architecture.

## MCP Integration

Kilo-Kit exposes a read-only MCP server in `mcp/`.

Install from npm in MCP-capable clients:

```json
{
  "mcpServers": {
    "kilo-kit": {
      "command": "npx",
      "args": ["-y", "@vodailoc/kilo-kit-mcp"]
    }
  }
}
```

Build and verify:

```bash
cd mcp
npm install
npm run build
npm test
npm run smoke
```

When the MCP server is available, call `kilo_route_intent` with the current user request before selecting a workflow skill, then call `kilo_get_skill` for the selected skill.

---

*Kilo-Kit Codex Plugin v1.0.0*
