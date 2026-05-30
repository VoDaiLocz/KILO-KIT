# C4 Orchestration Kernel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the C4 central orchestration layer that enforces brainstorming-first workflows, always-ask question gates, global memory suggestions, and auditable final workflow decisions.

**Architecture:** Add focused MCP modules instead of expanding `server.ts` or `router.ts`: question templates own clarification prompts, memory owns global facts/suggestions, orchestrator owns state transitions, and formatter/server expose the new tool. SQLite via `node:sqlite` is used when available; C4 falls back to in-memory memory/session state so Node runtimes without SQLite can still operate safely.

**Tech Stack:** TypeScript, Vitest, Node `node:sqlite` when available, JSONL audit, existing MCP SDK, existing C1-C3 router and analytics modules.

---

## File Structure

- Create `mcp/src/orchestration-types.ts`: C4 public types for questions, memory suggestions, sessions, and results.
- Create `mcp/src/question-templates.ts`: category templates plus skill overrides.
- Create `mcp/src/orchestration-memory.ts`: memory store interface, in-memory store, SQLite store, suggestion logic.
- Create `mcp/src/orchestration-audit.ts`: append-only JSONL audit writer for C4 events.
- Create `mcp/src/orchestrator.ts`: state machine around C1-C3 router, questions, memory, and final workflow.
- Modify `mcp/src/formatters.ts`: add `formatOrchestration()` and `formatMemoryReport()`.
- Modify `mcp/src/server.ts`: register `kilo_orchestrate_task` and `kilo_memory_report`.
- Modify `mcp/src/smoke-env.ts`: forward C4 memory/audit env vars to smoke server.
- Modify `mcp/src/smoke.ts`: run a realistic orchestration smoke.
- Add `mcp/tests/question-templates.test.ts`, `mcp/tests/orchestration-memory.test.ts`, `mcp/tests/orchestrator.test.ts`.
- Update `README.md` and `mcp/README.md`.

---

### Task 1: Add C4 Types and Question Template Tests

**Files:**
- Create: `mcp/src/orchestration-types.ts`
- Create: `mcp/src/question-templates.ts`
- Create: `mcp/tests/question-templates.test.ts`

- [x] **Step 1: Write failing template tests**

```ts
import { describe, expect, it } from "vitest";

import { selectQuestionTemplate } from "../src/question-templates.js";

describe("question templates", () => {
  it("selects category questions and skill overrides for TDD bug fixes", () => {
    const template = selectQuestionTemplate({
      taskMode: "bug-test-first",
      workflowSkillIds: ["engineering/diagnose", "engineering/tdd"],
      recommendedSkillIds: ["engineering/tdd"],
    });

    expect(template.id).toBe("engineering:bug-test-first");
    expect(template.questions.map((question) => question.id)).toEqual(
      expect.arrayContaining(["goal", "scope", "success_criteria", "failing_behavior", "test_command"]),
    );
    expect(template.questions.some((question) => question.skillId === "engineering/tdd")).toBe(true);
  });

  it("keeps templates compact enough for orchestration output", () => {
    const template = selectQuestionTemplate({
      taskMode: "ui",
      workflowSkillIds: ["productivity/brainstorming", "design/frontend-design", "design/ui-styling"],
      recommendedSkillIds: ["design/frontend-design"],
    });

    expect(template.questions.length).toBeLessThanOrEqual(8);
    expect(template.questions.every((question) => question.prompt.length <= 220)).toBe(true);
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npm --prefix mcp test -- question-templates.test.ts`

Expected: FAIL because `question-templates.js` does not exist.

- [x] **Step 3: Implement minimal C4 types**

Add `orchestration-types.ts` with `Question`, `QuestionTemplate`, `OrchestrationState`, `MemorySuggestion`, and `OrchestrationResult` interfaces.

- [x] **Step 4: Implement category templates and skill overrides**

Add `question-templates.ts` with `selectQuestionTemplate()` that merges:

- base questions: `goal`, `scope`, `success_criteria`
- task/category questions for engineering, design, review, ops, docs, security, fallback
- skill overrides for `engineering/tdd`, `design/frontend-design`, `operations/deployment-procedures`, `engineering/vulnerability-scanner`, and `productivity/verification-before-completion`

- [x] **Step 5: Run focused template tests**

Run: `npm --prefix mcp test -- question-templates.test.ts`

Expected: PASS.

---

### Task 2: Add Memory Store and Suggestion Tests

**Files:**
- Create: `mcp/src/orchestration-memory.ts`
- Create: `mcp/tests/orchestration-memory.test.ts`

- [x] **Step 1: Write failing memory tests**

