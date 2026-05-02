# KILO-KIT Skills

A curated, installable skill library built from the local Codex skill collection and organized for real engineering work.

## Quickstart

Install the whole repository with a skills-compatible installer:

```bash
npx skills@latest add VoDaiLocz/KILO-KIT
```

Install one skill by path:

```bash
npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/tdd
```

For local development, point your agent at this repository and load skills from `skills/<category>/<skill>/SKILL.md`.

## Structure

- `skills/kilo-kit/` contains the original KILO-KIT core framework skills.
- The other category folders contain imported Codex skills from `C:\Users\Admin\.codex\skills`, materialized as normal repository files.
- Each skill keeps its original `SKILL.md`, `references/`, `scripts/`, and assets where present.

## Reference (114 skills)

### agent-frameworks

Agent framework and orchestration skills.

- **[claukit](agent-frameworks/claukit/SKILL.md)** - Advanced Agentic Coding framework providing mission briefs, guardrails, and integration hints for complex tasks. This skill ensures high-quality output through disciplined automation and systematic workflows.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/agent-frameworks/claukit
  ```

### ai-media

AI media, multimodal workflows, search/SEO/GEO, screenshot, and Sora-oriented skills.

- **[ai-multimodal](ai-media/ai-multimodal/SKILL.md)** - Process and generate multimedia content using Google Gemini API. Capabilities include analyze audio files (transcription with timestamps, summarization, speech understanding, music/sound analysis up to 9.5 hours), understand images (captioning, object detection, OCR, visual Q&A, segmentation), process videos (scene detection, Q&A, temporal analysis, YouTube URLs, up to 6 hours), extract from documents (PDF tables, forms, charts, diagrams, multi-page), generate images (text-to-image, editing, composition, refinement). Use when working with audio/video files, analyzing images or screenshots, processing PDF documents, extracting structured data from media, creating images from text prompts, or implementing multimodal AI features. Supports multiple models (Gemini 2.5/2.0) with context windows up to 2M tokens.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/ai-media/ai-multimodal
  ```
- **[geo-fundamentals](ai-media/geo-fundamentals/SKILL.md)** - Generative Engine Optimization for AI search engines (ChatGPT, Claude, Perplexity).

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/ai-media/geo-fundamentals
  ```
- **[media-processing](ai-media/media-processing/SKILL.md)** - Process multimedia files with FFmpeg (video/audio encoding, conversion, streaming, filtering, hardware acceleration) and ImageMagick (image manipulation, format conversion, batch processing, effects, composition). Use when converting media formats, encoding videos with specific codecs (H.264, H.265, VP9), resizing/cropping images, extracting audio from video, applying filters and effects, optimizing file sizes, creating streaming manifests (HLS/DASH), generating thumbnails, batch processing images, creating composite images, or implementing media processing pipelines. Supports 100+ formats, hardware acceleration (NVENC, QSV), and complex filtergraphs.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/ai-media/media-processing
  ```
- **[screenshot](ai-media/screenshot/SKILL.md)** - Use when the user explicitly asks for a desktop or system screenshot (full screen, specific app or window, or a pixel region), or when tool-specific capture capabilities are unavailable and an OS-level capture is needed.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/ai-media/screenshot
  ```
- **[seo-fundamentals](ai-media/seo-fundamentals/SKILL.md)** - SEO fundamentals, E-E-A-T, Core Web Vitals, and Google algorithm principles.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/ai-media/seo-fundamentals
  ```
- **[sora](ai-media/sora/SKILL.md)** - Use when the user asks to generate, remix, poll, list, download, or delete Sora videos via OpenAI’s video API using the bundled CLI (`scripts/sora.py`), including requests like “generate AI video,” “Sora,” “video remix,” “download video/thumbnail/spritesheet,” and batch video generation; requires `OPENAI_API_KEY` and Sora API access.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/ai-media/sora
  ```

### design

Interface, frontend, visual design, Figma, Tailwind, and styling skills.

- **[aesthetic](design/aesthetic/SKILL.md)** - Create aesthetically beautiful interfaces following proven design principles. Use when building UI/UX, analyzing designs from inspiration sites, generating design images with ai-multimodal, implementing visual hierarchy and color theory, adding micro-interactions, or creating design documentation. Includes workflows for capturing and analyzing inspiration screenshots with chrome-devtools and ai-multimodal, iterative design image generation until aesthetic standards are met, and comprehensive design system guidance covering BEAUTIFUL (aesthetic principles), RIGHT (functionality/accessibility), SATISFYING (micro-interactions), and PEAK (storytelling) stages. Integrates with chrome-devtools, ai-multimodal, media-processing, ui-styling, and web-frameworks skills.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/design/aesthetic
  ```
