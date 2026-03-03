---
name: fix-verification
description: >-
  Comprehensive fix verification methodology to ensure bugs are truly fixed.
  Use after implementing any bug fix to verify it works and hasn't caused regressions.
  Keywords: verify, confirm, test, validate, check, ensure, regression, fixed
version: 1.0.0
behaviors: [test_change, run_command, compare, reason]
dependencies: []
token_estimate:
  min: 1000
  typical: 2500
  max: 5000
---

# ✅ Fix Verification Skill

> **Philosophy:** A bug isn't fixed until it's verified. Twice.

## When to Use

Use this skill when:
- You've implemented a bug fix
- Someone else's fix needs verification
- Deploying a fix to production
- Bug was high-impact and needs thorough verification
- Previous fixes for this bug have failed

**Do NOT use this skill when:**
- Just exploring code (no fix yet)
- Bug is trivial (e.g., typo fix)
- Running standard CI (automated verification)

---

## Prerequisites

Before starting:
- [ ] Fix has been implemented
- [ ] You know the expected behavior
- [ ] You can reproduce the original bug (or have a failing test)
- [ ] You have access to test environment

---

## Process

### Phase 1: DIRECT VERIFICATION 🎯

**Goal:** Confirm the fix addresses the exact reported issue.

**Steps:**

1. **Recreate the Original Bug Scenario**
   ```
   Exact steps that caused the bug:
   1. [step 1]
   2. [step 2]
   3. [step 3]
   
   Expected result: [what should happen]
   Previous result: [what was happening - the bug]
   ```

2. **Execute Test with Fix Applied**
   - Follow exact same steps
   - Document actual result
   - Compare to expected

3. **Verify the FIX, Not Just Absence of Error**
   ```
   ❌ "It doesn't crash anymore" (incomplete)
   ✅ "It returns the expected user object with correct fields" (complete)
   ```

4. **Test Multiple Times**
   - Run at least 3 times
   - Note any inconsistency

**Verification Checklist:**
- [ ] Original bug scenario no longer produces error
- [ ] Expected behavior now occurs
- [ ] Result is consistent across multiple runs
- [ ] All variations of bug scenario work

---

### Phase 2: EDGE CASE VERIFICATION 🔲

**Goal:** Ensure fix works for edge cases and variations.

**Steps:**

1. **Identify Edge Cases**
   ```yaml
   edge_cases:
     boundary_values:
       - Empty input
       - Maximum length input
       - Minimum valid input
       - Just over limit
       - Just under limit
     
     special_inputs:
       - Null/undefined
       - Special characters
       - Unicode/emoji
       - Numbers as strings
       - Whitespace only
     
     state_variations:
       - First time user
       - Returning user
       - Admin user
       - Concurrent users
       - High load
   ```

2. **Create Edge Case Matrix**
   | Edge Case | Input | Expected | Actual | Pass? |
   |-----------|-------|----------|--------|-------|
   | Empty | "" | Error msg | | |
   | Max length | 1000 chars | Success | | |
   | Special chars | "<>&" | Escaped | | |

3. **Test Each Edge Case**
   - Document results
   - Note any failures

**Edge Case Checklist:**
- [ ] All boundary values tested
- [ ] Special inputs handled correctly
- [ ] Different user states work
- [ ] Concurrent access works (if applicable)

---

### Phase 3: REGRESSION TESTING 🔄

**Goal:** Ensure fix hasn't broken anything else.

**Steps:**

1. **Identify Affected Areas**
   ```yaml
   affected_areas:
     directly_affected:
       - The fixed function/component
       - Its callers
       - Its dependencies
     
     indirectly_affected:
       - Related features
       - Shared utilities used
       - Configuration changes
   ```

2. **Run Targeted Tests**
   ```bash
   # Run tests for affected module
   npm test -- --grep "auth"
   
   # Run integration tests
   npm run test:integration
   ```

3. **Run Full Test Suite**
   ```bash
   # Ensure no regressions anywhere
   npm test
   ```

4. **Manual Smoke Test**
   - Test main user flows
   - Pay attention to anything that feels different

**Regression Checklist:**
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Smoke test passes
- [ ] No new warnings in logs
- [ ] Performance not degraded

---

### Phase 4: NEGATIVE TESTING 🚫

**Goal:** Verify error handling and failure modes.

**Steps:**

1. **Test Invalid Inputs**
   - What happens with bad data?
   - Are errors handled gracefully?
   - Are error messages helpful?

2. **Test Failure Scenarios**
   ```yaml
   failure_scenarios:
     - Database connection lost
     - API timeout
     - Invalid credentials
     - Missing permissions
     - Disk full
   ```

3. **Test Recovery**
   - Does system recover after failure?
   - Is data consistent after recovery?

