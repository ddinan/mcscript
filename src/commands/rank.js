module.exports = {
    AddCommand: function(player, server) {
        server.commands.add({
            base: 'rank',
            info: 'sets the rank of <player> to <rank>',
            usage: '/rank <player> <rank>',
            op: true,
            action(params) {
                const user = server.getPlayer(params.toString().split(' ')[0].trim())
                let reason

                if (params.toString().split(' ')[1] !== null) reason = params.toString().split(' ')[1]
                if (!user) {
                    return `${server.color.red}Player not found`
                } else {
                    if (reason === undefined) {
                        user.disconnect('You have been kicked from the server')
                    } else {
                        user.disconnect(reason)
                    }
                }
            }
        })
    }
};