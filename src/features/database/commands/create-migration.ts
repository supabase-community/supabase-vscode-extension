import * as vscode from 'vscode';
import to from 'await-to-js';
import { transformString } from '@/utils/transform-string';
import { exec, execShell } from '@/utils/exec-shell';
import * as fs from 'fs';

export async function createNewMigration() {
  const input = await vscode.window.showInputBox({
    placeHolder: 'For example: migration_test'
  });
  if (input) {
    const name = transformString(input);

    const path = vscode.workspace?.workspaceFolders ? vscode.workspace?.workspaceFolders[0].uri.path : null;
    const isValidPath = !!path && !!fs.lstatSync(path).isDirectory();

    if (isValidPath === true) {
      const cmd = `cd ${path} && npx supabase migration new ${name}`;

      const [err, data] = await to(exec(cmd));
      if (data?.stderr || err) {
        vscode.window.showErrorMessage(`Cannot create migration: ${data?.stderr} ${err}`);
      }
    } else {
      vscode.window.showErrorMessage(`Cannot create migration: invalid workspace path`);
    }
  }
}

export async function dbReset() {
  const path = vscode.workspace?.workspaceFolders ? vscode.workspace?.workspaceFolders[0].uri.path : null;
  const isValidPath = !!path && !!fs.lstatSync(path).isDirectory();

  if (isValidPath === true) {
    const cmd = `cd ${path} && npx supabase db reset`;

    const [err, data] = await to(exec(cmd));
    if (data?.stderr || err) {
      vscode.window.showErrorMessage(`Cannot reset local db: ${data?.stderr} ${err}`);
    }
  } else {
    vscode.window.showErrorMessage(`Cannot reset local db: invalid workspace path`);
  }
}
