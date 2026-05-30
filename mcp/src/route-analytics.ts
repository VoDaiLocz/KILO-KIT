import { appendFileSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";

import type { RouteDecisionEntry } from "./types.js";

export interface RouteEvent {
  timestamp: string;
  message: string;
  taskMode: string;
  recommendedSkillIds: string[];
  workflowSkillIds: string[];
  decisionTrail: RouteDecisionEntry[];
}

export interface RouteSkillStats {
  skillId: string;
  timesRecommended: number;
  timesInWorkflow: number;
  timesPrimary: number;
  avgScore: number;
}

export interface RouteCount {
  taskMode: string;
  count: number;
}

export interface WorkflowCount {
  workflow: string[];
  count: number;
}

export interface ConflictPenaltyStats {
  skillId: string;
  count: number;
  totalPenalty: number;
}

export interface RouteReport {
  totalEvents: number;
  taskModes: RouteCount[];
  workflows: WorkflowCount[];
  topSkills: RouteSkillStats[];
  conflictPenalties: ConflictPenaltyStats[];
}

export interface RouteAnalyticsStore {
  record(event: RouteEvent): void;
  events(): RouteEvent[];
  report(): RouteReport;
  scoreAdjustment(skillId: string, taskMode: string): number;
}

export interface JsonlRouteAnalyticsOptions {
  filePath: string;
}

export function createInMemoryRouteAnalytics(initialEvents: RouteEvent[] = []): RouteAnalyticsStore {
  const events = [...initialEvents];

  return {
    record(event) {
      events.push(cloneEvent(event));
    },
    events() {
      return events.map(cloneEvent);
    },
    report() {
      return buildReport(events);
    },
    scoreAdjustment(skillId, taskMode) {
      return scoreAdjustment(events, skillId, taskMode);
    },
  };
}

export function createJsonlRouteAnalytics(options: JsonlRouteAnalyticsOptions): RouteAnalyticsStore {
  return {
    record(event) {
      mkdirSync(path.dirname(options.filePath), { recursive: true });
      appendFileSync(options.filePath, `${JSON.stringify(event)}\n`, "utf8");
    },
    events() {
      return readJsonlEvents(options.filePath);
    },
    report() {
      return buildReport(readJsonlEvents(options.filePath));
    },
    scoreAdjustment(skillId, taskMode) {
      return scoreAdjustment(readJsonlEvents(options.filePath), skillId, taskMode);
    },
  };
}

function buildReport(events: RouteEvent[]): RouteReport {
  const taskModes = new Map<string, number>();
  const workflows = new Map<string, { workflow: string[]; count: number }>();
  const skills = new Map<
    string,
    { timesRecommended: number; timesInWorkflow: number; timesPrimary: number; totalScore: number; scoreSamples: number }
  >();
  const conflicts = new Map<string, { count: number; totalPenalty: number }>();

  for (const event of events) {
    taskModes.set(event.taskMode, (taskModes.get(event.taskMode) ?? 0) + 1);

    const workflowKey = event.workflowSkillIds.join(" -> ");
    if (workflowKey) {
      const current = workflows.get(workflowKey) ?? { workflow: event.workflowSkillIds, count: 0 };
      current.count += 1;
      workflows.set(workflowKey, current);
    }

    event.recommendedSkillIds.forEach((skillId) => {
      const stats = skillStats(skills, skillId);
      stats.timesRecommended += 1;
    });

    event.workflowSkillIds.forEach((skillId, index) => {
      const stats = skillStats(skills, skillId);
      stats.timesInWorkflow += 1;
      if (index === 0) {
        stats.timesPrimary += 1;
      }
    });

    for (const entry of event.decisionTrail) {
      const stats = skillStats(skills, entry.skillId);
      stats.totalScore += entry.score;
      stats.scoreSamples += 1;

      const conflict = entry.scoreBreakdown.conflict ?? 0;
      if (conflict < 0) {
        const current = conflicts.get(entry.skillId) ?? { count: 0, totalPenalty: 0 };
        current.count += 1;
        current.totalPenalty += conflict;
        conflicts.set(entry.skillId, current);
      }
    }
  }

  return {
    totalEvents: events.length,
    taskModes: [...taskModes.entries()]
      .map(([taskMode, count]) => ({ taskMode, count }))
      .sort((left, right) => right.count - left.count || left.taskMode.localeCompare(right.taskMode)),
    workflows: [...workflows.values()].sort((left, right) => right.count - left.count || left.workflow.join(">").localeCompare(right.workflow.join(">"))),
    topSkills: [...skills.entries()]
      .map(([skillId, stats]) => ({
        skillId,
        timesRecommended: stats.timesRecommended,
        timesInWorkflow: stats.timesInWorkflow,
        timesPrimary: stats.timesPrimary,
        avgScore: stats.scoreSamples === 0 ? 0 : Math.round((stats.totalScore / stats.scoreSamples) * 100) / 100,
      }))
      .sort(
        (left, right) =>
          right.timesPrimary - left.timesPrimary ||
          right.timesRecommended + right.timesInWorkflow - (left.timesRecommended + left.timesInWorkflow) ||
          right.avgScore - left.avgScore ||
          left.skillId.localeCompare(right.skillId),
      ),
    conflictPenalties: [...conflicts.entries()]
      .map(([skillId, stats]) => ({ skillId, count: stats.count, totalPenalty: stats.totalPenalty }))
      .sort((left, right) => right.count - left.count || left.skillId.localeCompare(right.skillId)),
  };
}

function scoreAdjustment(events: RouteEvent[], skillId: string, taskMode: string): number {
  const sameMode = events.filter((event) => event.taskMode === taskMode);
  const recommended = sameMode.filter((event) => event.recommendedSkillIds.includes(skillId)).length;
  const inWorkflow = sameMode.filter((event) => event.workflowSkillIds.includes(skillId)).length;
  const primary = sameMode.filter((event) => event.workflowSkillIds[0] === skillId).length;

  return Math.min(12, recommended * 3 + inWorkflow * 2 + primary * 3);
}

function skillStats(
  skills: Map<
    string,
    { timesRecommended: number; timesInWorkflow: number; timesPrimary: number; totalScore: number; scoreSamples: number }
  >,
  skillId: string,
): { timesRecommended: number; timesInWorkflow: number; timesPrimary: number; totalScore: number; scoreSamples: number } {
  const existing = skills.get(skillId);
  if (existing) {
    return existing;
  }

  const created = { timesRecommended: 0, timesInWorkflow: 0, timesPrimary: 0, totalScore: 0, scoreSamples: 0 };
  skills.set(skillId, created);
  return created;
}

function readJsonlEvents(filePath: string): RouteEvent[] {
  let content = "";
  try {
    content = readFileSync(filePath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }

  return content
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => parseRouteEvent(line))
    .filter((event): event is RouteEvent => event !== null);
}

function parseRouteEvent(line: string): RouteEvent | null {
  try {
    const parsed = JSON.parse(line) as RouteEvent;
    if (
      typeof parsed.timestamp !== "string" ||
      typeof parsed.message !== "string" ||
      typeof parsed.taskMode !== "string" ||
      !Array.isArray(parsed.recommendedSkillIds) ||
      !Array.isArray(parsed.workflowSkillIds) ||
      !Array.isArray(parsed.decisionTrail)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function cloneEvent(event: RouteEvent): RouteEvent {
  return JSON.parse(JSON.stringify(event)) as RouteEvent;
}
