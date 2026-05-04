import type { RouteIntentInput, RouteIntentResult, RouteRecommendation, SkillRecord } from "./types.js";
import type { SkillRegistry } from "./registry.js";

export function routeIntent(registry: SkillRegistry, input: RouteIntentInput): RouteIntentResult {
  const query = buildQuery(input);
  const limit = Math.max(1, Math.min(input.limit ?? 5, 10));
  const searchMatches = registry.searchSkills({ query, limit: 25 });
  const candidateIds = new Set(searchMatches.map((skill) => skill.id));
  const candidates = [
    ...searchMatches,
    ...registry.listSkills().filter((skill) => !candidateIds.has(skill.id)),
  ];
  const ranked = candidates
    .map((skill) => ({
      skill,
      score: scoreRoute(skill, input),
      reason: explainRoute(skill, input),
    }))
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score || left.skill.id.localeCompare(right.skill.id))
    .slice(0, limit);

  const recommended: RouteRecommendation[] = ranked.map((candidate, index) => ({
    skill: candidate.skill,
    confidence: Math.max(0.1, Math.min(0.99, candidate.score / (candidate.score + 20 + index * 3))),
    reason: candidate.reason,
  }));

  return {
    recommended,
    nextAction: recommended[0]
      ? `Load ${recommended[0].skill.id} with kilo_get_skill before executing the workflow.`
      : "No strong skill match found. Search with more specific task keywords or inspect skills/SKILLS_INDEX.md.",
  };
}

function buildQuery(input: RouteIntentInput): string {
  return [
    input.message,
    input.context?.mode,
    input.context?.previousErrors,
    ...(input.context?.files ?? []),
  ]
    .filter(Boolean)
    .join(" ");
}

function scoreRoute(skill: SkillRecord, input: RouteIntentInput): number {
  const text = buildQuery(input).toLowerCase();
  let score = 1;

  if (text.includes("test") || text.includes("tdd") || text.includes("test trước")) {
    if (skill.id === "engineering/tdd") score += 50;
    if (skill.id.includes("tdd")) score += 25;
    if (skill.id.includes("testing")) score += 15;
  }

  if (text.includes("bug") || text.includes("fix") || text.includes("failing") || text.includes("error")) {
    if (skill.id === "engineering/diagnose") score += 35;
    if (skill.id.includes("debug")) score += 20;
    if (skill.id === "kilo-kit/debugging/systematic") score += 15;
  }

  if (text.includes("ui") || text.includes("dashboard") || text.includes("react") || text.includes("frontend")) {
    if (skill.category === "design") score += 35;
    if (skill.id === "design/frontend-design") score += 20;
  }

  if (text.includes("mcp")) {
    if (skill.id === "operations/mcp-builder") score += 40;
    if (skill.id === "operations/mcp-management") score += 20;
  }

  if (input.context?.files?.some((file) => file.endsWith(".tsx") || file.endsWith(".jsx"))) {
    if (skill.category === "design") score += 10;
    if (skill.id === "engineering/react-patterns") score += 10;
  }

  return score;
}

function explainRoute(skill: SkillRecord, input: RouteIntentInput): string {
  const text = buildQuery(input).toLowerCase();
  const reasons: string[] = [];

  if (skill.id === "engineering/tdd" && (text.includes("test") || text.includes("test trước"))) {
    reasons.push("the request asks for test-first work");
  }
  if (skill.id === "engineering/diagnose" && (text.includes("bug") || text.includes("fix"))) {
    reasons.push("the request describes a bug/fix workflow");
  }
  if (skill.category === "design" && (text.includes("ui") || text.includes("dashboard"))) {
    reasons.push("the request targets user interface work");
  }
  if (skill.id.includes("mcp") && text.includes("mcp")) {
    reasons.push("the request is about MCP integration");
  }

  return reasons.length > 0
    ? `Selected because ${reasons.join(" and ")}.`
    : `Selected from skill metadata match for '${input.message.slice(0, 80)}'.`;
}
