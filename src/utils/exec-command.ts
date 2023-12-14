import * as fs from 'fs';
import * as vscode from 'vscode';

export function executeCommand(cmd: string) {
  const path = vscode.workspace?.workspaceFolders ? vscode.workspace?.workspaceFolders[0].uri.path : null;
  const isValidPath = !!path && !!fs.lstatSync(path).isDirectory();

  if (isValidPath === true && path !== null) {
    const terminal = vscode.window.activeTerminal;
    if (!terminal) {
      const newTerminal = vscode.window.createTerminal({ cwd: path });
      newTerminal.show();
      newTerminal.sendText(cmd);
    } else {
      terminal.show();
      terminal.sendText(`cd ${path} && ${cmd}`);
    }
  } else {
    vscode.window.showErrorMessage(`Cannot execute command: invalid workspace path`);
  }
}
