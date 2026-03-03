# 🎯 Kilo-Kit Master Skill

> **Version:** 1.0.0  
> **Paradigm:** Cognitive Flow Architecture  
> **Philosophy:** Anticipate → Adapt → Execute → Learn → Optimize

---

## ⚠️ THINKING PROTOCOL — MANDATORY

> **THE IRON LAW:** Before processing ANY task, you MUST:
> 1. **READ** this master skill file completely
> 2. **ACTIVATE** the Predictive Context Engine
> 3. **ROUTE** through Adaptive Routing Engine  
> 4. **VERIFY** Decision Audit Trail is logging
> 5. **ONLY THEN** begin execution
>
> ❌ NEVER start work without completing this protocol
> ❌ NEVER skip steps regardless of task simplicity
> ❌ NEVER ignore Token Economy constraints

---

## 🧠 Cognitive Flow Architecture

Kilo-Kit treats interactions as **continuous flows**, not discrete events:

```
Traditional:  Task → Process → Response (done)

Kilo-Kit:     ┌─────────────────────────────┐
              │      COGNITIVE FLOW         │
              │                             │
    Input ───►│  Predict → Execute → Learn  │───► Output
              │      ↑              │       │
    Next  ───►│      └──────────────┘       │───► Better
              │                             │
              └─────────────────────────────┘
```

---

## 🔄 Processing Pipeline

### Stage 1: INTAKE (Predictive Context Engine)

```yaml
activation_trigger: Any new user input

actions:
  1. Parse user intent:
     - Extract explicit keywords
     - Infer implicit needs
     - Detect emotional tone
     - Identify urgency level
  
  2. Predict required context:
     - Which skills likely needed (top 3)
     - What files likely relevant
     - What history is pertinent
     - What tools might be called
  
  3. Prefetch context:
     - Load predicted skills (metadata + body)
     - Cache relevant file contents
     - Prepare tool configurations
     - Estimate token budget

output:
  - intent_analysis: { type, confidence, keywords[], urgency }
  - predicted_context: { skills[], files[], tools[] }
  - token_estimate: { min, max, recommended_mode }
```

### Stage 2: ROUTE (Adaptive Routing Engine)

```yaml
activation_trigger: After INTAKE completes

actions:
  1. Match skills to intent:
     - Score each skill by relevance (0.0-1.0)
     - Consider historical success rates
     - Factor in user preferences
     - Apply context modifiers
  
  2. Compose behavior chain:
     - Select primary skill
     - Identify supporting behaviors
     - Build execution DAG
     - Optimize for parallelism
  
  3. Log decision trail:
     - Record all considered options
     - Document scoring rationale
     - Save alternative paths
     - Timestamp everything

output:
  - selected_skill: { id, confidence, reason }
  - behavior_chain: [ {behavior, config, dependencies}... ]
  - decision_audit: { id, timestamp, reasoning, alternatives }
```

### Stage 3: EXECUTE (Execution Engine)

```yaml
activation_trigger: After ROUTE completes

actions:
  1. Validate budget (Token Economy):
     - Check against estimated usage
     - Select appropriate quality mode
     - Reserve tokens for verification
     - Track actual usage
  
  2. Execute behavior chain:
     - Run behaviors in DAG order
     - Parallelize independent branches
     - Collect intermediate results
     - Handle errors gracefully
  
  3. Apply quality gates:
     - Validate outputs at each step
     - Ensure type safety
     - Check for regressions
     - Verify against requirements

output:
  - execution_result: { success, outputs[], token_used }
  - quality_report: { gates_passed[], gates_failed[] }
  - error_context: { if_any }
```

### Stage 4: LEARN (Feedback Loop)

```yaml
activation_trigger: After EXECUTE completes

actions:
  1. Update skill analytics:
     - Record success/failure
     - Track token efficiency
     - Measure user satisfaction
     - Calculate context fit score
  
  2. Persist knowledge:
     - Save successful patterns
     - Update knowledge graph
     - Adjust routing weights
     - Flag skills for review
  
  3. Prepare for next flow:
     - Cache likely next contexts
     - Update user model
     - Refine predictions
     - Clean up resources

output:
  - skill_metrics_update: { skill_id, delta }
  - knowledge_graph_update: { nodes[], edges[] }
  - prediction_adjustments: { weights[] }
```

---

