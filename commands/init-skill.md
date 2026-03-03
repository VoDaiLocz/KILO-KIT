# 🛠️ Init Skill Command

> **Usage:** Create a new skill from the template.

## Quick Start

```bash
# Python
python src/tools/init-skill.py <skill-name> --category <category>

# Example
python src/tools/init-skill.py my-debug-skill --category debugging
python src/tools/init-skill.py api-helper --category development --path ./skills/kilo-kit/
```

## Workflow

1. Choose a skill name (kebab-case)
2. Select a category: `debugging`, `development`, `quality`
3. Run the init command
4. Edit the generated `SKILL.md`
5. Add keywords to the description for dispatch matching
6. Define process phases
7. Validate with `validate-skill`

## Generated Structure

```
<skill-name>/
├── SKILL.md           # Main instructions (required)
├── references/
│   └── guide.md       # Detailed documentation
└── scripts/
    └── .gitkeep       # Placeholder
```

## See Also

- `skills/kilo-kit/_template/SKILL.md` — Skill template
- `commands/validate-skill.md` — Validate skill structure

---

*Init Skill Command v1.0.0*
