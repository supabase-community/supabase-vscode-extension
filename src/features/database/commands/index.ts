import * as vscode from 'vscode';
import to from 'await-to-js';
import { WorkspaceStorage, WorkspaceStorageKeys } from '@/utils/workspace-storage';
import axios from 'axios';
import { transformString } from '@/utils/transform-string';
import { SupabaseApi } from '@/features/database/classes/supabase-api';
import { execShell } from '@/utils/exec-shell';
import * as cp from 'child_process';

export async function createNewMigration(supabase: SupabaseApi) {
  const name = await vscode.window.showInputBox({
    placeHolder: 'For example: migration_test'
  });
  if (name) {
    const sanitize = transformString(name);
    console.log(sanitize);
    const asdf = await execShell('pwd');
    console.log('asdf', asdf);

    // console.log('vscode', vscode.workspace.workspaceFolders[0].uri.path);

    cp.exec('ls', (err, stdout, stderr) => {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (err) {
        console.log('error: ' + err);
      }
    });
  }
}
