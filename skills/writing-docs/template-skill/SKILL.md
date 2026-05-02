---
name: template-skill
description: A template for creating new modular and scalable agent skills.
---

# Template Skill

This is a blueprint for creating new skills. Follow this folder structure and the guidelines in `STRUCTURE.md`.

## Folder Layout

- `SKILL.md`: Metadata and high-level instructions.
- `scripts/`: Implementation logic (Python/Node).
- `resources/`: Prompts, reference documents, or static data.
- `examples/`: Sample usage for the agent to learn from.
- `tests/`: Basic verification to ensure the skill works.

## Guidelines

1. **Self-Documentation**: Always keep `SKILL.md` updated with the latest capabilities.
2. **Utilities**: Import from `../common/` for logging and environment management.
3. **Artifacts**: Store temporary outputs in `artifacts/` (don't commit these).

## Usage Example

Refer to `examples/basic_usage.md` for a demonstration.
