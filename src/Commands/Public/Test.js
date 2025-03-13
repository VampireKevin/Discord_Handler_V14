module.exports = {
  name: "test",
  description: "Test Desc",
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

  /**
   * @param { import("discord.js").Message } message
   * @param { String } args
   * @param { import("discord.js").Client } args
   * @param { String } prefix
   */

  execute: async (message, args, client, prefix) => {
    message.reply({ content: `Test` });
  },
};
