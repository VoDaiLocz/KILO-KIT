# C4 Orchestration Kernel Design

## Goal

Build a central C4 orchestration layer for Kilo-Kit that makes every agent task start with explicit intent clarification, brainstorming discipline, memory-aware suggestions, and a verified workflow plan before implementation begins.

C4 should complete the C1-C3 adaptive routing work by adding an operational kernel above routing:

- C1: deterministic routing and workflow metadata.
- C2: route telemetry and reporting.
- C3: bounded analytics feedback.
- C4: central orchestration, mandatory questions, global memory suggestions, and brainstorming-first workflow governance.

## Non-Goals

- Do not let memory silently rewrite workflows.
- Do not store raw chat history as long-term memory.
- Do not implement a full vector database in the first C4 release.
- Do not require one custom question template for every individual skill before C4 can ship.

## Core Decision

C4 will use a hybrid design:

- MCP runtime tool for deterministic orchestration and testable state handling.
- A central skill for human-readable operating rules and agent behavior.
- Global SQLite memory for cross-project user preferences and accepted defaults.
- JSONL audit trail for append-only traceability.

The first C4 tool will be `kilo_orchestrate_task`.

## Brainstorming-First Gate

Brainstorming is the highest-priority C4 gate.

When a user asks the agent to start any substantive task, C4 must put `productivity/brainstorming` at the front of the workflow unless the current task is already in a brainstorming/specification phase.

The gate applies before implementation, refactoring, feature work, architecture changes, skill authoring, UI work, deployment work, database work, and any other task that would change files or behavior.

The gate does not need to block simple read-only answers, status reports, or command-output requests. If the agent is about to do work rather than answer, the gate applies.

C4 may perform internal advisory routing before brainstorming so it can choose the right question template. That internal classification does not release implementation work. Any workflow returned for execution must still place `productivity/brainstorming` first unless brainstorming has already been completed and approved for the current session.

## Question Policy

C4 uses an Always Ask policy.

Every substantive workflow must pass through a question phase before the final workflow is released. The question style is Verbose Safe: ask enough to avoid wrong routing and clarify success criteria, even when that costs extra tokens.

Templates are hybrid:

- Category-level templates cover the full skill library by default.
- Skill-level overrides cover important or high-risk skills.

Initial skill override targets:

- `engineering/tdd`
- `engineering/code-review`
- `engineering/improve-codebase-architecture`
- `design/frontend-design`
- `design/ui-styling`
- `operations/deployment-procedures`
- `operations/mcp-builder`
- `engineering/database-design`
- `engineering/vulnerability-scanner`
- `productivity/writing-skills`
- `productivity/verification-before-completion`

## Memory Policy

C4 uses global user memory, not project-only memory.

Default memory path:

```text
~/.kilo-kit/orchestrator.sqlite
```

Memory may store structured facts, not raw chat logs:

- accepted user preferences
- rejected suggestions
- common verification gates
- preferred workflow chains
- project fingerprints
- task outcomes
- skill and workflow effectiveness summaries

Memory must use Ask Before Apply. It can suggest workflow or verification changes, but it cannot silently apply them.

Example memory suggestions:

- "You usually prefer TDD before bug fixes. Apply that default here?"
- "For TypeScript repos, you often run test, typecheck, and build before completion. Add that verification gate?"
- "You often want architecture review before editing skill routing. Add `engineering/improve-codebase-architecture` before implementation?"

## State Machine

`kilo_orchestrate_task` should operate as a state machine:

1. `new`
   - Receive a user request.
   - Create or accept a `sessionId`.

2. `routed_internal`
   - Call the C1-C3 router for advisory classification only.
   - Capture `taskMode`, recommendations, workflow, rule hierarchy, and decision trail.

3. `brainstorming_required`
   - Insert `productivity/brainstorming` before any implementation workflow.
   - Return a clear next action when brainstorming/spec approval is still missing.

4. `questioning`
   - Select category template plus skill override questions.
   - Return required questions and missing fields.

5. `memory_check`
   - Look up relevant global memory.
   - Produce concise `memorySuggestions` when confidence is high enough.

