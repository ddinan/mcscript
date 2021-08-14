#!/usr/bin/env node

const {
    createServer
} = require('./client.js')
const fs = require('fs')
const ini = require('ini')

const config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))

createServer({
    'port': config.general.port,
    'name': config.general.name,
    'motd': config.general.motd,
    'max-players': config.general.maxPlayers,
    'public': config.general.public,
    'online-mode': config.general.online,
    'disable-op-command': config.disableOp,
    'ops': config.general.ops,
    'plugins': {
        cosmetics: {}
    },
    'irc-channel': config.IRC.channel,
    'irc-password': config.IRC.password,
    'irc-server': config.IRC.server,
    'irc-nick': config.IRC.nick,
})