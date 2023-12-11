<a href="https://www.figma.com/community/plugin/1254538877056388290" target="_blank">
  <img src="./src/assets/supabase-vscode.png" alt="preview" width="100%">
</a>

# Supabase CLI for Visual Studio Code

Supercharge your productivity by integrating your local Supabase instance right into the editor.

<a href="https://marketplace.visualstudio.com/items?itemName=anasaraid.vscode.supabase.cli"><strong>Install →</strong></a>

<br/>

- [Usage](#usage)
- [Development](#development)
- [Contributing](#contributing)
- [Bug report](#bug-report)
- [License](#license)

## Usage

> Disclaimer: This is still a work in progress extension. Might have some broken edge cases. Not ready for production use.

...

## Development

- `yarn run install:all`
  - install package dependencies for both the extension and react webview source code.
- `yarn run build:webview`
  - build react webview source code. Must be executed before compiling or running the extension.
- `npx supabase start`
  - starts the [supabase local development stack](https://supabase.com/docs/reference/cli/supabase-start)
- `yarn run start:webview`
  - runs the react webview source code in development mode.
- `yarn run compile`
  - compile vs code extension
- press `F5`
  - to open a new window with the extension loaded

## Contributing

If you have any questions or requests or want to contribute, please write an issue or give me a PR freely.

## Bug report

If you find a bug, please create a new [issue](https://github.com/anas-araid/vscode-supabase-cli/issues) on GitHub.

## License

MIT
