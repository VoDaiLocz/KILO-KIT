# Atomic Behaviors Reference

> **Component:** Behavior Layer  
> **Type:** Atomic (Cannot be decomposed further)  
> **Version:** 1.0.0

---

## Overview

Atomic behaviors are the smallest, indivisible units of action in Kilo-Kit. They form the building blocks for compound behaviors and skills.

**Properties of Atomic Behaviors:**
- Single, focused purpose
- Deterministic output
- No internal composition
- Minimal token cost
- Can be parallelized when independent

---

## Catalog of Atomic Behaviors

### 1. `parse_input`

**Purpose:** Parse and structure raw input into actionable data.

```yaml
behavior: parse_input
category: input

input:
  raw_text: string
  parse_type: "intent" | "error" | "code" | "command"

output:
  parsed_data: object
  confidence: float
  tokens_used: int

token_cost: ~50

example:
  input: 
    raw_text: "Fix the login bug in auth.ts"
    parse_type: "intent"
  output:
    parsed_data:
      action: "fix"
      target: "login bug"
      file: "auth.ts"
    confidence: 0.92
```

---

### 2. `search_code`

**Purpose:** Search codebase for patterns, symbols, or text.

```yaml
behavior: search_code
category: retrieval

input:
  query: string
  scope: "all" | "file" | "directory" | "project"
  type: "text" | "symbol" | "regex" | "semantic"
  max_results: int (default: 10)

output:
  results: array<{file, line, content, relevance}>
  total_matches: int
  tokens_used: int

token_cost: ~100

example:
  input:
    query: "validateUser"
    scope: "project"
    type: "symbol"
  output:
    results:
      - file: "auth.ts"
        line: 45
        content: "function validateUser(credentials) {...}"
        relevance: 1.0
```

---

### 3. `list_dir`

**Purpose:** List the contents of a directory.

```yaml
behavior: list_dir
category: retrieval

input:
  path: string
  recursive: bool (default: false)
  max_depth: int (default: 1)
  include_hidden: bool (default: false)

output:
  entries: array<{name, type, size_bytes}>
  total_count: int
  tokens_used: int

token_cost: ~15

example:
  input:
    path: "src/skills"
    recursive: false
  output:
    entries:
      - name: "_template"
        type: "directory"
      - name: "debugging"
        type: "directory"
      - name: "development"
        type: "directory"
      - name: "quality"
        type: "directory"
    total_count: 4
```

> **Cross-Platform Notes:**
> - Claude Code: `list_dir` maps to the `LS` tool
> - Cursor: `list_dir` maps to `list_dir` (native)
> - Codex: `list_dir` maps to shell `ls` or `find`
> - OpenCode: `list_dir` maps to directory listing APIs

---

### 4. `read_file`

**Purpose:** Read contents of a file.

```yaml
behavior: read_file
category: retrieval

input:
  path: string
  start_line: int (optional)
  end_line: int (optional)
  encoding: string (default: "utf-8")

output:
  content: string
  lines: int
  size_bytes: int
  tokens_used: int

token_cost: ~20 (base) + content tokens

example:
  input:
    path: "src/auth.ts"
    start_line: 40
    end_line: 60
  output:
    content: "function validateUser..."
    lines: 21
```

---

### 5. `write_file`

**Purpose:** Write or modify file contents.

```yaml
behavior: write_file
category: mutation

input:
  path: string
  content: string
  mode: "overwrite" | "append" | "insert" | "replace"
  at_line: int (for insert/replace)
  backup: bool (default: true)

output:
  success: bool
  bytes_written: int
  backup_path: string (if backup: true)
  tokens_used: int

token_cost: ~30

example:
  input:
    path: "src/auth.ts"
    content: "function validateUser(credentials) { ... }"
    mode: "replace"
    at_line: 45
```

---

### 6. `run_command`

**Purpose:** Execute a CLI command.

```yaml
behavior: run_command
category: execution

input:
  command: string
  cwd: string (optional)
  timeout_ms: int (default: 30000)
  env: object (optional)

output:
  exit_code: int
  stdout: string
  stderr: string
  duration_ms: int
  tokens_used: int

token_cost: ~40

example:
  input:
    command: "npm test -- --grep 'auth'"
    cwd: "/project"
    timeout_ms: 60000
  output:
    exit_code: 0
    stdout: "All tests passed"
    duration_ms: 3200
```

---

### 7. `validate_syntax`

**Purpose:** Validate code syntax for a given language.

```yaml
behavior: validate_syntax
category: validation

input:
  code: string
  language: string
  strict: bool (default: true)

output:
  valid: bool
  errors: array<{line, column, message}>
  warnings: array<{line, column, message}>
  tokens_used: int

token_cost: ~60

example:
  input:
    code: "function foo() { return }"
    language: "javascript"
  output:
    valid: false
    errors:
      - line: 1
        column: 25
        message: "Missing semicolon"
```

---

### 8. `validate_data`

**Purpose:** Validate data against a schema.

