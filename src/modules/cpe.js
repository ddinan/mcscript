module.exports.player = (player) => {
    player._client.on('ext_info', (packet) => {
        player.extension_count = packet.extension_count
        player.app_name = packet.app_name
    })

    player._client.on('ext_entry', (packet) => {
        player.supported_extensions.push(packet)
    })
}