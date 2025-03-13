const fs = require("node:fs");
const chalk = require("chalk");
const { REST, Routes } = require("discord.js");

module.exports = (client) => {
  const rest = new REST({ version: "10" }).setToken(client.token);
  const commands = [];

  fs.readdirSync("./src/slashCommands").forEach((folder) => {
    const commandFiles = fs
      .readdirSync(`./src/slashCommands/${folder}`)
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(`../slashCommands/${folder}/${file}`);

      if (command.data?.name && command.data?.description) {
        commands.push(command.data.toJSON());
        client.slashCommands.set(command.data.name, command);
      }
    }
  });

  client.on("ready", async (c) => {
    try {
      client.logger.log(
        chalk.yellowBright(
          `Started Refreshing ${commands.length} Application (/) Commands`
        ),
        "cmd"
      );

      const data = await rest.put(Routes.applicationCommands(c.user.id), {
        body: commands,
      });

      client.logger.log(
        chalk.blackBright(
          `Successfully Reloaded ${data.length} Application (/) Commands`
        ),
        "cmd"
      );
    } catch (err) {
      console.log(err);
    }
  });
};
