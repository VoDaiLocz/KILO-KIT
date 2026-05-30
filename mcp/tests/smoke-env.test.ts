import { describe, expect, it } from "vitest";

import { buildSmokeEnvironment } from "../src/smoke-env.js";

describe("smoke environment", () => {
  it("forwards route telemetry environment variables to the spawned MCP server", () => {
    const env = buildSmokeEnvironment(
      {
        KILO_KIT_WRITE_DECISIONS: "true",
        KILO_KIT_DECISION_TRAIL_PATH: "/tmp/kilo-kit-route.jsonl",
        KILO_KIT_REPO_ROOT: "/repo/root",
        UNRELATED: "ignored",
      },
      { PATH: "/usr/bin" },
    );

    expect(env).toMatchObject({
      PATH: "/usr/bin",
      KILO_KIT_WRITE_DECISIONS: "true",
      KILO_KIT_DECISION_TRAIL_PATH: "/tmp/kilo-kit-route.jsonl",
      KILO_KIT_REPO_ROOT: "/repo/root",
    });
    expect(env.UNRELATED).toBeUndefined();
  });
});
