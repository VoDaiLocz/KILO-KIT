import { getDefaultEnvironment } from "@modelcontextprotocol/sdk/client/stdio.js";

const FORWARDED_ENV_VARS = [
  "KILO_KIT_WRITE_DECISIONS",
  "KILO_KIT_DECISION_TRAIL_PATH",
  "KILO_KIT_REPO_ROOT",
  "KILO_KIT_MEMORY_PATH",
  "KILO_KIT_ORCHESTRATION_AUDIT_PATH",
] as const;

export function buildSmokeEnvironment(
  sourceEnv: NodeJS.ProcessEnv = process.env,
  baseEnv: Record<string, string> = getDefaultEnvironment(),
): Record<string, string> {
  const env = { ...baseEnv };

  for (const name of FORWARDED_ENV_VARS) {
    const value = sourceEnv[name];
    if (value !== undefined) {
      env[name] = value;
    }
  }

  return env;
}
