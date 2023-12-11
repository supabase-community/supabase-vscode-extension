import 'module-alias/register';
import * as vscode from 'vscode';
import { WorkspaceStorage, WorkspaceStorageKeys } from './utils/workspace-storage';
import { linkApiPort } from '@/features/connect/commands/link-api-port';
import { disconnect } from '@/features/connect/commands/disconnect';
import { ConnectProvider } from '@/features/connect/provider/connect-provider';
import { DatabaseProvider } from '@/features/database/provider/database-provider';
import { SupabaseApi } from '@/features/database/classes/supabase-api';
import { createNewMigration } from '@/features/database/commands';

export function activate(context: vscode.ExtensionContext) {
  const workspaceStorage = new WorkspaceStorage(context);
  const supabase = new SupabaseApi(workspaceStorage);

  const connectSupabaseProvider = new ConnectProvider();
  const databaseProvider = new DatabaseProvider(context, supabase);

  const connectSupabaseView = vscode.window.createTreeView('connectSupabase', {
    treeDataProvider: connectSupabaseProvider
  });
  const databaseView = vscode.window.createTreeView('database', {
    treeDataProvider: databaseProvider
  });

  vscode.commands.registerCommand('connectSupabase.linkApiPort', async () => {
    linkApiPort(workspaceStorage);
    databaseProvider.refresh();
  });
  vscode.commands.registerCommand('databaseProvider.refresh', () => databaseProvider.refresh());
  vscode.commands.registerCommand('databaseProvider.disconnect', async () => disconnect(workspaceStorage));
  vscode.commands.registerCommand('databaseProvider.create-migration', async () => createNewMigration(supabase));

  context.subscriptions.push(connectSupabaseView, databaseView);
}
