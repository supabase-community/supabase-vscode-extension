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
- Add the details in the [Changelog](./CHANGELOG.md)
- Run `npm run install:all`
- Run `npm run vscode:prepublish`
- Run `npx vsce package`
- Run `npx vsce publish`
