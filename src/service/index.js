const fs = require('fs')
const path = require('path')
const registerModels = require('./register_models')
const Database = require('warehouse')
const WarehouseError = require('warehouse/lib/error')
const DB_VERSION = 1
const DB_PATH = '../../data/'
const DB_FILE = 'wdb.json'

class DataServiceError extends Error {
  constructor (message, code) {
    super(message)
    Error.captureStackTrace(this)
    this.code = code
  }
}

DataServiceError.prototype.name = 'DataServiceError'
DataServiceError.INITIATING = 'INITIATING'
DataServiceError.USER_EXIST = 'USER_EXIST'
DataServiceError.USER_NOT_EXIST = 'USER_NOT_EXIST'

class DataService {
  constructor () {
    this.ready = false
    this.init()
  }

  async init () {
    // create database file
    if (!fs.existsSync(path.resolve(__dirname, DB_PATH))) {
      fs.mkdirSync(path.resolve(__dirname, DB_PATH))
    }
    // create database
    this.database = new Database({
      version: DB_VERSION,
      path: path.resolve(__dirname, DB_PATH, DB_FILE)
    })
    if (!fs.existsSync(path.resolve(__dirname, DB_PATH, DB_FILE))) {
      await this.save()
    }
    // register models
    registerModels(this)
    await this.database.load()
    this.ready = true
  }

  checkReady () {
    if (!this.ready) throw new DataServiceError('service initiating', DataServiceError.INITIATING)
  }

  save () {
    return this.database.save()
  }

  model (name, schema) {
    return this.database.model(name, schema)
  }

  async clear () {
    this.database = new Database({
      version: DB_VERSION,
      path: path.resolve(__dirname, DB_PATH, 'wdb.json')
    })
    await this.save()
  }

  async adduser (username, password) {
    const User = this.model('User')
    if (User.findOne({ username })) {
      throw new DataServiceError('duplicate user:' + username, DataServiceError.USER_EXIST)
    }
    await User.insertOne({ username, password })
    await this.save()
  }

  async updateUser (id, username, password) {
    const User = this.model('User')
    const update = {}
    update.username = username
    update.password = password
    try {
      await User.updateById(id, update)
    } catch (err) {
      if (err.name === WarehouseError.ID_NOT_EXIST) {
        throw new DataServiceError('user not exists', DataServiceError.USER_NOT_EXIST)
      }
      throw err
    }
  }

  async hasUser (username, password) {
    const User = this.model('User')
    if (password) {
      return !!User.findOne({ username, password })
    } else {
      return !!User.findOne({ username })
    }
  }
}

const ds = new DataService()
module.exports = { ds, DataServiceError }
