const {
    join
} = require('path')

const EventEmitter = require('events').EventEmitter
const requireIndex = require('requireindex')
const plugins = requireIndex(join(__dirname))
const Logger = require('js-logger')
const crypto = require('crypto')
const MD5 = require('md5.js')
const zlib = require('zlib')

module.exports.server = (server, options) => {
    server.pid = process.pid
    server.log = Logger
    server.log.useDefaults()

    server.log.info(`Starting MCScript server version 0.30c (${require('../../package.json').version})`)

    server.salt = crypto.randomBytes(16).toString('hex')
    server['online_players'] = 0

    process.on('SIGINT', () => {
        setTimeout(() => {
            process.exit(0)
        }, 500)
    })

    server
        .on('error', (error) => {
            server.log.error(`Oops! Something went wrong, ${error}`)
        })
        .on('listening', () => {
            const host = server._server.socketServer.address()
            if (host.address === "0.0.0.0") host.address = "127.0.0.1"
            server.log.info(`Started MCScript server on ${host.address}:${host.port}`)
        })
        ._server.on('connection', (client) => {
            client.on('error', error => server.emit('clientError', client, error))
        })

    server._server.on('login', (client) => {
        if (client.socket.listeners('end').length === 0) return
        const player = new EventEmitter()
        player._client = client

        Object.keys(plugins)
            .filter(pluginName => plugins[pluginName].player !== undefined)
            .forEach(pluginName => plugins[pluginName].player(player, server, options))

        server.emit('newPlayer', player)
        player.emit('asap')
        player.login()
    })

    server.heartbeat()
}

module.exports.player = (player, server, settings) => {
    player.login = () => {
        player._client.on('error', (err) => {
            server.log.info(err.stack)
        })

        if (server.getPlayer(player._client.username)) {
            return player._client.write('disconnect_player', {
                disconnect_reason: 'You already joined the server.'
            })
        }

        player.verification_key = player._client.verification_key
        player.id = server.entityID
        player.username = player._client.username
        player.ip = player._client.socket.remoteAddress

        server.log.info(`${player.username} [/${player._client.socket.remoteAddress}:${player._client.socket.remotePort}] logged in with entity id ${player.id}`)

        player.emit('connected')

        player._client.on('end', () => {
            server.players.forEach((_player) => {
                if (_player.id !== player.id) {
                    _player._client.write('despawn_player', {
                        player_id: player.id
                    })
                }
            })
            const index = server.players.indexOf(player)
            if (index > -1) server.players.splice(index, 1)
            server._writeAll('message', {
                player_id: player.id,
                message: `&e${player.username} left the game`
            })
            server.log.info(`${player.username} left the game`)
            server['online_players']--
            player.emit('disconnected')
        })

        player._client.write('level_initialize', {})

        const compressedMap = zlib.gzipSync(server.world.dump())

        for (let i = 0; i < compressedMap.length; i += 1024) {
            player._client.write('level_data_chunk', {
                chunk_data: compressedMap.slice(i, Math.min(i + 1024, compressedMap.length)),
                percent_complete: i === 0 ? 0 : Math.ceil(i / compressedMap.length * 100)
            })
        }

        player._client.write('level_finalize', {
            x_size: 256,
            y_size: 64,
            z_size: 256
        })

        if (settings['max-players'] < server['online_players'] + 1) {
            player._client.write('disconnect_player', {
                disconnect_reason: 'The player limit has been reached, please try again later.'
            })
        } else {
            if (settings['online-mode'] === true) {
                if ((new MD5().update(server.salt + player._client.username).digest('hex')) === player.verification_key) {
                    player.spawn()
                } else {
                    player._client.write('disconnect_player', {
                        disconnect_reason: 'Your username could not be verified!'
                    })
                    server.log.info(`${player.username} couldn't be verified!`)
                }
            } else {
                player.spawn()
            }
        }
    }
}