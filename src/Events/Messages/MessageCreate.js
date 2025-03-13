const {
  EmbedBuilder,
  Message,
  Client,
  PermissionsBitField,
} = require("discord.js");
const { cooldown } = require("../../Utils/Functions.js");
const { prefix } = require("../../Config.js");

module.exports = {
  name: "messageCreate",

  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @returns
   */
  
  run: async (client, message) => {
    if (!message.guild || message.author.bot || message.channel.type === 1)
      return;

    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(mention)) {
      const embed = new EmbedBuilder()
        .setDescription(
          `**› My prefix in this server is \`${prefix}\`**\n**› You can see my all commands type \`${prefix}\`help**`
        );
      message.channel.send({ embeds: [embed] });
    }
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(
      `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
    );
    if (!prefixRegex.test(message.content)) return;
    const [matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) return;
    /*
    if (!client.dev.includes(message.author.id) && client.dev.length > 0) {
      message.channel.send("The bot is under maintenance. (Please come back again later)");
      console.log(`[INFOMATION] ${message.author.tag} trying request the command!`);
      return;
    }
*/
    if (
      !message.guild.members.me.permissions.has(
        PermissionsBitField.resolve("SendMessages")
      )
    )
      return await message.author.dmChannel
        .send({
          content: `I don't have **\`SEND_MESSAGES\`** permission in <#${message.channelId}> to execute this **\`${command.name}\`** command.`,
        })
        .catch(() => {});

    if (
      !message.guild.members.me.permissions.has(
        PermissionsBitField.resolve("ViewChannel")
      )
    )
      return;

    if (
      !message.guild.members.me.permissions.has(
        PermissionsBitField.resolve("EmbedLinks")
      )
    )
      return await message.channel
        .send({
          content: `I don't have **\`EMBED_LINKS\`** permission in <#${message.channelId}> to execute this **\`${command.name}\`** command.`,
        })
        .catch(() => {});

    const embed = new EmbedBuilder().setColor("Red");
    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments, ${message.author}!`;

      if (command.usage) {
        reply += `\nUsage: \`${prefix}${command.name} ${command.usage}\``;
      }

      embed.setDescription(reply);
      return message.channel.send({ embeds: [embed] });
    }

    if (command.permissions.bot) {
      if (
        !message.guild.members.me.permissions.has(
          PermissionsBitField.resolve(command.permissions.bot || [])
        )
      ) {
        embed.setDescription(
          `I don't have **\`${command.permissions.bot}\`** permission in <#${message.channelId}> to execute this **\`${command.name}\`** command.`
        );
        return message.channel.send({ embeds: [embed] });
      }
    }

    if (command.permissions.user) {
      if (
        !message.member.permissions.has(
          PermissionsBitField.resolve(command.permissions.user || [])
        )
      ) {
        embed.setDescription(
          `You don't have **\`${command.permissions.user}\`** permission in <#${message.channelId}> to execute this **\`${command.name}\`** command.`
        );
        return message.channel.send({ embeds: [embed] });
      }
    }

    if (command.settings.isOwner && !client.owner.includes(message.author.id)) {
      embed.setDescription(`Only <@${client.owner.join(", ")}> can use this command!`);
      return message.channel.send({ embeds: [embed] });
    }
    
    if (
      cooldown(client, message.member.id, command) &&
      !client.owner.includes(message.member.id)
    ) {
      let timeLeft = cooldown(client, message.member.id, command);
      return message.channel.send({
        embeds: [
          new EmbedBuilder().setDescription(
            `Please wait for ${timeLeft} before reusing the \`${command.name}\` command!`
          ),
        ],
      });
    }

    try {
      command.execute(message, client, args, prefix);
    } catch (error) {
      console.log(error);
      embed.setDescription(
        "There was an error executing that command.\nI have contacted the owner of the bot to fix it immediately."
      );
      return message.channel.send({ embeds: [embed] });
    }
  },
};
