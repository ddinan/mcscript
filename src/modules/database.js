const fs = require('fs')

const serverDBFile = './MCScript.db'
const playerDBFile = './Players.db'

const sql = require('better-sqlite3');

module.exports.server = (server) => {
    let serverDB = new sql(serverDBFile, sql.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
        }
        verbose: console.log
    })

    let playerDB = new sql(playerDBFile, sql.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
        }
        verbose: console.log
    })

    // Create table if it does not exist
    serverDB.exec("CREATE TABLE IF NOT EXISTS levels ('name' varchar, 'spawn' varchar)")

    insertData()

    function insertData() {
        const prepare = serverDB.prepare('INSERT INTO levels (name, spawn) VALUES (@name, @spawn)');

        const insert = serverDB.transaction((levels) => {
            for (const level of levels) prepare.run(level)
        });

        var coords = "1 34 1 0 0"

        insert([{
            name: 'level',
            spawn: coords
        }, ]);

        console.log(`Loaded database file (MCScript.db)`)
    }
}