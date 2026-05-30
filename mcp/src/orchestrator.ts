import { randomUUID } from "node:crypto";

import type { OrchestrationAuditWriter } from "./orchestration-audit.js";
import { createNoopOrchestrationAudit } from "./orchestration-audit.js";
import type { OrchestrationMemoryStore } from "./orchestration-memory.js";
import type {
  MemorySuggestion,
  OrchestrationInput,
  OrchestrationQuestion,
  OrchestrationResult,
  OrchestrationState,
  VerificationGate,
} from "./orchestration-types.js";
import { selectQuestionTemplate } from "./question-templates.js";
import type { SkillRegistry } from "./registry.js";
import { routeIntent } from "./router.js";
import type { RouteIntentResult, RouteWorkflowStep, SkillRecord } from "./types.js";

export interface CreateOrchestratorOptions {
  registry: SkillRegistry;
  memory: OrchestrationMemoryStore;
  audit?: OrchestrationAuditWriter;
}

export interface KiloOrchestrator {
  orchestrate(input: OrchestrationInput): OrchestrationResult;
}

interface OrchestrationSession {
  sessionId: string;
  message: string;
  createdAt: string;
  route: RouteIntentResult;
  workflow: RouteWorkflowStep[];
  questions: OrchestrationQuestion[];
  answers: Record<string, string>;
  memorySuggestions: MemorySuggestion[];
  memoryConfirmations: Record<string, "accepted" | "rejected">;
  context?: OrchestrationInput["context"];
}

export function createOrchestrator(options: CreateOrchestratorOptions): KiloOrchestrator {
  const sessions = new Map<string, OrchestrationSession>();
  const audit = options.audit ?? createNoopOrchestrationAudit();

  return {
    orchestrate(input) {
      const session = getOrCreateSession(sessions, options.registry, input);
      mergeInput(session, input);

      const missingInfo = missingRequiredQuestionIds(session.questions, session.answers);
      const suggestions = ensureMemorySuggestions(options.memory, session);
      const pendingSuggestions = suggestions.filter(
        (suggestion) => session.memoryConfirmations[suggestion.key] === undefined,
      );
      const acceptedSuggestions = suggestions.filter(
        (suggestion) => session.memoryConfirmations[suggestion.key] === "accepted",
      );

      const state = selectState(session, missingInfo, pendingSuggestions);
      for (const [suggestionKey, decision] of Object.entries(input.memoryConfirmations ?? {})) {
        options.memory.recordDecision({ suggestionKey, decision });
      }

      const verificationGate = buildVerificationGate(acceptedSuggestions);
      const finalWorkflow = state === "ready" ? session.workflow : undefined;
      const firstSkillToLoad = finalWorkflow?.[0]?.skill;
      const nextAction = buildNextAction(state, session, missingInfo, pendingSuggestions, firstSkillToLoad);
      persistSession(options.memory, session, state, verificationGate, finalWorkflow);
      const auditRef = audit.record({
        sessionId: session.sessionId,
        state,
        taskMode: session.route.taskMode,
        message: session.message,
        nextAction,
      });

      return {
        sessionId: session.sessionId,
        state,
        message: session.message,
        taskMode: session.route.taskMode,
        questions: session.questions,
        missingInfo,
        route: session.route,
        workflow: session.workflow,
        memorySuggestions: suggestions,
        ...(finalWorkflow ? { finalWorkflow } : {}),
        ...(firstSkillToLoad ? { firstSkillToLoad } : {}),
        verificationGate,
        nextAction,
        ...(auditRef ? { auditRef } : {}),
      };
    },
  };
}

function getOrCreateSession(
  sessions: Map<string, OrchestrationSession>,
  registry: SkillRegistry,
  input: OrchestrationInput,
): OrchestrationSession {
  if (input.sessionId && sessions.has(input.sessionId)) {
    return sessions.get(input.sessionId)!;
  }

  const route = routeIntent(registry, {
    message: input.message,
    ...(input.context
      ? {
          context: {
            ...(input.context.files ? { files: input.context.files } : {}),
            ...(input.context.mode ? { mode: input.context.mode } : {}),
            ...(input.context.previousErrors ? { previousErrors: input.context.previousErrors } : {}),
          },
        }
      : {}),
    limit: 5,
  });
  const workflow = ensureBrainstormingFirst(registry, route.workflow, input);
  const template = selectQuestionTemplate({
    taskMode: route.taskMode,
    workflowSkillIds: workflow.map((step) => step.skill.id),
    recommendedSkillIds: route.recommended.map((item) => item.skill.id),
  });
  const session: OrchestrationSession = {
    sessionId: input.sessionId ?? randomUUID(),
    message: input.message,
    createdAt: new Date().toISOString(),
    route,
    workflow,
    questions: template.questions,
    answers: {},
    memorySuggestions: [],
    memoryConfirmations: {},
    ...(input.context ? { context: input.context } : {}),
  };

  sessions.set(session.sessionId, session);
  return session;
}