- **[figma](design/figma/SKILL.md)** - Use the Figma MCP server to fetch design context, screenshots, variables, and assets from Figma, and to translate Figma nodes into production code. Trigger when a task involves Figma URLs, node IDs, design-to-code implementation, or Figma MCP setup and troubleshooting.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/design/figma
  ```
- **[figma-implement-design](design/figma-implement-design/SKILL.md)** - Translate Figma nodes into production-ready code with 1:1 visual fidelity using the Figma MCP workflow (design context, screenshots, assets, and project-convention translation). Trigger when the user provides Figma URLs or node IDs, or asks to implement designs or components that must match Figma specs. Requires a working Figma MCP server connection.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/design/figma-implement-design
  ```
- **[frontend-design](design/frontend-design/SKILL.md)** - Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/design/frontend-design
  ```
- **[mobile-design](design/mobile-design/SKILL.md)** - Mobile-first design thinking and decision-making for iOS and Android apps. Touch interaction, performance patterns, platform conventions. Teaches principles, not fixed values. Use when building React Native, Flutter, or native mobile apps.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/design/mobile-design
  ```
- **[tailwind-patterns](design/tailwind-patterns/SKILL.md)** - Tailwind CSS v4 principles. CSS-first configuration, container queries, modern patterns, design token architecture.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/design/tailwind-patterns
  ```
- **[ui-styling](design/ui-styling/SKILL.md)** - Create beautiful, accessible user interfaces with shadcn/ui components (built on Radix UI + Tailwind), Tailwind CSS utility-first styling, and canvas-based visual designs. Use when building user interfaces, implementing design systems, creating responsive layouts, adding accessible components (dialogs, dropdowns, forms, tables), customizing themes and colors, implementing dark mode, generating visual designs and posters, or establishing consistent styling patterns across applications.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/design/ui-styling
  ```

### engineering

Daily software engineering skills: architecture, TDD, reviews, framework guidance, codebase work, and delivery workflows.

- **[api-patterns](engineering/api-patterns/SKILL.md)** - API design principles and decision-making. REST vs GraphQL vs tRPC selection, response formats, versioning, pagination.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/api-patterns
  ```
- **[app-builder](engineering/app-builder/SKILL.md)** - Main application building orchestrator. Creates full-stack applications from natural language requests. Determines project type, selects tech stack, coordinates agents.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/app-builder
  ```
- **[architecture](engineering/architecture/SKILL.md)** - Architectural decision-making framework. Requirements analysis, trade-off evaluation, ADR documentation. Use when making architecture decisions or analyzing system design.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/architecture
  ```
- **[aspnet-core](engineering/aspnet-core/SKILL.md)** - Build, review, refactor, or architect ASP.NET Core web applications using current official guidance for .NET web development. Use when working on Blazor Web Apps, Razor Pages, MVC, Minimal APIs, controller-based Web APIs, SignalR, gRPC, middleware, dependency injection, configuration, authentication, authorization, testing, performance, deployment, or ASP.NET Core upgrades.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/aspnet-core
  ```
- **[backend-development](engineering/backend-development/SKILL.md)** - Build robust backend systems with modern technologies (Node.js, Python, Go, Rust), frameworks (NestJS, FastAPI, Django), databases (PostgreSQL, MongoDB, Redis), APIs (REST, GraphQL, gRPC), authentication (OAuth 2.1, JWT), testing strategies, security best practices (OWASP Top 10), performance optimization, scalability patterns (microservices, caching, sharding), DevOps practices (Docker, Kubernetes, CI/CD), and monitoring. Use when designing APIs, implementing authentication, optimizing database queries, setting up CI/CD pipelines, handling security vulnerabilities, building microservices, or developing production-ready backend systems.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/backend-development
  ```
- **[better-auth](engineering/better-auth/SKILL.md)** - Implement authentication and authorization with Better Auth - a framework-agnostic TypeScript authentication framework. Features include email/password authentication with verification, OAuth providers (Google, GitHub, Discord, etc.), two-factor authentication (TOTP, SMS), passkeys/WebAuthn support, session management, role-based access control (RBAC), rate limiting, and database adapters. Use when adding authentication to applications, implementing OAuth flows, setting up 2FA/MFA, managing user sessions, configuring authorization rules, or building secure authentication systems for web applications.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/better-auth
  ```
