import chalk from "chalk";
import { isCancel,text } from "@clack/prompts";
import { defaultAgentConfig } from "./types";
import { ActionTracker } from "./action-tracker";
import { ToolExecutor } from "./toolExecutor";
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
   const executor = new ToolExecutor(config,actiontracker);
} 