```ts
import { mkdtempSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { createInMemoryOrchestrationMemory, createSqliteOrchestrationMemory } from "../src/orchestration-memory.js";

describe("orchestration memory", () => {
  it("suggests accepted verification defaults without applying them", () => {
    const memory = createInMemoryOrchestrationMemory();
    memory.rememberFact({
      kind: "verification-default",
      key: "typescript-quality-gate",
      value: { commands: ["npm --prefix mcp test", "npm --prefix mcp run typecheck"] },
      confidence: 0.91,
      source: "accepted-user-default",
    });

    const suggestions = memory.suggest({
      taskMode: "bug-test-first",
      workflowSkillIds: ["engineering/diagnose", "engineering/tdd"],
      projectFingerprint: "typescript:mcp",
    });

    expect(suggestions[0]).toMatchObject({
      key: "typescript-quality-gate",
      requiresConfirmation: true,
      applied: false,
    });
  });

  it("persists facts in sqlite when sqlite is available", async () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), "kilo-c4-memory-"));
    const filePath = path.join(dir, "orchestrator.sqlite");
    const memory = await createSqliteOrchestrationMemory({ filePath });

    memory.rememberFact({
      kind: "workflow-default",
      key: "prefer-brainstorming-first",
      value: { skillId: "productivity/brainstorming" },
      confidence: 1,
      source: "system",
    });

    const report = memory.report();
    expect(report.facts).toContainEqual(
      expect.objectContaining({ key: "prefer-brainstorming-first", kind: "workflow-default" }),
    );
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npm --prefix mcp test -- orchestration-memory.test.ts`

Expected: FAIL because memory module does not exist.

- [x] **Step 3: Implement in-memory store**

Implement `createInMemoryOrchestrationMemory()` with `rememberFact()`, `suggest()`, `recordDecision()`, and `report()`.

- [x] **Step 4: Implement SQLite store with safe fallback surface**

Implement `createSqliteOrchestrationMemory()` using dynamic `import("node:sqlite")`, create tables if available, and expose the same interface as in-memory.

- [x] **Step 5: Run focused memory tests**

Run: `npm --prefix mcp test -- orchestration-memory.test.ts`

Expected: PASS on Node with `node:sqlite`; if SQLite is unavailable, test should skip or use fallback in a controlled way.

---

### Task 3: Add Orchestrator State Machine

**Files:**
- Create: `mcp/src/orchestration-audit.ts`
- Create: `mcp/src/orchestrator.ts`
- Create: `mcp/tests/orchestrator.test.ts`

- [x] **Step 1: Write failing orchestrator tests**

```ts
import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";

import { createInMemoryOrchestrationMemory } from "../src/orchestration-memory.js";
import { createOrchestrator } from "../src/orchestrator.js";
import { createSkillRegistry } from "../src/registry.js";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));

describe("C4 orchestrator", () => {
  it("requires brainstorming before implementation workflows", async () => {
    const registry = await createSkillRegistry({ repoRoot });
    const orchestrator = createOrchestrator({
      registry,
      memory: createInMemoryOrchestrationMemory(),
    });

    const result = orchestrator.orchestrate({
      message: "Fix bug login, viết test trước",
      context: { files: ["src/auth/login.ts"], mode: "coding" },
    });

    expect(result.state).toBe("brainstorming_required");
    expect(result.finalWorkflow).toBeUndefined();
    expect(result.workflow.map((step) => step.skill.id)[0]).toBe("productivity/brainstorming");
    expect(result.questions.length).toBeGreaterThan(0);
  });

  it("does not duplicate brainstorming when brainstorming is already active", async () => {
    const registry = await createSkillRegistry({ repoRoot });
    const orchestrator = createOrchestrator({
      registry,
      memory: createInMemoryOrchestrationMemory(),
    });

    const result = orchestrator.orchestrate({
      message: "Brainstorm spec for C4 orchestration",
      context: { mode: "brainstorming" },
    });

    const brainstormingSteps = result.workflow.filter((step) => step.skill.id === "productivity/brainstorming");
    expect(brainstormingSteps).toHaveLength(1);
  });

  it("returns ready only after answers and memory confirmations are provided", async () => {
    const registry = await createSkillRegistry({ repoRoot });
    const memory = createInMemoryOrchestrationMemory();
    memory.rememberFact({
      kind: "verification-default",
      key: "typescript-quality-gate",
      value: { commands: ["npm --prefix mcp test", "npm --prefix mcp run typecheck"] },
      confidence: 0.95,
      source: "accepted-user-default",
    });
    const orchestrator = createOrchestrator({ registry, memory });

    const first = orchestrator.orchestrate({
      message: "Fix bug login, viết test trước",
      context: { files: ["src/auth/login.ts"], mode: "coding" },
    });

    const answered = orchestrator.orchestrate({
      message: first.message,
      sessionId: first.sessionId,
      answers: {
        goal: "Fix login failure",
        scope: "src/auth/login.ts",
        success_criteria: "login test passes",
        failing_behavior: "valid credentials rejected",
        test_command: "npm test -- login",
      },
    });

    expect(answered.state).toBe("awaiting_memory_confirmation");

    const ready = orchestrator.orchestrate({
      message: first.message,
      sessionId: first.sessionId,
      memoryConfirmations: { "typescript-quality-gate": "accepted" },
    });

    expect(ready.state).toBe("ready");
    expect(ready.firstSkillToLoad?.id).toBe("productivity/brainstorming");
    expect(ready.verificationGate.commands).toContain("npm --prefix mcp test");
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npm --prefix mcp test -- orchestrator.test.ts`

