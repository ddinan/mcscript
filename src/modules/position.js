module.exports.player = (player, server) => {
    player._client.on('position', (packet) => {
        player.positionUpdate(packet.x, packet.y, packet.z)
        player.orientationUpdate(packet.yaw, packet.pitch)
        player.heldBlock = packet.player_id
    })

    player.positionUpdate = (x, y, z) => {
        const dx = x - player.pos.x
        const dy = y - player.pos.y
        const dz = z - player.pos.z
        const fitsInRelative = (dx >= -128 && dx <= 127) && (dy >= -128 && dy <= 127) && (dz >= -128 && dz <= 127)

        server.players.forEach((_player) => {
            if (_player.id !== player.id) {
                if (fitsInRelative) {
                    _player._client.write('position_update', {
                        player_id: player.id,
                        change_in_x: x - player.pos.x,
                        change_in_y: y - player.pos.y,
                        change_in_z: z - player.pos.z
                    })
                } else {
                    _player._client.write('player_teleport', {
                        player_id: player.id,
                        x: x,
                        y: y,
                        z: z,
                        yaw: player.yaw,
                        pitch: player.pitch
                    })
                }
            }
        })

        player.pos.x = x
        player.pos.y = y
        player.pos.z = z
    }

    player.orientationUpdate = (yaw, pitch) => {
        server.players.forEach((_player) => {
            if (_player.id !== player.id) {
                _player._client.write('orientation_update', {
                    player_id: player.id,
                    yaw: yaw,
                    pitch: pitch
                })
            }
        })

        player.yaw = yaw
        player.pitch = pitch
    }

    player.setPosition = (x, y, z, yaw, pitch) => {
        player.pos.x = x
        player.pos.y = y
        player.pos.z = z
        player.yaw = yaw
        player.pitch = pitch

        player._client.write('player_teleport', {
            player_id: -1,
            x: player.pos.x,
            y: player.pos.y,
            z: player.pos.z,
            yaw: player.yaw,
            pitch: player.pitch
        })
    }
}