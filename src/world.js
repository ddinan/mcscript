const { readFile, writeFile } = require('fs')
const { gunzip, gzip } = require('zlib')
const { promisify } = require('util')

const [
  readFileAsync,
  writeFileAsync,
  gunzipAsync,
  gzipAsync
] = [
  promisify(readFile),
  promisify(writeFile),
  promisify(gunzip),
  promisify(gzip)
]

module.exports = class World {
  constructor (size) {
    this.size = size
    this.data = Buffer.alloc(4 + size.x * size.y * size.z)
    this.data.fill(0)
    this.data.writeInt32BE(this.size.x * this.size.y * this.size.z, 0)
  }

  setBlock (pos, block) {
    this.data.writeUInt8(block, 4 + pos.x + this.size.z * (pos.z + this.size.x * pos.y))
  }

  getBlock (pos) {
    return this.data.readUInt8(4 + pos.x + this.size.z * (pos.z + this.size.x * pos.y))
  }

  dump () {
    return this.data
  }

  async load () {
    this.data = await gunzipAsync(await readFileAsync('./levels/level.dat'))
  }

  async save () {
    await writeFileAsync('./levels/level.dat', await gzipAsync(this.data))
  }
}