- **[clean-code](engineering/clean-code/SKILL.md)** - Pragmatic coding standards - concise, direct, no over-engineering, no unnecessary comments

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/clean-code
  ```
- **[code-review](engineering/code-review/SKILL.md)** - Use when receiving code review feedback (especially if unclear or technically questionable), when completing tasks or major features requiring review before proceeding, or before making any completion/success claims. Covers three practices - receiving feedback with technical rigor over performative agreement, requesting reviews via code-reviewer subagent, and verification gates requiring evidence before any status claims. Essential for subagent-driven development, pull requests, and preventing false completion claims.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/code-review
  ```
- **[code-review-checklist](engineering/code-review-checklist/SKILL.md)** - Code review guidelines covering code quality, security, and best practices.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/code-review-checklist
  ```
- **[context-engineering](engineering/context-engineering/SKILL.md)** - Master context engineering for AI agent systems. Use when designing agent architectures, debugging context failures, optimizing token usage, implementing memory systems, building multi-agent coordination, evaluating agent performance, or developing LLM-powered pipelines. Covers context fundamentals, degradation patterns, optimization techniques (compaction, masking, caching), compression strategies, memory architectures, multi-agent patterns, LLM-as-Judge evaluation, tool design, and project development.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/context-engineering
  ```
- **[database-design](engineering/database-design/SKILL.md)** - Database design principles and decision-making. Schema design, indexing strategy, ORM selection, serverless databases.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/database-design
  ```
- **[databases](engineering/databases/SKILL.md)** - Work with MongoDB (document database, BSON documents, aggregation pipelines, Atlas cloud) and PostgreSQL (relational database, SQL queries, psql CLI, pgAdmin). Use when designing database schemas, writing queries and aggregations, optimizing indexes for performance, performing database migrations, configuring replication and sharding, implementing backup and restore strategies, managing database users and permissions, analyzing query performance, or administering production databases.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/databases
  ```
- **[diagnose](engineering/diagnose/SKILL.md)** - Disciplined diagnosis loop for hard bugs and performance regressions. Reproduce → minimise → hypothesise → instrument → fix → regression-test. Use when user says "diagnose this" / "debug this", reports a bug, says something is broken/throwing/failing, or describes a performance regression.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/diagnose
  ```
- **[docs-seeker](engineering/docs-seeker/SKILL.md)** - Searching internet for technical documentation using llms.txt standard, GitHub repositories via Repomix, and parallel exploration. Use when user needs: (1) Latest documentation for libraries/frameworks, (2) Documentation in llms.txt format, (3) GitHub repository analysis, (4) Documentation without direct llms.txt support, (5) Multiple documentation sources in parallel

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/docs-seeker
  ```
- **[frontend-dev-guidelines](engineering/frontend-development/SKILL.md)** - Frontend development guidelines for React/TypeScript applications. Modern patterns including Suspense, lazy loading, useSuspenseQuery, file organization with features directory, MUI v7 styling, TanStack Router, performance optimization, and TypeScript best practices. Use when creating components, pages, features, fetching data, styling, routing, or working with frontend code.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/frontend-development
  ```
- **[i18n-localization](engineering/i18n-localization/SKILL.md)** - Internationalization and localization patterns. Detecting hardcoded strings, managing translations, locale files, RTL support.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/i18n-localization
  ```
- **[improve-codebase-architecture](engineering/improve-codebase-architecture/SKILL.md)** - Find deepening opportunities in a codebase, informed by the domain language in CONTEXT.md and the decisions in docs/adr/. Use when the user wants to improve architecture, find refactoring opportunities, consolidate tightly-coupled modules, or make a codebase more testable and AI-navigable.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/improve-codebase-architecture
  ```
- **[lint-and-validate](engineering/lint-and-validate/SKILL.md)** - Automatic quality control, linting, and static analysis procedures. Use after every code modification to ensure syntax correctness and project standards. Triggers onKeywords: lint, format, check, validate, types, static analysis.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/lint-and-validate
  ```
