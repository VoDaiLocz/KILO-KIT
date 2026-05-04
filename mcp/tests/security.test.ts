import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";

import { createSkillRegistry } from "../src/registry.js";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));

describe("registry security", () => {
  it("rejects path traversal category and skill input", async () => {
    const registry = await createSkillRegistry({ repoRoot });

    await expect(
      registry.loadSkill({ category: "..", skill: "README", maxChars: 1000 }),
    ).rejects.toThrow(/Invalid category/);

    await expect(
      registry.loadSkill({ category: "engineering", skill: "../README", maxChars: 1000 }),
    ).rejects.toThrow(/Invalid skill/);
  });

  it("does not expose arbitrary files as skill resources", async () => {
    const registry = await createSkillRegistry({ repoRoot });

    expect(() => registry.getSkill("engineering", "../README")).toThrow(/Invalid skill/);
  });
});
