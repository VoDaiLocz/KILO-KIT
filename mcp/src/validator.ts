import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { normalizeRepoRoot, resolveInsideRepo } from "./paths.js";
import type { ValidationSummary } from "./types.js";

const execFileAsync = promisify(execFile);

export interface ValidateSkillsInput {
  repoRoot: string;
}

export async function validateSkills(input: ValidateSkillsInput): Promise<ValidationSummary> {
  const repoRoot = normalizeRepoRoot(input.repoRoot);
  const script = resolveInsideRepo(repoRoot, "src/tools/validate-skill.js");
  const skillsPath = resolveInsideRepo(repoRoot, "skills");
  const command = `${process.execPath} ${script} --all ${skillsPath}`;

  const result = await execFileAsync(process.execPath, [script, "--all", skillsPath], {
    cwd: repoRoot,
    maxBuffer: 10 * 1024 * 1024,
    windowsHide: true,
  });

  const output = `${result.stdout}${result.stderr}`.trim();
  const summary = output.match(/SUMMARY:\s+(\d+)\/(\d+)\s+skills valid/);
  const valid = summary?.[1] ? Number(summary[1]) : 0;
  const total = summary?.[2] ? Number(summary[2]) : 0;

  return {
    command,
    total,
    valid,
    invalid: Math.max(0, total - valid),
    output: summarizeOutput(output),
  };
}

function summarizeOutput(output: string): string {
  const lines = output
    .split(/\r?\n/)
    .filter((line) => /SUMMARY|All skills passed|INVALID|errors|warnings/.test(stripAnsi(line)));

  return lines.map(stripAnsi).join("\n").slice(0, 2_800);
}

function stripAnsi(value: string): string {
  return value.replace(/\u001b\[[0-9;]*m/g, "");
}