```yaml
behavior: validate_data
category: validation

input:
  data: any
  schema: object (JSON Schema or similar)
  strict: bool (default: false)

output:
  valid: bool
  errors: array<{path, message}>
  coerced_data: any (if coercion enabled)
  tokens_used: int

token_cost: ~50

example:
  input:
    data: { name: "John", age: "25" }
    schema: { name: string, age: number }
  output:
    valid: false
    errors:
      - path: ".age"
        message: "Expected number, got string"
```

---

### 9. `reason`

**Purpose:** Apply logical reasoning to reach a conclusion.

```yaml
behavior: reason
category: cognition

input:
  premise: string | array<string>
  question: string
  depth: "shallow" | "medium" | "deep"
  max_steps: int (default: 5)

output:
  conclusion: string
  reasoning_chain: array<{step, thought}>
  confidence: float
  tokens_used: int

token_cost: ~200 (shallow) to ~500 (deep)

example:
  input:
    premise: "The test fails only when database is empty."
    question: "What is likely wrong?"
    depth: "medium"
  output:
    conclusion: "Missing null/empty check in data retrieval"
    reasoning_chain:
      - step: 1
        thought: "Issue is data-dependent"
      - step: 2
        thought: "Empty database = edge case = missing check"
    confidence: 0.85
```

---

### 10. `generate`

**Purpose:** Generate content (code, text, etc.).

```yaml
behavior: generate
category: generation

input:
  type: "code" | "text" | "documentation" | "test"
  specification: string
  language: string (if code)
  style: string (optional)
  max_length: int (optional)

output:
  content: string
  tokens_generated: int
  tokens_used: int

token_cost: ~300

example:
  input:
    type: "code"
    specification: "Function to validate email format"
    language: "typescript"
  output:
    content: "function isValidEmail(email: string): boolean { ... }"
```

---

### 11. `compare`

**Purpose:** Compare two items and identify differences.

```yaml
behavior: compare
category: analysis

input:
  item_a: any
  item_b: any
  type: "text" | "code" | "data" | "semantic"
  ignore: array<string> (optional)

output:
  equal: bool
  differences: array<{location, a_value, b_value}>
  similarity: float
  tokens_used: int

token_cost: ~80

example:
  input:
    item_a: "function foo() { return 1; }"
    item_b: "function foo() { return 2; }"
    type: "code"
  output:
    equal: false
    differences:
      - location: "return statement"
        a_value: "1"
        b_value: "2"
    similarity: 0.95
```

---

### 12. `summarize`

**Purpose:** Summarize content to reduce token usage.

```yaml
behavior: summarize
category: transformation

input:
  content: string
  max_length: int
  preserve: array<string> (key terms to keep)
  style: "bullet" | "prose" | "technical"

output:
  summary: string
  compression_ratio: float
  tokens_used: int

token_cost: ~100

example:
  input:
    content: "Long error log with stack trace..."
    max_length: 100
    style: "technical"
  output:
    summary: "NullPointerException at line 45 in auth.ts"
    compression_ratio: 0.15
```

---

### 13. `ask_user`

**Purpose:** Request clarification from user.

```yaml
behavior: ask_user
category: interaction

input:
  question: string
  context: string (why asking)
  options: array<string> (optional)
  required: bool (default: true)

output:
  response: string
  selected_option: int (if options provided)
  tokens_used: int

token_cost: ~30

example:
  input:
    question: "Should I also update the tests?"
    context: "The fix touched auth logic"
    options: ["Yes", "No", "Skip for now"]
  output:
    response: "Yes"
    selected_option: 0
```

---

## Behavior Composition Rules

### Chaining

```yaml
# Sequential execution
chain:
  - parse_input
  - search_code
  - reason
  
# Output of each feeds into next
flow: parse_input.output → search_code.input → reason.input
```

### Parallel

```yaml
# Independent behaviors can run in parallel
parallel:
  branch_a: read_file(file1)
  branch_b: read_file(file2)
  branch_c: search_code(query)

# Results aggregated after all complete
```

### Conditional

```yaml
# Branch based on condition
conditional:
  if: validate_syntax.output.valid
  then: write_file
  else: ask_user
```

---

## Token Budget Reference

| Behavior | Min Tokens | Typical | Max |
|----------|------------|---------|-----|
| parse_input | 30 | 50 | 100 |
| search_code | 50 | 100 | 300 |
| list_dir | 10 | 15 | 50 |
| read_file | 20 | 50 | 500+ |
| write_file | 20 | 30 | 50 |
| run_command | 30 | 40 | 100 |
| validate_syntax | 40 | 60 | 150 |
| validate_data | 30 | 50 | 100 |
| reason | 100 | 200 | 500 |
| generate | 150 | 300 | 1000 |
| compare | 50 | 80 | 200 |
| summarize | 60 | 100 | 300 |
| ask_user | 20 | 30 | 50 |

---

*Atomic Behaviors Reference v1.0.0 — 13 building blocks for intelligent actions*
