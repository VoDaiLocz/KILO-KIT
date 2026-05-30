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
