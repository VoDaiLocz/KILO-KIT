# Adaptive Routing Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first executable adaptive routing foundation for Kilo-Kit MCP so rule/workflow selection becomes deterministic, inspectable, and easier to improve.

**Architecture:** Keep `mcp/src/router.ts` as the public routing seam while moving routing policy into focused helpers inside that module. The route result will include selected skills, an ordered workflow chain, applied rule hierarchy, and a decision trail explaining candidate scores.

**Tech Stack:** TypeScript, Vitest, existing MCP registry and formatter code.

---

### Task 1: Add Routing Behavior Tests

**Files:**
- Modify: `mcp/tests/router.test.ts`

- [ ] Add tests for workflow optimization requests.
- [ ] Add tests for test-first bug fixes.
- [ ] Add tests for UI workflows.
- [ ] Add tests for PR review workflows.
- [ ] Run `npm --prefix mcp test -- router.test.ts` and confirm the new assertions fail before implementation.

### Task 2: Implement Adaptive Route Result Shape

**Files:**
- Modify: `mcp/src/types.ts`
- Modify: `mcp/src/router.ts`
- Modify: `mcp/src/formatters.ts`

- [ ] Add route metadata types for workflow steps, rule hierarchy, and decision trail entries.
- [ ] Update `routeIntent()` to classify task mode, score candidate skills, and return workflow/rule/decision metadata.
- [ ] Update markdown formatting to show workflow chain and decision trail without breaking JSON output.
- [ ] Run focused router tests and confirm they pass.

### Task 3: Verify MCP Quality Gates

**Files:**
- No production files beyond Task 2.

- [ ] Run `npm --prefix mcp test`.
- [ ] Run `npm --prefix mcp run typecheck`.
- [ ] Run `node src/tools/validate-skill.js --all skills`.
- [ ] Inspect `git diff --check`.