- **[nextjs-best-practices](engineering/nextjs-best-practices/SKILL.md)** - Next.js App Router principles. Server Components, data fetching, routing patterns.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/nextjs-best-practices
  ```
- **[nodejs-best-practices](engineering/nodejs-best-practices/SKILL.md)** - Node.js development principles and decision-making. Framework selection, async patterns, security, and architecture. Teaches thinking, not copying.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/nodejs-best-practices
  ```
- **[openai-docs](engineering/openai-docs/SKILL.md)** - Use when the user asks how to build with OpenAI products or APIs and needs up-to-date official documentation with citations, help choosing the latest model for a use case, or explicit GPT-5.4 upgrade and prompt-upgrade guidance; prioritize OpenAI docs MCP tools, use bundled references only as helper context, and restrict any fallback browsing to official OpenAI domains.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/openai-docs
  ```
- **[performance-profiling](engineering/performance-profiling/SKILL.md)** - Performance profiling principles. Measurement, analysis, and optimization techniques.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/performance-profiling
  ```
- **[playwright](engineering/playwright/SKILL.md)** - Use when the task requires automating a real browser from the terminal (navigation, form filling, snapshots, screenshots, data extraction, UI-flow debugging) via `playwright-cli` or the bundled wrapper script.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/playwright
  ```
- **[playwright-interactive](engineering/playwright-interactive/SKILL.md)** - Persistent browser and Electron interaction through `js_repl` for fast iterative UI debugging.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/playwright-interactive
  ```
- **[python-patterns](engineering/python-patterns/SKILL.md)** - Python development principles and decision-making. Framework selection, async patterns, type hints, project structure. Teaches thinking, not copying.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/python-patterns
  ```
- **[react-patterns](engineering/react-patterns/SKILL.md)** - Modern React patterns and principles. Hooks, composition, performance, TypeScript best practices.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/react-patterns
  ```
- **[render-deploy](engineering/render-deploy/SKILL.md)** - Deploy applications to Render by analyzing codebases, generating render.yaml Blueprints, and providing Dashboard deeplinks. Use when the user wants to deploy, host, publish, or set up their application on Render's cloud platform.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/render-deploy
  ```
- **[repomix](engineering/repomix/SKILL.md)** - Package entire code repositories into single AI-friendly files using Repomix. Capabilities include pack codebases with customizable include/exclude patterns, generate multiple output formats (XML, Markdown, plain text), preserve file structure and context, optimize for AI consumption with token counting, filter by file types and directories, add custom headers and summaries. Use when packaging codebases for AI analysis, creating repository snapshots for LLM context, analyzing third-party libraries, preparing for security audits, generating documentation context, or evaluating unfamiliar codebases.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/repomix
  ```
- **[setup-matt-pocock-skills](engineering/setup-matt-pocock-skills/SKILL.md)** - Sets up an `## Agent skills` block in AGENTS.md/CLAUDE.md and `docs/agents/` so the engineering skills know this repo's issue tracker (GitHub or local markdown), triage label vocabulary, and domain doc layout. Run before first use of `to-issues`, `to-prd`, `triage`, `diagnose`, `tdd`, `improve-codebase-architecture`, or `zoom-out` — or if those skills appear to be missing context about the issue tracker, triage labels, or domain docs.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/setup-matt-pocock-skills
  ```
- **[shopify](engineering/shopify/SKILL.md)** - Build Shopify applications, extensions, and themes using GraphQL/REST APIs, Shopify CLI, Polaris UI components, and Liquid templating. Capabilities include app development with OAuth authentication, checkout UI extensions for customizing checkout flow, admin UI extensions for dashboard integration, POS extensions for retail, theme development with Liquid, webhook management, billing API integration, product/order/customer management. Use when building Shopify apps, implementing checkout customizations, creating admin interfaces, developing themes, integrating payment processing, managing store data via APIs, or extending Shopify functionality.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/shopify
  ```
- **[tdd](engineering/tdd/SKILL.md)** - Test-driven development with red-green-refactor loop. Use when user wants to build features or fix bugs using TDD, mentions "red-green-refactor", wants integration tests, or asks for test-first development.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/tdd
  ```
- **[tdd-workflow](engineering/tdd-workflow/SKILL.md)** - Test-Driven Development workflow principles. RED-GREEN-REFACTOR cycle.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/tdd-workflow
  ```
