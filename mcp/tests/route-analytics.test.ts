import { mkdtempSync, readFileSync, appendFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  createInMemoryRouteAnalytics,
  createJsonlRouteAnalytics,
  type RouteEvent,
} from "../src/route-analytics.js";

const baseEvent: RouteEvent = {
  timestamp: "2026-05-30T00:00:00.000Z",
  message: "Optimize workflow",
  taskMode: "workflow-optimization",
  recommendedSkillIds: ["engineering/improve-codebase-architecture", "engineering/context-engineering"],
  workflowSkillIds: [
    "engineering/improve-codebase-architecture",
    "engineering/context-engineering",
    "productivity/verification-before-completion",
  ],
  decisionTrail: [
    {
      skillId: "engineering/improve-codebase-architecture",
      score: 100,
      matchedSignals: ["workflow-optimization"],
      scoreBreakdown: { "workflow-optimization": 58, workflow: 24 },
      reason: "Selected because it matched workflow-optimization.",
    },
    {
      skillId: "operations/mcp-builder",
      score: 2,
      matchedSignals: ["mcp"],
      scoreBreakdown: { mcp: 12, conflict: -10 },
      reason: "Selected because it received a conflict penalty.",
    },
  ],
};

describe("route analytics", () => {
  it("summarizes route events by skill, task mode, workflow, and conflicts", () => {
    const analytics = createInMemoryRouteAnalytics([
      baseEvent,
      {
        ...baseEvent,
        timestamp: "2026-05-30T00:01:00.000Z",
        taskMode: "bug-test-first",
        recommendedSkillIds: ["engineering/tdd", "engineering/diagnose"],
        workflowSkillIds: ["engineering/diagnose", "engineering/tdd"],
      },
    ]);

    const report = analytics.report();

    expect(report.totalEvents).toBe(2);
    expect(report.taskModes).toContainEqual({ taskMode: "workflow-optimization", count: 1 });
    expect(report.taskModes).toContainEqual({ taskMode: "bug-test-first", count: 1 });
    expect(report.topSkills[0]).toMatchObject({
      skillId: "engineering/improve-codebase-architecture",
      timesRecommended: 1,
      timesInWorkflow: 1,
      timesPrimary: 1,
    });
    expect(report.conflictPenalties).toContainEqual({
      skillId: "operations/mcp-builder",
      count: 2,
      totalPenalty: -20,
    });
    expect(analytics.scoreAdjustment("engineering/improve-codebase-architecture", "workflow-optimization")).toBeGreaterThan(0);
  });

  it("persists JSONL route events and ignores malformed lines in reports", () => {
    const tempDir = mkdtempSync(path.join(os.tmpdir(), "kilo-route-analytics-"));
    const filePath = path.join(tempDir, "decision-trail.jsonl");
    const analytics = createJsonlRouteAnalytics({ filePath });

    analytics.record(baseEvent);
    appendFileSync(filePath, "not-json\n", "utf8");

    const persisted = readFileSync(filePath, "utf8");
    const restored = createJsonlRouteAnalytics({ filePath });
    const report = restored.report();

    expect(persisted).toContain("\"taskMode\":\"workflow-optimization\"");
    expect(report.totalEvents).toBe(1);
    expect(report.topSkills[0]?.skillId).toBe("engineering/improve-codebase-architecture");
  });
});