## 📋 Skill Dispatch Table (Adaptive)

| Intent Keywords | Primary Skill | Confidence Boost |
|-----------------|---------------|------------------|
| `bug, error, fix, debug, broken` | `skills/kilo-kit/debugging/systematic/` | +0.15 if recent test failure |
| `root cause, why, understand` | `skills/kilo-kit/debugging/root-cause/` | +0.20 if 3rd+ fix attempt |
| `verify, confirm, done` | `skills/kilo-kit/debugging/verification/` | +0.25 if completion claimed |
| `review, PR, code review` | `skills/kilo-kit/quality/code-review/` | +0.15 if git context |
| `test, TDD, testing` | `skills/kilo-kit/quality/testing/` | +0.10 if new feature |
| `security, auth, OWASP` | `skills/kilo-kit/development/security/` | +0.30 if auth-related |
| `API, backend, server` | `skills/kilo-kit/development/backend/` | +0.05 if TypeScript/Python |
| `validate, validation, check` | `skills/kilo-kit/debugging/systematic/` ⁽¹⁾ | +0.10 if security context |
| `frontend, UI, React` | `skills/kilo-kit/development/frontend/` ⁽²⁾ | +0.10 if component work |
| `database, SQL, query` | `skills/kilo-kit/development/database/` ⁽²⁾ | +0.15 if performance issue |
| `architecture, design` | `skills/kilo-kit/architecture/system-design/` ⁽²⁾ | +0.20 if greenfield |
| `scale, microservices` | `skills/kilo-kit/architecture/scalability/` ⁽²⁾ | +0.25 if load mentioned |
| `CI/CD, deploy, Docker` | `skills/kilo-kit/automation/devops/` ⁽²⁾ | +0.10 if config files |
| `context, token, optimize` | `skills/kilo-kit/automation/context-engineering/` ⁽²⁾ | +0.30 if budget warning |

> ⁽¹⁾ *Routed to closest existing skill. Originally mapped to `skills/kilo-kit/debugging/defense-in-depth/` (planned).*  
> ⁽²⁾ *Skill planned but not yet implemented. The routing engine should fall back to the closest matching existing skill.*

**Adaptive Adjustments:**
- Skills with >80% success rate get +0.10 boost
- Skills with <50% success rate get -0.15 penalty
- User's frequent skills get +0.05 preference boost
- Recently failed skills get -0.20 cooldown penalty

---

## 💰 Token Economy Modes

| Mode | Token Multiplier | Use When |
|------|------------------|----------|
| **🟢 Economy** | 0.6x baseline | Simple, well-defined tasks |
| **🟡 Standard** | 1.0x baseline | Most tasks (default) |
| **🟠 Premium** | 1.5x baseline | Complex, multi-step tasks |
| **🔴 Critical** | 2.0x baseline | Production issues, security |

**Auto-Selection Rules:**
```
IF urgency == "high" AND type == "security": mode = Critical
ELSE IF complexity > 7 OR files_touched > 5: mode = Premium
ELSE IF intent_confidence < 0.6: mode = Standard (need exploration)
ELSE IF task_familiarity > 0.9: mode = Economy
ELSE: mode = Standard
```

---

## ✅ Quality Gates (NEVER SKIP)

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
```yaml
before_claiming_done:
  - [ ] Verify claimed changes exist
  - [ ] Run relevant tests if applicable
  - [ ] Check for obvious regressions
  - [ ] Ensure user request addressed
  - [ ] Document what was done

if_gate_fails:
  - Return to appropriate stage
  - Log failure in decision trail
  - Adjust for next attempt
```

---

## 🔧 Composable Behavior Units

### Atomic Behaviors (Cannot decompose)

| Behavior | Purpose | Token Cost |
|----------|---------|------------|
| `parse_input` | Parse and structure input | ~50 |
| `search_code` | Search codebase | ~100 |
| `read_file` | Read file content | ~20 |
| `write_file` | Write file content | ~30 |
| `run_command` | Execute command | ~40 |
| `list_dir` | List directory contents | ~15 |
| `validate_syntax` | Validate code syntax | ~60 |
| `validate_data` | Validate data against schema | ~50 |
| `reason` | Logical reasoning | ~200 |
| `generate` | Generate content | ~300 |
| `compare` | Compare two items | ~80 |
| `summarize` | Summarize content | ~100 |
| `ask_user` | Request user clarification | ~30 |

