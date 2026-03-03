# 📊 Performance Benchmarks

> Target benchmarks for Hard-Gate scans, skill execution, and quality gates in Kilo-Kit.

---

## Hard-Gate Scan Benchmarks

| Scan Phase | Target Duration | Max Acceptable | Notes |
|------------|-----------------|----------------|-------|
| System scan (disk, memory, runtime) | < 5s | 15s | Parallel checks recommended |
| Codebase scan (structure, files) | < 10s | 30s | Depends on project size |
| Context validation (intent, scope) | < 3s | 10s | Reasoning step |
| **Total Hard-Gate** | **< 18s** | **55s** | Sum of all phases |

---

## Token Budget Benchmarks

| Operation | Typical Tokens | Max Tokens | Mode |
|-----------|---------------|------------|------|
| Hard-Gate scan report | 200–500 | 800 | Economy |
| Iron Law compliance check | 100–300 | 500 | Economy |
| Skill routing decision | 150–400 | 600 | Standard |
| Evidence gathering | 500–1500 | 3000 | Standard |
| Code modification + verification | 1000–3000 | 8000 | Premium |
| Root cause analysis | 2000–4500 | 10000 | Premium |
| Security audit | 1500–3500 | 8000 | Critical |

---

## Quality Gate Pass Rates

> Target pass rates for well-configured projects.

| Gate | Target Pass Rate | Warning Threshold | Action if Below |
|------|------------------|-------------------|-----------------|
| Pre-Execution (intent, budget) | > 95% | < 90% | Improve intent parsing |
| Per-Behavior (input/output validation) | > 90% | < 80% | Review behavior configs |
| Post-Execution (tests, build) | > 85% | < 75% | Review test coverage |
| Pre-Completion (verification) | > 98% | < 95% | Strengthen verification steps |

---

## Codebase Scan Scaling

> Expected scan duration by project size.

| Project Size | Files | Scan Duration (target) | Scan Duration (max) |
|-------------|-------|----------------------|---------------------|
| Small | < 100 files | < 3s | 10s |
| Medium | 100–1000 files | < 10s | 30s |
| Large | 1000–10000 files | < 30s | 90s |
| Monorepo | > 10000 files | < 60s | 180s |

**Optimization tips for large codebases:**
- Use `.gitignore`-aware file listing to skip `node_modules`, `dist`, etc.
- Limit `find` depth to 3 levels for initial scan
- Use `git diff` to focus on recently changed files
- Cache project structure between tasks in the same session

---

## Skill Execution Benchmarks

| Skill | Typical Duration | Token Usage | Success Rate Target |
|-------|------------------|-------------|---------------------|
| `debugging/systematic` | 2–5 min | 1500–4000 | > 80% |
| `debugging/root-cause` | 5–15 min | 2000–10000 | > 70% |
| `debugging/verification` | 1–3 min | 500–2000 | > 95% |
| `quality/code-review` | 3–8 min | 1000–5000 | > 85% |
| `quality/testing` | 3–10 min | 1500–6000 | > 80% |
| `development/security` | 5–12 min | 1500–8000 | > 75% |
| `development/backend` | 5–15 min | 2000–8000 | > 75% |

---

## Iron Law Compliance Metrics

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| Evidence citation rate | 100% of recommendations | Count recommendations with/without file:line citations |
| Hard-Gate completion rate | 100% of tasks | Count tasks that ran Hard-Gate before execution |
| Verification before completion | 100% of tasks | Count tasks with post-execution verification |
| Decision trail completeness | > 95% of decisions logged | Audit decision trail entries vs. actions taken |
| Minimal change adherence | > 90% of tasks | Review changed files vs. task scope |

---

*Performance Benchmarks v1.0.0 — Kilo-Kit*
