import {select,isCancel} from "@clack/prompts"; //used for user input
import chalk from "chalk";// used for colored text output
import figlet from "figlet";//used for ASCII art text like big letters in our case 
import { runClientMode } from "../modes/cli";//importing the function to run client 

const Banner_font="Ansi Shadow";//font for the banner text
const shadow=chalk.hex("#1b1a19");//color for the banner text
const face=chalk.hex("#d9e4dd").bold;//color for the face text

function printBannerWithShadow(ascii: string) {
  const bannerLines = ascii.replace(/\s+$/, '').split('\n');
  const maxLen = Math.max(...bannerLines.map((l) => l.length), 0);
  const rowWidth = maxLen + 2;

  for (const line of bannerLines) {
    console.log(shadow((' ' + line).padEnd(rowWidth)));
  }

  process.stdout.write(`\x1b[${bannerLines.length}A`);

  for (const line of bannerLines) {
    console.log(face(line.padEnd(rowWidth)));
  }

  console.log();
}

export async function wakeup(){
  let ascii:string;
  try {
    ascii = figlet.textSync("OpenClaw", { font: Banner_font });
  } catch (err) {
    console.error("Error generating ASCII art:", err);
    ascii = "OpenClaw"; // Fallback to plain text if figlet fails
  }
  printBannerWithShadow(ascii);
  
  const options =await select({
    message:"Choose your mode",
    options:[
      {value:"client",label:"Client Mode"},
      {value:"telegram",label:"Telegram Mode"},
      {value:"exit",label:"Exit"},
    ],
  });

  if(isCancel(options || options === "exit")){ //what this function does is to check if the user has cancelled the selection process, if they have it will print a message and exit the program
    console.log(chalk.dim("Operation cancelled. Exiting..."));
    process.exit(0);
  } 

  if(options==="client"){
    await runClientMode();
    console.log(chalk.green("Client Mode selected!"));
    // Here you can add the code to start the client mode
  } else if(options==="telegram"){
    console.log(chalk.green("Telegram Mode selected!"));
    // Here you can add the code to start the telegram mode
  }else if(options==="exit"){
    console.log(chalk.dim("Exiting..."));
    process.exit(0);
  }

}