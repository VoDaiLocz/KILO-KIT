# 🚀 Kilo-Kit: Professional AI Agent Development Framework

> **Version:** 1.0.0  
> **Author:** Kilo-Kit Team  
> **License:** Apache 2.0

## 🎯 What is Kilo-Kit?

**Kilo-Kit** is a comprehensive, modular framework for building and managing AI agent systems at scale (kilo-code = thousands of lines, hundreds of files). It introduces a revolutionary **Cognitive Flow Architecture (CFA)** that treats AI interactions as continuous flows rather than discrete events.

### Core Philosophy

```
🧠 "Anticipate needs before they arise"
🔄 "Learn from every interaction"
📐 "Modularity enables scalability"
🎯 "Quality over quantity in every token"
💰 "Cost-aware intelligence"
```

## ✨ Key Innovations

| Innovation | Description |
|------------|-------------|
| **Predictive Context Engine (PCE)** | Pre-loads context before you need it |
| **Composable Behavior Units (CBU)** | Build workflows from micro-behaviors |
| **Token Economy Manager (TEM)** | Smart budgeting for cost/quality balance |
| **Decision Audit Trail (DAT)** | Full explainability for all decisions |
| **Skill Effectiveness Tracker (SET)** | Self-improving skill system |
| **Adaptive Routing** | Learns optimal skill selection over time |

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **Skill System** | Modular, loadable skills for specialized tasks |
| **Adaptive Dispatch** | Intelligent skill routing that learns from usage |
| **Progressive Disclosure** | Three-level context loading for efficiency |
| **Context Engineering** | Token optimization and attention management |
| **Quality Gates** | Mandatory checkpoints: typecheck → lint → test → build |
| **TDD Workflow** | Test-first development with RED → GREEN → REFACTOR |
| **Security First** | Input validation, parameterized queries, no hardcoded secrets |
| **Multi-Stack Support** | TypeScript, Python, .NET, Go ready |

## 📁 Project Structure

```
kilo-kit/
├── README.md                    # This file
├── QUICKSTART.md               # 15-minute getting started guide
├── CONTRIBUTING.md             # Contribution guidelines
├── CHANGELOG.md                # Version history
│
├── src/                        # Source code
│   ├── core/                   # Core system components
│   │   ├── KILO_MASTER.md     # Master skill file (entry point)
│   │   ├── predictive-engine/  # Predictive Context Engine
│   │   ├── routing-engine/     # Adaptive Routing Engine
│   │   ├── execution-engine/   # Execution & Quality Gates
│   │   └── knowledge-layer/    # Persistent Knowledge
│   │
│   ├── behaviors/              # Composable Behavior Units
│   │   ├── atomic/             # Smallest behavior units
│   │   ├── compound/           # Combined behaviors
│   │   └── meta/               # Meta-behaviors
│   │
│   ├── skills/                 # Modular skill system
│   │   ├── _template/          # Skill template
│   │   ├── debugging/          # Debugging skills
│   │   ├── development/        # Development skills
│   │   └── quality/            # Quality assurance skills
│   │
│   └── tools/                  # CLI and utility tools
│       ├── init-skill.py       # Skill initializer
│       ├── validate-skill.py   # Skill validator (Python)
│       └── validate-skill.js   # Skill validator (Node.js)
│
├── docs/                       # Documentation
│   ├── architecture/           # Architecture decisions
│   ├── COMPLETION_ASSESSMENT.md
│   ├── DEEP_ANALYSIS.md
│   └── PROJECT_STRUCTURE.md
│
└── examples/                   # Real-world examples
    ├── basic/                  # Basic usage patterns
    ├── intermediate/           # Intermediate patterns
    └── advanced/               # Advanced patterns
```

## 🚀 Quick Start

### 1. Install

```bash
# Clone the repository
git clone https://github.com/your-org/kilo-kit.git
cd kilo-kit

# No dependencies required - works out of the box!
```

### 2. Configure Your Agent

Copy the master skill file to your agent's configuration:

```bash
# For most AI agents
cp src/core/KILO_MASTER.md ~/.your-agent/KILO_MASTER.md

# Update your agent's system prompt to reference it
```

### 3. Use Skills

