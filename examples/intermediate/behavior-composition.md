# Building a Custom Debugging Workflow

> **Difficulty:** Intermediate  
> **Time:** 30 minutes  
> **Goal:** Learn to compose behaviors into custom workflows

---

## Introduction

This tutorial teaches you how to combine Kilo-Kit's atomic and compound behaviors to create a custom debugging workflow tailored to your needs.

**What you'll learn:**
1. Understanding the behavior system
2. Composing atomic behaviors
3. Creating compound workflows
4. Customizing execution with meta-behaviors

---

## Prerequisites

- Completed [Hello Kilo-Kit](../basic/hello-kilo.md) tutorial
- Basic understanding of the behavior system
- Familiarity with debugging concepts

---

## Part 1: Understanding Behaviors

### The Three Layers

```
┌─────────────────────────────────────────┐
│           META BEHAVIORS                 │
│  (Control flow: chain, loop, parallel)   │
├─────────────────────────────────────────┤
│         COMPOUND BEHAVIORS               │
│  (Workflows: trace_error, test_change)   │
├─────────────────────────────────────────┤
│          ATOMIC BEHAVIORS                │
│  (Building blocks: read, write, search)  │
└─────────────────────────────────────────┘
```

**Atomic behaviors** are the smallest units — they do one thing.

**Compound behaviors** combine atomics into useful workflows.

**Meta behaviors** control how behaviors execute (order, conditions, loops).

---

## Part 2: Building Your Debug Workflow

Let's create a custom "quick debug" workflow that:
1. Parses the error
2. Searches for the problem
3. Generates a fix
4. Tests the fix

### Step 1: Define the Workflow

Create `skills/kilo-kit/debugging/quick-debug/SKILL.md`:

```yaml
---
name: quick-debug
description: >-
  Fast, focused debugging for simple bugs.
  Best for obvious errors that just need a quick fix.
  Keywords: quick, fast, simple, fix, error, bug
version: 1.0.0
behaviors:
  atomic: [parse_input, search_code, generate, run_command]
  compound: [trace_error, test_change]
  meta: [chain, conditional]
token_estimate:
  min: 500
  typical: 1500
  max: 3000
---

# ⚡ Quick Debug Skill

> **Philosophy:** Fix fast, verify faster.

## When to Use

- Simple, obvious bugs
- Clear error messages
- Time-sensitive fixes
- NOT for complex systemic issues

## Process

### Phase 1: Quick Diagnosis

```yaml
workflow:
  name: quick_diagnosis
  type: chain
  
  steps:
    - behavior: parse_input
      config:
        parse_type: "error"
        extract: [error_type, location, message]
    
    - behavior: search_code
      config:
        query: "$previous.location"
        scope: "file"
        lines_before: 5
        lines_after: 5
```

### Phase 2: Fix Generation

```yaml
workflow:
  name: generate_fix
  type: conditional
  
  condition:
    check: "$diagnosis.confidence > 0.8"
  
  if_true:
    - behavior: generate
      config:
        type: "code"
        specification: "Fix for: $diagnosis.error"
        constraints:
          - "Minimal change"
          - "Don't break existing behavior"
  
  if_false:
    - behavior: ask_user
      config:
        question: "Error isn't clear. Can you provide more context?"
```

### Phase 3: Verify Fix

```yaml
workflow:
  name: verify_fix
  type: chain
  
  steps:
    - behavior: test_change
      config:
        test_command: "npm test"
        expected_outcome: "pass"
    
    - behavior: conditional
      config:
        if: "$tests.passed"
        then: "complete"
        else: "rollback and report"
```
```

---

## Part 3: Behavior Composition Examples

### Example 1: Sequential Chain

Execute behaviors one after another:

```yaml
# Simple chain: A → B → C
type: chain
behaviors:
  - parse_input
  - search_code
  - reason

# Output flows through
flow: |
  User input 
    → parse_input 
    → {keywords: [...]} 
    → search_code 
    → {files: [...]} 
    → reason 
    → {conclusion: "..."}
```

**Python-like pseudo-code:**
```python
def sequential_debug(error_message):
    # Step 1: Parse
    parsed = await parse_input(error_message, type="error")
    
    # Step 2: Search
    locations = await search_code(
        query=parsed.keywords,
        scope="project"
    )
    
    # Step 3: Reason
    conclusion = await reason(
        evidence=locations,
        question="What's causing the error?"
    )
    
    return conclusion
```

---

### Example 2: Parallel Execution

Run independent behaviors simultaneously:

```yaml
# Parallel: A, B, C run at same time
type: parallel
behaviors:
  code_search:
    behavior: search_code
    config: { query: "$error.keywords" }
  
  test_search:
    behavior: search_code
    config: { query: "test.*$error.function" }
  
  history_search:
    behavior: search_code
    config: { query: "git log", type: "command" }

# All results available at once
aggregate: merge_results
```

