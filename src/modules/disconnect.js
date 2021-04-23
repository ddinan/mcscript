module.exports.player = (player) => {
    player.disconnect = (reason) => {
        player._client.write('disconnect_player', {
            disconnect_reason: reason
        })
    }
}