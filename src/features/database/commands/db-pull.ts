import { Commands } from '@/constants';
import { executeCommand } from '@/utils/exec-command';
import * as vscode from 'vscode';

export async function dbPull() {
  const items: vscode.QuickPickItem[] = [
    { label: 'Local', description: 'Pulls from the local database.' },
    {
      label: 'Linked',
      description: 'Pulls from the linked project. '
    }
  ];
  const result = await vscode.window.showQuickPick(items);

  let arg;
  if (result?.label === 'Local') {
    arg = '--local';
  }
  if (result?.label === 'Linked') {
    arg = '--linked';
  }

  const cmd = `${Commands.DB_PULL} ${arg}`;
  executeCommand(cmd);
}
