import * as vscode from 'vscode';
import to from 'await-to-js';
import { WorkspaceStorage, WorkspaceStorageKeys } from '@/utils/workspace-storage';
import axios from 'axios';

export async function createNewMigration(workspaceStorage: WorkspaceStorage) {
  const name = await vscode.window.showInputBox({
    placeHolder: 'For example: schema_test'
  });

  // const sanitize = transformString(name);

  if (name) {
    const baseUrl = `http://localhost:${+port}`;
    const checkStatus = baseUrl + '/api/projects/default';
    const [error] = await to(axios.get(checkStatus));

    if (error) {
      vscode.window.showErrorMessage(
        `Could not connect to: ${checkStatus}. Make sure your instance is up and running.`
      );
      return;
    }
    workspaceStorage.set(WorkspaceStorageKeys.BASE_URL, baseUrl);
    vscode.commands.executeCommand('setContext', 'workspaceState.isConnected', true);
    return;
  } else {
    vscode.window.showErrorMessage('Invalid migration name');
    return;
  }
}
