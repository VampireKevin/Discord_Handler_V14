const chalk = require("chalk");

module.exports = {
  name: "ready",
  
  /**
   *
   * @param {import("discord.js").Client} client
   */

  run: async (client) => {
    client.logger.log(
      chalk.greenBright(`${client.user.tag} (${client.user.id}) is Ready!`),
      "ready"
    );
  },
};