Expected: FAIL because orchestrator module does not exist.

- [x] **Step 3: Implement audit writer**

Add JSONL audit writer that records state transitions and returns `auditRef`.

- [x] **Step 4: Implement `createOrchestrator()`**

Implement session state, advisory routing, brainstorming-first workflow insertion, question selection, answer collection, memory suggestions, memory confirmation, final workflow, and verification gate.

- [x] **Step 5: Run focused orchestrator tests**

Run: `npm --prefix mcp test -- orchestrator.test.ts`

Expected: PASS.

---

### Task 4: Expose C4 Through MCP Server and Formatters

**Files:**
- Modify: `mcp/src/formatters.ts`
- Modify: `mcp/src/server.ts`
- Modify: `mcp/src/smoke-env.ts`
- Modify: `mcp/src/smoke.ts`

- [x] **Step 1: Add formatter tests through existing smoke path**

Use the orchestrator tests plus smoke after implementation. No separate formatter unit test is needed for v1 because JSON output is snapshot-equivalent through MCP smoke.

- [x] **Step 2: Implement `formatOrchestration()` and `formatMemoryReport()`**

Markdown must show state, questions, memory suggestions, workflow, verification gate, and next action. JSON must return the complete result.

- [x] **Step 3: Register MCP tools**

Register:

- `kilo_orchestrate_task`
- `kilo_memory_report`

Use zod schemas for message/context/session/answers/memoryConfirmations/format.

- [x] **Step 4: Forward C4 env vars in smoke**

Forward:

- `KILO_KIT_MEMORY_PATH`
- `KILO_KIT_ORCHESTRATION_AUDIT_PATH`

- [x] **Step 5: Extend smoke**

Smoke should:

- list `kilo_orchestrate_task` and `kilo_memory_report`
- call `kilo_orchestrate_task` for a bug-fix request
- confirm `state` is `brainstorming_required`
- confirm workflow starts with `productivity/brainstorming`
- confirm questions include TDD-specific prompt fields

---

### Task 5: Real Project Verification and Docs

**Files:**
- Modify: `README.md`
- Modify: `mcp/README.md`
- Modify: `docs/superpowers/plans/2026-05-30-c4-orchestration-kernel.md`

- [x] **Step 1: Update docs**

Document `kilo_orchestrate_task`, `kilo_memory_report`, global memory path, audit path, and Brainstorming-First Gate.

- [x] **Step 2: Run full MCP verification**

Run:

```bash
npm --prefix mcp test
npm --prefix mcp run typecheck
npm --prefix mcp run build
npm --prefix mcp run smoke
node src/tools/validate-skill.js --all skills
git diff --check
```

Expected:

- all Vitest files pass
- typecheck exits 0
- build exits 0
- smoke prints `MCP smoke check passed.`
- skill validator reports `134/134 skills valid`
- `git diff --check` exits 0

- [x] **Step 3: Run real project orchestration smoke**

Run built MCP smoke with real local persistence:

```bash
KILO_KIT_MEMORY_PATH=/tmp/kilo-kit-c4-real-orchestrator.sqlite \
KILO_KIT_ORCHESTRATION_AUDIT_PATH=/tmp/kilo-kit-c4-real-audit.jsonl \
KILO_KIT_WRITE_DECISIONS=true \
KILO_KIT_DECISION_TRAIL_PATH=/tmp/kilo-kit-c4-route-decisions.jsonl \
npm --prefix mcp run smoke
```

Expected:

- orchestration smoke passes
- route decision JSONL has at least one route event
- orchestration audit JSONL has at least one C4 event
- SQLite memory file exists when `node:sqlite` is available

- [x] **Step 4: Produce review checklist**

Summarize actual evidence for:

- Brainstorming-first enforcement
- Always-Ask questions
- Full-library hybrid template support
- Ask-before-apply memory
- JSONL audit
- Real local MCP operation
