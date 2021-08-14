module.exports = {
    AddCommand: function(player, server) {
        server.commands.add({
            base: 'tp',
            info: 'teleport a player to another player',
            usage: '/tp <player>',
            op: true,
            action(params) {
                if (params.length === 0) return `${server.color.red}No arguments specified.`

                const user = server.getPlayer(params.toString().split(' ')[0].trim())

                if (!user) {
                    return `${server.color.red}Player not found`
                } else {
                    player.setPosition(user.pos.x, user.pos.y, user.pos.z, user.yaw, user.pitch)
                    return `${server.color.green}Teleported to ${params}`
                }
            }
        })
    }
};