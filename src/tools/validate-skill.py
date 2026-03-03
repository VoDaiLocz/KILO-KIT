#!/usr/bin/env python3
"""
Kilo-Kit Skill Validator

Validates skill files for correctness, completeness, and quality.

Usage:
    python validate-skill.py <skill-path> [--fix] [--verbose]
    python validate-skill.py --all [--fix]

Examples:
    python validate-skill.py skills/kilo-kit/debugging/systematic/
    python validate-skill.py skills/kilo-kit/ --all
    python validate-skill.py skills/kilo-kit/my-skill/ --fix --verbose
"""

import argparse
import os
import re
import sys
import yaml
from pathlib import Path
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any
from enum import Enum


class Severity(Enum):
    ERROR = "error"      # Must fix
    WARNING = "warning"  # Should fix
    INFO = "info"        # Nice to have


@dataclass
class ValidationIssue:
    severity: Severity
    message: str
    location: str
    suggestion: Optional[str] = None


@dataclass
class ValidationResult:
    skill_path: str
    valid: bool
    issues: List[ValidationIssue] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def add_issue(self, severity: Severity, message: str, location: str = "", suggestion: str = None):
        self.issues.append(ValidationIssue(severity, message, location, suggestion))
        if severity == Severity.ERROR:
            self.valid = False


# Required frontmatter fields
REQUIRED_FRONTMATTER = ["name", "description", "version"]
RECOMMENDED_FRONTMATTER = ["behaviors", "token_estimate", "dependencies"]

# Required sections in SKILL.md
REQUIRED_SECTIONS = [
    "When to Use",
    "Process",
    "Guidelines",
]
RECOMMENDED_SECTIONS = [
    "Prerequisites",
    "Success Criteria",
    "Related Skills",
]

# Keyword patterns that should trigger the skill
MIN_KEYWORDS = 3


def parse_frontmatter(content: str) -> tuple[Dict[str, Any], str]:
    """Parse YAML frontmatter from markdown content."""
    if not content.startswith("---"):
        return {}, content
    
    try:
        end_index = content.index("---", 3)
        frontmatter_str = content[3:end_index].strip()
        body = content[end_index + 3:].strip()
        frontmatter = yaml.safe_load(frontmatter_str)
        return frontmatter or {}, body
    except (ValueError, yaml.YAMLError):
        return {}, content


def extract_sections(body: str) -> Dict[str, str]:
    """Extract markdown sections from body."""
    sections = {}
    current_section = None
    current_content = []
    
    for line in body.split('\n'):
        if line.startswith('## '):
            if current_section:
                sections[current_section] = '\n'.join(current_content).strip()
            current_section = line[3:].strip()
            # Remove emoji prefixes
            current_section = re.sub(r'^[^\w\s]+\s*', '', current_section)
            current_content = []
        elif current_section:
            current_content.append(line)
    
    if current_section:
        sections[current_section] = '\n'.join(current_content).strip()
    
    return sections


def extract_keywords(description: str) -> List[str]:
    """Extract keywords from description."""
    # Look for "Keywords:" line
    match = re.search(r'Keywords?:\s*(.+)', description, re.IGNORECASE)
    if match:
        keywords_str = match.group(1)
        return [k.strip() for k in keywords_str.split(',')]
    return []


def validate_frontmatter(frontmatter: Dict[str, Any], result: ValidationResult):
    """Validate SKILL.md frontmatter."""
    # Check required fields
    for field in REQUIRED_FRONTMATTER:
        if field not in frontmatter or not frontmatter[field]:
            result.add_issue(
                Severity.ERROR,
                f"Missing required frontmatter field: {field}",
                "frontmatter",
                f"Add '{field}:' to the YAML frontmatter"
            )
    
    # Check recommended fields
    for field in RECOMMENDED_FRONTMATTER:
        if field not in frontmatter:
            result.add_issue(
                Severity.WARNING,
                f"Missing recommended field: {field}",
                "frontmatter",
                f"Consider adding '{field}:' for better skill discoverability"
            )
    
    # Validate name format
    if "name" in frontmatter:
        name = frontmatter["name"]
        if not re.match(r'^[a-z0-9-]+$', name):
            result.add_issue(
                Severity.WARNING,
                f"Skill name '{name}' should be kebab-case (lowercase with dashes)",
                "frontmatter.name",
                "Use format like 'my-skill-name'"
            )
    
    # Validate description has keywords
    if "description" in frontmatter:
        desc = frontmatter["description"]
        keywords = extract_keywords(desc)
        result.metadata["keywords"] = keywords
        
        if len(keywords) < MIN_KEYWORDS:
            result.add_issue(
                Severity.WARNING,
                f"Description has {len(keywords)} keywords, recommend at least {MIN_KEYWORDS}",
                "frontmatter.description",
                "Add 'Keywords: keyword1, keyword2, keyword3' to description"
            )
    
    # Validate version format
    if "version" in frontmatter:
        version = str(frontmatter["version"])
        if not re.match(r'^\d+\.\d+\.\d+$', version):
            result.add_issue(
                Severity.WARNING,
                f"Version '{version}' should follow semver format (x.y.z)",
                "frontmatter.version",
                "Use format like '1.0.0'"
            )
    
    # Validate token_estimate structure
    if "token_estimate" in frontmatter:
        te = frontmatter["token_estimate"]
        if isinstance(te, dict):
            for key in ["min", "typical", "max"]:
                if key not in te:
                    result.add_issue(
                        Severity.WARNING,
                        f"token_estimate missing '{key}'",
                        "frontmatter.token_estimate"
                    )
            
            if all(k in te for k in ["min", "typical", "max"]):
                if not (te["min"] <= te["typical"] <= te["max"]):
                    result.add_issue(
                        Severity.ERROR,
                        "token_estimate values should be: min <= typical <= max",
                        "frontmatter.token_estimate"
                    )


