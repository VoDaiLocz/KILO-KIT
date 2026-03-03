# 📁 Kilo-Kit Project Structure

> **Last Updated:** 2026-03-03  
> **Total Files:** 45  
> **Status:** ✅ Complete

---

## Directory Tree

```
kilo-kit/
│
├── 📄 README.md                              # Project overview
├── 📄 QUICKSTART.md                          # 15-minute getting started
├── 📄 CONTRIBUTING.md                        # Contribution guidelines
├── 📄 CHANGELOG.md                           # Version history
├── 📄 LICENSE                                # Apache 2.0
│
├── 🔌 .claude-plugin/                        # Claude Code entry point
│   └── instructions.md                       # Plugin instructions
├── 🔌 .cursor-plugin/                        # Cursor IDE entry point
│   └── instructions.md                       # Plugin instructions
├── 🔌 .codex/                                # OpenAI Codex entry point
│   └── instructions.md                       # Plugin instructions
├── 🔌 .opencode/                             # OpenCode entry point
│   └── instructions.md                       # Plugin instructions
│
├── 💡 skills/                                # Installable skill packs
│   └── kilo-kit/                             # Core Kilo-Kit skills
│       ├── _template/
│       │   └── SKILL.md                      # Skill template
│       ├── debugging/                        # Debugging Skills
│       │   ├── systematic/
│       │   │   └── SKILL.md                  # 4-phase debugging
│       │   ├── root-cause/
│       │   │   └── SKILL.md                  # 5 Whys & Fishbone
│       │   └── verification/
│       │       └── SKILL.md                  # Fix verification
│       ├── development/                      # Development Skills
│       │   ├── backend/
│       │   │   └── SKILL.md                  # Backend API dev
│       │   └── security/
│       │       └── SKILL.md                  # Security best practices
│       └── quality/                          # Quality Skills
│           ├── code-review/
│           │   └── SKILL.md                  # Code review checklist
│           └── testing/
│               └── SKILL.md                  # Testing strategy
│
├── ⚡ commands/                               # Workflow commands
│   ├── quality-gate.md                       # Quality gate workflow
│   ├── init-skill.md                         # Skill initialization
│   └── validate-skill.md                     # Skill validation
│
├── 📚 docs/                                  # Documentation
│   ├── AUDIT_REPORT.md                       # Audit report
│   ├── COMPLETION_ASSESSMENT.md              # Project completion status
│   ├── DEEP_ANALYSIS.md                      # Deep analysis report
│   ├── PROJECT_STRUCTURE.md                  # This file
│   └── architecture/
│       └── ARCHITECTURE_DESIGN.md            # Full architecture design
│
├── 🔧 src/                                   # Core system source
│   │
│   ├── core/                                 # Core system
│   │   ├── KILO_MASTER.md                    # 🎯 Master skill (entry point)
│   │   │
│   │   ├── predictive-engine/                # PCE Innovation
│   │   │   ├── intent-parser.md              # Intent classification
│   │   │   ├── pattern-predictor.md          # Pattern prediction
│   │   │   └── prefetch-scheduler.md         # Context prefetching
│   │   │
│   │   ├── routing-engine/                   # Routing System
│   │   │   ├── skill-matcher.md              # Skill selection
│   │   │   └── decision-trail.md             # DAT Innovation
│   │   │
│   │   ├── execution-engine/                 # Execution System
│   │   │   ├── token-economy.md              # TEM Innovation
│   │   │   └── quality-gates.md              # Quality checkpoints
│   │   │
│   │   └── knowledge-layer/                  # Knowledge System
│   │       └── skill-analytics.md            # SET Innovation
│   │
│   ├── behaviors/                            # CBU Innovation
│   │   ├── atomic/
│   │   │   └── BEHAVIORS.md                  # 12 atomic behaviors
│   │   ├── compound/
│   │   │   └── BEHAVIORS.md                  # 8 compound workflows
│   │   └── meta/
│   │       └── BEHAVIORS.md                  # 10 meta control flows
│   │
│   └── tools/                                # CLI Tools
│       ├── init-skill.py                     # Create new skills
│       ├── validate-skill.py                 # Validate skills (Python)
│       └── validate-skill.js                 # Validate skills (Node.js)
│
└── 📖 examples/                              # Learning Examples
    ├── basic/
    │   └── hello-kilo.md                     # First skill tutorial
    ├── intermediate/
    │   └── behavior-composition.md           # Behavior composition
    └── advanced/
        └── multi-skill-chain.md              # Multi-skill workflows
```

---

## Component Categories

### 📄 Root Documentation (5 files)

| File | Purpose | Audience |
|------|---------|----------|
| README.md | Project introduction | Everyone |
| QUICKSTART.md | Getting started in 15 minutes | New users |
| CONTRIBUTING.md | How to contribute | Contributors |
| CHANGELOG.md | Version history | All users |
| LICENSE | Legal terms (Apache 2.0) | Legal/Compliance |

### 🔌 Plugin Entry Points (4 directories)

| Directory | Platform | Purpose |
|-----------|----------|---------|
| `.claude-plugin/` | Claude Code | Entry point for Claude Code integration |
| `.cursor-plugin/` | Cursor IDE | Entry point for Cursor IDE integration |
| `.codex/` | OpenAI Codex | Entry point for Codex integration |
| `.opencode/` | OpenCode | Entry point for OpenCode integration |

