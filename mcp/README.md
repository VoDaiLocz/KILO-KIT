# 🔌 Kilo-Kit MCP Server

> **Version:** 1.1.1
> **Mode:** Read-only Skill Registry + Validator
> **Transport:** stdio

The Kilo-Kit MCP server exposes the `skills/` workflow surface to MCP-capable agents. It lets agents route the current chat request to the right skill, load exactly one `SKILL.md`, and run the skill validation quality gate without granting write access.

---

## 🎯 Capabilities

| Capability | MCP Tool | Purpose |
|------------|----------|---------|
| C4 orchestration | `kilo_orchestrate_task` | Enforce brainstorming-first workflow, required questions, memory suggestions, and final workflow release |
| Skill discovery | `kilo_search_skills` | Search the skill library by task/query |
| Intent routing | `kilo_route_intent` | Recommend skills, workflow order, rule hierarchy, and decision trail for the current chat context |
| Skill loading | `kilo_get_skill` | Load one exact `SKILL.md` with output limits |
| Route reporting | `kilo_route_report` | Summarize route telemetry, top skills, workflows, scores, and conflict penalties |
| Memory reporting | `kilo_memory_report` | Inspect C4 global memory facts, decisions, and suggestions |
| Quality gate | `kilo_validate_skills` | Run the Kilo-Kit skill validator summary |

Resources:

| Resource | Purpose |
|----------|---------|
| `kilo://skills/index` | Lightweight skill index |
| `kilo://core/master` | Kilo-Kit master skill |
| `kilo://skills/{category}/{skill}` | Dynamic skill resource |

Prompts:

| Prompt | Purpose |
|--------|---------|
| `kilo-select-skill` | Route a request before implementation |
| `kilo-validate-library` | Run the validation quality gate |

---

## 🚀 Build and Verify

```bash
cd mcp
npm install
npm run build
npm test
npm run smoke
```

Expected verification:

```text
Test Files  9 passed
Tests       22 passed
MCP smoke check passed.
```

---

## ⚙️ Client Configuration

Use the published npm package in any MCP-capable client:

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

The npm package includes the Kilo-Kit skill library, core master file, validator, and built MCP server.

Route telemetry is in-memory by default. To persist route decisions between server runs, set:

```bash
KILO_KIT_WRITE_DECISIONS=true
# optional override:
KILO_KIT_DECISION_TRAIL_PATH=/absolute/path/decision-trail.jsonl
```

When persistence is enabled and no override is provided, decisions are written to `.kilo/decision-trail.jsonl` under the configured repository root.

C4 orchestration memory is global by default at `~/.kilo-kit/orchestrator.sqlite` when Node's SQLite runtime is available. Override it with:

```bash
KILO_KIT_MEMORY_PATH=/absolute/path/orchestrator.sqlite
KILO_KIT_ORCHESTRATION_AUDIT_PATH=/absolute/path/orchestration-audit.jsonl
```

`kilo_orchestrate_task` uses the C4 Brainstorming-First Gate: substantive work starts with `productivity/brainstorming`, then required questions, then memory suggestions that require explicit accept/reject before a final workflow is released.

### Codex CLI on Windows

When Codex is opened inside the Kilo-Kit source checkout, `npx -y @vodailoc/kilo-kit-mcp` can resolve the local package instead of the published package. Use an npm prefix outside the repository:

```toml
[mcp_servers.kilo-kit]
command = "npm"
args = ["exec", "--prefix", "C:\\Users\\Admin", "--yes", "--package=@vodailoc/kilo-kit-mcp", "--", "kilo-kit-mcp"]
startup_timeout_sec = 60
enabled = true
```

### Publishing

Kilo-Kit publishes through npm Trusted Publishing, so releases do not require a long-lived npm token or an interactive OTP.

Configure the npm package once:

1. Open `@vodailoc/kilo-kit-mcp` on npm.
2. Go to `Settings` -> `Trusted publishing`.
3. Select `GitHub Actions`.
4. Use repository `VoDaiLocz/KILO-KIT`.
5. Use workflow filename `publish.yml`.

Then publish by running the GitHub Actions workflow `Publish npm package`, or by pushing a version tag:

```bash
git tag v1.1.1
git push origin v1.1.1
```

The workflow runs build, typecheck, tests, smoke, skill validation, package dry-run, and then `npm publish --access public --ignore-scripts` through OIDC.

### Local Development

Build first:

```bash
cd mcp
npm install
npm run build
```

Then configure your MCP-capable client with stdio:

```json
{
  "mcpServers": {
    "kilo-kit": {
      "command": "node",
      "args": ["D:/skill/mcp/dist/server.js"],
      "env": {
        "KILO_KIT_REPO_ROOT": "D:/skill"
      }
    }
  }
}
```

Use `.mcp/kilo-kit.example.json` as the portable template.

---

## 🛡️ Security Posture

- Externally read-only by default.
- Route telemetry is in-memory by default; JSONL persistence is opt-in with `KILO_KIT_WRITE_DECISIONS=true`.
- C4 memory stores structured facts and decisions, not raw chat logs.
- No arbitrary filesystem reads.
- Category and skill names must be single kebab-case path segments.
- Repository paths are resolved through an allowlist boundary.
- Tool output is capped to protect context budget.
- Validation runs the existing Kilo-Kit validator and returns a concise summary.

---

## 🧠 Recommended Agent Flow

```text
User request
→ kilo_orchestrate_task(message, context)
→ answer required C4 questions
→ accept/reject memory suggestions
→ kilo_get_skill(category, skill) for the first workflow skill
→ follow final workflow skills in order
→ kilo_route_report when you need routing analytics
→ kilo_memory_report when you need memory analytics
→ kilo_validate_skills before claiming the skill library is healthy
```
