module.exports = {
    AddCommand: function(player, server) {
        server.commands.add({
            base: 'help',
            info: 'to show all commands',
            usage: '/help [page:command name]',
            parse: function parse(str) {
                const params = str.split(' ')
                const page = parseInt(params[params.length - 1])
                if (page) params.pop()
                const search = params.join(' ')
                return {
                    search: search,
                    page: (page && page - 1) || 0
                }
            },
            action: function action(_ref) {
                let search = _ref.search
                let page = _ref.page

                if (page < 0) return 'Page # must be >= 1'
                let hash = server.commands.uniqueHash

                let PAGE_LENGTH = 7

                let found = Object.keys(hash).filter((h) => {
                    return (`${h} `).indexOf((search && `${search} `) || '') === 0
                })

                if (found.length === 0) {
                    return `${server.color.red}Could not find any matches`
                } else if (found.length === 1) {
                    let cmd = hash[found[0]]
                    let usage = (cmd.params && cmd.params.usage) || cmd.base
                    let info = (cmd.params && cmd.params.info) || 'No info'
                    player.chat(`${server.color.white}${usage}${server.color.gray}: ${info}`)
                } else {
                    let totalPages = Math.ceil((found.length - 1) / PAGE_LENGTH)
                    if (page >= totalPages) return `${server.color.red}The number you have entered is too big, it must be at most ${totalPages}`
                    found = found.sort()
                    if (found.indexOf('search') !== -1) {
                        let baseCmd = hash[search]
                        player.chat(`${baseCmd.base} -` + ((baseCmd.params && baseCmd.params.info && ` ${baseCmd.params.info}`) || ''))
                    } else {
                        player.chat(`${server.color.green}--- Showing help page ${(page + 1)} of ${totalPages} (/help <page>) ---`)
                    }
                    for (let i = PAGE_LENGTH * page; i < Math.min(PAGE_LENGTH * (page + 1), found.length); i++) {
                        if (found[i] === search) continue
                        let cmd = hash[found[i]]
                        let usage = (cmd.params && cmd.params.usage) || cmd.base
                        let info = (cmd.params && cmd.params.info) || 'No info'
                        player.chat(`${server.color.white}${usage}${server.color.gray}: ${info}`)
                    }
                }
            }
        })
    }
};