const { Collection } = require("discord.js");

module.exports = class Util {
  static cooldown(client, member, command) {
    if (!client.cooldowns.has(command.name)) {
      client.cooldowns.set(command.name, new Collection());
    }
    const timestamps = client.cooldowns.get(command.name);
    const cooldownAmount = command.settings.isCooldown * 1000;
    if (timestamps.has(member)) {
      const expirationTime = timestamps.get(member) + cooldownAmount;
      if (Date.now() < expirationTime) {
        const timeLeft = (expirationTime - Date.now()) / 1000;
        return Math.round(timeLeft) + 1 === 1
          ? "a second"
          : `${Math.round(timeLeft) + 1} seconds`;
      } else {
        timestamps.set(member, Date.now());
        setTimeout(() => timestamps.delete(member), cooldownAmount);
      }
    } else {
      timestamps.set(member, Date.now());
      setTimeout(() => timestamps.delete(member), cooldownAmount);
    }
  }
};
