import * as vscode from 'vscode';
import { WorkspaceStorage } from './utils/workspace-storage';
import { ConnectProvider } from '@/features/connect/provider/connect-provider';
import { DatabaseProvider } from '@/features/database/provider/database-provider';
import { SupabaseApi } from '@/features/database/classes/supabase-api';
import { registerCommands } from '@/register';
import { createChatRequestHandler } from './utils/chatRequestHandler';

export function activate(context: vscode.ExtensionContext) {
  const workspaceStorage = new WorkspaceStorage(context);
  const supabase = new SupabaseApi();
  const connectSupabaseProvider = new ConnectProvider();
  const databaseProvider = new DatabaseProvider(context, supabase);

  const connectSupabaseView = vscode.window.createTreeView('connectSupabase', {
    treeDataProvider: connectSupabaseProvider
  });
  const databaseView = vscode.window.createTreeView('database', {
    treeDataProvider: databaseProvider
  });
  registerCommands({
    databaseProvider,
    workspaceStorage,
    supabase
  });

  // Register chat participant only if the API is available (VS Code with Copilot)
  let participant: vscode.ChatParticipant | undefined;
  try {
    if (vscode.chat && vscode.chat.createChatParticipant) {
      participant = vscode.chat.createChatParticipant('supabase.clippy', createChatRequestHandler(supabase));
    }
  } catch (error) {
    console.log('Chat participant not available, continuing without chat features');
  }

  // Add subscriptions conditionally
  const subscriptions: vscode.Disposable[] = [connectSupabaseView, databaseView];
  if (participant) {
    subscriptions.push(participant);
  }
  context.subscriptions.push(...subscriptions);
}