- **[testing-patterns](engineering/testing-patterns/SKILL.md)** - Testing patterns and principles. Unit, integration, mocking strategies.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/testing-patterns
  ```
- **[to-issues](engineering/to-issues/SKILL.md)** - Break a plan, spec, or PRD into independently-grabbable issues on the project issue tracker using tracer-bullet vertical slices. Use when user wants to convert a plan into issues, create implementation tickets, or break down work into issues.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/to-issues
  ```
- **[to-prd](engineering/to-prd/SKILL.md)** - Turn the current conversation context into a PRD and publish it to the project issue tracker. Use when user wants to create a PRD from the current context.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/to-prd
  ```
- **[triage](engineering/triage/SKILL.md)** - Triage issues through a state machine driven by triage roles. Use when user wants to create an issue, triage issues, review incoming bugs or feature requests, prepare issues for an AFK agent, or manage issue workflow.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/triage
  ```
- **[vulnerability-scanner](engineering/vulnerability-scanner/SKILL.md)** - Advanced vulnerability analysis principles. OWASP 2025, Supply Chain Security, attack surface mapping, risk prioritization.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/vulnerability-scanner
  ```
- **[webapp-testing](engineering/webapp-testing/SKILL.md)** - Web application testing principles. E2E, Playwright, deep audit strategies.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/webapp-testing
  ```
- **[web-frameworks](engineering/web-frameworks/SKILL.md)** - Build modern full-stack web applications with Next.js (App Router, Server Components, RSC, PPR, SSR, SSG, ISR), Turborepo (monorepo management, task pipelines, remote caching, parallel execution), and RemixIcon (3100+ SVG icons in outlined/filled styles). Use when creating React applications, implementing server-side rendering, setting up monorepos with multiple packages, optimizing build performance and caching strategies, adding icon libraries, managing shared dependencies, or working with TypeScript full-stack projects.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/web-frameworks
  ```
- **[write-a-skill](engineering/write-a-skill/SKILL.md)** - Create new agent skills with proper structure, progressive disclosure, and bundled resources. Use when user wants to create, write, or build a new skill.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/engineering/write-a-skill
  ```

### games

2D, 3D, web, mobile, PC, multiplayer, VR/AR, art, audio, and game design skills.

- **[2d-games](games/2d-games/SKILL.md)** - 2D game development principles. Sprites, tilemaps, physics, camera.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/games/2d-games
  ```
- **[3d-games](games/3d-games/SKILL.md)** - 3D game development principles. Rendering, shaders, physics, cameras.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/games/3d-games
  ```
- **[game-art](games/game-art/SKILL.md)** - Game art principles. Visual style selection, asset pipeline, animation workflow.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/games/game-art
  ```
- **[game-audio](games/game-audio/SKILL.md)** - Game audio principles. Sound design, music integration, adaptive audio systems.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/games/game-audio
  ```
- **[game-design](games/game-design/SKILL.md)** - Game design principles. GDD structure, balancing, player psychology, progression.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/games/game-design
  ```
- **[game-development](games/game-development/SKILL.md)** - Game development orchestrator. Routes to platform-specific skills based on project needs.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/games/game-development
  ```
- **[mobile-games](games/mobile-games/SKILL.md)** - Mobile game development principles. Touch input, battery, performance, app stores.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/games/mobile-games
  ```
- **[multiplayer](games/multiplayer/SKILL.md)** - Multiplayer game development principles. Architecture, networking, synchronization.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/games/multiplayer
  ```
- **[pc-games](games/pc-games/SKILL.md)** - PC and console game development principles. Engine selection, platform features, optimization strategies.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/games/pc-games
  ```
- **[vr-ar](games/vr-ar/SKILL.md)** - VR/AR development principles. Comfort, interaction, performance requirements.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/games/vr-ar
  ```
- **[web-games](games/web-games/SKILL.md)** - Web browser game development principles. Framework selection, WebGPU, optimization, PWA.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/games/web-games
  ```

### operations

Shell, browser automation, deployment, DevOps, MCP, server management, and platform operations skills.

- **[bash-linux](operations/bash-linux/SKILL.md)** - Bash/Linux terminal patterns. Critical commands, piping, error handling, scripting. Use when working on macOS or Linux systems.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/operations/bash-linux
  ```
