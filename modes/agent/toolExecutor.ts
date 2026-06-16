import fs from 'node:fs';
import path from 'node:path';
import {homedir} from 'node:os';
import {spawnSync} from 'node:child_process';
import type {ActionLog,AgentConfig} from "./types"
import {ActionTracker} from "./action-tracker"

const TEXT_EXT = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.json',
  '.md',
  '.mdx',
  '.css',
  '.html',
  '.yml',
  '.yaml',
  '.toml',
  '.txt',
  ''
]);

function isProbablyTextFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return TEXT_EXT.has(ext) || ext === ''; // If no extension, assume it's a text file
}
export class ToolExecutor {
  private overlay=new Map<string,string>();
  private deleted=new Set<string>();
  private readonly norm=(rel:string)=>path.posix.normalize(rel.split(path.sep).join("/")).replace(/^\.\//,"");

  constructor(private readonly config: AgentConfig,private readonly actionTracker: any) {
   
  }
}
