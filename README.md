# Discord Handler V14

A Discord bot handler for managing slash commands and prefix commands using Discord.js v14.

## Features

- Slash commands and prefix commands support
- Command cooldowns
- Error handling
- Event handling
- Logging with different log levels

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/VampireKevin/Discord_Handler_V14.git
   cd Discord_Handler_V14
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Configure the bot:

   Edit the `src/Config.js` file with your bot's token, prefix, owner IDs, and error logs channel ID.

   ```javascript
   module.exports = {
     token: "your_token",
     prefix: "your_prefix",
     ownersId: ["your_owner_id"],
     errorLogsChannel: "your_error_logs_channel_id",
   };
   ```

## Usage

1. Start the bot:

   ```sh
   npm start
   ```

2. Add your commands and events in the respective directories:

   - `src/Commands/` for prefix commands
   - `src/slashCommands/` for slash commands
   - `src/Events/` for events

## Example Command

Here is an example of a simple test command:

```javascript
// filepath: /src/Commands/Public/Test.js
module.exports = {
  name: "test",
  description: "Test command",
  aliases: ["t"],
  usage: "",
  args: false,
  permissions: {
    bot: [],
    user: [],
  },
  settings: {
    isOwner: true,
    isCooldown: 10,
  },

  execute: async (message, args, client, prefix) => {
    message.reply({ content: `Test` });
  },
};
```

## Dependencies
- [Discord.js v14](https://discord.js.org/)
- chalk
- moment

## Contributing
Pull requests are welcome! Please open an issue for major changes before submitting PRs.

## License
This project is licensed under the **ISC License**.

## Credits
Made by [VampireKevin](https://github.com/VampireKevin), **Vampire Studio**.
