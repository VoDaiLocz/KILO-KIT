import type { OrchestrationQuestion, QuestionTemplate, QuestionTemplateInput } from "./orchestration-types.js";

const BASE_QUESTIONS: OrchestrationQuestion[] = [
  {
    id: "goal",
    prompt: "What exact outcome should this task produce?",
    kind: "text",
    required: true,
  },
  {
    id: "scope",
    prompt: "Which files, modules, or behavior are in scope, and what is explicitly out of scope?",
    kind: "text",
    required: true,
  },
  {
    id: "success_criteria",
    prompt: "What evidence will prove the task is complete and working correctly?",
    kind: "text",
    required: true,
  },
];

const MODE_QUESTIONS: Record<string, { id: string; label: string; questions: OrchestrationQuestion[] }> = {
  "bug-test-first": {
    id: "engineering:bug-test-first",
    label: "Engineering bug/TDD clarification",
    questions: [
      {
        id: "failing_behavior",
        prompt: "What is the current failing behavior, including the smallest reproducible trigger?",
        kind: "text",
        required: true,
        category: "engineering",
      },
      {
        id: "test_command",
        prompt: "Which focused test or command should fail before the fix and pass after it?",
        kind: "text",
        required: true,
        category: "engineering",
        skillId: "engineering/tdd",
      },
    ],
  },
  ui: {
    id: "design:ui",
    label: "Design and UI clarification",
    questions: [
      {
        id: "audience",
        prompt: "Who will use this interface, and what is their most common workflow?",
        kind: "text",
        required: true,
        category: "design",
      },
      {
        id: "visual_constraints",
        prompt: "Which existing design system, layout, or responsive constraints must be preserved?",
        kind: "text",
        required: true,
        category: "design",
      },
    ],
  },
  review: {
    id: "engineering:review",
    label: "Code review clarification",
    questions: [
      {
        id: "review_target",
        prompt: "Which branch, diff, or files should be reviewed, and what risks matter most?",
        kind: "text",
        required: true,
        category: "engineering",
        skillId: "engineering/code-review",
      },
      {
        id: "merge_gate",
        prompt: "What checks must pass before this can be considered merge-ready?",
        kind: "text",
        required: true,
        category: "engineering",
      },
    ],
  },
  "workflow-optimization": {
    id: "engineering:workflow-optimization",
    label: "Architecture and workflow clarification",
    questions: [
      {
        id: "current_friction",
        prompt: "Where is the current rule or workflow friction showing up in real use?",
        kind: "text",
        required: true,
        category: "engineering",
      },
      {
        id: "desired_operating_model",
        prompt: "What should the agent do differently after this workflow change lands?",
        kind: "text",
        required: true,
        category: "engineering",
      },
    ],
  },
};

const CATEGORY_QUESTIONS: Record<string, { id: string; label: string; questions: OrchestrationQuestion[] }> = {
  engineering: {
    id: "engineering:general",
    label: "Engineering clarification",
    questions: [
      {
        id: "runtime",
        prompt: "Which runtime, framework, or command environment must this work support?",
        kind: "text",
        required: true,
        category: "engineering",
      },
    ],
  },
  design: MODE_QUESTIONS.ui!,
  operations: {
    id: "operations:general",
    label: "Operations clarification",
    questions: [
      {
        id: "environment",
        prompt: "Which environment is affected, and what rollback or safety constraint applies?",
        kind: "text",
        required: true,
        category: "operations",
      },
    ],
  },
  "writing-docs": {
    id: "writing-docs:general",
    label: "Documentation clarification",
    questions: [
      {
        id: "audience",
        prompt: "Who is the target reader, and what should they be able to do after reading?",
        kind: "text",
        required: true,
        category: "writing-docs",
      },
    ],
  },
  security: {
    id: "security:general",
    label: "Security clarification",
    questions: [
      {
        id: "risk_boundary",
        prompt: "What asset, permission boundary, or threat scenario must be protected?",
        kind: "text",
        required: true,
        category: "security",
      },
    ],
  },
  fallback: {
    id: "general:fallback",
    label: "General clarification",
    questions: [
      {
        id: "constraints",
        prompt: "What constraints, deadlines, or preferences should shape this workflow?",
        kind: "text",
        required: true,
      },
    ],
  },
};

const SKILL_OVERRIDES: Record<string, OrchestrationQuestion[]> = {
  "engineering/tdd": [
    {
      id: "test_command",
      prompt: "Which exact test command should demonstrate red before green?",
      kind: "text",
      required: true,
      category: "engineering",
      skillId: "engineering/tdd",
    },
  ],
  "design/frontend-design": [
    {
      id: "visual_constraints",
      prompt: "Which visual style, density, and responsive breakpoints should guide the UI?",
      kind: "text",
      required: true,
      category: "design",
      skillId: "design/frontend-design",
    },
  ],
  "operations/deployment-procedures": [
    {
      id: "rollback_plan",
      prompt: "What rollback signal and rollback command should be ready before deployment?",
      kind: "text",
      required: true,
      category: "operations",
      skillId: "operations/deployment-procedures",
    },
  ],
  "engineering/vulnerability-scanner": [
    {
      id: "risk_boundary",
      prompt: "Which threat model, asset, or exploit class should this security review prioritize?",
      kind: "text",
      required: true,
      category: "engineering",
      skillId: "engineering/vulnerability-scanner",
    },
  ],
  "productivity/verification-before-completion": [
    {
      id: "verification_commands",
      prompt: "Which commands or manual checks must be fresh before completion is claimed?",
      kind: "text",
      required: false,
      category: "productivity",
      skillId: "productivity/verification-before-completion",
    },
  ],
};

export function selectQuestionTemplate(input: QuestionTemplateInput): QuestionTemplate {
  const modeTemplate = MODE_QUESTIONS[input.taskMode];
  const categoryTemplate = modeTemplate ?? categoryTemplateFor(input);
  const workflowSkillIds = input.workflowSkillIds.length > 0 ? input.workflowSkillIds : input.recommendedSkillIds;
  const overrideQuestions = workflowSkillIds.flatMap((skillId) => SKILL_OVERRIDES[skillId] ?? []);

  return {
    id: categoryTemplate.id,
    label: categoryTemplate.label,
    questions: dedupeQuestions([...BASE_QUESTIONS, ...categoryTemplate.questions, ...overrideQuestions]).slice(0, 8),
  };
}

function categoryTemplateFor(input: QuestionTemplateInput): { id: string; label: string; questions: OrchestrationQuestion[] } {
  const firstSkillId = input.workflowSkillIds[0] ?? input.recommendedSkillIds[0];
  const category = firstSkillId?.split("/")[0];

  if (category && CATEGORY_QUESTIONS[category]) {
    return CATEGORY_QUESTIONS[category]!;
  }

  return CATEGORY_QUESTIONS.fallback!;
}

function dedupeQuestions(questions: OrchestrationQuestion[]): OrchestrationQuestion[] {
  const byId = new Map<string, OrchestrationQuestion>();
  for (const question of questions) {
    byId.set(question.id, question);
  }
  return [...byId.values()];
}
