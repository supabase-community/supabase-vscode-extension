import * as vscode from 'vscode';

type TreeElement = {
  id: string;
  parentId?: string;
  label?: string;
  description?: string;
  contextValue?: string;
  command?: vscode.Command;
  collapsibleState?: vscode.TreeItemCollapsibleState;
};

export class ConnectProvider implements vscode.TreeDataProvider<TreeElement> {
  private _onDidChangeTreeData: vscode.EventEmitter<TreeElement | undefined> = new vscode.EventEmitter<
    TreeElement | undefined
  >();
  readonly onDidChangeTreeData: vscode.Event<TreeElement | undefined> = this._onDidChangeTreeData.event;

  constructor() {}
  getChildren(element?: TreeElement | undefined): vscode.ProviderResult<TreeElement[]> {
    return [];
  }
  getTreeItem(element: TreeElement): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return {};
  }
  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }
}