def validate_sections(sections: Dict[str, str], result: ValidationResult):
    """Validate SKILL.md sections."""
    section_names = list(sections.keys())
    
    # Check required sections
    for section in REQUIRED_SECTIONS:
        found = any(section.lower() in s.lower() for s in section_names)
        if not found:
            result.add_issue(
                Severity.ERROR,
                f"Missing required section: '## {section}'",
                "body",
                f"Add a '## {section}' section to the skill"
            )
    
    # Check recommended sections
    for section in RECOMMENDED_SECTIONS:
        found = any(section.lower() in s.lower() for s in section_names)
        if not found:
            result.add_issue(
                Severity.INFO,
                f"Consider adding section: '## {section}'",
                "body"
            )
    
    # Validate Process section has phases
    process_section = None
    for name, content in sections.items():
        if "process" in name.lower():
            process_section = content
            break
    
    if process_section:
        phase_count = len(re.findall(r'###\s*Phase', process_section, re.IGNORECASE))
        if phase_count < 2:
            result.add_issue(
                Severity.INFO,
                f"Process section has {phase_count} phases, consider adding more structure",
                "section.Process"
            )
    
    # Check Guidelines has DO and DON'T
    guidelines_section = None
    for name, content in sections.items():
        if "guidelines" in name.lower():
            guidelines_section = content
            break
    
    if guidelines_section:
        has_do = bool(re.search(r'###?\s*DO\s*[✅✓]?', guidelines_section, re.IGNORECASE))
        has_dont = bool(re.search(r"###?\s*DON'?T\s*[❌✗]?", guidelines_section, re.IGNORECASE))
        
        if not has_do:
            result.add_issue(
                Severity.INFO,
                "Guidelines section missing '### DO ✅' subsection",
                "section.Guidelines"
            )
        if not has_dont:
            result.add_issue(
                Severity.INFO,
                "Guidelines section missing '### DON'T ❌' subsection",
                "section.Guidelines"
            )


def validate_structure(skill_path: Path, result: ValidationResult):
    """Validate skill directory structure."""
    skill_md = skill_path / "SKILL.md"
    
    if not skill_md.exists():
        result.add_issue(
            Severity.ERROR,
            "Missing SKILL.md file",
            str(skill_path),
            "Create a SKILL.md file using the template"
        )
        return None
    
    # Check for optional directories
    references_dir = skill_path / "references"
    scripts_dir = skill_path / "scripts"
    
    if not references_dir.exists():
        result.add_issue(
            Severity.INFO,
            "No 'references/' directory (optional)",
            str(skill_path),
            "Add references/ for detailed documentation if needed"
        )
    
    if not scripts_dir.exists():
        result.add_issue(
            Severity.INFO,
            "No 'scripts/' directory (optional)",
            str(skill_path),
            "Add scripts/ for helper utilities if needed"
        )
    
    return skill_md