Skills are automatically loaded when your task matches their keywords. See the [Skill Dispatch Table](#-skill-dispatch-table) below.

## 📋 Skill Dispatch Table

| Task Keywords | Skill to Load |
|---------------|---------------|
| `bug, error, fix, debug` | `skills/debugging/systematic/` |
| `validate, validation` | `skills/debugging/systematic/` |
| `root cause, why` | `skills/debugging/root-cause/` |
| `verify, confirm` | `skills/debugging/verification/` |
| `review, PR, code review` | `skills/quality/code-review/` |
| `test, TDD, testing` | `skills/quality/testing/` |
| `security, auth, OWASP` | `skills/development/security/` |
| `API, backend, server` | `skills/development/backend/` |

## 🎓 Core Principles

### 1. Cognitive Flow Architecture

```
Traditional:  Task → Process → Response (done)

Kilo-Kit:     ┌─────────────────────────────┐
              │      COGNITIVE FLOW         │
              │                             │
    Input ───►│  Predict → Execute → Learn  │───► Output
              │      ↑              │       │
    Next  ───►│      └──────────────┘       │───► Better
              │                             │
              └─────────────────────────────┘
```

### 2. Quality Gates (NEVER SKIP)

```bash
# Before EVERY commit
typecheck → lint → test → build

# All must pass. No exceptions.
```

### 3. The Three Pillars

```
ANTICIPATE → EXECUTE → LEARN → OPTIMIZE
     ↑                            │
     └────────────────────────────┘
```

### 4. Progressive Disclosure

```
Level 1: Metadata (always loaded, ~100 tokens)
Level 2: SKILL.md body (when triggered, <5k tokens)  
Level 3: References/Scripts (on-demand, unlimited)
```

## 🔧 Creating Custom Skills

Use the skill template:

```bash
python src/tools/init-skill.py my-skill --path ./src/skills/
```

This creates:

```
my-skill/
├── SKILL.md           # Main instructions (required)
├── references/        # Documentation to load as needed
├── scripts/           # Executable utilities
└── assets/            # Templates, images, etc.
```

### SKILL.md Format

```yaml
---
name: my-skill
description: >-
  Clear description of what this skill does and when to use it.
  Include keywords that should trigger this skill.
version: 1.0.0
behaviors: [behavior1, behavior2]
token_estimate:
  min: 500
  typical: 1500
  max: 5000
---

# My Skill

## When to Use
- Situation 1
- Situation 2

## Process
1. Step 1
2. Step 2

## Guidelines
- Guideline 1
- Guideline 2

## References
- `references/detailed-guide.md` - For detailed instructions
- `scripts/helper.py` - For automated tasks
```

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 15 minutes
- **[docs/architecture/](./docs/architecture/)** - Architecture design documents
- **[docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md)** - Project structure guide
- **[examples/](./examples/)** - Real-world usage examples

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for:

- Code of conduct
- Development setup
- Pull request process
- Coding standards

## 📊 Stack Preferences

### TypeScript/JavaScript (2024-2025)
| Category | Preferred | Avoid |
|----------|-----------|-------|
| Runtime | Bun, Node 20+ | Node <18 |
| Backend | Hono, Elysia | Express |
| ORM | Drizzle, Prisma 5+ | Sequelize |
| Testing | Vitest, Playwright | Jest |
| Package | pnpm, Bun | npm |

### Python
| Category | Preferred | Avoid |
|----------|-----------|-------|
| Runtime | Python 3.11+ | <3.9 |
| Backend | FastAPI, Litestar | Flask |
| ORM | SQLAlchemy 2.0 | <2.0 |
| Validation | Pydantic v2 | v1 |
| Linting | Ruff, mypy | flake8 |

### .NET
| Category | Preferred |
|----------|-----------|
| Framework | .NET 8+ |
| Web | ASP.NET Core |
| ORM | EF Core |
| Testing | xUnit, NUnit |

## 🏗️ Roadmap

- [x] v1.0.0 - Core Cognitive Flow Architecture
- [ ] v1.1.0 - MCP Integration
- [ ] v1.2.0 - Multi-Agent Orchestration
- [ ] v2.0.0 - Visual Workflow Builder

## 📄 License

Apache 2.0 - See [LICENSE](./LICENSE) for details.

---

**Made with ❤️ for developers who value quality, efficiency, and scalability.**

*Kilo-Kit — Where AI meets excellence.*
