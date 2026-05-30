import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

import { buildSmokeEnvironment } from "./smoke-env.js";

const transport = new StdioClientTransport({
  command: process.env.KILO_KIT_SMOKE_COMMAND ?? process.execPath,
  args: parseSmokeArgs(),
  env: buildSmokeEnvironment(),
});

const client = new Client({ name: "kilo-kit-smoke", version: "1.0.0" });

try {
  await client.connect(transport);

  const tools = await client.listTools();
  const toolNames = tools.tools.map((tool) => tool.name);
  for (const required of [
    "kilo_route_intent",
    "kilo_get_skill",
    "kilo_validate_skills",
    "kilo_route_report",
    "kilo_orchestrate_task",
    "kilo_memory_report",
  ]) {
    if (!toolNames.includes(required)) {
      throw new Error(`Missing expected tool: ${required}`);
    }
  }

  const route = await client.callTool({
    name: "kilo_route_intent",
    arguments: {
      message: "Fix bug login, viết test trước",
      context: { files: ["src/auth/login.ts"], mode: "coding" },
      format: "json",
    },
  });

  const routeText = extractFirstText(route);
  if (!routeText.includes("engineering/tdd")) {
    throw new Error(`Smoke route did not recommend engineering/tdd: ${routeText}`);
  }

  const report = await client.callTool({
    name: "kilo_route_report",
    arguments: { format: "json" },
  });
  const reportText = extractFirstText(report);
  if (!reportText.includes('"totalEvents": 1') || !reportText.includes("engineering/tdd")) {
    throw new Error(`Smoke route report did not include the routed event: ${reportText}`);
  }

  const orchestration = await client.callTool({
    name: "kilo_orchestrate_task",
    arguments: {
      message: "Fix bug login, viết test trước",
      context: { files: ["src/auth/login.ts"], mode: "coding", projectFingerprint: "smoke:typescript" },
      format: "json",
    },
  });
  const orchestrationText = extractFirstText(orchestration);
  const orchestrationResult = JSON.parse(orchestrationText) as {
    sessionId?: string;
    state?: string;
    workflow?: Array<{ skill?: { id?: string } }>;
    questions?: Array<{ id?: string; skillId?: string }>;
  };
  if (orchestrationResult.state !== "brainstorming_required") {
    throw new Error(`Smoke orchestration did not require brainstorming: ${orchestrationText}`);
  }
  if (orchestrationResult.workflow?.[0]?.skill?.id !== "productivity/brainstorming") {
    throw new Error(`Smoke orchestration did not start with brainstorming: ${orchestrationText}`);
  }
  if (!orchestrationResult.questions?.some((question) => question.id === "test_command" || question.skillId === "engineering/tdd")) {
    throw new Error(`Smoke orchestration did not include TDD questions: ${orchestrationText}`);
  }

  const readyOrchestration = await client.callTool({
    name: "kilo_orchestrate_task",
    arguments: {
      message: "Fix bug login, viết test trước",
      sessionId: orchestrationResult.sessionId,
      answers: {
        goal: "Fix login failure",
        scope: "src/auth/login.ts",
        success_criteria: "login test passes",
        failing_behavior: "valid credentials are rejected",
        test_command: "npm test -- login",
      },
      format: "json",
    },
  });
  const readyText = extractFirstText(readyOrchestration);
  const readyResult = JSON.parse(readyText) as {
    state?: string;
    firstSkillToLoad?: { id?: string };
    finalWorkflow?: Array<{ skill?: { id?: string } }>;
  };
  if (readyResult.state !== "ready" || readyResult.firstSkillToLoad?.id !== "productivity/brainstorming") {
    throw new Error(`Smoke orchestration did not release final workflow after answers: ${readyText}`);
  }
  if (readyResult.finalWorkflow?.[0]?.skill?.id !== "productivity/brainstorming") {
    throw new Error(`Smoke final workflow did not start with brainstorming: ${readyText}`);
  }

  const memoryReport = await client.callTool({
    name: "kilo_memory_report",
    arguments: { format: "json" },
  });
  const memoryReportText = extractFirstText(memoryReport);
  if (!memoryReportText.includes('"facts"')) {
    throw new Error(`Smoke memory report did not return memory facts: ${memoryReportText}`);
  }

  const skill = await client.callTool({
    name: "kilo_get_skill",
    arguments: { category: "engineering", skill: "tdd", maxChars: 800 },
  });
  const skillText = extractFirstText(skill);
  if (!skillText.includes("Test-Driven Development")) {
    throw new Error("Smoke skill load did not return the TDD skill body.");
  }

  console.log("MCP smoke check passed.");
} finally {
  await client.close();
}

function extractFirstText(value: unknown): string {
  const content = (value as { content?: Array<{ type?: string; text?: string }> }).content;
  const first = content?.[0];
  return first?.type === "text" && first.text ? first.text : "";
}

function parseSmokeArgs(): string[] {
  const rawArgs = process.env.KILO_KIT_SMOKE_ARGS;
  if (!rawArgs) {
    return ["dist/server.js"];
  }

  const parsed = JSON.parse(rawArgs) as unknown;
  if (!Array.isArray(parsed) || !parsed.every((item) => typeof item === "string")) {
    throw new Error("KILO_KIT_SMOKE_ARGS must be a JSON array of strings.");
  }

  return parsed;
}
