import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";

import { createSkillRegistry } from "../src/registry.js";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));

describe("skill registry", () => {
  it("loads indexed skills with category, name, path, and description", async () => {
    const registry = await createSkillRegistry({ repoRoot });

    const tdd = registry.getSkill("engineering", "tdd");

    expect(tdd.name).toBe("tdd");
    expect(tdd.category).toBe("engineering");
    expect(tdd.skillPath).toBe("skills/engineering/tdd/SKILL.md");
    expect(tdd.description).toContain("Test-driven development");
  });

  it("searches by query and ranks exact domain matches first", async () => {
    const registry = await createSkillRegistry({ repoRoot });

    const results = registry.searchSkills({ query: "test driven development", limit: 3 });

    expect(results[0]?.id).toBe("engineering/tdd");
    expect(results.map((skill) => skill.id)).toContain("engineering/tdd-workflow");
  });

  it("loads capped skill content and preserves references list", async () => {
    const registry = await createSkillRegistry({ repoRoot });

    const loaded = await registry.loadSkill({ category: "engineering", skill: "tdd", maxChars: 400 });

    expect(loaded.content.length).toBeLessThanOrEqual(400);
    expect(loaded.truncated).toBe(true);
    expect(loaded.skill.id).toBe("engineering/tdd");
  });
});
