const Command = require('../command')

const fs = require("fs");
const util = require("util");
const promisify = util.promisify;
const readdir = promisify(fs.readdir);

// TODO: Load on server startup instead of when player joins?

module.exports.player = (player, server) => {
    server.commands = new Command({})
    let i = 1;

    readdir(__dirname + "/../commands/", (err, files) => {
        if (err) return console.error(err);

        files.forEach((file) => {
            if (!file.endsWith(".js")) return;

            var commands = require(`../commands/${file}`);
            commands.AddCommand(player, server);
            let commandName = file.split(".")[0];
            i++;
        });
    });

    server.handleCommand = (str) => {
        try {
            const res = server.commands.use(str, player.op)
            if (res) player.chat(res)
        } catch (err) {
            if (err) {
                player.chat(`${server.color.red}Error: ${err.message}`)
                console.log(`Error: ${err.stack}`)
            } else {
                setTimeout(() => {
                    throw err
                }, 0)
            }
        }
    }
}