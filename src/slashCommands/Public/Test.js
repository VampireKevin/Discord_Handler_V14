const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  permissions: {
    bot: [],
    user: [],
  },
  settings: {
    isOwner: false,
    isCooldown: 10,
  },
  
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("test")
    .setDMPermission(false),

  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   */

  async run(interaction) {
    await interaction.reply({ content: "test" });
  },
};