- **[chrome-devtools](operations/chrome-devtools/SKILL.md)** - Browser automation, debugging, and performance analysis using Puppeteer CLI scripts. Use for automating browsers, taking screenshots, analyzing performance, monitoring network traffic, web scraping, form automation, and JavaScript debugging.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/operations/chrome-devtools
  ```
- **[deployment-procedures](operations/deployment-procedures/SKILL.md)** - Production deployment principles and decision-making. Safe deployment workflows, rollback strategies, and verification. Teaches thinking, not scripts.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/operations/deployment-procedures
  ```
- **[devops](operations/devops/SKILL.md)** - Deploy and manage cloud infrastructure on Cloudflare (Workers, R2, D1, KV, Pages, Durable Objects, Browser Rendering), Docker containers, and Google Cloud Platform (Compute Engine, GKE, Cloud Run, App Engine, Cloud Storage). Use when deploying serverless functions to the edge, configuring edge computing solutions, managing Docker containers and images, setting up CI/CD pipelines, optimizing cloud infrastructure costs, implementing global caching strategies, working with cloud databases, or building cloud-native applications.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/operations/devops
  ```
- **[mcp-builder](operations/mcp-builder/SKILL.md)** - Guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools. Use when building MCP servers to integrate external APIs or services, whether in Python (FastMCP) or Node/TypeScript (MCP SDK).

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/operations/mcp-builder
  ```
- **[mcp-management](operations/mcp-management/SKILL.md)** - Manage Model Context Protocol (MCP) servers - discover, analyze, and execute tools/prompts/resources from configured MCP servers. Use when working with MCP integrations, need to discover available MCP capabilities, filter MCP tools for specific tasks, execute MCP tools programmatically, access MCP prompts/resources, or implement MCP client functionality. Supports intelligent tool selection, multi-server management, and context-efficient capability discovery.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/operations/mcp-management
  ```
- **[powershell-windows](operations/powershell-windows/SKILL.md)** - PowerShell Windows patterns. Critical pitfalls, operator syntax, error handling.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/operations/powershell-windows
  ```
- **[server-management](operations/server-management/SKILL.md)** - Server management principles and decision-making. Process management, monitoring strategy, and scaling decisions. Teaches thinking, not commands.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/operations/server-management
  ```

### problem-solving

Debugging and reasoning techniques for root cause analysis, validation, inversion, scale tests, and stuck states.

- **[Collision-Zone Thinking](problem-solving/collision-zone-thinking/SKILL.md)** - Force unrelated concepts together to discover emergent properties - "What if we treated X like Y?

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/problem-solving/collision-zone-thinking
  ```
- **[Defense-in-Depth Validation](problem-solving/defense-in-depth/SKILL.md)** - Validate at every layer data passes through to make bugs impossible

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/problem-solving/defense-in-depth
  ```
- **[Inversion Exercise](problem-solving/inversion-exercise/SKILL.md)** - Flip core assumptions to reveal hidden constraints and alternative approaches - "what if the opposite were true?

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/problem-solving/inversion-exercise
  ```
- **[Meta-Pattern Recognition](problem-solving/meta-pattern-recognition/SKILL.md)** - Spot patterns appearing in 3+ domains to find universal principles

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/problem-solving/meta-pattern-recognition
  ```
- **[Root Cause Tracing](problem-solving/root-cause-tracing/SKILL.md)** - Systematically trace bugs backward through call stack to find original trigger

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/problem-solving/root-cause-tracing
  ```
- **[Scale Game](problem-solving/scale-game/SKILL.md)** - Test at extremes (1000x bigger/smaller, instant/year-long) to expose fundamental truths hidden at normal scales

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/problem-solving/scale-game
  ```
- **[sequential-thinking](problem-solving/sequential-thinking/SKILL.md)** - Use when complex problems require systematic step-by-step reasoning with ability to revise thoughts, branch into alternative approaches, or dynamically adjust scope. Ideal for multi-stage analysis, design planning, problem decomposition, or tasks with initially unclear scope.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/problem-solving/sequential-thinking
  ```
- **[Simplification Cascades](problem-solving/simplification-cascades/SKILL.md)** - Find one insight that eliminates multiple components - "if this is true, we don't need X, Y, or Z

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/problem-solving/simplification-cascades
  ```
- **[systematic-debugging](problem-solving/systematic-debugging/SKILL.md)** - Use when encountering any bug, test failure, or unexpected behavior, before proposing fixes

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/problem-solving/systematic-debugging
  ```