**When to use parallel:**
- Behaviors are independent
- Results can be combined
- Speed is important

---

### Example 3: Conditional Branching

Choose path based on condition:

```yaml
type: conditional

# Evaluate this first
condition:
  behavior: validate_syntax
  config: { code: "$generated_fix" }

# If valid...
if_true:
  - behavior: write_file
    config: { content: "$generated_fix" }
  - behavior: run_command
    config: { command: "npm test" }

# If invalid...
if_false:
  - behavior: generate
    config:
      specification: "Fix syntax in: $generated_fix"
  # Loop back to condition
  - behavior: goto
    config: { target: "condition" }
```

---

### Example 4: Loop Until Success

Retry with improvements:

```yaml
type: loop

behavior:
  # The behavior to repeat
  type: chain
  behaviors:
    - generate_with_validation
    - test_change

# Stop condition
until: "$result.tests_pass == true"

# Safety limits
max_iterations: 3

# What to do if max reached
on_max_reached:
  behavior: ask_user
  config:
    question: "Couldn't fix automatically. Need help?"
```

---

## Part 4: Full Custom Workflow

Here's a complete example combining everything:

```yaml
name: comprehensive_debug
description: "Full debugging workflow with fallbacks"

workflow:
  # Start with parallel investigation
  phase_1:
    type: parallel
    name: gather_context
    behaviors:
      error_trace:
        behavior: trace_error
        config: { depth: "medium" }
      
      recent_changes:
        behavior: run_command
        config: { command: "git diff HEAD~5" }
      
      test_status:
        behavior: run_command
        config: { command: "npm test -- --reporter json" }
  
  # Then chain the fix process
  phase_2:
    type: chain
    name: develop_fix
    depends_on: [phase_1]
    
    behaviors:
      - behavior: reason
        config:
          input: "$phase_1"
          question: "What's the root cause?"
      
      - behavior: generate_with_validation
        config:
          specification: "Fix for $reasoning.conclusion"
  
  # Conditional verification
  phase_3:
    type: conditional
    name: verify
    depends_on: [phase_2]
    
    condition: "$phase_2.valid"
    
    if_true:
      type: loop
      behavior: test_change
      until: "$tests.pass"
      max_iterations: 2
    
    if_false:
      behavior: fallback
      behaviors:
        - behavior: ask_user
        - behavior: generate  # With user input
  
  # Final reporting
  phase_4:
    type: chain
    name: report
    always_run: true  # Run even if previous fails
    
    behaviors:
      - behavior: summarize
        config:
          content: "All phases"
          style: "technical"
      
      - behavior: document_code
        config:
          doc_type: "commit_message"
```

---

## Part 5: Testing Your Workflow

### Dry Run

Test your workflow without executing:

```yaml
# Add to workflow config
debug_mode: true
dry_run: true  # Print what would happen, don't execute
```

### Incremental Testing

Test phase by phase:

```bash
# Test just phase 1
kilo-kit run quick-debug --phase 1 --error "TypeError..."

# Test with mock data
kilo-kit run quick-debug --mock-input '{"error": "..."}'
```

### Validation

Use the validator:

```bash
python src/tools/validate-skill.py skills/kilo-kit/debugging/quick-debug/
```

---

## Part 6: Best Practices

### DO ✅

1. **Start simple, add complexity**
   ```yaml
   # Start with basic chain
   - parse_input
   - search_code
   - generate
   
   # Add parallel later if needed
   ```

2. **Name your workflows clearly**
   ```yaml
   name: quick_investigation  # Not: step1
   ```

3. **Add fallbacks**
   ```yaml
   on_error:
     behavior: ask_user
   ```

4. **Set reasonable limits**
   ```yaml
   max_iterations: 3
   timeout_ms: 30000
   ```

### DON'T ❌

1. **Don't over-parallelize**
   ```yaml
   # Bad: Creates race conditions
   parallel:
     - read_file(a)
     - write_file(a)  # Conflict!
   ```

2. **Don't create infinite loops**
   ```yaml
   # Bad: No exit condition
   loop:
     behavior: generate
     until: false  # Never exits!
   ```

3. **Don't ignore errors**
   ```yaml
   # Bad: Swallows errors
   on_error: continue
   ```

---

## Summary

You've learned to:
- ✅ Understand the three behavior layers
- ✅ Compose atomic behaviors into chains
- ✅ Use parallel execution for speed
- ✅ Add conditional logic
- ✅ Create loops with safety limits
- ✅ Build complete custom workflows

---

## Next Steps

- [Advanced: Multi-Skill Chains](../advanced/multi-skill-chain.md)
- [Creating Reusable Behavior Templates](../advanced/behavior-templates.md)
- [Optimizing Token Usage](../advanced/token-optimization.md)

---

*Behavior Composition Tutorial v1.0.0*
