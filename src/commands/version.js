var methods = {
  AddCommand: function(player, server) {
    player.commands.add({
      base: 'version',
      info: 'get the version of the server',
      usage: '/version',
      action () {
        return `This server is running MCScript (${require('../../package').version}).`
      }
    })
  }
}

module.exports = methods;
