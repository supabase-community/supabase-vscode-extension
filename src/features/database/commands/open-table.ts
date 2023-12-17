import { SupabaseApi } from '@/features/database/classes/supabase-api';
import { TablesElement, TreeElement } from '@/features/database/types/index.ts';
import to from 'await-to-js';
import * as vscode from 'vscode';

export async function openTable(supabase: SupabaseApi, element: TreeElement) {
  const table = element.label;
  const type = element.contextValue === TablesElement.PRIVATE ? 'private' : 'public';
  const query = `select * from ${type}.${table} limit 10 offset 0`;

  const [err, res] = await to(supabase.executeQuery(query));
  console.log('res', res);
  console.log('err', err);

  if (err !== null || !res.data) {
    console.error(err);
    vscode.window.showErrorMessage(`Cannot open ${table} table: ${err}`);
    return;
  }

  const panel = vscode.window.createWebviewPanel('webview.table', `${table} table`, vscode.ViewColumn.One, {
    enableScripts: true,
    portMapping: [{ webviewPort: 54323, extensionHostPort: 54323 }]
  });

  panel.webview.html = getWebviewContent(res.data);
}

function getWebviewContent(data: Record<string, string>[]): string {
  const tableRows = data
    .map((item) => {
      const tableCells = Object.values(item)
        .map((value) => `<td>${value || 'N/A'}</td>`)
        .join('');
      return `<tr>${tableCells}</tr>`;
    })
    .join('');

  const tableHeaders = Object.keys(data[0] || {})
    .map((header) => `<th>${header}</th>`)
    .join('');

  if (data.length > 0) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Tables</title>
        <meta http-equiv="Content-Security-Policy" content="default-src *; img-src http: https: data: *;">
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> 
    </head>
    <body>
        <table class="w3-small" border="1">
            <thead>
                <tr>${tableHeaders}</tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    </body>
    </html>
  `;
  }
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Tables</title>
        <meta http-equiv="Content-Security-Policy" content="default-src *; img-src http: https: data: *;">
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> 
    </head>
    <body style="display:flex;justify-items:center;align-items:center;height:100vh; width:100vh">
        <h5>Empty table</h5>
    </body>
    </html>
  `;
}
