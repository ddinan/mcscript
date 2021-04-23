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
    'public': config.public,
    'online-mode': config.online,
    'disable-op-command': config.disableOp,
    'ops': config.ops,
    'plugins': {
        cosmetics: {}
    }
})