import chalk from "chalk";
import figlet from "figlet";
import { select, isCancel } from "@clack/prompts";

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
   
    if (isCancel(options) || options === "back") {
      console.log(chalk.dim("Returning to main menu..."));
      return; // Exit the function to go back to the main menu
    }

    if (options === "Agent") {
      console.log(chalk.green("Agent Mode selected!"));
      // Here you can add the code to start the Agent mode
    } else if (options === "plan") {
      console.log(chalk.green("Plan Mode selected!"));
      // Here you can add the code to start the Plan mode
    } else if (options === "ask") {
      console.log(chalk.green("Ask Mode selected!"));
      // Here you can add the code to start the Ask mode
    }
    
    if (options !== "Agent" && options !== "plan" && options !== "ask") {
      console.log(chalk.red("Invalid option selected. Please try again."));
    }
  }
}