6. `awaiting_memory_confirmation`
   - Ask the user to accept or reject memory suggestions that affect workflow, verification, or defaults.

7. `ready`
   - Return final workflow, first skill to load, verification gate, accepted memory suggestions, and audit summary.

8. `blocked`
   - Return a reason and the next question when required information conflicts or remains missing.

## MCP Surface

### `kilo_orchestrate_task`

Input:

- `message`: current user request.
- `context`: optional files, mode, previous errors, repo hints.
- `sessionId`: optional existing orchestration session.
- `answers`: optional answers to previous questions.
- `memoryConfirmations`: optional accept/reject decisions for memory suggestions.
- `format`: `markdown` or `json`.

Output:

- `sessionId`
- `state`
- `taskMode`
- `questions`
- `missingInfo`
- `route`
- `workflow`
- `memorySuggestions`
- `finalWorkflow`
- `firstSkillToLoad`
- `verificationGate`
- `nextAction`
- `auditRef`

### `kilo_memory_report`

Input:

- optional filters for task mode, project fingerprint, skill, or date range.

Output:

- accepted defaults
- rejected suggestions
- top workflow patterns
- skill outcome summaries
- stale memory candidates

This tool is read-only.

## Data Model

SQLite tables:

### `memory_facts`

- `id`
- `kind`
- `scope`
- `key`
- `value_json`
- `confidence`
- `source`
- `created_at`
- `updated_at`

### `orchestration_sessions`

- `id`
- `state`
- `message`
- `task_mode`
- `route_json`
- `questions_json`
- `answers_json`
- `memory_suggestions_json`
- `final_workflow_json`
- `created_at`
- `updated_at`

### `memory_decisions`

- `id`
- `session_id`
- `suggestion_key`
- `decision`
- `reason`
- `created_at`

### `workflow_outcomes`

- `id`
- `session_id`
- `task_mode`
- `workflow_json`
- `verification_json`
- `outcome`
- `created_at`

JSONL audit remains append-only and records each orchestration decision without replacing SQLite memory.

## Error Handling

- If no route is confident enough, stay in `questioning`.
- If memory is unavailable, continue without memory and record a warning in the audit trail.
- If SQLite initialization fails, fall back to in-memory session state and do not claim persistence.
- If answers conflict, enter `blocked` and ask one clarifying question.
- If brainstorming approval is missing, return `brainstorming_required` and do not release implementation workflow.

## Token Budget Policy

C4 is intentionally Verbose Safe, but it still needs hard caps:

- Return only relevant memory suggestions.
- Do not return raw memory rows by default.
- Limit question output to the selected template plus required overrides.
- Keep route decision trail summarized unless `format=json` or debug mode requests details.

## Testing Strategy

Core tests:

- Always inserts `productivity/brainstorming` before implementation workflows.
- Does not insert duplicate brainstorming when already in brainstorming mode.
- Always returns questions before `ready` for substantive tasks.
- Uses category templates for broad skill categories.
- Applies skill-level question overrides for high-risk skills.
- Produces memory suggestions without applying them.
- Applies memory suggestions only after explicit confirmation.
- Falls back cleanly when memory storage is unavailable.
- Persists orchestration state and decisions in SQLite.
- Writes append-only audit events for orchestration decisions.
- Keeps C1-C3 route behavior backward-compatible.

Smoke tests:

- A bug-fix request goes through brainstorming, TDD questions, memory suggestion confirmation, final workflow, and verification gate.
- A UI request goes through brainstorming, UI template questions, final design workflow, and verification gate.
- A read-only status request does not force implementation workflow.

## Documentation Updates

Update:

- `README.md` MCP section.
- `mcp/README.md`.
- Add C4 plan under `docs/superpowers/plans/`.
- Add usage examples for `kilo_orchestrate_task`.

## Success Criteria

C4 is successful when:

- Agents have one central orchestration entry point.
- Substantive work always starts with brainstorming.
- Every workflow asks clarifying questions before execution.
- Global memory can suggest defaults across projects.
- Memory never silently changes workflow.
- The final workflow is inspectable, auditable, and verified.
- Existing C1-C3 router tests still pass.
