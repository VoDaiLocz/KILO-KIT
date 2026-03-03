# 📋 Output Formats

> Standard output format definitions for Kilo-Kit workflows.

---

## Hard-Gate Scan Report

```yaml
hard_gate_report:
  timestamp: "<ISO-8601>"
  task: "<brief task description>"

  system_scan:
    disk_space:
      status: "pass|fail"
      detail: "<e.g., 45% used, 120GB free>"
    memory:
      status: "pass|fail"
      detail: "<e.g., 8GB available of 16GB>"
    runtime_versions:
      status: "pass|fail"
      detail:
        node: "<version or N/A>"
        python: "<version or N/A>"
        dotnet: "<version or N/A>"

  codebase_scan:
    project_structure:
      status: "pass|fail"
      files_scanned: <count>
      relevant_files: ["<file1>", "<file2>"]
    recent_changes:
      status: "pass|fail"
      commits_reviewed: <count>
      relevant_commits: ["<sha1>", "<sha2>"]
    existing_tests:
      status: "pass|fail"
      test_files_found: <count>
      relevant_tests: ["<test1>", "<test2>"]

  context_validation:
    intent_confirmed: true|false
    scope_verified: true|false
    dependencies_identified: ["<dep1>", "<dep2>"]

  gate_result: "OPEN|BLOCKED"
  blocked_reasons: ["<reason1>"]  # empty if OPEN
```

---

## Iron Law Compliance Report

```yaml
iron_law_compliance:
  task_id: "<task identifier>"
  timestamp: "<ISO-8601>"

  law_1_evidence:
    compliant: true|false
    citations: ["<file:line — description>"]

  law_2_scan_before_speak:
    compliant: true|false
    hard_gate_completed: true|false

  law_3_verify_before_claim:
    compliant: true|false
    verification_method: "<tests|build|manual>"
    verification_result: "pass|fail"

  law_4_minimal_blast_radius:
    compliant: true|false
    files_changed: <count>
    lines_changed: <count>

  law_5_preserve_what_works:
    compliant: true|false
    unrelated_changes: <count>

  law_6_trace_every_decision:
    compliant: true|false
    decisions_logged: <count>

  law_7_fail_loud:
    compliant: true|false
    errors_reported: <count>
    errors_hidden: <count>

  overall: "COMPLIANT|VIOLATION"
  violations: ["<law_number — description>"]  # empty if COMPLIANT
```

---

## Decision Audit Trail Entry

```yaml
decision_entry:
  id: "DEC-<timestamp>-<short_hash>"
  timestamp: "<ISO-8601>"
  phase: "hard-gate|routing|execution|verification"

  context:
    user_request: "<original request summary>"
    current_state: "<what has been done so far>"
    token_budget_remaining: <count>

  decision:
    action: "<what was decided>"
    reasoning: "<why this action was chosen>"
    evidence:
      - source: "<file:line or command>"
        finding: "<what was observed>"

  alternatives:
    - option: "<alternative approach>"
      rejected_because: "<reason>"

  outcome:
    result: "success|failure|pending"
    detail: "<additional context>"
```

---

## Skill Execution Summary

```yaml
skill_execution:
  skill: "<skill name>"
  version: "<skill version>"
  timestamp: "<ISO-8601>"

  input:
    user_request: "<request>"
    hard_gate_result: "OPEN"
    token_mode: "economy|standard|premium|critical"

  execution:
    phases_completed: ["<phase1>", "<phase2>"]
    behaviors_used: ["<behavior1>", "<behavior2>"]
    quality_gates:
      pre_execution: "pass|fail"
      per_behavior: "pass|fail"
      post_execution: "pass|fail"
      pre_completion: "pass|fail"

  output:
    changes_made:
      - file: "<path>"
        description: "<what changed>"
    tests_run: <count>
    tests_passed: <count>
    verification: "pass|fail"

  metrics:
    tokens_used: <count>
    duration_seconds: <count>
    iron_law_compliant: true|false
```

---

## Change Proposal Format

```markdown
## Change Proposal: <title>

**Task:** <link to issue or request description>
**Date:** <ISO-8601>

### Evidence

| # | Source | Finding |
|---|--------|---------|
| 1 | `<file:line>` | <observation> |
| 2 | `<command output>` | <observation> |

### Proposed Changes

| File | Change | Reason |
|------|--------|--------|
| `<path>` | <description> | <why> |

### Verification Plan

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual verification performed
- [ ] No regressions introduced

### Iron Law Compliance

- [x] Evidence cited for all changes
- [x] Hard-Gate scan completed
- [ ] Verification performed
- [x] Minimal blast radius confirmed
```

---

*Output Formats v1.0.0 — Kilo-Kit*
