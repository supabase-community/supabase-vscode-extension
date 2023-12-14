import * as vscode from 'vscode';
import to from 'await-to-js';
import { transformString } from '@/utils/transform-string';
import { exec, execShell } from '@/utils/exec-shell';
import * as fs from 'fs';
import { executeCommand } from '@/utils/exec-command';
import { Commands } from '@/constants';

export async function createNewMigration() {
  const input = await vscode.window.showInputBox({
    placeHolder: 'For example: migration_test'
  });
  if (input) {
    const name = transformString(input);
    const cmd = `${Commands.NEW_MIGRATION} ${name}`;
    executeCommand(cmd);
  }
}
