module.exports.player = (player, server) => {
  player._client.on('message', (packet) => {
    if (packet.message.split('')[0] === '/') {
      player.handleCommand(packet.message)
    } else {
      player.emit('chat', { message: packet.message })
      server.log.info(`<${player.username}> ${packet.message}`)

      if (packet.message.length >= 57) {
        server.broadcast(`<${player.username}> ${packet.message.split('%').join('&')}`)
        server.broadcast(`> ${packet.message.split('').splice(56, packet.message.split('').length).join('')}`)
      } else {
        server.broadcast(`<${player.username}> ${packet.message.split('%').join('&')}`)
      }
    }
  })

  player.chat = (message) => {
    player._client.write('message', {
      player_id: player.id,
      message: message
    })
  }
}

module.exports.server = (server) => {
  server.broadcast = (message) => {
    server._writeAll('message', {
      player_id: 0,
      message: message
    })
  }

  server.color = {
    'black': '&0',
    'dark_blue': '&1',
    'navy': '&1',
    'dark_green': '&2',
    'green': '&2',
    'teal': '&3',
    'dark_red': '&4',
    'maroon': '&4',
    'purple': '&5',
    'dark_yellow': '&6',
    'gold': '&6',
    'gray': '&7',
    'grey': '&7',
    'silver': '&7',
    'dark_gray': '&8',
    'dark_grey': '&8',
    'indigo': '&9',
    'blue': '&9',
    'bright_green': '&a',
    'lime': '&a',
    'cyan': '&b',
    'aqua': '&b',
    'red': '&c',
    'pink': '&d',
    'yellow': '&e',
    'white': '&f'
  }
}
