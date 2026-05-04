# 🔌 Kilo-Kit MCP Server

> **Version:** 1.1.1
> **Mode:** Read-only Skill Registry + Validator
> **Transport:** stdio

The Kilo-Kit MCP server exposes the `skills/` workflow surface to MCP-capable agents. It lets agents route the current chat request to the right skill, load exactly one `SKILL.md`, and run the skill validation quality gate without granting write access.

---

## 🎯 Capabilities

| Capability | MCP Tool | Purpose |
|------------|----------|---------|
| Skill discovery | `kilo_search_skills` | Search the skill library by task/query |
| Intent routing | `kilo_route_intent` | Recommend skills for the current chat context |
| Skill loading | `kilo_get_skill` | Load one exact `SKILL.md` with output limits |
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
Test Files  4 passed
Tests       8 passed
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

- Read-only tools only.
- No arbitrary filesystem reads.
- Category and skill names must be single kebab-case path segments.
- Repository paths are resolved through an allowlist boundary.
- Tool output is capped to protect context budget.
- Validation runs the existing Kilo-Kit validator and returns a concise summary.

---

## 🧠 Recommended Agent Flow

```text
User request
→ kilo_route_intent(message, context)
→ kilo_get_skill(category, skill)
→ follow selected SKILL.md
→ kilo_validate_skills before claiming the skill library is healthy
```
