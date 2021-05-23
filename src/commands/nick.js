module.exports = {
    AddCommand: function(player, server) {
        server.commands.add({
            base: 'nick',
            info: 'changes your nickname to <nick>',
            usage: '/nick <nick>',
            action(nick) {
                nick = nick.replace('%', '&')
                player.chat("Your nick is currently: " + player.nick)

                const path = './Players.db'
                const sql = require('better-sqlite3');

                let db = new sql(path, sql.OPEN_READWRITE, (err) => {
                    if (err) {
                        console.error(err.message);
                    }
                    verbose: console.log
                })

                insertData()

                function insertData() {
                    db.exec(`UPDATE players SET nick = '${nick}' WHERE username = '${player.username}'`);

                    console.log(`Updated database file (Players.db)`)
                    player.nick = nick
                    return player.chat(`${server.color.green}Changed your nick to ${nick}`)
                }
            }
        })
    }
};