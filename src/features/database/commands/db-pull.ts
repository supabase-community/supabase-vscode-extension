import * as vscode from 'vscode';
import to from 'await-to-js';
import { exec } from '@/utils/exec-shell';
import * as fs from 'fs';

/**
 * @deprecated
 */
export async function dbPull() {
  const path = vscode.workspace?.workspaceFolders ? vscode.workspace?.workspaceFolders[0].uri.path : null;
  const isValidPath = !!path && !!fs.lstatSync(path).isDirectory();

  if (isValidPath === true) {
    const cmd = `cd ${path} && npx supabase db pull`;

    const [err, data] = await to(exec(cmd));
    if (data?.stderr || err) {
      vscode.window.showErrorMessage(`Cannot run supabase db pull: ${err}`);
    }
  } else {
    vscode.window.showErrorMessage(`Cannot run supabase db pull: invalid workspace path`);
  }
}
