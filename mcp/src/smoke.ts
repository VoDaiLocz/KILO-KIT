import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: process.execPath,
  args: ["dist/server.js"],
});

const client = new Client({ name: "kilo-kit-smoke", version: "1.0.0" });

try {
  await client.connect(transport);

  const tools = await client.listTools();
  const toolNames = tools.tools.map((tool) => tool.name);
  for (const required of ["kilo_route_intent", "kilo_get_skill", "kilo_validate_skills"]) {
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
