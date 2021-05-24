const Vec3 = require('vec3')

module.exports = {
    AddCommand: function(player, server) {
        server.commands.add({
            base: 'place',
            info: 'Places a block where you are standing.',
            usage: '/place',
            action() {
                server.setBlock(new Vec3(player.pos.x >> 5, (player.pos.y >> 5) - 1, player.pos.z >> 5), player.heldBlock)
            }
        })
    }
};