import * as vscode from 'vscode';
import { SupabaseApi } from '@/features/database/classes/supabase-api';

export async function linkApiPort() {
  const supabase = new SupabaseApi();
  const { data, error } = await supabase.checkStatus();

  if (error) {
    vscode.window.showErrorMessage(
      `Could not connect to local Supabase project. Make sure you've run 'supabase start'!`
    );
    return;
  }

  vscode.commands.executeCommand('setContext', 'workspaceState.isConnected', true);
  return;
}
