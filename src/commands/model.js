module.exports = {
    AddCommand: function(player, server) {
        server.commands.add({
            base: 'model',
            info: 'changes your model to <model>',
            usage: '/model <model>',
            action(params) {
                params = params.replace('%', '&')
                if (params.length === 0) return player.chat("Your model is currently: " + player.model)

                player._client.write('change_model', {
                    entity_id: -1,
                    model_name: params.replace(':', '|')
                })

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
                    db.exec(`UPDATE players SET model = '${params}' WHERE username = '${player.username}'`);

                    console.log(`Updated database file (Players.db)`)
                    player.model = params.replace(':', '|')
                    return player.chat(`${server.color.green}Changed your model to ${params}`)
                }
            }
        })
    }
};