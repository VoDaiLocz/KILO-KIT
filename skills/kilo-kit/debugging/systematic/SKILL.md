---
name: systematic-debugging
description: >-
  Comprehensive 4-phase debugging methodology for complex bugs.
  Use for bugs that aren't immediately obvious or have resisted quick fixes.
  Keywords: bug, error, fix, debug, broken, crash, fail, exception
version: 1.0.0
behaviors: [parse_error, search_code, reason, validate, write_file]
dependencies: []
token_estimate:
  min: 1500
  typical: 3500
  max: 8000
---

# 🔍 Systematic Debugging Skill

> **Philosophy:** Understand before you fix. Verify before you celebrate.

## When to Use

Use this skill when:
- Bug is not immediately obvious
- Previous quick fixes have failed
- Error involves multiple components
- Need to ensure no regression from fix
- Production issue requiring careful handling

**Do NOT use this skill when:**
- Bug is trivial (typo, missing import)
- Just need a quick syntax check
- Issue is really a feature request

---

## Prerequisites

Before starting:
- [ ] Have access to the codebase
- [ ] Can reproduce the bug OR have error logs
- [ ] Understand the expected behavior
- [ ] Know which environment is affected

---

## Process

### Phase 1: ROOT CAUSE INVESTIGATION 🔬

**Goal:** Find the TRUE cause, not just symptoms.

**Steps:**

1. **Reproduce the Bug**
   ```
   Ask yourself:
   - Can I make this happen consistently?
   - What are the exact steps?
   - What input causes it?
   ```

2. **Gather Evidence**
   - Error messages (complete, not truncated)
   - Stack traces
   - Relevant logs
   - Recent changes (git log, blame)

3. **Trace the Flow**
   ```
   Start from: Error location
   Work backward: How did we get here?
   Find: Where does expected != actual?
   ```

4. **Identify the Root Cause**
   - Not "it crashed" but "WHY it crashed"
   - Not "wrong output" but "WHAT produced wrong output"

**Output:** Clear statement of root cause.

**Red Flags (STOP if you find yourself doing these):**
- ❌ Immediately jumping to code changes
- ❌ Assuming you know the cause without evidence
- ❌ Changing things randomly hoping they'll work
- ❌ Ignoring the stack trace

---

### Phase 2: PATTERN ANALYSIS 📊

**Goal:** Understand the shape of the problem.

**Steps:**

1. **Scope Assessment**
   - Is this isolated or systemic?
   - Does it affect other components?
   - Has this happened before?

2. **Similar Pattern Search**
   ```bash
   # Search for similar patterns in codebase
   grep -r "similar_pattern" src/
   ```

3. **Dependency Check**
   - What depends on the broken code?
   - What does the broken code depend on?

4. **Risk Assessment**
   - What could break if we fix this?
   - Are there other places with same bug?

**Output:** Understanding of bug's scope and risk.

---

### Phase 3: HYPOTHESIS & TESTING 🧪

**Goal:** Develop and test fix hypothesis.

**Steps:**

1. **Form Hypothesis**
   ```
   "If I change X to Y, then Z should work because..."
   ```
   
   **Good hypothesis includes:**
   - Specific change
   - Expected outcome
   - Reasoning

2. **Design the Fix**
   - Minimal change principle
   - Don't fix what isn't broken
   - Consider edge cases

3. **Mental/Paper Test**
   - Walk through the code with fix
   - Does it address root cause?
   - Any side effects?

4. **Create Test Case**
   - Before implementing fix, write test that fails
   - Test should pass after fix
   - Include edge cases

**Output:** Tested hypothesis ready for implementation.

---

### Phase 4: IMPLEMENTATION & VERIFICATION ✅

**Goal:** Apply fix and verify it works.

**Steps:**

1. **Implement the Fix**
   - Apply minimal necessary changes
   - Add comments explaining WHY (not just what)
   - Follow project coding standards

2. **Run Existing Tests**
   ```bash
   # All tests must pass
   npm test    # or pytest, etc.
   ```

3. **Run New Test Case**
   - Test you wrote in Phase 3 should now pass
   - Verify fix addresses root cause

4. **Verify No Regression**
   - Related functionality still works
   - No new errors introduced
   - Performance not degraded

5. **Documentation**
   - Update relevant docs if needed
   - Consider adding to known issues/patterns

**Output:** Verified fix with passing tests.

---

## Debugging Decision Tree

```
Bug Report Received
        │
        ▼
┌─────────────────┐
│ Can reproduce?  │
└────────┬────────┘
    YES  │  NO
         │  └──► Gather more info, check logs, ask for steps
         ▼
┌─────────────────┐
│ Error obvious?  │
└────────┬────────┘
    YES  │  NO
         │  └──► Phase 1: Root Cause Investigation
         ▼
Quick fix
         │
         ▼
┌─────────────────┐
│ Fix verified?   │
└────────┬────────┘
    YES  │  NO
         │  └──► Return to investigation
         ▼
    Complete ✓
```

---

## Guidelines

### DO ✅
- Read the full stack trace
- Reproduce before fixing
- Change one thing at a time
- Test after each change
- Keep notes during investigation
- Ask "WHY" at least 3 times

### DON'T ❌
- Assume you know the cause
- Make multiple changes at once
- Skip testing
- Ignore "unrelated" errors
- Rush to deploy fix
- Delete old code without understanding it

---

## Common Patterns

### Pattern: Off-by-One Error

**When:** Array/loop issues, boundary conditions

**Detection:**
- Works for most cases, fails at edges
- Index out of bounds errors
- Missing first/last item

**Solution:**
- Check `<` vs `<=`
- Check starting index (0 vs 1)
- Verify array length handling

### Pattern: Async/Timing Issue

**When:** Race conditions, inconsistent failures

**Detection:**
- Works sometimes, fails other times
- Different behavior in different environments
- Issues with "slow" operations

**Solution:**
- Add proper await/promises
- Check for missing error handling
- Consider operation ordering

### Pattern: Null/Undefined Reference

**When:** Missing data, optional fields

**Detection:**
- "Cannot read property of undefined"
- Works with some data, not others
- Fails after recent data changes

**Solution:**
- Add null checks
- Use optional chaining (?.)
- Validate data at entry points

---

## Anti-Patterns (AVOID)

### Anti-Pattern: "It Works on My Machine"

**Problem:** Not investigating environment differences.

**Instead:** 
- Compare environments systematically
- Check versions, configs, dependencies
- Document environment requirements

### Anti-Pattern: "Shotgun Debugging"

**Problem:** Changing random things hoping something works.

**Instead:**
- Form hypothesis first
- Test ONE change at a time
- Keep track of what you tried

### Anti-Pattern: "It's Fixed Now" (No Verification)

**Problem:** Assuming fix works without testing.

**Instead:**
- Always run tests
- Verify the exact scenario that failed
- Check for regressions

---

## Success Criteria

Before claiming the bug is fixed:

- [ ] Root cause identified and documented
- [ ] Fix addresses root cause (not just symptom)
- [ ] Test case written that would catch this bug
- [ ] All existing tests pass
- [ ] New test passes
- [ ] No regressions in related functionality
- [ ] Fix is reviewable (clear, minimal, documented)
- [ ] User can verify the fix works

---

## Related Skills

- `skills/kilo-kit/debugging/root-cause/` - For deeper root cause analysis
- `skills/kilo-kit/debugging/verification/` - For thorough verification
- `skills/kilo-kit/quality/testing/` - For writing better tests

---

*Systematic Debugging Skill v1.0.0 — Understand before you fix*