function persistSession(
  memory: OrchestrationMemoryStore,
  session: OrchestrationSession,
  state: OrchestrationState,
  verificationGate: VerificationGate,
  finalWorkflow: RouteWorkflowStep[] | undefined,
): void {
  const now = new Date().toISOString();
  memory.recordSession({
    id: session.sessionId,
    state,
    message: session.message,
    taskMode: session.route.taskMode,
    route: toJsonObject(session.route),
    questions: toJsonArray(session.questions),
    answers: { ...session.answers },
    memorySuggestions: session.memorySuggestions.map((suggestion) => ({ ...suggestion })),
    finalWorkflow: toJsonArray(finalWorkflow ?? []),
    createdAt: session.createdAt,
    updatedAt: now,
  });

  if (state === "ready" && finalWorkflow) {
    memory.recordOutcome({
      id: randomUUID(),
      sessionId: session.sessionId,
      taskMode: session.route.taskMode,
      workflow: toJsonArray(finalWorkflow),
      verification: verificationGate,
      outcome: "workflow-released",
      createdAt: now,
    });
  }
}

function mergeInput(session: OrchestrationSession, input: OrchestrationInput): void {
  session.message = input.message || session.message;
  session.answers = { ...session.answers, ...(input.answers ?? {}) };
  session.memoryConfirmations = { ...session.memoryConfirmations, ...(input.memoryConfirmations ?? {}) };
  if (input.context) {
    session.context = input.context;
  }
}

function ensureMemorySuggestions(
  memory: OrchestrationMemoryStore,
  session: OrchestrationSession,
): MemorySuggestion[] {
  if (session.memorySuggestions.length > 0) {
    return session.memorySuggestions;
  }

  session.memorySuggestions = memory.suggest({
    taskMode: session.route.taskMode,
    workflowSkillIds: session.workflow.map((step) => step.skill.id),
    ...(session.context?.projectFingerprint ? { projectFingerprint: session.context.projectFingerprint } : {}),
  });
  return session.memorySuggestions;
}

function selectState(
  session: OrchestrationSession,
  missingInfo: string[],
  pendingSuggestions: MemorySuggestion[],
): OrchestrationState {
  if (isSubstantiveWork(session) && Object.keys(session.answers).length === 0) {
    return "brainstorming_required";
  }
  if (missingInfo.length > 0) {
    return "questioning";
  }
  if (pendingSuggestions.length > 0) {
    return "awaiting_memory_confirmation";
  }
  return "ready";
}

function ensureBrainstormingFirst(
  registry: SkillRegistry,
  workflow: RouteWorkflowStep[],
  input: OrchestrationInput,
): RouteWorkflowStep[] {
  const existing = workflow.filter((step) => step.skill.id !== "productivity/brainstorming");
  const brainstorming = findSkillById(registry, "productivity/brainstorming");
  if (!brainstorming) {
    return workflow;
  }

  const step = {
    skill: brainstorming,
    role: "prepare" as const,
    reason: "C4 Brainstorming-First Gate requires design clarification before substantive work.",
  };

  if (input.context?.mode === "brainstorming" || /\bbrainstorm(?:ing)?\b/i.test(input.message)) {
    return [step, ...existing];
  }

  if (isReadOnlyRequest(input.message)) {
    return workflow;
  }

  return [step, ...existing];
}

function findSkillById(registry: SkillRegistry, id: string): SkillRecord | undefined {
  const [category, skill] = id.split("/");
  if (!category || !skill) {
    return undefined;
  }

  try {
    return registry.getSkill(category, skill);
  } catch {
    return undefined;
  }
}

function missingRequiredQuestionIds(
  questions: OrchestrationQuestion[],
  answers: Record<string, string>,
): string[] {
  return questions
    .filter((question) => question.required)
    .filter((question) => !answers[question.id]?.trim())
    .map((question) => question.id);
}

function buildVerificationGate(acceptedSuggestions: MemorySuggestion[]): VerificationGate {
  const commands = acceptedSuggestions.flatMap((suggestion) => {
    const commands = suggestion.value.commands;
    return Array.isArray(commands) ? commands.filter((command): command is string => typeof command === "string") : [];
  });

  return {
    commands: commands.length > 0 ? [...new Set(commands)] : ["npm --prefix mcp test", "npm --prefix mcp run typecheck"],
    reason:
      commands.length > 0
        ? "Memory-confirmed verification commands must pass before completion."
        : "Default MCP verification gate for C4 orchestration.",
  };
}

function buildNextAction(
  state: OrchestrationState,
  session: OrchestrationSession,
  missingInfo: string[],
  pendingSuggestions: MemorySuggestion[],
  firstSkillToLoad: SkillRecord | undefined,
): string {
  if (state === "brainstorming_required") {
    return `Start with productivity/brainstorming and answer required C4 questions: ${missingInfo.join(", ")}.`;
  }
  if (state === "questioning") {
    return `Answer missing C4 questions before workflow execution: ${missingInfo.join(", ")}.`;
  }
  if (state === "awaiting_memory_confirmation") {
    return `Accept or reject memory suggestions before execution: ${pendingSuggestions.map((item) => item.key).join(", ")}.`;
  }
  if (firstSkillToLoad) {
    return `Load ${firstSkillToLoad.id} with kilo_get_skill, then follow the final workflow.`;
  }
  return session.route.nextAction;
}

function isSubstantiveWork(session: OrchestrationSession): boolean {
  return !isReadOnlyRequest(session.message);
}

function isReadOnlyRequest(message: string): boolean {
  return /\b(status|show|read|explain|what is|what's|la sao|là sao)\b/i.test(message);
}

function toJsonObject(value: unknown): Record<string, unknown> {
  return JSON.parse(JSON.stringify(value)) as Record<string, unknown>;
}

function toJsonArray(value: unknown): unknown[] {
  return JSON.parse(JSON.stringify(value)) as unknown[];
}