### Compound Behaviors (Composable)

```yaml
trace_error:
  components: [parse_input, search_code, read_file, reason]
  purpose: Trace error to source

modify_safely:
  components: [read_file, validate_syntax, write_file, run_command]
  purpose: Safe file modification

test_change:
  components: [write_file, run_command, parse_input, compare]
  purpose: Write and test change
```

### Composition Rules

```
SEQUENTIAL: A → B → C (output flows to next)
PARALLEL:   A | B | C (run independently)  
CONDITIONAL: IF(A) THEN B ELSE C
LOOP:       WHILE(condition) DO A
FALLBACK:   TRY A CATCH B
```

---

## 🔍 Decision Audit Trail Format

```yaml
decision_record:
  id: "DEC-{timestamp}-{hash}"
  timestamp: "ISO-8601"
  
  context:
    user_input: "..."
    session_history_length: N
    token_budget_remaining: N
  
  intake:
    intent_type: "debug|develop|review|..."
    confidence: 0.0-1.0
    keywords_extracted: [...]
    urgency: "low|medium|high|critical"
  
  routing:
    candidates:
      - skill: "skill-id"
        score: 0.0-1.0
        reason: "..."
    selected: "skill-id"
    selection_reason: "..."
    alternative_considered: [...]
  
  execution:
    behavior_chain: [...]
    quality_gates: {passed: [], failed: []}
    token_used: N
    duration_ms: N
  
  outcome:
    success: true|false
    error_if_any: "..."
    user_feedback: "positive|negative|neutral|none"
  
  learning:
    skill_metric_delta: {...}
    routing_weight_adjustments: [...]
    knowledge_graph_updates: [...]
```

---

## 📚 Skill File Format

Every skill follows this structure:

```yaml
# SKILL.md
---
name: skill-name
description: >-
  Concise description of what this skill does.
  Include keywords that should trigger this skill.
version: 1.0.0
behaviors: [behavior1, behavior2]  # CBUs this skill uses
dependencies: [other-skill]        # Required skills
token_estimate:
  min: 500
  typical: 1500
  max: 5000
---

# Skill Name

## When to Use
- Trigger condition 1
- Trigger condition 2

## Prerequisites
- What must be true before using

## Process
1. Step 1
2. Step 2
3. Step 3

## Guidelines
- Guideline 1
- Guideline 2

## References
- `references/detailed-guide.md` - For deep dives
- `scripts/helper.py` - Automation scripts

## Common Patterns
- Pattern 1: When X, do Y
- Pattern 2: When A, consider B

## Anti-Patterns (AVOID)
- Don't do X because Y
- Never assume Z

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

---

## 🚀 Quick Reference Commands

### Starting a Task
```
1. Parse intent from user input
2. Check token budget
3. Route to appropriate skill
4. Log decision trail
5. Execute behavior chain
6. Apply quality gates
7. Learn from outcome
```

### When Stuck
```
1. Check: Is intent clear? (If not → ask clarifying question)
2. Check: Is skill matched? (If not → try related keywords)
3. Check: Is budget sufficient? (If not → switch to Economy mode)
4. Check: Did behavior fail? (If yes → check error, try fallback)
5. Check: Are gates failing? (If yes → identify which, address root cause)
```

### Before Claiming Done
```
1. Verify: Changes exist (read/run to confirm)
2. Verify: Tests pass (if applicable)
3. Verify: No regressions
4. Verify: User request fully addressed
5. Document: What was done and why
```

---

## 💡 Core Principles Summary

| Principle | Mantra | Implementation |
|-----------|--------|----------------|
| **Flow-First** | "Continuous, not discrete" | Event-driven with state |
| **Predict-Then-Act** | "Anticipate needs" | PCE prefetching |
| **Compose-Don't-Monolith** | "Small pieces, loosely joined" | CBU system |
| **Learn-Always** | "Every task teaches" | Skill analytics |
| **Explain-Everything** | "No black boxes" | Decision audit trail |
| **Budget-Aware** | "Quality per token" | Token economy |
| **Fail-Forward** | "Errors are data" | Graceful degradation |
| **Gate-Never-Skip** | "Quality is non-negotiable" | Mandatory checkpoints |

---

*Kilo-Kit Master Skill v1.0.0 — Cognitive Flow Architecture*
