# 🔍 Validate Skill Command

> **Usage:** Validate skill files for correctness, completeness, and quality.

## Quick Start

```bash
# Python
python src/tools/validate-skill.py skills/kilo-kit/debugging/systematic/
python src/tools/validate-skill.py skills/kilo-kit/ --all --verbose

# Node.js
node src/tools/validate-skill.js skills/kilo-kit/debugging/systematic
node src/tools/validate-skill.js --all skills/kilo-kit --verbose
```

## What It Checks

### Required (Error if missing)
- SKILL.md file exists
- YAML frontmatter with `name`, `description`, `version`
- Sections: "When to Use", "Process", "Guidelines"

### Recommended (Warning if missing)
- Frontmatter: `behaviors`, `token_estimate`, `dependencies`
- Sections: "Prerequisites", "Success Criteria", "Related Skills"
- At least 3 keywords in description

### Quality (Info)
- File size (not too short or too long)
- Process has multiple phases
- Guidelines has DO and DON'T subsections

## Options

| Flag | Description |
|------|-------------|
| `--all`, `-a` | Validate all skills under path |
| `--verbose`, `-v` | Show all issues including info |
| `--json` | Output as JSON (Python only) |
| `--fix` | Attempt auto-fix (planned) |

---

*Validate Skill Command v1.0.0*
