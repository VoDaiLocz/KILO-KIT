#!/usr/bin/env python3
"""
Kilo-Kit Skill Initializer

Creates a new skill from template with proper structure.

Usage:
    python init-skill.py <skill-name> [--category <category>] [--path <path>]

Examples:
    python init-skill.py my-debug-skill --category debugging
    python init-skill.py api-helper --category development --path ./custom-skills/
"""

import argparse
import os
import sys
from datetime import datetime
from pathlib import Path

# Template for SKILL.md
SKILL_TEMPLATE = '''---
name: {name}
description: >-
  {description}
  Keywords: {keywords}
version: 1.0.0
behaviors: []
dependencies: []
token_estimate:
  min: 500
  typical: 1500
  max: 5000
---

# {title}

> **Purpose:** {purpose}

## When to Use

Use this skill when:
- [Trigger condition 1]
- [Trigger condition 2]
- [Trigger condition 3]

**Do NOT use this skill when:**
- [Wrong condition 1]
- [Wrong condition 2]

---

## Prerequisites

Before using this skill, ensure:
- [ ] [Prerequisite 1]
- [ ] [Prerequisite 2]

---

## Process

### Phase 1: [Phase Name]

**Goal:** [What this phase achieves]

**Steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Output:** [What this phase produces]

### Phase 2: [Phase Name]

**Goal:** [What this phase achieves]

**Steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Output:** [What this phase produces]

---

## Guidelines

### DO ✅
- [Guideline 1]
- [Guideline 2]
- [Guideline 3]

### DON'T ❌
- [Anti-pattern 1]
- [Anti-pattern 2]

---

## Common Patterns

### Pattern 1: [Pattern Name]

**When:** [Condition]
**Action:** [What to do]

---

## Success Criteria

Before claiming completion, verify:

- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] User request fully addressed

---

## References

- `references/guide.md` - Detailed documentation

---

*{name} v1.0.0 — Created {date}*
'''

# Template for reference guide
REFERENCE_TEMPLATE = '''# {title} - Detailed Guide

> Reference documentation for {name} skill.

## Overview

[Detailed overview of the skill]

## Detailed Process

### Step-by-Step Instructions

1. **First Step**
   - Detailed instructions
   - Examples
   - Edge cases

2. **Second Step**
   - Detailed instructions
   - Examples

## Examples

### Example 1: [Scenario]

**Input:**
```
[example input]
```

**Expected Output:**
```
[example output]
```

### Example 2: [Scenario]

**Input:**
```
[example input]
```

**Expected Output:**
```
[example output]
```

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| [Issue 1] | [Cause] | [Solution] |
| [Issue 2] | [Cause] | [Solution] |

## Related Skills

- `skills/[related]/` - [Why related]

---

*Reference Guide v1.0.0*
'''

def to_title_case(name: str) -> str:
    """Convert kebab-case to Title Case."""
    return ' '.join(word.capitalize() for word in name.replace('-', ' ').split())

def create_skill(name: str, category: str, base_path: str, description: str = None) -> bool:
    """Create a new skill with proper structure."""
    
    # Normalize name
    skill_name = name.lower().replace(' ', '-')
    skill_title = to_title_case(skill_name)
    
    # Determine path
    if category:
        skill_path = Path(base_path) / category / skill_name
    else:
        skill_path = Path(base_path) / skill_name
    
    # Check if exists
    if skill_path.exists():
        print(f"❌ Error: Skill already exists at {skill_path}")
        return False
    
    # Create directories
    try:
        skill_path.mkdir(parents=True, exist_ok=True)
        (skill_path / "references").mkdir(exist_ok=True)
        (skill_path / "scripts").mkdir(exist_ok=True)
        print(f"✅ Created directory: {skill_path}")
    except Exception as e:
        print(f"❌ Error creating directories: {e}")
        return False
    
    # Generate content
    if not description:
        description = f"Description for {skill_title} skill. Customize this."
    
    keywords = ', '.join(skill_name.split('-'))
    purpose = f"Provide {skill_title.lower()} functionality"
    
    skill_content = SKILL_TEMPLATE.format(
        name=skill_name,
        title=skill_title,
        description=description,
        keywords=keywords,
        purpose=purpose,
        date=datetime.now().strftime("%Y-%m-%d")
    )
    
    reference_content = REFERENCE_TEMPLATE.format(
        name=skill_name,
        title=skill_title
    )
    
    # Write files
    try:
        with open(skill_path / "SKILL.md", 'w', encoding='utf-8') as f:
            f.write(skill_content)
        print(f"✅ Created: {skill_path / 'SKILL.md'}")
        
        with open(skill_path / "references" / "guide.md", 'w', encoding='utf-8') as f:
            f.write(reference_content)
        print(f"✅ Created: {skill_path / 'references' / 'guide.md'}")
        
        # Create empty placeholder files
        (skill_path / "scripts" / ".gitkeep").touch()
        
    except Exception as e:
        print(f"❌ Error writing files: {e}")
        return False
    
    # Success summary
    print(f"""
╔══════════════════════════════════════════════════════════════╗
║                    ✨ Skill Created Successfully ✨            ║
╠══════════════════════════════════════════════════════════════╣
║  Name:     {skill_name:<48} ║
║  Category: {category if category else '(none)':<48} ║
║  Path:     {str(skill_path):<48} ║
╠══════════════════════════════════════════════════════════════╣
║  Next Steps:                                                  ║
║  1. Edit SKILL.md to customize your skill                    ║
║  2. Add keywords to description for dispatch matching         ║
║  3. Define your process phases                                ║
║  4. Add detailed references if needed                         ║
╚══════════════════════════════════════════════════════════════╝
""")
    
    return True

def main():
    parser = argparse.ArgumentParser(
        description="Create a new Kilo-Kit skill from template"
    )
    parser.add_argument(
        "name",
        help="Name of the skill (kebab-case recommended)"
    )
    parser.add_argument(
        "--category", "-c",
        help="Category folder (e.g., debugging, development, quality)",
        default=None
    )
    parser.add_argument(
        "--path", "-p",
        help="Base path for skills",
        default="./skills/kilo-kit"
    )
    parser.add_argument(
        "--description", "-d",
        help="Skill description",
        default=None
    )
    
    args = parser.parse_args()
    
    # Validate name
    if not args.name or len(args.name) < 2:
        print("❌ Error: Skill name must be at least 2 characters")
        sys.exit(1)
    
    # Create skill
    success = create_skill(
        name=args.name,
        category=args.category,
        base_path=args.path,
        description=args.description
    )
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
