import { SupabaseApi } from '@/features/database/classes/supabase-api';
import { TreeElement } from '@/features/database/types/index.ts';
import * as vscode from 'vscode';

export async function openDbFunction(supabase: SupabaseApi, element: TreeElement) {
  const dbFunc = (await supabase.getDatabaseFunctions()).find((fn) => fn.id === parseInt(element.id));

  if (!dbFunc || !dbFunc.complete_statement) {
    vscode.window.showErrorMessage(`Cannot open db function`);
    return;
  }

  const panel = vscode.window.createWebviewPanel('webview.db_function', `${dbFunc?.name}`, vscode.ViewColumn.One, {
    enableScripts: true,
    portMapping: [{ webviewPort: 54323, extensionHostPort: 54323 }]
  });
  panel.webview.html = getWebviewContent(dbFunc.complete_statement);
}

function getWebviewContent(statement: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Tables</title>
        <meta http-equiv="Content-Security-Policy" content="default-src *; img-src http: https: data: *;">
    </head>
    <body style="height:100vh;width:100vh;">
    <textarea style="height:100vh;width:100vh;background:#3c3c3c;color:#d4d4d4" readonly>
    ${statement}
    </textarea>
    </body>
    </html>
  `;
}
