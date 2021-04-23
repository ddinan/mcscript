var methods = {
    AddCommand: function(player, server) {
        player.commands.add({
            base: 'op',
            info: 'give a player operator permissions',
            usage: '/op <username>',
            op: true,
            action(username) {
                const user = server.getPlayer(username.toString().split(' ')[0].trim())

                if (!user) return `${server.color.red}Player not found`
                if (user.op !== true) user.op = true

                user._client.write('update_user_type', {
                    user_type: 0x64
                })

                if (user !== player) user.chat(`${server.color.gray}You have been granted operator permissions`)
                player.chat(`Opped ${username}`)
            }
        })
    }
}

module.exports = methods;