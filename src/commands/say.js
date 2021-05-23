module.exports = {
    AddCommand: function(player, server) {
        server.commands.add({
            base: 'say',
            info: 'Broadcasts a message to all players as the server.',
            usage: '/say <message>',
            op: true,
            action(params) {
                let message
                if (params.toString().split(' ')[0] !== null) message = params.toString()

                server._writeAll('message', {
                    player_id: player.id,
                    message: `${message.split('%').join('&')}`
                })
            }
        })
    }
};