- **[When Stuck - Problem-Solving Dispatch](problem-solving/when-stuck/SKILL.md)** - Dispatch to the right problem-solving technique based on how you're stuck

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/problem-solving/when-stuck
  ```

### productivity

Agent workflow skills for planning, compact communication, reviews, worktrees, implementation plans, and completion discipline.

- **[brainstorming](productivity/brainstorming/SKILL.md)** - You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior. Explores user intent, requirements and design before implementation.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/productivity/brainstorming
  ```
- **[caveman](productivity/caveman/SKILL.md)** - Ultra-compressed communication mode. Cuts token usage ~75% by dropping filler, articles, and pleasantries while keeping full technical accuracy. Use when user says "caveman mode", "talk like caveman", "use caveman", "less tokens", "be brief", or invokes /caveman.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/productivity/caveman
  ```
- **[dispatching-parallel-agents](productivity/dispatching-parallel-agents/SKILL.md)** - Use when facing 2+ independent tasks that can be worked on without shared state or sequential dependencies

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/productivity/dispatching-parallel-agents
  ```
- **[executing-plans](productivity/executing-plans/SKILL.md)** - Use when you have a written implementation plan to execute in a separate session with review checkpoints

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/productivity/executing-plans
  ```
- **[finishing-a-development-branch](productivity/finishing-a-development-branch/SKILL.md)** - Use when implementation is complete, all tests pass, and you need to decide how to integrate the work - guides completion of development work by presenting structured options for merge, PR, or cleanup

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/productivity/finishing-a-development-branch
  ```
- **[grill-me](productivity/grill-me/SKILL.md)** - Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/productivity/grill-me
  ```
- **[grill-with-docs](productivity/grill-with-docs/SKILL.md)** - Grilling session that challenges your plan against the existing domain model, sharpens terminology, and updates documentation (CONTEXT.md, ADRs) inline as decisions crystallise. Use when user wants to stress-test a plan against their project's language and documented decisions.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/productivity/grill-with-docs
  ```
- **[parallel-agents](productivity/parallel-agents/SKILL.md)** - Multi-agent orchestration patterns. Use when multiple independent tasks can run with different domain expertise or when comprehensive analysis requires multiple perspectives.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/productivity/parallel-agents
  ```
- **[plan-writing](productivity/plan-writing/SKILL.md)** - Structured task planning with clear breakdowns, dependencies, and verification criteria. Use when implementing features, refactoring, or any multi-step work.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/productivity/plan-writing
  ```
- **[receiving-code-review](productivity/receiving-code-review/SKILL.md)** - Use when receiving code review feedback, before implementing suggestions, especially if feedback seems unclear or technically questionable - requires technical rigor and verification, not performative agreement or blind implementation

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/productivity/receiving-code-review
  ```
- **[requesting-code-review](productivity/requesting-code-review/SKILL.md)** - Use when completing tasks, implementing major features, or before merging to verify work meets requirements

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/productivity/requesting-code-review
  ```
- **[subagent-driven-development](productivity/subagent-driven-development/SKILL.md)** - Use when executing implementation plans with independent tasks in the current session

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/productivity/subagent-driven-development
  ```
- **[test-driven-development](productivity/test-driven-development/SKILL.md)** - Use when implementing any feature or bugfix, before writing implementation code

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/productivity/test-driven-development
  ```
- **[using-git-worktrees](productivity/using-git-worktrees/SKILL.md)** - Use when starting feature work that needs isolation from current workspace or before executing implementation plans - creates isolated git worktrees with smart directory selection and safety verification

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/productivity/using-git-worktrees
  ```
- **[using-superpowers](productivity/using-superpowers/SKILL.md)** - Use when starting any conversation - establishes how to find and use skills, requiring Skill tool invocation before ANY response including clarifying questions

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/productivity/using-superpowers
  ```
- **[verification-before-completion](productivity/verification-before-completion/SKILL.md)** - Use when about to claim work is complete, fixed, or passing, before committing or creating PRs - requires running verification commands and confirming output before making any success claims; evidence before assertions always

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/productivity/verification-before-completion
  ```
- **[writing-plans](productivity/writing-plans/SKILL.md)** - Use when you have a spec or requirements for a multi-step task, before touching code

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/productivity/writing-plans
  ```
