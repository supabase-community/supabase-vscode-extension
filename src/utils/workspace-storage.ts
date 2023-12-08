import * as vscode from "vscode";

export class WorkspaceStorage {
  private workspaceState: vscode.Memento;

  constructor(context: vscode.ExtensionContext) {
    this.workspaceState = context.workspaceState;
  }

  public get<T>(key: string): T | undefined {
    return this.workspaceState.get<T>(key);
  }

  public set<T>(key: string, value: T) {
    this.workspaceState.update(key, value);
  }

  public delete(key: string): Thenable<void> {
    return this.workspaceState.update(key, undefined);
  }
}

export enum WorkspaceStorageKeys {
  BASE_URL = "base_url",
}
