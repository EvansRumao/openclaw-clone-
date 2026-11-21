
import { Telegraf } from "telegraf";
import chalk from "chalk";
import { WELCOME } from "./constants";
import { registerHandlers } from "./handlers";

export async function runTelegramMode() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const ownerId = Number(process.env.TELEGRAM_OWNER_ID);

  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is missing in .env");
  }

  if (!Number.isSafeInteger(ownerId) || ownerId <= 0) {
    throw new Error("Invalid TELEGRAM_OWNER_ID in .env");
  }

  const bot = new Telegraf(token);

  registerHandlers(bot);

  // Verify bot credentials
  const me = await bot.telegram.getMe();
  console.log(chalk.green(`Connected to @${me.username}`));

  // Launch bot before sending messages
  await bot.launch();

  console.log(chalk.green("Telegram bot is running."));

  try {
    await bot.telegram.sendMessage(
      ownerId,
      WELCOME,
      { parse_mode: "Markdown" }
    );

    console.log(chalk.green("Sent welcome message to Telegram.\n"));
  } catch (error) {
    console.error("Failed to send welcome message:", error);
  }

  await new Promise<void>((resolve) => {
    const stop = () => {
      bot.stop("SIGINT");
      resolve();
    };

    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
  });
}