- **[writing-skills](productivity/writing-skills/SKILL.md)** - Use when creating new skills, editing existing skills, or verifying skills work before deployment

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/productivity/writing-skills
  ```
- **[zoom-out](productivity/zoom-out/SKILL.md)** - Tell the agent to zoom out and give broader context or a higher-level perspective. Use when you're unfamiliar with a section of code or need to understand how it fits into the bigger picture.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/productivity/zoom-out
  ```

### security

Security testing and adversarial review skills.

- **[red-team-tactics](security/red-team-tactics/SKILL.md)** - Red team tactics principles based on MITRE ATT&CK. Attack phases, detection evasion, reporting.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/security/red-team-tactics
  ```

### writing-docs

Documentation, slides, PDFs, spreadsheets, templates, Mermaid, and structured document workflows.

- **[behavioral-modes](writing-docs/behavioral-modes/SKILL.md)** - AI operational modes (brainstorm, implement, debug, review, teach, ship, orchestrate). Use to adapt behavior based on task type.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/writing-docs/behavioral-modes
  ```
- **[doc](writing-docs/doc/SKILL.md)** - Use when the task involves reading, creating, or editing `.docx` documents, especially when formatting or layout fidelity matters; prefer `python-docx` plus the bundled `scripts/render_docx.py` for visual checks.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/writing-docs/doc
  ```
- **[documentation-templates](writing-docs/documentation-templates/SKILL.md)** - Documentation templates and structure guidelines. README, API docs, code comments, and AI-friendly documentation.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/writing-docs/documentation-templates
  ```
- **[docx](writing-docs/docx/SKILL.md)** - Comprehensive document creation, editing, and analysis with support for tracked changes, comments, formatting preservation, and text extraction. When Claude needs to work with professional documents (.docx files) for: (1) Creating new documents, (2) Modifying or editing content, (3) Working with tracked changes, (4) Adding comments, or any other document tasks

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/writing-docs/docx
  ```
- **[mermaidjs-v11](writing-docs/mermaidjs-v11/SKILL.md)** - Create diagrams and visualizations using Mermaid.js v11 syntax. Use when generating flowcharts, sequence diagrams, class diagrams, state diagrams, ER diagrams, Gantt charts, user journeys, timelines, architecture diagrams, or any of 24+ diagram types. Supports JavaScript API integration, CLI rendering to SVG/PNG/PDF, theming, configuration, and accessibility features. Essential for documentation, technical diagrams, project planning, system architecture, and visual communication.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/writing-docs/mermaidjs-v11
  ```
- **[pdf](writing-docs/pdf/SKILL.md)** - Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms. When Claude needs to fill in a PDF form or programmatically process, generate, or analyze PDF documents at scale.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/writing-docs/pdf
  ```
- **[pptx](writing-docs/pptx/SKILL.md)** - Presentation creation, editing, and analysis. When Claude needs to work with presentations (.pptx files) for: (1) Creating new presentations, (2) Modifying or editing content, (3) Working with layouts, (4) Adding comments or speaker notes, or any other presentation tasks

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/writing-docs/pptx
  ```
- **[slides](writing-docs/slides/SKILL.md)** - Create and edit presentation slide decks (`.pptx`) with PptxGenJS, bundled layout helpers, and render/validation utilities. Use when tasks involve building a new PowerPoint deck, recreating slides from screenshots/PDFs/reference decks, modifying slide content while preserving editable output, adding charts/diagrams/visuals, or diagnosing layout issues such as overflow, overlaps, and font substitution.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/writing-docs/slides
  ```
- **[templates](writing-docs/templates/SKILL.md)** - Project scaffolding templates for new applications. Use when creating new projects from scratch. Contains 12 templates for various tech stacks.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/writing-docs/templates
  ```
- **[template-skill](writing-docs/template-skill/SKILL.md)** - A template for creating new modular and scalable agent skills.

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/writing-docs/template-skill
  ```
- **[xlsx](writing-docs/xlsx/SKILL.md)** - Comprehensive spreadsheet creation, editing, and analysis with support for formulas, formatting, data analysis, and visualization. When Claude needs to work with spreadsheets (.xlsx, .xlsm, .csv, .tsv, etc) for: (1) Creating new spreadsheets with formulas and formatting, (2) Reading or analyzing data, (3) Modify existing spreadsheets while preserving formulas, (4) Data analysis and visualization in spreadsheets, or (5) Recalculating formulas

  ```bash
  npx skills@latest add VoDaiLocz/KILO-KIT/skills/writing-docs/xlsx
  ```
