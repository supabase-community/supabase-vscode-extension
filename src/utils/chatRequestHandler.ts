import * as vscode from 'vscode';

interface ICatChatResult extends vscode.ChatResult {
  metadata: {
    command: string;
  };
}

const MODEL_SELECTOR: vscode.LanguageModelChatSelector = { vendor: 'copilot', family: 'gpt-3.5-turbo' };

// Define a Cat chat handler.
export const handler: vscode.ChatRequestHandler = async (
  request: vscode.ChatRequest,
  context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken
): Promise<ICatChatResult> => {
  // Show command
  if (request.command === 'show') {
    stream.progress('Fetching tables...');
    try {
      stream.markdown('Here are the tables in your database:');
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
          vscode.LanguageModelChatMessage.User(request.prompt)
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
