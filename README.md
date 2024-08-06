<img src="./src/assets/supabase-vscode.png" alt="preview" width="100%" style="border-radius: 8px">

# Supabase for Visual Studio Code

Supercharge your productivity by integrating your local Supabase instance right into the editor.

<a href="https://marketplace.visualstudio.com/items?itemName=anasaraid.vscode-supabase-cli">
<strong>Install → </strong>
</a>

<br/>
<br/>

- [Usage](#usage)
- [Development](#development)
- [Contributing](#contributing)
- [Bug report](#bug-report)
- [License](#license)

## Usage

> Disclaimer: This is still a work in progress prototype. It might have some broken edge cases. I have zero experience in building extensions so contributions are welcome.

[DEMO](https://twitter.com/anas_araid/status/1736641409094988033)

https://github.com/anas-araid/vscode-supabase-cli/assets/23257651/0b52af80-633d-46a8-972a-3b3f3697d0c9

## Development

- `yarn run install:all`
  - install package dependencies for both the extension and react webview source code.
- install [esbuild-problem-matchers](https://marketplace.visualstudio.com/items?itemName=connor4312.esbuild-problem-matchers) extension
- `npx supabase start`
  - starts the [supabase local development stack](https://supabase.com/docs/reference/cli/supabase-start)
- `yarn run watch`
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

## Authors

- [Anas Araid](https://github.com/anas-araid)
- [Thor Schaeff](https://github.com/thorwebdev)

## License

MIT
