const Vec3 = require('vec3')

module.exports.player = (player, server) => {
    player._client.on('set_block', (packet) => {
        if (packet.mode === 0x01) {
            server.setBlock(new Vec3(packet.x, packet.y, packet.z), packet.block_type)
        } else if (packet.mode === 0x00) {
            server.destroyBlock(new Vec3(packet.x, packet.y, packet.z))
        }
    })
}

module.exports.server = (server) => {
    server.setBlock = (coords, blockType) => {
        server.world.setBlock(new Vec3(coords.x, coords.y, coords.z), blockType)

        server._writeAll('set_block', {
            x: coords.x,
            y: coords.y,
            z: coords.z,
            block_type: blockType
        })
    }

    server.destroyBlock = (coords) => {
        server.world.setBlock(new Vec3(coords.x, coords.y, coords.z), 0)

        server._writeAll('set_block', {
            x: coords.x,
            y: coords.y,
            z: coords.z,
            block_type: 0
        })
    }
}