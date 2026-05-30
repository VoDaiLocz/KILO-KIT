import { appendFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

export interface OrchestrationAuditEvent {
  sessionId: string;
  state: string;
  taskMode: string;
  message: string;
  nextAction: string;
}

export interface OrchestrationAuditWriter {
  record(event: OrchestrationAuditEvent): string | undefined;
}

export function createNoopOrchestrationAudit(): OrchestrationAuditWriter {
  return {
    record() {
      return undefined;
    },
  };
}

export function createJsonlOrchestrationAudit(filePath: string): OrchestrationAuditWriter {
  return {
    record(event) {
      mkdirSync(path.dirname(filePath), { recursive: true });
      const auditRef = randomUUID();
      appendFileSync(filePath, `${JSON.stringify({ auditRef, timestamp: new Date().toISOString(), ...event })}\n`, "utf8");
      return auditRef;
    },
  };
}
