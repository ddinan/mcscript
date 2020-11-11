const Vec3 = require('vec3')

module.exports.player = (player, server) => {
  player.spawn = () => {
    player.pos = new Vec3(1 * 32, 34 * 32, 1 * 32)
    player.yaw = 0
    player.pitch = 0
    player.op = true
    player.cpe = false
    player.supported_extensions = []

    if (player._client.identification_byte === 0x42) player.cpe = true
    if (player.cpe) {
      player._client.write('ext_info', {
        app_name: 'MCScript',
        extension_count: 0
      })
    }

    player._client.write('spawn_player', {
      player_id: -1,
      player_name: player._client.username,
      x: player.pos.x,
      y: player.pos.y,
      z: player.pos.z,
      yaw: player.yaw,
      pitch: player.pitch
    })

    server.players.forEach((_player) => {
      _player._client.write('spawn_player', {
        player_id: server.entityID,
        player_name: player._client.username,
        x: player.pos.x,
        y: player.pos.y,
        z: player.pos.z,
        yaw: player.yaw,
        pitch: player.pitch
      })
    })

    server.players.push(player)

    server.players.forEach((_player) => {
      if (_player.id !== player.id) {
        player._client.write('spawn_player', {
          player_id: _player.id,
          player_name: _player.username,
          x: _player.pos.x,
          y: _player.pos.y,
          z: _player.pos.z,
          yaw: _player.yaw,
          pitch: _player.pitch
        })
      }
    })

    server.broadcast(`${server.color.yellow}${player._client.username} joined the game`)
    server.log.info(`${player.username} joined the game`)
    player.chat(`${server.color.gray}Welcome ${server.color.green}${player._client.username}${server.color.gray}!`)

    server['online_players']++
    server.entityID++
  }
}
