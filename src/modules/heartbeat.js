const fetch = require('node-fetch')

module.exports.server = (server, settings) => {
    if (settings.public === true) setInterval(() => server.heartbeat(), 45000)

    server.heartbeat = async () => {
        if (settings.public === true) {
            const body = await fetch(`https://www.classicube.net/heartbeat.jsp?port=${settings.port}&max=${settings['max-players']}&name=${settings['name']}&public=true&version=7&salt=${server.salt}&software=MCScript%20${require('../../package').version}&users=${server['online_players']}`)
                .then(res => res.json())
                .catch(() => {})
            if ((body && body.errors[0][0]) && body.errors[0][0].startsWith('Port')) console.log(`Port ${settings.port} not open, you may need to port forward it.`)
        }
    }
}