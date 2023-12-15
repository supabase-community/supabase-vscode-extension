import { Commands } from '@/constants';
import { disconnect } from '@/features/connect/commands/disconnect';
import { linkApiPort } from '@/features/connect/commands/link-api-port';
import { createNewMigration, genTypes } from '@/features/database/commands';
import { DatabaseProvider } from '@/features/database/provider/database-provider';
import { executeCommand } from '@/utils/exec-command';
import { WorkspaceStorage } from '@/utils/workspace-storage';
import * as vscode from 'vscode';

interface Props {
  databaseProvider: DatabaseProvider;
  workspaceStorage: WorkspaceStorage;
}

export function registerCommands({ databaseProvider, workspaceStorage }: Props) {
  vscode.commands.registerCommand('connectSupabase.link_api_port', async () => {
    linkApiPort(workspaceStorage);
    databaseProvider.refresh();
  });
  vscode.commands.registerCommand('databaseProvider.refresh', () => databaseProvider.refresh());
  vscode.commands.registerCommand('databaseProvider.disconnect', async () => disconnect(workspaceStorage));
  vscode.commands.registerCommand('databaseProvider.create_migration', async () => createNewMigration());
  vscode.commands.registerCommand('databaseProvider.create_migration_cmd', async () => createNewMigration());
  vscode.commands.registerCommand('databaseProvider.db_reset', async () => executeCommand(Commands.DB_RESET));
  vscode.commands.registerCommand('databaseProvider.db_pull', async () => executeCommand(Commands.DB_PULL));
  vscode.commands.registerCommand('databaseProvider.db_push', async () => executeCommand(Commands.DB_PUSH));
  vscode.commands.registerCommand('databaseProvider.gen_types', async () => genTypes());
}
