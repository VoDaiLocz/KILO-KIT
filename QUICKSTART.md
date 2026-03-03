# 🚀 Kilo-Kit Quick Start Guide

> **Time Required:** 15 minutes  
> **Difficulty:** Beginner  
> **Prerequisites:** Basic understanding of AI agents

---

## 📋 What You'll Learn

1. How Kilo-Kit works (Cognitive Flow Architecture)
2. How to set up Kilo-Kit for your AI agent
3. How to use skills effectively
4. How to create your first custom skill

---

## 🧠 Understanding Kilo-Kit (2 minutes)

### The Core Idea

Kilo-Kit treats AI interactions as **continuous flows**, not one-off tasks:

```
Traditional AI:     Ask → Answer → Done

Kilo-Kit:           Ask → Predict → Execute → Learn → Improve
                          ↑                        ↓
                          └────────────────────────┘
```

### The 5 Innovations

| Innovation | What It Does | Why It Matters |
|------------|--------------|----------------|
| **PCE** | Predicts what context you'll need | Faster responses |
| **SET** | Tracks skill effectiveness | Self-improving system |
| **CBU** | Breaks skills into composable units | Maximum flexibility |
| **TEM** | Manages token budgets | Cost efficiency |
| **DAT** | Logs all decisions | Full explainability |

---

## 🔧 Setup (5 minutes)

### Step 1: Get Kilo-Kit

```bash
# Clone the repository
git clone https://github.com/your-org/kilo-kit.git
cd kilo-kit
```

### Step 2: Copy Master Skill to Your Agent

For **Claude Code / Cursor / Similar**:
```bash
# Create agent config directory if not exists
mkdir -p ~/.config/your-agent

# Copy the master skill
cp src/core/KILO_MASTER.md ~/.config/your-agent/KILO_MASTER.md
```

For **Custom Agent Setup**:
```bash
# Add to your agent's system prompt
Reference: src/core/KILO_MASTER.md
```

### Step 3: Verify Setup

Ask your AI agent:
```
What are the 4 stages of Kilo-Kit's processing pipeline?
```

Expected answer should mention: **INTAKE → ROUTE → EXECUTE → LEARN**

---

## 🎯 Using Skills (5 minutes)

### How Skill Dispatch Works

When you ask your AI agent something, Kilo-Kit automatically:

1. **Parses your intent** (What are you trying to do?)
2. **Matches a skill** (Which skill fits best?)
3. **Loads context** (What info is needed?)
4. **Executes with quality gates** (Do it right)
5. **Learns from outcome** (Get better next time)

### Common Triggers

| What You Say | Skill Activated |
|--------------|-----------------|
| "Fix this bug" | `debugging/systematic` |
| "Why is this failing?" | `debugging/root-cause` |
| "Review this code" | `quality/code-review` |
| "Write tests for this" | `quality/testing` |
| "Create an API endpoint" | `development/backend` |
| "Secure this auth flow" | `development/security` |

### Example Interaction

**You:** "There's a bug in the login function - users can't authenticate"

**Kilo-Kit activates:**
```yaml
Intent: DEBUG
Domain: AUTH
Urgency: HIGH (authentication = security)
Mode: CRITICAL (2x token budget)
Skill: debugging/systematic

Processing:
  1. INTAKE: Parse "bug", "login", "authenticate" → DEBUG+AUTH
  2. ROUTE: Select systematic-debugging (confidence: 0.94)
  3. EXECUTE: Run 4-phase debugging process
  4. LEARN: Record outcome for future improvement
```

---

## 🛠️ Creating Your First Skill (3 minutes)

### Skill Structure

```
my-skill/
├── SKILL.md           # Main instructions (required)
├── references/        # Detailed documentation
└── scripts/           # Helper scripts
```

### Minimal SKILL.md Template

```yaml
---
name: my-first-skill
description: >-
  A brief description of what this skill does.
  Keywords: keyword1, keyword2, keyword3
version: 1.0.0
---

# My First Skill

## When to Use
- When user asks about [topic]
- When task involves [specific action]

## Process
1. First, understand the request
2. Then, gather necessary information
3. Execute the main task
4. Verify the result
5. Document what was done

## Guidelines
- Always verify before claiming done
- Ask for clarification if unclear
- Follow project conventions

## Success Criteria
- [ ] Task completed as requested
- [ ] No regressions introduced
- [ ] User confirmed satisfaction
```

### Quick Create Command

```bash
# Create a new skill (when tools are available)
python src/tools/init-skill.py my-skill --category development
```

---

## 💰 Understanding Token Economy

Kilo-Kit manages token usage automatically:

| Mode | When Used | Token Budget |
|------|-----------|--------------|
| 🟢 **Economy** | Simple tasks | 60% |
| 🟡 **Standard** | Most tasks | 100% |
| 🟠 **Premium** | Complex tasks | 150% |
| 🔴 **Critical** | Production issues | 200% |

**You don't need to specify modes manually** - Kilo-Kit auto-selects based on:
- Task urgency
- Complexity signals
- Domain sensitivity (security = Critical)

---

## ✅ Quality Gates

Kilo-Kit enforces quality at every step:

### Before Execution
- [ ] Intent parsed correctly?
- [ ] Skill matched?
- [ ] Budget sufficient?

### During Execution
- [ ] Each step validated?
- [ ] No errors?

### Before Claiming Done
- [ ] Changes verified?
- [ ] Tests pass?
- [ ] User request addressed?

**These gates are NEVER skipped.**

---

## 🔍 Debugging Kilo-Kit

### Check Decision Trail

Ask your agent:
```
Show me the decision trail for the last task
```

This reveals:
- What intent was detected
- Which skills were considered
- Why the chosen skill was selected
- What alternatives existed

### Common Issues

| Problem | Solution |
|---------|----------|
| Wrong skill activated | Add more trigger keywords |
| Slow responses | Check if Premium/Critical mode is over-used |
| Missing context | Verify skill dependencies |
| Quality gate fails | Review the failing criterion |

---

## 📚 Next Steps

1. **Explore existing skills** in `skills/kilo-kit/`
2. **Read the architecture doc** in `docs/architecture/`
3. **Create custom skills** for your workflow
4. **Contribute improvements** - see CONTRIBUTING.md

---

## 🆘 Getting Help

- **Documentation:** `docs/` directory
- **Examples:** `examples/` directory
- **Issues:** GitHub Issues
- **Discussions:** GitHub Discussions

---

*Quick Start Guide v1.0.0 — Get productive in 15 minutes*