def validate_skill(skill_path: Path) -> ValidationResult:
    """Validate a single skill directory."""
    result = ValidationResult(skill_path=str(skill_path), valid=True)
    
    # Check it's a directory
    if not skill_path.is_dir():
        result.add_issue(Severity.ERROR, "Path is not a directory", str(skill_path))
        return result
    
    # Validate structure
    skill_md = validate_structure(skill_path, result)
    if not skill_md:
        return result
    
    # Read and parse SKILL.md
    try:
        content = skill_md.read_text(encoding='utf-8')
    except Exception as e:
        result.add_issue(Severity.ERROR, f"Cannot read SKILL.md: {e}", str(skill_md))
        return result
    
    # Parse frontmatter and body
    frontmatter, body = parse_frontmatter(content)
    
    if not frontmatter:
        result.add_issue(
            Severity.ERROR,
            "No YAML frontmatter found",
            str(skill_md),
            "Add YAML frontmatter between --- markers at the start"
        )
    else:
        validate_frontmatter(frontmatter, result)
        result.metadata["frontmatter"] = frontmatter
    
    # Extract and validate sections
    sections = extract_sections(body)
    validate_sections(sections, result)
    result.metadata["sections"] = list(sections.keys())
    
    # Check file size (shouldn't be too short or too long)
    content_length = len(content)
    if content_length < 500:
        result.add_issue(
            Severity.WARNING,
            f"SKILL.md seems too short ({content_length} chars)",
            str(skill_md),
            "Add more detail to make the skill useful"
        )
    elif content_length > 50000:
        result.add_issue(
            Severity.WARNING,
            f"SKILL.md is very long ({content_length} chars)",
            str(skill_md),
            "Consider moving detail to references/"
        )
    
    return result


def find_all_skills(base_path: Path) -> List[Path]:
    """Find all skill directories under base path."""
    skills = []
    for skill_md in base_path.rglob("SKILL.md"):
        skills.append(skill_md.parent)
    return skills


def print_result(result: ValidationResult, verbose: bool = False):
    """Print validation result."""
    # Status icon
    if result.valid:
        status = "✅ VALID"
        status_color = "\033[92m"  # Green
    else:
        status = "❌ INVALID"
        status_color = "\033[91m"  # Red
    reset = "\033[0m"
    
    print(f"\n{status_color}{status}{reset}: {result.skill_path}")
    
    # Count by severity
    errors = [i for i in result.issues if i.severity == Severity.ERROR]
    warnings = [i for i in result.issues if i.severity == Severity.WARNING]
    infos = [i for i in result.issues if i.severity == Severity.INFO]
    
    if errors or warnings or (verbose and infos):
        print(f"   └─ {len(errors)} errors, {len(warnings)} warnings, {len(infos)} info")
    
    # Print issues
    for issue in result.issues:
        if issue.severity == Severity.INFO and not verbose:
            continue
        
        if issue.severity == Severity.ERROR:
            icon = "❌"
            color = "\033[91m"
        elif issue.severity == Severity.WARNING:
            icon = "⚠️"
            color = "\033[93m"
        else:
            icon = "ℹ️"
            color = "\033[94m"
        
        print(f"      {icon} {color}{issue.message}{reset}")
        if issue.location:
            print(f"         📍 {issue.location}")
        if issue.suggestion and verbose:
            print(f"         💡 {issue.suggestion}")


def main():
    parser = argparse.ArgumentParser(
        description="Validate Kilo-Kit skill files"
    )
    parser.add_argument(
        "path",
        nargs="?",
        default=".",
        help="Path to skill directory or parent directory"
    )
    parser.add_argument(
        "--all", "-a",
        action="store_true",
        help="Validate all skills under the path"
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Show all issues including info"
    )
    parser.add_argument(
        "--fix",
        action="store_true",
        help="Attempt to auto-fix issues (not implemented yet)"
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Output as JSON"
    )
    
    args = parser.parse_args()
    path = Path(args.path).resolve()
    
    # Find skills to validate
    if args.all:
        skills = find_all_skills(path)
        if not skills:
            print(f"No skills found under {path}")
            sys.exit(1)
    else:
        skills = [path]
    
    # Validate each skill
    results = []
    for skill_path in skills:
        result = validate_skill(skill_path)
        results.append(result)
        
        if not args.json:
            print_result(result, args.verbose)
    
    # Summary
    valid_count = sum(1 for r in results if r.valid)
    total_count = len(results)
    
    if args.json:
        import json
        output = {
            "summary": {
                "total": total_count,
                "valid": valid_count,
                "invalid": total_count - valid_count,
            },
            "results": [
                {
                    "path": r.skill_path,
                    "valid": r.valid,
                    "issues": [
                        {
                            "severity": i.severity.value,
                            "message": i.message,
                            "location": i.location,
                            "suggestion": i.suggestion,
                        }
                        for i in r.issues
                    ],
                    "metadata": r.metadata,
                }
                for r in results
            ]
        }
        print(json.dumps(output, indent=2))
    else:
        print(f"\n{'='*50}")
        print(f"SUMMARY: {valid_count}/{total_count} skills valid")
        
        if valid_count < total_count:
            print(f"Run with --verbose for more details")
            sys.exit(1)
        else:
            print("All skills passed validation! ✅")
    
    sys.exit(0 if valid_count == total_count else 1)


if __name__ == "__main__":
    main()
