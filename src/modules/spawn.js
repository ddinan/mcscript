const Vec3 = require('vec3')

module.exports.player = (player, server) => {
    let x, y, z, yaw, pitch
    const db = require('better-sqlite3')('MCScript.db')
    const row = db.prepare('SELECT * FROM levels WHERE name = ?').get("level")
    console.log(row.name + " " + row.spawn)
    var coords = row.spawn.split(' ')
    x = coords[0]
    y = coords[1]
    z = coords[2]
    yaw = coords[3]
    pitch = coords[4]

    player.spawn = () => {
        player.pos = new Vec3(x, y, z)
        player.yaw = yaw
        player.pitch = pitch
        player.op = true
        player.cpe = false
        player.supported_extensions = []

        if (player._client.identification_byte === 0x42) player.cpe = true
        if (player.cpe) {
            player._client.write('ext_info', {
                app_name: 'MCScript',
                extension_count: 1
            })

            player._client.write('ext_entry', {
                ext_name: 'HeldBlock',
                version: 1
            })
        }

        player._client.write('spawn_player', {
            player_id: -1,
            player_name: player._client.username,
            x: player.pos.x,
            y: player.pos.y,
            z: player.pos.z,
            yaw: player.yaw,
            pitch: player.pitch
        })

        server.players.forEach((_player) => {
            _player._client.write('spawn_player', {
                player_id: server.entityID,
                player_name: player._client.username,
                x: player.pos.x,
                y: player.pos.y,
                z: player.pos.z,
                yaw: player.yaw,
                pitch: player.pitch
            })
        })

        server.players.push(player)

        server.players.forEach((_player) => {
            if (_player.id !== player.id) {
                player._client.write('spawn_player', {
                    player_id: _player.id,
                    player_name: _player.username,
                    x: _player.pos.x,
                    y: _player.pos.y,
                    z: _player.pos.z,
                    yaw: _player.yaw,
                    pitch: _player.pitch
                })
            }
        })

        server.broadcast(`${server.color.yellow}${player._client.username} joined the game`)
        server.log.info(`${player.username} joined the game`)
        player.chat(`${server.color.gray}Welcome ${server.color.green}${player._client.username}${server.color.gray}!`)

        const path = './Players.db'

        const sql = require('better-sqlite3');
        const createTable = "CREATE TABLE IF NOT EXISTS players ('username' VARCHAR, 'nick' VARCHAR, 'title' VARCHAR, 'model' VARCHAR, 'firstJoin' TIMESTAMP, 'lastJoin' TIMESTAMP)"

        let db = new sql(path, sql.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
            verbose: console.log
        })

        db.exec(createTable)
        insertData()

        function insertData() {
            const prepare = db.prepare('INSERT INTO players (username, nick, title, model, firstJoin, lastJoin) VALUES (@username, @nick, @model, @title, @firstJoin, @lastJoin)');

            const insert = db.transaction((players) => {
                for (const pl of players) prepare.run(pl)
            });

            var now = new Date();

            insert([{
                username: player.username,
                nick: "",
                title: "",
                model: "",
                firstJoin: now.toISOString().slice(0, 19).replace('T', ' '),
                lastJoin: now.toISOString().slice(0, 19).replace('T', ' ')
            }, ]);

            console.log(`Updated database file (Players.db)`)

            const database = require('better-sqlite3')('Players.db')
            const row = database.prepare('SELECT * FROM players WHERE username = ?').get(player.username)

            player.nick = row.nick
            player.model = row.model
            player._client.write('change_model', {
                entity_id: -1,
                model_name: row.model.replace(':', '|')
            })
        }

        server['online_players']++
        server.entityID++
    }
}