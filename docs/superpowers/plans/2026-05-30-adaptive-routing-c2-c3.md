# Adaptive Routing C2-C3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add persisted route telemetry, analytics reporting, and controlled analytics feedback into Kilo-Kit routing.

**Architecture:** Keep route selection deterministic by default, make persistence opt-in, and feed analytics into scoring only when an explicit store is provided. `routing-policy-data.ts` owns static rules and workflows, `route-analytics.ts` owns telemetry storage/reporting, and `router.ts` coordinates routing plus optional analytics.

**Tech Stack:** TypeScript, Vitest, JSONL local storage, existing MCP server and registry.

---

### Task 1: Add C2-C3 Failing Tests

**Files:**
- Modify: `mcp/tests/router.test.ts`
- Create: `mcp/tests/route-analytics.test.ts`

- [x] Add a router test proving analytics can boost a relevant skill without overriding workflow order.
- [x] Add analytics tests proving JSONL records are persisted, summarized, and ignored when malformed.
- [x] Run focused tests and confirm they fail for missing modules/APIs.

### Task 2: Split Static Routing Policy Data

**Files:**
- Create: `mcp/src/routing-policy-data.ts`
- Modify: `mcp/src/routing-policy.ts`

- [x] Move rule hierarchy, signal patterns, skill signal weights, and workflow definitions into the data module.
- [x] Keep scoring and intent analysis in `routing-policy.ts`.
- [x] Preserve C-v1 routing behavior.

### Task 3: Implement Route Analytics Store

**Files:**
- Create: `mcp/src/route-analytics.ts`
- Modify: `mcp/src/types.ts`

- [x] Define route event, route report, and analytics summary types.
- [x] Implement in-memory analytics for tests and deterministic scoring feedback.
- [x] Implement JSONL analytics store with opt-in persistence.
- [x] Add report generation for top skills, task modes, workflows, conflict penalties, and score averages.

### Task 4: Wire Analytics Into Router and MCP

**Files:**
- Modify: `mcp/src/router.ts`
- Modify: `mcp/src/server.ts`
- Modify: `mcp/src/formatters.ts`

- [x] Let `routeIntent()` accept optional analytics context.
- [x] Apply bounded analytics score adjustments in candidate scoring.
- [x] Persist route events only when the server is configured with a writable analytics store.
- [x] Add `kilo_route_report` MCP tool.
- [x] Format route reports in markdown and JSON.

### Task 5: Real Operation Verification

**Files:**
- Modify docs if needed: `README.md`, `mcp/README.md`

- [x] Run `npm --prefix mcp test`.
- [x] Run `npm --prefix mcp run typecheck`.
- [x] Run `npm --prefix mcp run build`.
- [x] Run `npm --prefix mcp run smoke`.
- [x] Run `node src/tools/validate-skill.js --all skills`.
- [x] Run a real local route flow with persistence enabled and read the report.
- [x] Run `git diff --check`.
