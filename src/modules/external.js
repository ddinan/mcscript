module.exports.server = (server, settings) => {
    server.plugins = {}
    server.pluginCount = 0
    server.externalPluginsLoaded = false

    server.addPlugin = (name, plugin, set) => {
        if (!name || !plugin) throw new Error('You need a name and object for your plugin!')
        server.plugins[name] = {
            id: server.pluginCount,
            name: name,
            player: plugin.player,
            server: plugin.server,
            settings: set,
            enabled: true
        }
        server.pluginCount++
        if (server.externalPluginsLoaded && plugin.server) server.plugins[name].server(server, settings)
    }

    Object.keys(settings.plugins).forEach((p) => {
        if (settings.plugins[p].disabled) return
        try {
            require.resolve(p)
        } catch (err) {
            try {
                require.resolve(`../../plugins/${p}`)
            } catch (err) {
                throw new Error(`Cannot find plugin "${p}"`)
            }
            return server.addPlugin(p, require(`../../plugins/${p}`), settings.plugins[p])
        }
        server.addPlugin(p, require(p), settings.plugins[p])
    })

    Object.keys(server.plugins).forEach((p) => {
        if (server.plugins[p].server) server.plugins[p].server(server.plugins[p], server, settings)
    })

    server.on('asap', () => {
        Object.keys(server.plugins).map((p) => {
            server.log.info(`Plugin "${server.plugins[p].name}" loaded!`)
        })
    })

    server.externalPluginsLoaded = true
}

module.exports.player = (player, server) => {
    Object.keys(server.plugins).forEach((p) => {
        const plugin = server.plugins[p]
        if (plugin.player) plugin.player(plugin, player, server)
    })
}