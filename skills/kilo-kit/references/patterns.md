# 📐 Patterns Reference

> Reusable patterns for evidence-based AI agent workflows in Kilo-Kit.

---

## Pattern 1: Pre-Flight System Scan

**Context:** Before any task execution, verify system readiness.

**Structure:**

```yaml
pre_flight:
  steps:
    - name: Check disk space
      command: "df -h ."
      fail_if: "usage > 90%"
    - name: Check memory
      command: "free -m"
      fail_if: "available < 256MB"  # Minimum for running build tools + tests concurrently
    - name: Check runtime versions
      command: "node --version && python3 --version"
      fail_if: "version below minimum"
    - name: Check running services
      command: "ps aux | grep -E '(node|python|dotnet)'"
      purpose: "Identify conflicts"
```

**When to use:** At the start of every Hard-Gate check.

---

## Pattern 2: Codebase Context Gathering

**Context:** Understand the project before making changes.

**Structure:**

```yaml
codebase_scan:
  steps:
    - name: Project structure
      command: "find . -maxdepth 2 -type f -not -path './.git/*' | head -60"
    - name: Recent changes
      command: "git log --oneline -10"
    - name: Relevant files
      action: "Search for files related to the task keywords"
    - name: Existing tests
      command: "find . -name '*.test.*' -o -name '*.spec.*' | head -20"
    - name: Dependencies
      action: "Read package.json, requirements.txt, or equivalent"
```

**When to use:** During the codebase scan phase of Hard-Gate.

---

## Pattern 3: Evidence-Backed Change Proposal

**Context:** Every recommended change must have traceable evidence.

**Structure:**

```markdown
## Change Proposal

**File:** `<path/to/file>:<line_number>`
**Current behavior:** <what the code does now>
**Proposed change:** <what the code should do>

**Evidence:**
1. Source: `<file:line>` — <what was observed>
2. Test gap: `<test file>` — <what is missing>
3. Impact: <scope of affected components>

**Verification plan:**
- [ ] Unit test added/updated
- [ ] Existing tests still pass
- [ ] Manual verification performed
```

**When to use:** Before any code modification.

---

## Pattern 4: Decision Audit Entry

**Context:** Every significant decision must be logged.

**Structure:**

```yaml
decision:
  id: "DEC-<timestamp>"
  action: "<what was decided>"
  evidence:
    - "<file:line or command output that supports this>"
  alternatives_considered:
    - option: "<alternative approach>"
      rejected_because: "<reason>"
  iron_law_compliance:
    - law_1_evidence: true
    - law_2_scan_completed: true
    - law_3_verification_planned: true
```

**When to use:** At every routing and execution decision point.

---

## Pattern 5: Minimal Change Verification

**Context:** Confirm that changes are focused and minimal.

**Structure:**

```yaml
change_verification:
  files_modified: ["<list of files>"]
  lines_changed: <count>
  scope_check:
    - question: "Is every changed file directly related to the task?"
      answer: "yes|no — <explanation>"
    - question: "Could any change be removed without breaking the fix?"
      answer: "yes|no — <explanation>"
    - question: "Are there unintended side effects?"
      answer: "yes|no — <explanation>"
```

**When to use:** Before completing any task (Iron Law #4: Minimal Blast Radius).

---

## Pattern 6: Failure Recovery

**Context:** When an execution step fails, recover systematically.

**Structure:**

```yaml
recovery:
  failed_step: "<which step failed>"
  error_output: "<actual error message>"
  diagnosis:
    - hypothesis: "<what might have caused it>"
      evidence: "<supporting data>"
  recovery_action: "<what to do next>"
  hard_gate_recheck: true  # Always re-run Hard-Gate after failures
```

**When to use:** Whenever a behavior or quality gate fails.

---

*Patterns Reference v1.0.0 — Kilo-Kit*
