module.exports.server = (server) => {
    server._writeAll = (packetName, packetFields) => {
        server.players.forEach((player) => player._client.write(packetName, packetFields))
    }
}