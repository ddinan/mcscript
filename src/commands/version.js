module.exports = {
    AddCommand: function(player, server) {
        server.commands.add({
            base: 'version',
            info: 'get the version of the server',
            usage: '/version',
            action() {
                return `This server is running MCScript (${require('../../package').version}).`
            }
        })
    }
};