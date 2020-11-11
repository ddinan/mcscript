const irc = require('irc')

module.exports.server = (server) => {
  this.irc = new irc.Client('irc.esper.net', 'MCScript', {
    channels: ['#ChangeMe'],
    secure: false
  })

  this.irc.nick = 'MCScript'
  this.irc._updateMaxLineLength()
  this.irc.addListener('message', (from, to, message) => server.broadcast(`${server.color.purple}(IRC) <${from}> ${server.color.white}${message}`))
  this.irc.addListener('error', message => console.log('error: ', message))
}

module.exports.player = (player, server) => {
  this.irc.join('#ChangeMe')

  const ircSay = (message) => this.irc.say('#ChangeMe', `${message}`)
  player.on('chat', ({ message }) => ircSay(`${player.username}: ${message}`))
  player.on('connected', () => ircSay(`${player.username} connected`))
  player.on('disconnected', () => ircSay(`${player.username} disconnected`))
}
