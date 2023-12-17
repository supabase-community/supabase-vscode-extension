import { Commands } from '@/constants';
import { disconnect } from '@/features/connect/commands/disconnect';
import { linkApiPort } from '@/features/connect/commands/link-api-port';
import { SupabaseApi } from '@/features/database/classes/supabase-api';
import { createNewMigration, dbPull, dbPush, genTypes, openDbFunction, openTable } from '@/features/database/commands';
import { DatabaseProvider } from '@/features/database/provider/database-provider';
import { TreeElement } from '@/features/database/types/index.ts';
import { executeCommand } from '@/utils/exec-command';
import { WorkspaceStorage } from '@/utils/workspace-storage';
import * as vscode from 'vscode';

interface Props {
  databaseProvider: DatabaseProvider;
  workspaceStorage: WorkspaceStorage;
  supabase: SupabaseApi;
}

export function registerCommands({ databaseProvider, workspaceStorage, supabase }: Props) {
  vscode.commands.registerCommand('connectSupabase.link_api_port', async () => {
    linkApiPort(workspaceStorage);
    databaseProvider.refresh();
  });
  vscode.commands.registerCommand('databaseProvider.refresh', () => databaseProvider.refresh());
  vscode.commands.registerCommand('databaseProvider.disconnect', async () => disconnect(workspaceStorage));
  vscode.commands.registerCommand('databaseProvider.create_migration', async () => createNewMigration());
  vscode.commands.registerCommand('databaseProvider.create_migration_cmd', async () => createNewMigration());
  vscode.commands.registerCommand('databaseProvider.db_reset', async () => executeCommand(Commands.DB_RESET));
  vscode.commands.registerCommand('databaseProvider.db_pull', async () => dbPull());
  vscode.commands.registerCommand('databaseProvider.db_push', async () => dbPush());
  vscode.commands.registerCommand('databaseProvider.gen_types', async () => genTypes());
  vscode.commands.registerCommand('databaseProvider.open_table', async (element: TreeElement) =>
    openTable(supabase, element)
  );
  vscode.commands.registerCommand('databaseProvider.open_db_function', async (element: TreeElement) =>
    openDbFunction(supabase, element)
  );
}
