const World = require('../world')
const Vec3 = require('vec3')

module.exports.server = async (server) => {
  server.world = new World({ x: 256, y: 64, z: 256 })

  server.world.load()
    .then(() => {})
    .catch(async () => {
      for (let x = 0; x < server.world.size.x; x++) {
        for (let y = 0; y <= (server.world.size.y / 2); y++) {
          for (let z = 0; z < server.world.size.z; z++) {
            if (y === 0) {
              server.world.setBlock(new Vec3(x, y, z), 0x07)
            } else if (y <= (server.world.size.y / 2) - 4) {
              server.world.setBlock(new Vec3(x, y, z), 0x01)
            } else if (y <= (server.world.size.y / 2) - 1) {
              server.world.setBlock(new Vec3(x, y, z), 0x03)
            } else if (y === (server.world.size.y / 2)) {
              server.world.setBlock(new Vec3(x, y, z), 0x02)
            }
          }
        }
      }

      await server.world.save()
    })
}