**Negative Testing Checklist:**
- [ ] Invalid inputs produce clear errors
- [ ] System fails gracefully
- [ ] Recovery works correctly
- [ ] No security information leaked in errors

---

### Phase 5: ENVIRONMENT VERIFICATION 🌍

**Goal:** Ensure fix works across all environments.

**Steps:**

1. **Test Across Environments**
   | Environment | Tested | Result | Notes |
   |-------------|--------|--------|-------|
   | Local dev | | | |
   | CI/CD | | | |
   | Staging | | | |
   | Production | | | |

2. **Test Across Configurations**
   - Different browsers (if applicable)
   - Different OS (if applicable)
   - Different database sizes
   - Different load levels

3. **Test Across User Types**
   - Regular users
   - Admin users
   - New users
   - Users with existing data

**Environment Checklist:**
- [ ] Works in development
- [ ] Works in staging
- [ ] Works in production (or production-like)
- [ ] Works across configurations

---

### Phase 6: DOCUMENTATION & SIGN-OFF 📝

**Goal:** Document verification and get sign-off.

**Steps:**

1. **Complete Verification Report**
   ```markdown
   ## Fix Verification Report
   
   **Bug ID:** [ID]
   **Fix Description:** [brief description]
   **Verified By:** [name]
   **Date:** [date]
   
   ### Direct Verification
   - [x] Original bug no longer occurs
   - [x] Expected behavior confirmed
   
   ### Edge Cases
   - [x] [edge case 1] - PASS
   - [x] [edge case 2] - PASS
   
   ### Regression Testing
   - [x] Unit tests: 100% pass
   - [x] Integration tests: 100% pass
   - [x] Smoke test: PASS
   
   ### Environment Testing
   - [x] Local: PASS
   - [x] Staging: PASS
   - [x] Production: [pending/pass]
   
   ### Sign-off
   - [ ] Developer
   - [ ] QA (if applicable)
   - [ ] Stakeholder (for critical bugs)
   ```

2. **Update Bug Tracking**
   - Change status to "Verified Fixed"
   - Add verification notes
   - Link to any new tests added

3. **Add/Update Tests**
   - Ensure test exists for this bug
   - Test should fail without fix, pass with fix

---

## Quick Verification Checklist

For simpler bugs, use this shortened checklist:

```markdown
## Quick Verification

- [ ] Original bug scenario fixed
- [ ] Edge cases work
- [ ] All tests pass
- [ ] No new warnings/errors
- [ ] Reviewed by another person (if critical)
```

---

## Verification Decision Tree

```
Fix Implemented
      │
      ▼
┌─────────────────┐
│ Does original   │
│ scenario work?  │
└────────┬────────┘
    YES  │  NO → Back to debugging
         ▼
┌─────────────────┐
│ Edge cases      │
│ work?           │
└────────┬────────┘
    YES  │  NO → Expand fix
         ▼
┌─────────────────┐
│ All tests       │
│ pass?           │
└────────┬────────┘
    YES  │  NO → Fix regressions
         ▼
┌─────────────────┐
│ Works in all    │
│ environments?   │
└────────┬────────┘
    YES  │  NO → Environment-specific fix
         ▼
   VERIFIED ✅
```

---

## Guidelines

### DO ✅
- Verify the fix, not just absence of error
- Test edge cases thoroughly
- Document your verification
- Run the full test suite
- Have someone else verify critical fixes

### DON'T ❌
- Assume fix works because code looks right
- Skip edge case testing
- Forget to check for regressions
- Test only in development environment
- Skip documentation

---

## Common Pitfalls

### "Works on My Machine"

**Problem:** Fix works locally but fails elsewhere.

**Prevention:**
- Always test in staging
- Use same data/config as production
- Test with production-like load

### "Fixed the Symptom, Not the Bug"

**Problem:** Error is gone but behavior is still wrong.

**Prevention:**
- Verify POSITIVE behavior, not just absence of error
- Compare to expected behavior documentation
- Test the complete user flow

### "Created a New Bug"

**Problem:** Fix introduced a regression.

**Prevention:**
- Always run full test suite
- Manual smoke test of related features
- Review changes with fresh eyes

---

## Success Criteria

Before marking bug as fixed:

- [ ] Original issue verified fixed
- [ ] All edge cases pass
- [ ] No regression in tests
- [ ] Works in all environments
- [ ] Verification documented
- [ ] Test added to prevent recurrence

---

## Related Skills

- `skills/kilo-kit/debugging/systematic/` - For finding the bug
- `skills/kilo-kit/debugging/root-cause/` - For understanding why it happened
- `skills/kilo-kit/quality/testing/` - For writing better tests

---

*Fix Verification Skill v1.0.0 — Verified twice, deployed once*
