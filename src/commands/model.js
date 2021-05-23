module.exports = {
    AddCommand: function(player, server) {
        server.commands.add({
            base: 'model',
            info: 'changes your model to <model>',
            usage: '/model <model>',
            action(model) {
                player._client.write('change_model', {
                    entity_id: -1,
                    model_name: model.replace(':', '|')
                })

                model = model.replace('%', '&')
                player.chat("Your model is currently: " + player.model)

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
                    db.exec(`UPDATE players SET model = '${model}' WHERE username = '${player.username}'`);

                    console.log(`Updated database file (Players.db)`)
                    player.model = model.replace(':', '|')
                    return player.chat(`${server.color.green}Changed your model to ${model}`)
                }
            }
        })
    }
};