var methods = {
    AddCommand: function(player, server) {
        player.commands.add({
            base: 'tp',
            info: 'teleport a player to another player',
            usage: '/tp <player>',
            op: true,
            action(username) {
                const user = server.getPlayer(username.toString().split(' ')[0].trim())

                if (!user) {
                    return `${server.color.red}Player not found`
                } else {
                    player.setPosition(user.pos.x, user.pos.y, user.pos.z, user.yaw, user.pitch)
                    return `${server.color.green}Teleported to ${username}`
                }
            }
        })
    }
}

module.exports = methods;