module.exports.server = (server) => {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    })

    readline.on('line', (input) => {
        console.log("[Console] " + input.split('%').join('&'))
        server._writeAll('message', {
            player_id: 0,
            message: `&e[Console] &f${input.split('%').join('&')}`
        })
    });
}