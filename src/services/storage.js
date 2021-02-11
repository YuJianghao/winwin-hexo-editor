
const { SHA1 } = require('crypto-js')
const { existsSync, mkdirSync } = require('fs')
const { throttle } = require('lodash')
const path = require('path')
const JSONdb = require('simple-json-db')
class Storage {
  constructor () {
    const root = path.resolve(process.cwd(), './data')
    const name = 'sjson.db'
    if (!existsSync(root))mkdirSync(root)
    this.db = new JSONdb(path.resolve(root, name))
    this.sync = throttle(this.sync, 500)
  }

  get (key) {
    this.sync()
    const r = this.db.get(key)
    return r
  }

  set (key, value) {
    const r = this.db.set(key, value)
    this.sync()
    return r
  }

  sync () {
    this.db.sync()
  }
}
const storage = new Storage()
storage.set('config', {
  root: '../testblog',
  port: 5777,
  secret: 'secret',
  expire: '1h',
  refresh: '7d',
  username: 'admin',
  password: SHA1(SHA1('admin').toString()).toString()
})

console.log(SHA1('admin').toString())
module.exports = storage
