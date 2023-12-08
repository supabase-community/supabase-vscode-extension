import * as vscode from 'vscode';
import { WorkspaceStorage, WorkspaceStorageKeys } from '@/utils/workspace-storage';

export async function disconnect(workspaceStorage: WorkspaceStorage) {
  workspaceStorage.delete(WorkspaceStorageKeys.BASE_URL);
  vscode.commands.executeCommand('setContext', 'workspaceState.isConnected', false);
}
