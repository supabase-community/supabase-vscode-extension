import { Commands } from '@/constants';
import { executeCommand } from '@/utils/exec-command';
import * as vscode from 'vscode';

export async function dbPush() {
  const items: vscode.QuickPickItem[] = [
    { label: 'Dry', description: 'Dry run migration.' },
    { label: 'Local', description: 'Apply migration to local database.' },
    {
      label: 'Linked',
      description: 'Apply migration to linked database.'
    }
  ];
  const result = await vscode.window.showQuickPick(items);

  let arg;
  if (result?.label === 'Dry') {
    arg = '--dry-run';
  }
  if (result?.label === 'Local') {
    arg = '--local';
  }
  if (result?.label === 'Linked') {
    arg = '--linked';
  }

  const cmd = `${Commands.DB_PUSH} ${arg}`;
  executeCommand(cmd);
}
