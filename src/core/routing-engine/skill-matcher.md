# Skill Matcher

> **Component:** Routing Engine  
> **Purpose:** Match user intent to optimal skill selection  
> **Version:** 1.0.0

---

## Overview

The Skill Matcher takes parsed intent from the Intent Parser and selects the most appropriate skill for handling the task. It uses a multi-factor scoring system that considers keywords, context, skill history, and user preferences.

---

## Matching Algorithm

### Input

```yaml
input:
  intent_analysis:
    primary_intent: "DEBUG"
    confidence: 0.85
    keywords: ["fix", "login", "bug"]
    domain: "AUTH"
    urgency: "high"
    
  context:
    recent_skills: ["code-review", "debugging/systematic"]
    project_type: "typescript-backend"
    active_files: ["auth.ts", "login.service.ts"]
    
  skill_registry:
    available_skills: [...]
    skill_metadata: {...}
    skill_analytics: {...}
```

### Scoring Factors

```yaml
scoring_weights:
  keyword_match: 0.35      # How well keywords match skill triggers
  intent_type_match: 0.25  # How well intent type matches skill domain
  historical_success: 0.15 # Skill's past success rate
  context_fit: 0.15        # How well skill fits current context
  user_preference: 0.10    # User's skill preferences
```

### Scoring Formula

```
Final Score = Σ (factor_score × factor_weight) + confidence_boost + penalty

Where:
  factor_score ∈ [0.0, 1.0]
  confidence_boost ∈ [-0.3, +0.3]
  penalty ∈ [-0.5, 0]
```

---

## Scoring Details

### 1. Keyword Match Score (35%)

```yaml
keyword_matching:
  method: "fuzzy_match"
  
  scoring:
    exact_match: 1.0        # "debug" matches "debug"
    stem_match: 0.8         # "debugging" matches "debug"
    synonym_match: 0.6      # "fix" matches "debug"
    partial_match: 0.4      # "debugger" contains "debug"
    no_match: 0.0
  
  calculation: |
    keyword_score = Σ(match_scores) / count(input_keywords)
    
  example:
    input: ["fix", "login", "bug"]
    skill_triggers: ["bug", "error", "fix", "debug"]
    
    matches:
      "fix" → exact_match (1.0)
      "bug" → exact_match (1.0)
      "login" → no_match (0.0)
    
    keyword_score = (1.0 + 1.0 + 0.0) / 3 = 0.67
```

### 2. Intent Type Match Score (25%)

```yaml
intent_type_matching:
  mapping:
    DEBUG: ["debugging/*", "quality/testing"]
    DEVELOP: ["development/*"]
    REVIEW: ["quality/code-review"]
    TEST: ["quality/testing"]
    SECURITY: ["development/security"]
  
  scoring:
    primary_match: 1.0      # Skill category matches intent type
    secondary_match: 0.6    # Skill is related to intent type
    no_match: 0.2           # Generic applicability
  
  example:
    intent: "DEBUG"
    skill: "debugging/systematic" → primary_match (1.0)
    skill: "quality/testing" → secondary_match (0.6)
    skill: "development/backend" → no_match (0.2)
```

### 3. Historical Success Score (15%)

```yaml
historical_success:
  source: "skill_analytics"
  
  metrics:
    success_rate: weight 0.5
    avg_iterations: weight 0.3
    token_efficiency: weight 0.2
  
  calculation: |
    base_score = success_rate
    iteration_penalty = min(0.2, (avg_iterations - 1) × 0.05)
    efficiency_bonus = (token_efficiency - 0.5) × 0.2
    
    historical_score = base_score - iteration_penalty + efficiency_bonus
    
  example:
    skill: "debugging/systematic"
    success_rate: 0.87
    avg_iterations: 2.3
    token_efficiency: 0.72
    
    base_score = 0.87
    iteration_penalty = min(0.2, 1.3 × 0.05) = 0.065
    efficiency_bonus = (0.72 - 0.5) × 0.2 = 0.044
    
    historical_score = 0.87 - 0.065 + 0.044 = 0.849
```

### 4. Context Fit Score (15%)

