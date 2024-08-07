# Contributing

## Development

- `npm run install:all`
  - install package dependencies for both the extension and react webview source code.
- install [esbuild-problem-matchers](https://marketplace.visualstudio.com/items?itemName=connor4312.esbuild-problem-matchers) extension
- `npx supabase start`
  - starts the [supabase local development stack](https://supabase.com/docs/reference/cli/supabase-start)
- `npm run watch`
  - compile vs code extension
- press `F5`
  - to open a new window with the extension loaded

## Publishing

- increment package.json version
- npm run vscode:prepublish
- npx vsce package
- npx vsce publish

## Contributing

If you have any questions or requests or want to contribute, please write an issue or give me a PR freely.

### To-do

- Query feature: execute queries directly from vscode
- Edge functions
- Open bucket files

## Bug report

If you find a bug, please create a new [issue](https://github.com/anas-araid/vscode-supabase-cli/issues) on GitHub.
