# Hello Kilo-Kit: Your First Skill

> **Difficulty:** Beginner  
> **Time:** 10 minutes  
> **Goal:** Understand how Kilo-Kit skills work

---

## Introduction

This tutorial will walk you through creating your first Kilo-Kit skill. By the end, you'll understand:

1. How skills are structured
2. How the processing pipeline works
3. How to create your own skill

---

## Step 1: Understand the Skill Structure

Every Kilo-Kit skill follows this structure:

```
my-skill/
├── SKILL.md           # Required: Main instructions
├── references/        # Optional: Detailed documentation
├── scripts/           # Optional: Helper scripts
└── assets/            # Optional: Templates, images, etc.
```

The only **required** file is `SKILL.md`.

---

## Step 2: Create Your First Skill

Let's create a simple "greeting" skill that helps the AI greet users appropriately.

### Create the Directory

```bash
mkdir -p skills/kilo-kit/examples/greeting
```

### Create SKILL.md

Create `skills/kilo-kit/examples/greeting/SKILL.md`:

```yaml
---
name: greeting
description: >-
  Helps greet users in a friendly, professional manner.
  Use when starting a conversation or welcoming users.
  Keywords: hello, hi, greet, welcome, introduction
version: 1.0.0
behaviors: [parse_input, generate]
token_estimate:
  min: 100
  typical: 200
  max: 500
---

# 👋 Greeting Skill

## When to Use

Use this skill when:
- Starting a new conversation
- User says hello or greets
- Need to make a good first impression

## Process

1. **Detect greeting type**
   - Formal (business context)
   - Casual (friendly context)
   - Time-based (good morning, etc.)

2. **Generate appropriate response**
   - Match the user's tone
   - Be warm but professional
   - Offer assistance

3. **Transition to next step**
   - Ask how you can help
   - Offer common actions

## Guidelines

### DO ✅
- Match the user's energy level
- Be concise but warm
- Offer to help

### DON'T ❌
- Be overly formal when user is casual
- Use excessive exclamation marks!!!
- Skip the greeting and jump to questions

## Response Templates

**Formal:**
> Hello! I'm here to help with your development needs. How may I assist you today?

**Casual:**
> Hey! 👋 What are we working on today?

**Time-based:**
> Good morning! Ready to tackle some code?

## Success Criteria

- [ ] Greeting matches user's tone
- [ ] Offered to help
- [ ] Ready for next interaction
```

---

## Step 3: Test Your Skill

Once created, Kilo-Kit will automatically recognize your skill.

Try saying:
- "Hello!"
- "Hey there"
- "Good morning"

The skill should activate and provide an appropriate greeting.

---

## Step 4: Understand the Processing Flow

When you say "Hello!", here's what happens:

```
1. INTAKE (Predictive Context Engine)
   ├── Intent detected: GREETING
   ├── Confidence: 0.95
   └── Keywords: ["hello"]

2. ROUTE (Adaptive Routing Engine)
   ├── Skill matched: examples/greeting
   ├── Score: 0.92
   └── Behaviors: [parse_input, generate]

3. EXECUTE (Execution Engine)
   ├── parse_input: Detect casual greeting
   ├── generate: Create casual response
   └── Quality gates: All passed

4. LEARN (Feedback Loop)
   ├── Record success
   └── Update skill analytics
```

---

## Step 5: Enhance Your Skill

Now let's add more sophistication.

### Add a Reference Document

Create `skills/kilo-kit/examples/greeting/references/localization.md`:

```markdown
# Greeting Localization

## Supported Languages

| Language | Formal | Casual |
|----------|--------|--------|
| English | "Hello" | "Hey" |
| Vietnamese | "Xin chào" | "Chào bạn" |
| Spanish | "Hola" | "¡Hola!" |

## Time-Based Greetings

| Time | Greeting |
|------|----------|
| 05:00-11:59 | Good morning |
| 12:00-16:59 | Good afternoon |
| 17:00-20:59 | Good evening |
| 21:00-04:59 | Good night |
```

### Reference It in SKILL.md

Update your SKILL.md to include:

```markdown
## References

- `references/localization.md` - For localized greetings
```

---

## Step 6: Key Takeaways

1. **Skills are modular** - Each skill does one thing well
2. **Skills are self-documenting** - The SKILL.md contains everything needed
3. **Skills are automatically routed** - Keywords trigger the right skill
4. **Skills can reference additional content** - For progressive disclosure

---

## What's Next?

- Learn about [Compound Behaviors](../intermediate/behavior-composition.md)
- Create a more complex skill
- Explore existing skills in `skills/kilo-kit/`

---

## Common Issues

### Skill Not Triggering

**Cause:** Keywords don't match  
**Solution:** Add more trigger keywords to description

### Wrong Skill Triggered

**Cause:** Keyword overlap with another skill  
**Solution:** Make keywords more specific

### Low Confidence Score

**Cause:** Ambiguous keywords  
**Solution:** Add more context-specific keywords

---

*Hello Kilo-Kit Tutorial v1.0.0*
