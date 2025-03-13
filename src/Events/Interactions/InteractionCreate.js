const { InteractionType, PermissionsBitField, EmbedBuilder } = require("discord.js");
const { cooldown } = require("../../Utils/Functions.js");

module.exports = {
  name: "interactionCreate",

  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("discord.js").Client} client
   */

  run: async (client, interaction) => {
    if (interaction.type === InteractionType.ApplicationCommand) {
      const command = client.slashCommands.get(interaction.commandName);
      if (!command) return;

      let embed = new EmbedBuilder().setColor("Red");
      if (command.permissions.bot) {
        if (
          !interaction.guild.members.me.permissions.has(
            PermissionsBitField.resolve(command.permissions.bot || [])
          )
        ) {
          embed.setDescription(
            `I don't have **\`${command.permissions.bot
            }\`** permission in ${interaction.channel.toString()} to execute this **\`${command.name
            }\`** command.`
          );
          return interaction.reply({ embeds: [embed] });
        }
      }

      if (command.permissions.user) {
        if (
          !interaction.member.permissions.has(
            PermissionsBitField.resolve(command.permissions.user || [])
          )
        ) {
          embed.setDescription(
            `You don't have **\`${command.permissions.user
            }\`** permission in ${interaction.channel.toString()} to execute this **\`${command.data.name
            }\`** command.`
          );
          return interaction.reply({ embeds: [embed] });
        }
      }

      if (command.settings.isOwner && !client.owner.includes(interaction.user.id)) {
        embed.setDescription(`Only <@${client.owner.join(", ")}> can use this command!`);
        return interaction.reply({ embeds: [embed] });
      }

      if (cooldown(client, interaction.member.id, command) && !client.owner.includes(interaction.member.id)) {
        let timeLeft = cooldown(client, interaction.member.id, command);
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `Please wait for ${timeLeft} before reusing the \`${command.data.name}\` command!`
              ),
          ],
        });
      }

      try {
        await command.run(interaction, client);
      } catch (error) {
        if (interaction.replied) {
          await interaction
            .editReply({
              content: `An unexcepted error occured.`,
            })
            .catch(() => {});
        } else {
          await interaction
            .reply({
              ephemeral: true,
              content: `An unexcepted error occured.`,
            })
            .catch(() => {});
        }
        console.error(error);
      }
    }
  },
};