```yaml
context_fit:
  factors:
    project_type_match:
      skill_supports_project: 1.0
      neutral: 0.5
      poor_fit: 0.2
    
    file_relevance:
      related_files_active: +0.1
      no_related_files: 0.0
    
    recent_skill_chain:
      follows_naturally: +0.15
      unrelated: 0.0
      conflicts: -0.1
  
  example:
    skill: "debugging/systematic"
    project_type: "typescript-backend" → supports (1.0)
    active_files: ["auth.ts"] → related (+0.1)
    recent_skill: "code-review" → follows naturally (+0.15)
    
    context_fit_score = 1.0 × 0.7 + 0.1 + 0.15 = 0.95
```

### 5. User Preference Score (10%)

```yaml
user_preference:
  sources:
    explicit_preference: "user set preference for skill"
    implicit_preference: "frequently used skills"
    session_preference: "skills used this session"
  
  scoring:
    explicitly_preferred: 1.0
    frequently_used: 0.7
    recently_used: 0.6
    neutral: 0.5
    explicitly_avoided: 0.0
```

---

## Confidence Boosters & Penalties

### Boosters

```yaml
boosters:
  recent_test_failure:
    condition: "test failure in last 5 minutes"
    applicable_to: ["debugging/*"]
    boost: +0.15
  
  security_context:
    condition: "auth/security keywords present"
    applicable_to: ["development/security"]
    boost: +0.30
  
  repeated_fix_attempt:
    condition: "3rd+ attempt on same issue"
    applicable_to: ["debugging/root-cause"]
    boost: +0.20
  
  completion_claim:
    condition: "user says 'done', 'finished'"
    applicable_to: ["debugging/verification"]
    boost: +0.25
  
  high_success_skill:
    condition: "skill success_rate > 0.80"
    applicable_to: "any"
    boost: +0.10
```

### Penalties

```yaml
penalties:
  recent_failure:
    condition: "skill failed in last 30 minutes"
    penalty: -0.20
  
  low_success_rate:
    condition: "skill success_rate < 0.50"
    penalty: -0.15
  
  budget_insufficient:
    condition: "skill token_estimate > available_budget"
    penalty: -0.30
  
  dependency_missing:
    condition: "skill dependency not available"
    penalty: -0.50
  
  context_mismatch:
    condition: "skill designed for different project type"
    penalty: -0.15
```

---

## Selection Process

### Step 1: Candidate Generation

```yaml
candidate_generation:
  method: "all_matching_skills"
  
  filter_criteria:
    - Skill is not disabled
    - At least one keyword matches
    - Dependencies can be satisfied
    - Not explicitly excluded
```

### Step 2: Score Calculation

```yaml
score_calculation:
  for_each_candidate:
    1. Calculate keyword_match_score
    2. Calculate intent_type_match_score
    3. Calculate historical_success_score
    4. Calculate context_fit_score
    5. Calculate user_preference_score
    6. Calculate base_score = weighted_sum
    7. Apply boosters
    8. Apply penalties
    9. final_score = base_score + boosters - penalties
```

### Step 3: Ranking & Selection

```yaml
ranking:
  method: "descending_by_score"
  
  selection:
    if: top_score > 0.6
    then: select top skill
    
    if: top_score <= 0.6 and < 0.4
    then: ask for clarification
    
    if: top_score < 0.4
    then: report no suitable skill found
    
  tie_breaking:
    1. Higher historical success rate
    2. Lower token estimate
    3. User preference
    4. Alphabetical (last resort)
```

---

## Output

```yaml
skill_match_result:
  selected_skill:
    id: "debugging/systematic"
    confidence: 0.97
    reason: "High keyword match + successful history + security context boost"
  
  alternatives:
    - skill: "debugging/root-cause"
      score: 0.78
      reason: "Good match but lower priority for first attempt"
    
    - skill: "quality/code-review"
      score: 0.45
      reason: "Some keyword overlap but wrong intent type"
  
  scoring_breakdown:
    keyword_match: 0.67 × 0.35 = 0.235
    intent_type: 1.0 × 0.25 = 0.250
    historical: 0.85 × 0.15 = 0.128
    context_fit: 0.95 × 0.15 = 0.143
    user_pref: 0.6 × 0.10 = 0.060
    subtotal: 0.816
    security_boost: +0.15
    no_penalties: 0
    final: 0.97 (capped at 1.0 if over)
  
  decision_logged: "DEC-20260130-101532-abc12345"
```

---

## Integration Points

### Upstream
- Receives intent analysis from Intent Parser
- Receives skill metadata from Skill Registry

### Downstream
- Passes selection to Behavior Composer
- Logs to Decision Audit Trail
- Feeds into Skill Analytics

---

*Skill Matcher v1.0.0 — Right skill for the right job*
