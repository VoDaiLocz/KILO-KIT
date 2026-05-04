import type { LoadedSkill, RouteIntentResult, SearchSkillsInput, SkillRecord, ValidationSummary } from "./types.js";

export function textResponse(text: string): { content: Array<{ type: "text"; text: string }> } {
  return { content: [{ type: "text", text }] };
}

export function formatSkills(skills: SkillRecord[], input: SearchSkillsInput, format: "markdown" | "json"): string {
  if (format === "json") {
    return JSON.stringify({ query: input.query, skills }, null, 2);
  }

  if (skills.length === 0) {
    return `No skills matched '${input.query}'. Try a broader query or inspect kilo://skills/index.`;
  }

  return [
    `# Skill Search Results`,
    ``,
    `Query: \`${input.query}\``,
    ``,
    ...skills.map(
      (skill, index) =>
        `${index + 1}. **${skill.id}**\n   ${skill.description}\n   Path: \`${skill.skillPath}\``,
    ),
  ].join("\n");
}

export function formatLoadedSkill(loaded: LoadedSkill, format: "markdown" | "json"): string {
  if (format === "json") {
    return JSON.stringify(loaded, null, 2);
  }

  const references =
    loaded.skill.references.length > 0
      ? loaded.skill.references.map((reference) => `- \`${reference}\``).join("\n")
      : "- No bundled references/scripts/assets found.";

  const truncation = loaded.truncated
    ? `\n\n> Output truncated at ${loaded.maxChars} characters. Increase maxChars if you need more.`
    : "";

  return [
    `# ${loaded.skill.id}`,
    ``,
    loaded.skill.description,
    ``,
    `Path: \`${loaded.skill.skillPath}\``,
    ``,
    `## References`,
    references,
    ``,
    `## SKILL.md`,
    ``,
    "```md",
    loaded.content,
    "```",
    truncation,
  ].join("\n");
}

export function formatRoute(result: RouteIntentResult, format: "markdown" | "json"): string {
  if (format === "json") {
    return JSON.stringify(result, null, 2);
  }

  if (result.recommended.length === 0) {
    return result.nextAction;
  }

  return [
    "# Kilo-Kit Skill Route",
    "",
    ...result.recommended.map(
      (item, index) =>
        `${index + 1}. **${item.skill.id}** (${Math.round(item.confidence * 100)}%)\n   ${item.reason}\n   Path: \`${item.skill.skillPath}\``,
    ),
    "",
    `Next action: ${result.nextAction}`,
  ].join("\n");
}

export function formatValidation(summary: ValidationSummary, format: "markdown" | "json"): string {
  if (format === "json") {
    return JSON.stringify(summary, null, 2);
  }

  return [
    "# Kilo-Kit Skill Validation",
    "",
    `Command: \`${summary.command}\``,
    `Valid: **${summary.valid}/${summary.total}**`,
    `Invalid: **${summary.invalid}**`,
    "",
    "```text",
    summary.output,
    "```",
  ].join("\n");
}
