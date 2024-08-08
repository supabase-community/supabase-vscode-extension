<img src="./images/supabase-vscode-green.png" alt="preview" width="100%" style="border-radius: 8px" />

# Supabase for Visual Studio Code

Supercharge your productivity by integrating your local Supabase instance into your favourite editor.

[Features](#features 'Jump to Features')
| [Support and Community](#support-and-community 'Jump to Support and Community')
| [Pricing](#pricing 'Jump to Pricing')
| [Contributing](#contributing 'Jump to Contributing')
| [Contributors](#contributors 'Jump to Contributors')
| [License](#license 'Jump to License')

## Getting Started

Install the Supabase VS Code Extension by clicking <a href="https://marketplace.visualstudio.com/items?itemName=Supabase.vscode-supabase-extension"><strong>Install </strong></a> on the banner above, or from the Extensions side bar in VS Code, by searching for Supabase.

## Dependencies

### Supabase CLI

The Extension currently requires Supabase to be running locally. Follow the steps to [install](https://supabase.com/docs/guides/cli/getting-started) and [start](https://supabase.com/docs/guides/cli/getting-started#running-supabase-locally) the Supabase CLI.

### GitHub Copilot

To use the Copilot Chatparticipant integration an active GitHub Copilot subscription is required. A [free trial](https://github.com/features/copilot) is available.

## Features

### GitHub Copilot Chat Participant

This Extensions provides a GitHub Copilot Chat Participant to help with your Supabase questions. Simply type `@supabase` in your Copilot Chat and the extension will provide your Database schema as context to Copilot.

![Copilot Chat integration demo](./images/copilot_chat.gif)

### Copilot Guided Database Migrations

The Extension provides a guided experience to help you create and apply database migrations. Simply type `@supabase /migration <describe what you want to do>` in your Copilot Chat and the extension will generate a new SQL migration for you.

![Copilot guided database migrations demo](./images/copilot_migration.gif)

### Inspect Tables & Views

Inspect your tables and views, including their columns, types, and data, directly from the editor!

![View tables and views](./images/table_view.png)

### List Database Migrations

See the migration history of your Database.

![Migration History](./images/migration_history.png)

### Inspect Database Functions

Inspect your database functions and their SQL definitions.

![Database functions](./images/database_functions.png)

### List Storage Buckets

List the storage buckets on your Supabase project.

## Support and Community

Support documentation can be found on the [Supabase Support Page](https://supabase.com/support). For community support, you can join the [Supabase Discord Server](https://discord.supabase.com/).

### Issue Reporting and Feature Requests

Found a bug? Have a feature request? Please open an issue on [GitHub](https://github.com/supabase-community/supabase-vscode-extension/issues/new/choose).

## Pricing

Supabase has a [generous free tier](https://supabase.com/pricing), giving you a fully fledged Postgres Database for every project. Running Supabase locally is completely free and doesn't require any account! Once you're ready to deploy your project, you can [sign up for a free account](https://database.new/) and [link your local project](https://supabase.com/docs/guides/cli/local-development#link-your-project).

## Contributing

The entire Supabase stack is [fully open source](https://supabase.com/open-source), including this Extension. In fact, this extension was originally created by [Anas Araid](https://github.com/anas-araid) during an [open source hackathon](https://twitter.com/anas_araid/status/1736641409094988033).

Your contributions, feedback, and engagement in the Supabase community are invaluable, and play a significant role in shaping our future. Thank you for your support!

Want to contirbute to this Extension? Follow the [CONTRIBUTING](./CONTRIBUTING.md) docs to get started. Want to contribute to other Supabase projects? Check out the [good first issues](https://github.com/supabase/supabase/contribute).

## Contributors

A big thanks to the people that have contributed to this project 🙏❤️:

- [Anas Araid](https://github.com/anas-araid)
- [Thor Schaeff](https://github.com/thorwebdev)

## License

MIT