### 💡 Skills (8 files)

| Category | Skills |
|----------|--------|
| Template | `skills/kilo-kit/_template/SKILL.md` |
| Debugging | `systematic`, `root-cause`, `verification` |
| Development | `backend`, `security` |
| Quality | `code-review`, `testing` |

### ⚡ Commands (3 files)

| Command | Purpose |
|---------|---------|
| `quality-gate.md` | Quality gate workflow |
| `init-skill.md` | Skill initialization command |
| `validate-skill.md` | Skill validation command |

### 📚 Documentation (5 files)

| File | Purpose | Audience |
|------|---------|----------|
| COMPLETION_ASSESSMENT.md | Project status report | Maintainers |
| DEEP_ANALYSIS.md | Detailed analysis | Maintainers |
| PROJECT_STRUCTURE.md | File organization | Developers |
| ARCHITECTURE_DESIGN.md | System architecture | Architects |

### 🔧 Core Components (9 files)

| Component | Innovation | Purpose |
|-----------|------------|---------|
| KILO_MASTER.md | CFA | Entry point & thinking protocol |
| intent-parser.md | PCE | Parse user intent |
| pattern-predictor.md | PCE | Predict context needs |
| prefetch-scheduler.md | PCE | Schedule context loading |
| skill-matcher.md | Routing | Select optimal skill |
| decision-trail.md | DAT | Log all decisions |
| token-economy.md | TEM | Manage token budget |
| quality-gates.md | Execution | Enforce quality |
| skill-analytics.md | SET | Track skill effectiveness |

### 🧩 Behaviors (3 files, 30 behaviors)

| Layer | File | Count |
|-------|------|-------|
| Atomic | BEHAVIORS.md | 12 behaviors |
| Compound | BEHAVIORS.md | 8 workflows |
| Meta | BEHAVIORS.md | 10 control flows |

### 🛠️ Tools (3 files)

| Tool | Command | Purpose |
|------|---------|---------|
| init-skill.py | `python init-skill.py <name>` | Create new skill |
| validate-skill.py | `python validate-skill.py <path>` | Validate skill (Python) |
| validate-skill.js | `node validate-skill.js <path>` | Validate skill (Node.js) |

### 📖 Examples (3 files)

| Level | Example | Topics |
|-------|---------|--------|
| Basic | hello-kilo.md | First skill, basic structure |
| Intermediate | behavior-composition.md | Combining behaviors |
| Advanced | multi-skill-chain.md | Multi-skill workflows |

---

## Innovation Mapping

```
┌─────────────────────────────────────────────────────────────┐
│                       KILO_MASTER.md                        │
│                    (Entry Point - CFA)                      │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│       PCE       │ │     Routing     │ │    Execution    │
│                 │ │                 │ │                 │
│ intent-parser   │ │ skill-matcher   │ │ token-economy   │
│ pattern-pred.   │ │ decision-trail  │ │ quality-gates   │
│ prefetch-sched. │ │     (DAT)       │ │     (TEM)       │
└─────────────────┘ └─────────────────┘ └─────────────────┘
          │                   │                   │
          └───────────────────┴───────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     KNOWLEDGE LAYER                          │
│                    skill-analytics                           │
│                        (SET)                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BEHAVIOR LAYER (CBU)                      │
│                                                              │
│   Atomic (12)    →    Compound (8)    →    Meta (10)        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       SKILL LIBRARY                          │
│                                                              │
│  debugging/   development/   quality/   (more to come...)  │
└─────────────────────────────────────────────────────────────┘
```

---

## File Statistics

| Category | Files | Lines (est.) | Purpose |
|----------|-------|--------------|---------|
| Root Docs | 5 | ~1,500 | Project info |
| Plugin Entry Points | 4 | ~400 | Multi-platform support |
| Documentation | 5 | ~2,000 | Detailed docs |
| Core | 9 | ~3,500 | System engine |
| Behaviors | 3 | ~2,500 | Action library |
| Skills | 8 | ~4,000 | Skill library |
| Commands | 3 | ~300 | Workflow commands |
| Tools | 3 | ~1,200 | CLI utilities |
| Examples | 3 | ~1,500 | Tutorials |
| **Total** | **43** | **~16,900** | |

---

## Navigation Guide

### "I want to..."

| Goal | Start Here |
|------|------------|
| Learn what Kilo-Kit is | `README.md` |
| Get started quickly | `QUICKSTART.md` |
| Understand the architecture | `docs/architecture/ARCHITECTURE_DESIGN.md` |
| Set up for Claude Code | `.claude-plugin/instructions.md` |
| Set up for Cursor IDE | `.cursor-plugin/instructions.md` |
| Set up for Codex | `.codex/instructions.md` |
| Set up for OpenCode | `.opencode/instructions.md` |
| Create a new skill | `skills/kilo-kit/_template/SKILL.md` + `src/tools/init-skill.py` |
| Debug code with Kilo-Kit | `skills/kilo-kit/debugging/systematic/SKILL.md` |
| Learn behavior composition | `examples/intermediate/behavior-composition.md` |
| Understand token management | `src/core/execution-engine/token-economy.md` |
| See how predictions work | `src/core/predictive-engine/` |
| Review a skill's quality | `src/tools/validate-skill.py` |
| Contribute to Kilo-Kit | `CONTRIBUTING.md` |

---

*Project Structure v1.2.0 — Multi-platform & Professional*
