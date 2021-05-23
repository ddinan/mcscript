module.exports = {
    AddCommand: function(player, server) {
        server.commands.add({
            base: 'setspawn',
            info: 'Sets the spawnpoint of the current map.',
            usage: '/spawnpoint',
            action() {
                const Database = require('better-sqlite3');
                const db = new Database('MCScript.db', {
                    verbose: console.log
                });

                const statement = db.prepare('UPDATE levels SET spawn = ? WHERE name = ?');
                var spawn = player.pos.x + " " + player.pos.y + " " + player.pos.z + " " + player.yaw + " " + player.pitch
                const updates = statement.run(spawn, "level")
            }
        })
    }
};