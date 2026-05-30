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

  it("persists orchestration sessions and workflow outcomes in sqlite", async () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), "kilo-c4-memory-session-"));
    const filePath = path.join(dir, "orchestrator.sqlite");
    const memory = await createSqliteOrchestrationMemory({ filePath });

    memory.recordSession({
      id: "session-1",
      state: "brainstorming_required",
      message: "Fix bug login",
      taskMode: "bug-test-first",
      route: { taskMode: "bug-test-first" },
      questions: [{ id: "goal" }],
      answers: {},
      memorySuggestions: [],
      finalWorkflow: [],
      createdAt: "2026-05-30T00:00:00.000Z",
      updatedAt: "2026-05-30T00:00:00.000Z",
    });
    memory.recordOutcome({
      id: "outcome-1",
      sessionId: "session-1",
      taskMode: "bug-test-first",
      workflow: [{ skill: { id: "productivity/brainstorming" } }],
      verification: { commands: ["npm --prefix mcp test"], reason: "test" },
      outcome: "workflow-released",
      createdAt: "2026-05-30T00:01:00.000Z",
    });

    const report = memory.report();

    expect(report.sessions).toContainEqual(expect.objectContaining({ id: "session-1", state: "brainstorming_required" }));
    expect(report.outcomes).toContainEqual(expect.objectContaining({ id: "outcome-1", outcome: "workflow-released" }));
  });
});
