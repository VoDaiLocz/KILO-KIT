#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import {
  formatLoadedSkill,
  formatRoute,
  formatSkills,
  formatValidation,
  textResponse,
} from "./formatters.js";
import { resolveInsideRepo } from "./paths.js";
import { createSkillRegistry } from "./registry.js";
import { routeIntent } from "./router.js";
import { validateSkills } from "./validator.js";
import type { ResponseFormat } from "./types.js";

const SERVER_VERSION = "1.1.1";
const DEFAULT_REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const formatSchema = z.enum(["markdown", "json"]).default("markdown");

export interface CreateKiloKitServerOptions {
  repoRoot?: string;
}

export async function createKiloKitServer(options: CreateKiloKitServerOptions = {}): Promise<McpServer> {
  const repoRoot = path.resolve(options.repoRoot ?? process.env.KILO_KIT_REPO_ROOT ?? DEFAULT_REPO_ROOT);
  const registry = await createSkillRegistry({ repoRoot });

  const server = new McpServer(
    {
      name: "kilo-kit",
      version: SERVER_VERSION,
    },
    {
      instructions:
        "Use kilo_route_intent before selecting a Kilo-Kit workflow skill. Load one selected skill with kilo_get_skill, then follow its instructions. All tools are read-only.",
    },
  );

  server.registerTool(
    "kilo_search_skills",
    {
      title: "Search Kilo-Kit Skills",
      description:
        "Search the Kilo-Kit skill library by natural-language query. Use this for broad discovery before loading a specific skill.",
      inputSchema: {
        query: z.string().min(1).max(500).describe("Natural-language task or keyword query."),
        category: z.string().min(1).max(80).optional().describe("Optional category such as engineering or design."),
        limit: z.number().int().min(1).max(50).optional().describe("Maximum number of skills to return."),
        format: formatSchema.optional(),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
      },
    },
    async ({ query, category, limit, format }) => {
      const searchInput = {
        query,
        ...(category ? { category } : {}),
        ...(limit ? { limit } : {}),
      };
      const skills = registry.searchSkills(searchInput);
      return textResponse(formatSkills(skills, searchInput, normalizeFormat(format)));
    },
  );

  server.registerTool(
    "kilo_get_skill",
    {
      title: "Load Kilo-Kit Skill",
      description:
        "Load one exact Kilo-Kit skill by category and skill name. Use after kilo_route_intent or kilo_search_skills.",
      inputSchema: {
        category: z.string().min(1).max(80).describe("Skill category, for example engineering."),
        skill: z.string().min(1).max(120).describe("Skill folder name, for example tdd."),
        maxChars: z.number().int().min(100).max(50000).optional().describe("Maximum SKILL.md characters to return."),
        format: formatSchema.optional(),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
      },
    },
    async ({ category, skill, maxChars, format }) => {
      const loaded = await registry.loadSkill({
        category,
        skill,
        ...(maxChars ? { maxChars } : {}),
      });
      return textResponse(formatLoadedSkill(loaded, normalizeFormat(format)));
    },
  );

  server.registerTool(
    "kilo_route_intent",
    {
      title: "Route Current Intent to Skills",
      description:
        "Recommend the best Kilo-Kit skills for the current chat request and optional repo context. Call this before choosing a workflow skill.",
      inputSchema: {
        message: z.string().min(1).max(4000).describe("Current user request or task summary."),
        context: z
          .object({
            files: z.array(z.string().max(300)).max(30).optional(),
            mode: z.string().max(80).optional(),
            previousErrors: z.string().max(2000).optional(),
          })
          .optional(),
        limit: z.number().int().min(1).max(10).optional(),
        format: formatSchema.optional(),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
      },
    },
    async ({ message, context, limit, format }) => {
      const routeContext = context
        ? {
            ...(context.files ? { files: context.files } : {}),
            ...(context.mode ? { mode: context.mode } : {}),
            ...(context.previousErrors ? { previousErrors: context.previousErrors } : {}),
          }
        : undefined;
      const result = routeIntent(registry, {
        message,
        ...(routeContext ? { context: routeContext } : {}),
        ...(limit ? { limit } : {}),
      });
      return textResponse(formatRoute(result, normalizeFormat(format)));
    },
  );

  server.registerTool(
    "kilo_validate_skills",
    {
      title: "Validate Kilo-Kit Skills",
      description:
        "Run the Kilo-Kit skill validator and return a concise quality-gate summary. This is read-only and does not modify files.",
      inputSchema: {
        format: formatSchema.optional(),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
      },
    },
    async ({ format }) => {
      const summary = await validateSkills({ repoRoot });
      return textResponse(formatValidation(summary, normalizeFormat(format)));
    },
  );

  registerResources(server, repoRoot, registry);
  registerPrompts(server);

  return server;
}

function registerResources(
  server: McpServer,
  repoRoot: string,
  registry: Awaited<ReturnType<typeof createSkillRegistry>>,
): void {
  server.registerResource(
    "kilo-skills-index",
    "kilo://skills/index",
    {
      title: "Kilo-Kit Skills Index",
      description: "Lightweight index for skill discovery.",
      mimeType: "text/markdown",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: await readFile(resolveInsideRepo(repoRoot, "skills/SKILLS_INDEX.md"), "utf8"),
        },
      ],
    }),
  );

  server.registerResource(
    "kilo-core-master",
    "kilo://core/master",
    {
      title: "Kilo-Kit Master Skill",
      description: "Core Cognitive Flow Architecture and routing protocol.",
      mimeType: "text/markdown",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: await readFile(resolveInsideRepo(repoRoot, "src/core/KILO_MASTER.md"), "utf8"),
        },
      ],
    }),
  );

  server.registerResource(
    "kilo-skill",
    new ResourceTemplate("kilo://skills/{category}/{skill}", {
      list: async () => ({
        resources: registry.listSkills().map((skill) => ({
          uri: `kilo://skills/${skill.category}/${skill.name}`,
          name: skill.id,
          description: skill.description,
          mimeType: "text/markdown",
        })),
      }),
    }),
    {
      title: "Kilo-Kit Skill",
      description: "Dynamic resource for one Kilo-Kit skill.",
      mimeType: "text/markdown",
    },
    async (uri, variables) => {
      const category = String(variables.category);
      const skill = String(variables.skill);
      const loaded = await registry.loadSkill({ category, skill, maxChars: 20_000 });
      return {
        contents: [
          {
            uri: uri.href,
            text: loaded.content,
          },
        ],
      };
    },
  );
}

function registerPrompts(server: McpServer): void {
  server.registerPrompt(
    "kilo-select-skill",
    {
      title: "Select Kilo-Kit Skill",
      description: "Prompt the agent to route the current request through Kilo-Kit before implementation.",
      argsSchema: {
        request: z.string().min(1).max(4000),
      },
    },
    ({ request }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Route this request through Kilo-Kit. First call kilo_route_intent with the request, then load the top skill with kilo_get_skill, then proceed.\n\nRequest:\n${request}`,
          },
        },
      ],
    }),
  );

  server.registerPrompt(
    "kilo-validate-library",
    {
      title: "Validate Kilo-Kit Library",
      description: "Prompt the agent to run the Kilo-Kit validation quality gate.",
      argsSchema: {},
    },
    () => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: "Run kilo_validate_skills and summarize whether the Kilo-Kit skill library passes the quality gate.",
          },
        },
      ],
    }),
  );
}

function normalizeFormat(format: ResponseFormat | undefined): ResponseFormat {
  return format ?? "markdown";
}

async function main(): Promise<void> {
  const server = await createKiloKitServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
}
