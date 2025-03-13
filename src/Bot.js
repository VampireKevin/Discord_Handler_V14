const MainBot = require("./Structures/Client");
const client = new MainBot();

client.connect().catch((err) => {
  console.log("Token Err => " + err);
});

module.exports = client;