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
  .action(
    async() => {
      await wakeup();
  });


  await program.parseAsync(process.argv);

