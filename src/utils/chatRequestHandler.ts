import { SupabaseApi } from '@/features/database/classes/supabase-api';
import * as vscode from 'vscode';

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
    } else {
      try {
        const [model] = await vscode.lm.selectChatModels(MODEL_SELECTOR);
        if (model) {
          const messages = [
            vscode.LanguageModelChatMessage.User(
              `You're a friendly PostgreSQL assistant called Supabase Clippy, helping with writing SQL.`
            ),
            vscode.LanguageModelChatMessage.User(prompt)
          ];

          const chatResponse = await model.sendRequest(messages, {}, token);
          for await (const fragment of chatResponse.text) {
            stream.markdown(fragment);
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