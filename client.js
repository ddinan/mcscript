const {
    createServer
} = require('minecraft-classic-protocol')
const {
    protocol
} = require('minecraft-classic-protocol-extension')
const {
    join
} = require('path')

const EventEmitter = require('events').EventEmitter
const requireIndex = require('requireindex')

module.exports.createServer = async (options = {}) => {
    options.customPackets = protocol

    const server = new MCServer()
    await server.connect(options)

    return server
}

class MCServer extends EventEmitter {
    constructor() {
        super()
        this._server = null
    }

    connect(options) {
        const modules = requireIndex(join(__dirname, 'src', 'modules'))
        this._server = createServer(options)

        Object.keys(modules)
            .filter(moduleName => modules[moduleName].server !== undefined)
            .forEach(moduleName => modules[moduleName].server(this, options))

        this._server.on('error', error => this.emit('error', error))
        this._server.on('clientError', error => this.emit('error', error))
        this._server.on('listening', () => this.emit('listening', this._server.socketServer.address().port))
        this.emit('asap')
    }
}