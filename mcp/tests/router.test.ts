import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";

import { createSkillRegistry } from "../src/registry.js";
import { routeIntent } from "../src/router.js";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));

describe("intent router", () => {
  it("routes test-first bug fixes to TDD and diagnosis skills", async () => {
    const registry = await createSkillRegistry({ repoRoot });

    const result = routeIntent(registry, {
      message: "Fix bug login, viết test trước",
      context: {
        files: ["src/auth/login.ts"],
        mode: "coding",
        previousErrors: "authentication test failing",
      },
      limit: 3,
    });

    expect(result.recommended[0]?.skill.id).toBe("engineering/tdd");
    expect(result.recommended.map((item) => item.skill.id)).toContain("engineering/diagnose");
    expect(result.nextAction).toContain("Load");
  });

  it("routes UI work to design skills", async () => {
    const registry = await createSkillRegistry({ repoRoot });

    const result = routeIntent(registry, {
      message: "Build a polished responsive dashboard UI in React",
      context: { files: ["src/components/Dashboard.tsx"], mode: "coding" },
      limit: 2,
    });

    expect(result.recommended[0]?.skill.category).toBe("design");
  });
});
