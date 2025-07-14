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

  // Check if GitHub Copilot Chat is available before registering chat participant
  const copilotChatExtension = vscode.extensions.getExtension('github.copilot-chat');
  
  if (copilotChatExtension) {
    // Only register chat participant if Copilot Chat is available
    try {
      const participant = vscode.chat.createChatParticipant('supabase.clippy', createChatRequestHandler(supabase));
      context.subscriptions.push(participant);
    } catch (error) {
      console.log('Supabase: Chat features unavailable - GitHub Copilot Chat may not be active', error);
    }
  } else {
    console.log('Supabase: Chat features disabled - GitHub Copilot Chat extension not found');
  }

  context.subscriptions.push(connectSupabaseView, databaseView);
}
