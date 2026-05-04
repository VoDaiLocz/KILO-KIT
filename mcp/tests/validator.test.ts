import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";

import { validateSkills } from "../src/validator.js";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));

describe("skill validator", () => {
  it("summarizes the skill validation gate without dumping noisy logs", async () => {
    const summary = await validateSkills({ repoRoot });

    expect(summary.total).toBeGreaterThan(100);
    expect(summary.valid).toBe(summary.total);
    expect(summary.invalid).toBe(0);
    expect(summary.command).toContain("validate-skill.js");
    expect(summary.output.length).toBeLessThan(3000);
  });
});
