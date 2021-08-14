module.exports.player = (player, server) => {
    console.log(player)
    /*server.on('login', (client) => {
        if (client.socket.listeners('end').length === 0) return
        const player = new EventEmitter()
        player._client = client

        player.chat("hi")
    })*/
    player.login = () => {
        console.log("Plugin activated.")
        player.sendCustomColor = function sendCustomColor(r, g, b, code) {
            player._client.write('set_text_color', {
                red: r,
                green: g,
                blue: b,
                alpha: 255,
                code: code
            })

            console.log("Sent custom color")
        }

        // Send custom colors to the client

        player.sendCustomColor(234, 24, 102, 103)
    }

    /*server._server_.commands.add({
        base: 'customcolors',
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
    })*/
}