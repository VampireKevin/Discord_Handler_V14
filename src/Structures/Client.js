const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require("discord.js");

class MainBot extends Client {
  constructor() {
    super({
      intents: [Object.keys(GatewayIntentBits)],
      partials: [Object.keys(Partials)],
    });

    this.config = require("../Config.js");
    this.logger = require("../Utils/Logger.js");
    this.owner = this.config.ownersId;
    this.prefix = this.config.prefix;
    if (!this.token) this.token = this.config.token;
    const client = this;

    this.rest.on("rateLimited", (info) => {
      this.logger.log(info, "log");
    });

    ["aliases", "slashCommands", "commands", "cooldowns"].forEach(
      (x) => (client[x] = new Collection())
    );
    [
      "LoadCommands",
      "LoadSlashCommands",
      "LoadEvents",
      "LoadErrorHandler",
    ].forEach((handler) => {
      require(`../Handlers/${handler}`)(this);
    });
  }
  connect() {
    return super.login(this.token);
  }
}

module.exports = MainBot;
