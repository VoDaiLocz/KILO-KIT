# ✅ Quality Gate Command

> **Usage:** Run before every commit to ensure code quality.

## Workflow

```
typecheck → lint → test → build
```

All gates must pass. No exceptions.

## Gates

### Gate 1: Pre-Execution
- [ ] Intent parsed with confidence > 0.5
- [ ] At least one skill matched
- [ ] Token budget sufficient
- [ ] Required context available

### Gate 2: Per-Behavior
- [ ] Input validated
- [ ] Dependencies satisfied
- [ ] No type violations
- [ ] Output schema correct

### Gate 3: Post-Execution
- [ ] All behaviors completed
- [ ] No critical errors
- [ ] Output meets requirements
- [ ] Token usage within estimate ±20%

### Gate 4: Pre-Completion (MANDATORY)
- [ ] Verify claimed changes exist
- [ ] Run relevant tests if applicable
- [ ] Check for obvious regressions
- [ ] Ensure user request addressed
- [ ] Document what was done

## Quick Reference

```bash
# TypeScript/JavaScript
npx tsc --noEmit && npx eslint . && npm test && npm run build

# Python
mypy . && ruff check . && pytest && python -m build

# .NET
dotnet build && dotnet test
```

---

*Quality Gate Command v1.0.0*
