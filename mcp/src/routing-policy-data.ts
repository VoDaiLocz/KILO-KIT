import type { RouteWorkflowStep } from "./types.js";

export interface SignalPattern {
  signal: string;
  patterns: RegExp[];
}

export interface WorkflowDefinition {
  id: string;
  role: RouteWorkflowStep["role"];
  reason: string;
}

export const RULE_HIERARCHY = [
  "user-instructions",
  "platform-safety",
  "kilo-global",
  "task-mode",
  "selected-skill",
  "on-demand-reference",
  "verification",
];

export const SIGNAL_PATTERNS: SignalPattern[] = [
  {
    signal: "workflow-optimization",
    patterns: [
      /\boptimi[sz]e\b/i,
      /\btoi uu\b/i,
      /\btối ưu\b/i,
      /\bworkflow\b/i,
      /\bwordflow\b/i,
      /\brules?\b/i,
      /\bskill(?:s)?\b/i,
      /\bchong cheo\b/i,
      /\bchồng chéo\b/i,
    ],
  },
  {
    signal: "architecture",
    patterns: [/\barchitecture\b/i, /\brefactor\b/i, /\bstructure\b/i, /\brouting\b/i, /\bkernel\b/i],
  },
  {
    signal: "context-engineering",
    patterns: [/\bcontext\b/i, /\btoken\b/i, /\bagent\b/i, /\badaptive\b/i, /\bpredictive\b/i],
  },
  {
    signal: "skill-authoring",
    patterns: [/\bSKILL\.md\b/i, /\bskill(?:s)?\b/i, /\brules?\b/i, /\bworkflow\b/i],
  },
  {
    signal: "bug-fix",
    patterns: [/\bbugs?\b/i, /\bfix\b/i, /\bfailing\b/i, /\berrors?\b/i, /\bbroken\b/i, /\bcrash(?:es|ing)?\b/i],
  },
  {
    signal: "test-first",
    patterns: [/\btdd\b/i, /\btest[- ]first\b/i, /\btest trước\b/i, /\bviết test trước\b/i, /\bviet test truoc\b/i],
  },
  {
    signal: "ui-work",
    patterns: [/\bui\b/i, /\bdashboard\b/i, /\breact\b/i, /\bfrontend\b/i, /\binterface\b/i],
  },
  {
    signal: "review",
    patterns: [/\breview\b/i, /\bPR\b/, /\bpull request\b/i, /\bmerge\b/i, /\bcode review\b/i],
  },
  {
    signal: "mcp",
    patterns: [/\bmcp\b/i],
  },
  {
    signal: "verification",
    patterns: [/\bverify\b/i, /\bverification\b/i, /\bvalidate\b/i, /\blint\b/i, /\bcomplete\b/i, /\bdone\b/i],
  },
];

export const SKILL_SIGNAL_WEIGHTS: Record<string, Record<string, number>> = {
  "engineering/improve-codebase-architecture": {
    "workflow-optimization": 58,
    architecture: 35,
    "context-engineering": 8,
    "skill-authoring": 12,
  },
  "engineering/context-engineering": {
    "workflow-optimization": 46,
    "context-engineering": 42,
    architecture: 12,
    mcp: 6,
  },
  "productivity/writing-skills": {
    "workflow-optimization": 44,
    "skill-authoring": 42,
    "context-engineering": 6,
  },
  "engineering/diagnose": {
    "bug-fix": 44,
    "test-first": 8,
    verification: 6,
  },
  "engineering/tdd": {
    "test-first": 58,
    "bug-fix": 22,
    verification: 5,
  },
  "engineering/lint-and-validate": {
    verification: 28,
    "bug-fix": 10,
    "test-first": 10,
    review: 5,
  },
  "productivity/verification-before-completion": {
    verification: 34,
    "bug-fix": 12,
    "test-first": 10,
    "workflow-optimization": 10,
    review: 18,
    "ui-work": 8,
  },
  "productivity/brainstorming": {
    "ui-work": 34,
    "workflow-optimization": 8,
    architecture: 5,
  },
  "design/frontend-design": {
    "ui-work": 58,
  },
  "design/ui-styling": {
    "ui-work": 46,
  },
  "engineering/code-review": {
    review: 68,
    verification: 10,
  },
  "operations/mcp-builder": {
    mcp: 42,
    architecture: 6,
  },
  "operations/mcp-management": {
    mcp: 32,
    "context-engineering": 8,
  },
};

export const WORKFLOWS: Record<string, WorkflowDefinition[]> = {
  "workflow-optimization": [
    {
      id: "engineering/improve-codebase-architecture",
      role: "primary",
      reason: "Find the modules where workflow and rule responsibilities are shallow or duplicated.",
    },
    {
      id: "engineering/context-engineering",
      role: "support",
      reason: "Tune context loading, routing metadata, and token-aware skill selection.",
    },
    {
      id: "productivity/writing-skills",
      role: "support",
      reason: "Improve rule wording, trigger metadata, and skill authoring discipline.",
    },
    {
      id: "productivity/verification-before-completion",
      role: "quality",
      reason: "Require evidence before claiming workflow improvements are complete.",
    },
  ],
  "bug-test-first": [
    {
      id: "engineering/diagnose",
      role: "prepare",
      reason: "Reproduce and rank hypotheses before changing behavior.",
    },
    {
      id: "engineering/tdd",
      role: "primary",
      reason: "Write the failing regression test before implementation.",
    },
    {
      id: "engineering/lint-and-validate",
      role: "quality",
      reason: "Run static checks after implementation changes.",
    },
    {
      id: "productivity/verification-before-completion",
      role: "quality",
      reason: "Verify tests and requirements before making completion claims.",
    },
  ],
  review: [
    {
      id: "engineering/code-review",
      role: "primary",
      reason: "Prioritize defects, regressions, and missing tests before summary.",
    },
    {
      id: "productivity/verification-before-completion",
      role: "quality",
      reason: "Require fresh evidence before accepting review or merge readiness.",
    },
  ],
  ui: [
    {
      id: "productivity/brainstorming",
      role: "prepare",
      reason: "Resolve design intent before creating or modifying UI behavior.",
    },
    {
      id: "design/frontend-design",
      role: "primary",
      reason: "Design the production-grade frontend experience.",
    },
    {
      id: "design/ui-styling",
      role: "support",
      reason: "Apply accessible styling, component, and responsive layout patterns.",
    },
    {
      id: "productivity/verification-before-completion",
      role: "quality",
      reason: "Verify UI implementation evidence before completion claims.",
    },
  ],
  bug: [
    {
      id: "engineering/diagnose",
      role: "primary",
      reason: "Reproduce, minimize, hypothesize, instrument, fix, and regression-test.",
    },
    {
      id: "engineering/lint-and-validate",
      role: "quality",
      reason: "Run static checks after implementation changes.",
    },
    {
      id: "productivity/verification-before-completion",
      role: "quality",
      reason: "Verify the fix before claiming success.",
    },
  ],
  mcp: [
    {
      id: "operations/mcp-builder",
      role: "primary",
      reason: "Design or update MCP tools/resources/prompts with clear interfaces.",
    },
    {
      id: "operations/mcp-management",
      role: "support",
      reason: "Inspect and manage MCP server capabilities efficiently.",
    },
    {
      id: "productivity/verification-before-completion",
      role: "quality",
      reason: "Run MCP build/test/smoke evidence before completion claims.",
    },
  ],
};
