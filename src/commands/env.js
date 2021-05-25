module.exports = {
    AddCommand: function(player, server) {
        server.commands.add({
            base: 'env',
            info: 'Changes the env setting of <setting> to <input>.',
            usage: '/env <setting> <input>',
            action(params) {
                if (params.length === 0) return player.chat("%SYou need to specify an env setting to change.")
                if (params.length === 1) return player.chat("%SYou need to specify what to change the setting to.")

                const setting = params.toString().split(' ')[0]
                const input = params.toString().split(' ')[1]

                function isHexColor(hex) {
                    return typeof hex === 'string' &&
                        hex.length === 6 &&
                        !isNaN(Number('0x' + hex))
                }

                const settings = ['sky', 'cloud', 'fog', 'shadow', 'sunlight']

                if (!settings.includes(setting.toLowerCase())) return player.chat("%SThis is not a valid env setting.")
                if (!isHexColor(input.replace('#', ''))) return player.chat("%SThis is not a valid hex value.")

                server.utils.hexToRGB = function hexToRGB(hex) {
                    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                    return result ? {
                        r: parseInt(result[1], 16),
                        g: parseInt(result[2], 16),
                        b: parseInt(result[3], 16)
                    } : null;
                }

                const r = server.utils.hexToRGB(input).r
                const g = server.utils.hexToRGB(input).g
                const b = server.utils.hexToRGB(input).b

                let regex

                let variable
                switch (setting) {
                    case "sky":
                        variable = 0
                        break;
                    case "cloud":
                        variable = 1
                        break;
                    case "fog":
                        variable = 2
                        break;
                    case "shadow":
                        variable = 3
                        break;
                    case "sunlight":
                        variable = 4
                        break;
                }

                const fs = require('fs')

                fs.readFile('./levels/properties/level.prop', {
                    encoding: 'utf-8'
                }, function(err, data) {
                    if (err) throw error;

                    let dataArray = data.split('\n');
                    let lastIndex = -1;

                    for (let index = 0; index < dataArray.length; index++) {
                        if (dataArray[index].includes(setting.toUpperCase())) {
                            lastIndex = index;
                            break;
                        }
                    }

                    dataArray.splice(lastIndex, 1); // remove the keyword 'user1' from the data Array

                    dataArray.push(setting.toUpperCase() + "=" + input.toUpperCase())
                    const updatedData = dataArray.join('\n');
                    fs.writeFile('./levels/properties/level.prop', updatedData, (err) => {
                        if (err) throw err;
                        console.log('Successfully updated the file data');
                    });

                });

                player.sendEnvColor(variable, r, g, b)

                player.chat("%SChanged &b" + setting + " %Sto &b" + input + "%S.")
            }
        })
    }
};