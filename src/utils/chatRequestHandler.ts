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

const MODEL_SELECTOR: vscode.LanguageModelChatSelector = { vendor: 'copilot', family: 'gpt-4o' };

export const createChatRequestHandler = (supabase: SupabaseApi): vscode.ChatRequestHandler => {
  const handler: vscode.ChatRequestHandler = async (
    request: vscode.ChatRequest,
    _context: vscode.ChatContext,
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
          const table = await supabase.getTable(prompt);
          if (table) {
            stream.markdown('Here are details for `' + prompt + '`\n');
            md.push(table);
            md.push('```');
            stream.markdown(md.join('\n'));
          } else {
            stream.markdown("Can't find the table `" + prompt + '` \n');
          }
        }
      } catch (err) {
        handleError(err, stream);
      }

      return { metadata: { command: 'show' } };
    } else if (request.command === 'migration') {
      try {
        // Check if language models are available
        let models;
        try {
          models = await vscode.lm.selectChatModels(MODEL_SELECTOR);
        } catch (err) {
          stream.markdown('⚠️ AI-powered migration generation requires an active GitHub Copilot subscription.\n\n' +
            'You can still create migrations manually using:\n' +
            '- The "Create new migration" button in the Database view\n' +
            '- Running `supabase migration new` in the terminal');
          return { metadata: { command: 'migration' } };
        }

        if (!models || models.length === 0) {
          stream.markdown('⚠️ GitHub Copilot language models are not available.\n\n' +
            'Please ensure you have:\n' +
            '1. An active GitHub Copilot subscription\n' +
            '2. Signed in to GitHub in VS Code\n\n' +
            'You can still create migrations manually.');
          return { metadata: { command: 'migration' } };
        }

        const [model] = models;
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

          // Render button to apply migration.
          stream.markdown('\n\nMake sure to review the migration file before applying it!');
          stream.button({
            command: 'databaseProvider.db_push',
            title: vscode.l10n.t('Apply migration.')
          });
        } catch (err) {
          stream.markdown(
            "🤔 I can't find the schema for the database. Please check that `supabase start` is running."
          );
        }
      } catch (err) {
        handleError(err, stream);
      }

      return { metadata: { command: 'migration' } };
    } else {
      try {
        // Check if language models are available
        let models;
        try {
          models = await vscode.lm.selectChatModels(MODEL_SELECTOR);
        } catch (err) {
          stream.markdown('⚠️ AI features require an active GitHub Copilot subscription.\n\n' +
            'However, you can still use all database management features:\n' +
            '- View and explore tables\n' +
            '- Create migrations manually\n' +
            '- Run database commands\n' +
            '- Generate TypeScript types');
          return { metadata: { command: '' } };
        }

        if (!models || models.length === 0) {
          stream.markdown('⚠️ GitHub Copilot language models are not available.\n\n' +
            'Please ensure you have:\n' +
            '1. An active GitHub Copilot subscription\n' +
            '2. Signed in to GitHub in VS Code');
          return { metadata: { command: '' } };
        }

        const [model] = models;
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

  // entries.forEach(([name, type]) => {
  //   console.log(`${name} - ${type === vscode.FileType.File ? 'File' : 'Directory'}`);
  // });

  const filePath = path.join(folderPath, entries[entries.length - 1][0]);
  return filePath;
}
