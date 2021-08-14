module.exports = {
    AddCommand: function(player, server) {
        server.commands.add({
            base: 'deop',
            info: 'remove a player\'s operator permissions',
            usage: '/deop <username>',
            op: true,
            action(params) {
                if (params.length === 0) return `${server.color.red}No arguments specified.`

                const user = server.getPlayer(params.toString().split(' ')[0].trim())

                if (!user) return `${server.color.red}Player not found`
                if (user.op !== false) user.op = false

                user._client.write('update_user_type', {
                    user_type: 0x00
                })

                if (user !== player) user.chat(`${server.color.gray}Your operator permissions have been revoked`)
                player.chat(`De-opped ${params}`)
            }
        })
    }
};