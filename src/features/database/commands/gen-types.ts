import { Commands } from '@/constants';
import { executeCommand } from '@/utils/exec-command';
import * as vscode from 'vscode';

export async function genTypes() {
  const items: vscode.QuickPickItem[] = [
    { label: 'Local', description: 'Generate types from the local dev database. ' },
    {
      label: 'Linked',
      description: 'Generate types from the linked project.'
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

  const cmd = `${Commands.GEN_TYPES} ${arg}`;
  executeCommand(cmd);
}
