import * as vscode from 'vscode';
import to from 'await-to-js';
import { WorkspaceStorage, WorkspaceStorageKeys } from '@/utils/workspace-storage';
import axios from 'axios';

export async function linkApiPort(workspaceStorage: WorkspaceStorage) {
  const port = await vscode.window.showInputBox({
    placeHolder: 'For example: 54323',
    validateInput: (port) => {
      if (isNaN(+port) || +port > 65535) {
        return 'Invalid port number. Cannot contain letters and the number must be less than 65535.';
      }
      return null;
    }
  });

  if (port) {
    const baseUrl = `http://localhost:${+port}`;
    const checkStatus = baseUrl + '/api/projects/default';
    const [error] = await to(axios.get(checkStatus));

    if (error) {
      vscode.window.showErrorMessage(`Could not connect to: ${checkStatus}`);
      return;
    }
    workspaceStorage.set(WorkspaceStorageKeys.BASE_URL, baseUrl);
    vscode.commands.executeCommand('setContext', 'workspaceState.isConnected', true);
    return;
  } else {
    vscode.window.showErrorMessage('Invalid port number');
    return;
  }
}
