import chalk from "chalk";
import { isCancel,text } from "@clack/prompts";
import { defaultAgentConfig } from "./types";
import { ActionTracker } from "./action-tracker";
import { ToolExecutor } from "./toolExecutor";
import { createAgentTools } from "./agent-tools";
import { stepCountIs, ToolLoopAgent } from "ai";
import { getAgentModel } from "../../ai";
import { renderTerminalMarkdown } from "../../tui/terminal-md";
import { runApprovalFlow } from "./approval";

export async function runAgentMode(){
   console.log(chalk.bold("Running in Agent Mode..."));

   const goal=await text({
    message:"What is your goal?",
    placeholder:"concrete task for this codebase."
   });


   if(isCancel(goal) || !goal){
    console.log(chalk.red("Agent mode cancelled."));
    return;
   }

   const config=defaultAgentConfig();
   const actiontracker =new ActionTracker();
   const executor = new ToolExecutor(actiontracker,config);
   const tools = createAgentTools(executor);

  const agent = new ToolLoopAgent({
    model: getAgentModel(),
    stopWhen: stepCountIs(40),
    instructions: [
      `Workspace root: ${config.codebasePath}`,
      "All mutations are staged until approval.",
    ].join("\n"),
    tools,
  });

  const result = await agent.generate({
    prompt: goal.trim(),
    onStepFinish: ({ toolCalls }) => {
      for (const tc of toolCalls) {
        const preview = JSON.stringify(tc.input).slice(0, 160);
        console.log(
          chalk.green("  ✓"),
          chalk.bold(String(tc.toolName)),
          chalk.dim(preview + (preview.length >= 160 ? "..." : "")),
        );
      }
    },
  });

   if (result.text?.trim()) console.log(renderTerminalMarkdown(result.text));

  const ok = await runApprovalFlow(actiontracker);
  if (!ok) return executor.clearStaging();

  const { errors } = executor.applyApprovedFromTracker();

  if (errors.length) {
    console.log(chalk.red("\nSome operations reported errors:\n"));
    for (const e of errors) console.log(chalk.red(`  • ${e}`));
  }
  else{
   console.log(chalk.green('\n✓ Applied.\n'));
  }

  executor.clearStaging()
}
