module.exports = {
    AddCommand: function(player, server) {
        server.commands.add({
            base: 'position',
            info: 'Shows your position on the server.',
            usage: '/position',
            action() {
                player.chat("X=" + player.pos.x / 32 + ", Y=" + ((player.pos.y / 32) - 1) + ", Z=" + player.pos.z / 32 + ", Yaw=" + player.yaw + ", Pitch=" + player.pitch)
            }
        })
    }
};