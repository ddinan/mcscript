const { createServer } = require('./client.js')

createServer({
  'port': process.env.PORT,
  'name': 'MCScript Server',
  'motd': 'Server made in JavaScript!',
  'max-players': 20,
  'public': true,
  'online-mode': false,
  'disable-op-command': false,
  'ops': [ 'Venk', 'Waxtz' ],
  'plugins': { test: {} }
})
