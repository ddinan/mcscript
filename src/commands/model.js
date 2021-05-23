module.exports = {
    AddCommand: function(player, server) {
        server.commands.add({
            base: 'model',
            info: 'change your model',
            usage: '/model <model>',
            action(model) {
                player._client.write('change_model', {
                    entity_id: -1,
                    model_name: model.replace(':', '|')
                })
                return `${server.color.green}Model changed to ${model}`
            }
        })
    }
};