import { Commands } from '@/constants';
import { executeCommand } from '@/utils/exec-command';
import { SupabaseApi } from '@/features/database/classes/supabase-api';
import * as vscode from 'vscode';
import * as path from 'path';
import { extractCode } from '@/utils/formatSql';

interface ICatChatResult extends vscode.ChatResult {
  metadata: {
    command: string;
  };
}

const MODEL_SELECTOR: vscode.LanguageModelChatSelector = { vendor: 'copilot', family: 'gpt-3.5-turbo' };

export const createChatRequestHandler = (supabase: SupabaseApi): vscode.ChatRequestHandler => {
  const handler: vscode.ChatRequestHandler = async (
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
  ): Promise<ICatChatResult> => {
    const prompt = request.prompt.trim();
    // Show command
    if (request.command === 'show') {
      stream.progress('Fetching tables...');
      try {
        let md = ['```json'];
        if (prompt === 'tables' || prompt.trim() === '') {
          let tables = await supabase.getTables();
          if (!tables) {
            stream.markdown('No tables found in the database.');
            return { metadata: { command: 'show' } };
          }
          stream.markdown(
            'Here are the tables in the database. You can ask for details about any table using `show [table]`.\n'
          );
          tables.forEach((t) => md.push(t.name));
          md.push('```');
          stream.markdown(md.join('\n'));
        } else {
          stream.markdown(`Prompt ${prompt} not supported.`);
        }
      } catch (err) {
        handleError(err, stream);
      }

      return { metadata: { command: 'show' } };
    } else if (request.command === 'migration') {
      try {
        const [model] = await vscode.lm.selectChatModels(MODEL_SELECTOR);
        if (model) {
          try {
            // Create new migration file (execute supabase migration new copilot).
            const migrationName = `copilot`; // TODO: generate from prompt.
            const cmd = `${Commands.NEW_MIGRATION} ${migrationName}`;
            executeCommand(cmd);

            // Get schema context.
            const schema = await supabase.getSchema();
            // TODO: figure out how to modify the prompt to only generate valid SQL. Currently Copilot generates a markdown response.
            const messages = [
              vscode.LanguageModelChatMessage.User(
                `You're a friendly PostgreSQL assistant called Supabase Clippy, helping with writing database migrations.`
              ),
              vscode.LanguageModelChatMessage.User(
                `Please provide help with ${prompt}. The reference database schema for question is ${schema}. IMPORTANT: Be sure you only use the tables and columns from this schema in your answer!`
              )
            ];
            const chatResponse = await model.sendRequest(messages, {}, token);
            let responseText = '';

            for await (const fragment of chatResponse.text) {
              stream.markdown(fragment);
              responseText += fragment;
            }
            console.log({ responseText });

            // Open migration file in editor.
            let filePath = await getFilePath();
            while (!(await isFileEmpty(filePath))) {
              await new Promise((resolve) => setTimeout(resolve, 500));
              filePath = await getFilePath();
            }

            const openPath = vscode.Uri.file(filePath);
            const doc = await vscode.workspace.openTextDocument(openPath);
            await vscode.window.showTextDocument(doc);
            const textEditor = vscode.window.activeTextEditor;

            // Extract SQL from markdown and write to migration file.
            const sql = extractCode(responseText);

            if (textEditor) {
              for await (const statement of sql) {
                await textEditor.edit((edit) => {
                  const lastLine = textEditor.document.lineAt(textEditor.document.lineCount - 1);
                  const position = new vscode.Position(lastLine.lineNumber, lastLine.text.length);
                  edit.insert(position, statement);
                });
              }
              await textEditor.document.save();
            }

            // TODO: render button to apply migration

            stream.markdown('finished');
          } catch (err) {
            stream.markdown(
              "🤔 I can't find the schema for the database. Please check that `supabase start` is running."
            );
          }
        }
      } catch (err) {
        handleError(err, stream);
      }

      return { metadata: { command: 'migration' } };
    } else {
      try {
        const [model] = await vscode.lm.selectChatModels(MODEL_SELECTOR);
        if (model) {
          try {
            const schema = await supabase.getSchema();

            const messages = [
              vscode.LanguageModelChatMessage.User(
                `You're a friendly PostgreSQL assistant called Supabase Clippy, helping with writing SQL.`
              ),
              vscode.LanguageModelChatMessage.User(
                `Please provide help with ${prompt}. The reference database schema for this question is ${schema}. IMPORTANT: Be sure you only use the tables and columns from this schema in your answer.`
              )
            ];

            const chatResponse = await model.sendRequest(messages, {}, token);
            for await (const fragment of chatResponse.text) {
              stream.markdown(fragment);
            }
          } catch (err) {
            stream.markdown(
              "🤔 I can't find the schema for the database. Please check that `supabase start` is running."
            );
          }
        }
      } catch (err) {
        handleError(err, stream);
      }

      return { metadata: { command: '' } };
    }
  };
  return handler;
};

/* HELPER FUNCTIONS */

function handleError(err: any, stream: vscode.ChatResponseStream): void {
  // making the chat request might fail because
  // - model does not exist
  // - user consent not given
  // - quote limits exceeded
  if (err instanceof vscode.LanguageModelError) {
    console.log(err.message, err.code);
    if (err.message.includes('off_topic')) {
      stream.markdown(vscode.l10n.t("I'm sorry, I can only explain computer science concepts."));
    }
  } else {
    // re-throw other errors so they show up in the UI
    throw err;
  }
}

async function isFileEmpty(filePath: string): Promise<boolean> {
  const fileUri = vscode.Uri.file(filePath);
  const stat = await vscode.workspace.fs.stat(fileUri);
  return stat.size === 0;
}

async function getFilePath() {
  const rootPath = vscode.workspace?.workspaceFolders ? vscode.workspace?.workspaceFolders[0].uri.path : '';
  const folderPath = path.join(rootPath, 'supabase/migrations');
  const folderUri = vscode.Uri.file(folderPath);
  const entries = await vscode.workspace.fs.readDirectory(folderUri);

  entries.forEach(([name, type]) => {
    console.log(`${name} - ${type === vscode.FileType.File ? 'File' : 'Directory'}`);
  });

  const filePath = path.join(folderPath, entries[entries.length - 1][0]);
  return filePath;
}
