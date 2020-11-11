const fs = require("fs");
const util = require("util");

const promisify = util.promisify;
const readdir = promisify(fs.readdir);

// TODO: Load on server startup instead of when player joins?
module.exports.player = (player, server) => {
  let i = 1;

  readdir(__dirname + "/../commands/", (err, files) => {
    if (err) return console.error(err);

    files.forEach((file) => {
      if (!file.endsWith(".js")) return;

      var commands = require(`../commands/${file}`);
      commands.AddCommand(player, server);
      let commandName = file.split(".")[0];

      //console.log(`Loading command: ${commandName}. Command ${i}`);
      i++;
    });

    console.log();
  });

  player.handleCommand = (str) => {
    try {
      const res = player.commands.use(str, player.op)
      if (res) player.chat(res)
    } catch (err) {
      if (err) {
        player.chat(`${server.color.red}Error: ${err.message}`)
      } else {
        setTimeout(() => {
          throw err
        }, 0)
      }
    }
  }
}
