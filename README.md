# OpenClaw Code

**Project:** `openclaw-code` – a CLI tool for **OpenClaw** built with **Bun**.

---

## Overview
This repository implements a multi‑mode interactive CLI called **`openclaw-code`**.  
It provides four primary operation modes:

| Mode | Description |
|------|-------------|
| **Client Mode** | Simple command‑line interface for running tasks directly. |
| **Agent Mode** | Invokes an LLM agent (`ToolLoopAgent`) to perform a concrete task, collects tool calls, and applies approved mutations. |
| **Plan Mode** | Takes a user goal, generates a step‑by‑step plan, lets the user pick steps, then executes them one by one. |
| **Ask Mode** | Answers a user question, optionally saves the result as a Markdown file. |
| **Telegram Mode** | Connects to a Telegram bot (using `TELEGRAM_BOT_TOKEN` & `TELEGRAM_OWNER_ID`) and sends welcome messages. |

The core entry point is `index.ts`. Running it with `bun index.ts` launches the program which presents a banner and asks the user to choose a mode.

---

## Project Structure
```
.
├── .gitignore
├── .env               # environment variables (API keys, tokens)
├── README.md          # this file
├── ai/
│   ├── ai.config.ts
│   └── index.ts
├── landing-page/     # static landing page (HTML + CSS)
│   ├── index.html
│   └── styles.css
├── modes/
│   ├── cli.ts
│   ├── agent/
│   │   ├── action-tracker.ts
│   │   ├── agent-tools.ts
│   │   ├── approval.ts
│   │   ├── diff-view.ts
│   │   ├── toolExecutor.ts
│   │   ├── ostrastrator.ts
│   │   ├── types.ts
│   │   └── ... (tool definitions)
│   ├── ask/
│   │   └── orchestrator.ts
│   ├── plan/
│   │   ├── Planner.ts
│   │   ├── selection.ts
│   │   ├── web-tools.ts
│   │   └── orchestrator.ts
│   ├── telegram/
│   │   ├── auth.ts
│   │   ├── constants.ts
│   │   ├── handlers.ts
│   │   ├── index.ts
│   │   ├── plan-session.ts
│   │   ├── text.ts
│   │   └── ...
│   └── telegram/agent-run.ts
├── tui/
│   ├── terminal-md.ts
│   └── wakeup.ts
├── index.ts           # main CLI entry
├── tsconfig.json
└── package.json
```

### Key Directories
- **`ai/`** – AI SDK provider integration (`@openrouter/ai-sdk-provider`), model retrieval via `getAgentModel()`.
- **`modes/agent/`**, **`modes/ask/`**, **`modes/plan/`**, **`modes/telegram/`** – orchestration logic for each mode.
- **`tui/`** – Terminal UI helpers (`wakeup.ts`, `terminal-md.ts`).
- **`landing-page/`** – A minimal two‑file static landing page showcasing Nova branding.

---

## Core Modules & Functions

### `index.ts`
```ts
#!/usr/bin/env bun
import { Command } from "commander";
import { wakeup } from "./tui/wakeup";

const program = new Command();
program
  .name("openclaw-code")
  .description("A CLI tool for OpenClaw")
  .version("0.0.1");

program.command("wakeup")
  .description("show the banner and pick client or telegram mode")
  .action(async () => await wakeup());

await program.parseAsync(process.argv);
```

### `ai/ai.config.ts`
```ts
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import dotenv from 'dotenv';

export function getAgentModel(){
  dotenv.config();
  const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
  const model = process.env.OPENROUTER_DEFAULT_MODEL!;
  return openrouter.chat(model);
}
```

### `modes/cli.ts`
```ts
import chalk from "chalk";
import figlet from "figlet";
import { select, isCancel } from "@clack/prompts";
import { runAgentMode } from "./agent/orschestrator";
import { runAskMode } from "./ask/orchestrator";
import { runPlanMode } from "./plan/orchestrator";

export async function runClientMode() {
  while (true) {
    const options = await select({
      message: "Choose an option",
      options: [
        { value: "Agent", label: "Agent Mode" },
        { value: "plan", label: "Plan Mode  " },
        { value: "ask", label: "Ask Mode" },
        { value: "back", label: "back to main menu" },
      ],
    });
    if (isCancel(options) || options === "back") return;
    switch (options) {
      case "Agent": await runAgentMode(); break;
      case "plan": await runPlanMode(); break;
      case "ask": await runAskMode(); break;
    }
  }
}
```

### `modes/agent/orschestrator.ts`
Handles **Agent Mode**: prompts for goal, builds `ActionTracker`, `ToolExecutor`, `ToolLoopAgent`, runs up to 40 steps, then approves mutations.

### `modes/ask/orchestrator.ts`
Handles **Ask Mode**: reads a question, gets answer, optionally writes to `.md` file.

### `modes/plan/orchestrator.ts`
Handles **Plan Mode**: generates a plan from goal, selects steps, executes sequentially.

### `modes/telegram/index.ts`
Connects to a Telegram bot via `Telegraf`, registers handlers, sends a welcome message.

### `tui/wakeup.ts`
Displays ASCII banner ("OpenClaw") and presents mode selection options.

---

## Staged Mutations Policy
All file changes are **staged until explicit approval** (via `modify_file`, `create_file`, etc.). This ensures every mutation is reviewed before being applied.

---

## Quick Start

1. **Install dependencies**
   ```bash
   bun install
   ```
2. **Set environment variables** (in `.env`)
   ```env
   OPENROUTER_API_KEY=...
   TELEGRAM_BOT_TOKEN=...
   TELEGRAM_OWNER_ID=...
   ```
3. **Run the CLI**
   ```bash
   bun index.ts wakeup
   ```
   You'll see the banner and can pick *Client*, *Agent*, *Plan*, *Ask*, or *Telegram* mode.

4. **Example commands**
   - `bun index.ts client` – start client mode loop.
   - `bun index.ts agent` – interactively define a goal for the agent.
   - `bun index.ts plan` – give a goal and view generated plan.
   - `bun index.ts ask "What is X?"` – ask a question and save answer.

---

## Landing Page
A lightweight static site under `landing-page/`:
- `index.html` – hero section with navigation.
- `styles.css` – gradient background, feature cards, responsive grid.

---

## Contributing / Future Work
- Add more sophisticated error handling.
- Extend Telegram bot functionality.
- Integrate additional AI models via `defaultAgentConfig`.
- Build CI/CD pipelines.

---

*All mutations are staged until you approve them. Edit this file when ready.*
