const geoip = require('geoip-lite');

module.exports = {
    AddCommand: function(player, server) {
        server.commands.add({
            base: 'location',
            info: 'shows your location',
            usage: '/location',
            op: true,
            action() {
                if (player.ip === "127.0.0.1") return player.chat("&cCannot read information from home IP.")
                var location = geoip.lookup(player.ip);
                player.chat(`&eCountry: &b${location.country}&e, region: &b${location.region}&e, city: &b${location.city}&e.`)
            }
        })
    }
};