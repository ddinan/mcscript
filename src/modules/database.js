module.exports.server = (server) => {
  const fs = require('fs')

  const path = '../MCScript.db'

  const sql = require('better-sqlite3');
  const createTable = "CREATE TABLE IF NOT EXISTS levels ('name' varchar, 'spawn' varchar)"

  const file = './MCScript.db';
  let db = new sql(file, sql.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    verbose: console.log
  })

  db.exec(createTable)
  insertData()

  function insertData() {
    const prepare = db.prepare('INSERT INTO levels (name, spawn) VALUES (@name, @spawn)');

    const insert = db.transaction((levels) => {
      for (const level of levels) prepare.run(level)
    });

    var coords = "1 34 1 0 0"

    insert([
      { name: 'level', spawn: coords },
    ]);

    console.log(`Generated database file (MCScript.db)`)
  }
}
