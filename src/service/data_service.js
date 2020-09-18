const fs = require('fs')
const path = require('path')
const logger = require('log4js').getLogger('DataService')
const registerModels = require('./register_models')
const config = require('../../config.default')
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
DataServiceError.SAVE_FAIL = 'SAVE_FAIL'

class DataService {
  constructor () {
    this.ready = false
    this.init()
  }

  /**
   * 可能的错误: other
   */
  async init () {
    // create database file
    try {
      if (!fs.existsSync(path.resolve(__dirname, DB_PATH))) {
        fs.mkdirSync(path.resolve(__dirname, DB_PATH))
      } // 写文件可能失败
    } catch (err) {
      logger.error('fail to create database folder')
      throw err
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

  /**
   * 可能的错误：other
   */
  save () {
    try {
      return this.database.save()
    } catch (err) {
      logger.error('fail to save database')
      throw err
    }
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

  /**
   * 可能的错误：DataServiceError.USER_EXIST
   * @param {String} username 用户名
   * @param {String} password 密码
   */
  async addUser (username, password) {
    const User = this.model('User')
    if (User.findOne({ username })) {
      throw new DataServiceError('duplicate user:' + username, DataServiceError.USER_EXIST)
    }
    await User.insertOne({ username, password })
    await this.save()
  }

  async getUser (id) {
    const User = this.model('User')
    return User.findOne({ _id: id })
  }

  /**
   * 可能的错误：DataServiceError.USER_NOT_EXIST | other
   * @param {String} id 用户id
   * @param {String} username 用户名
   * @param {String} password 密码
   */
  async updateUser (id, username, password) {
    const User = this.model('User')
    const update = {}
    update.username = username || config.username
    update.password = password || config.password
    try {
      await User.updateById(id, update)
      await this.save()
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
      return User.findOne({ username, password })
    } else {
      return User.findOne({ username })
    }
  }

  async hasUserById (_id) {
    const User = this.model('User')
    return User.findOne({ _id })
  }
}

const dataService = new DataService()
module.exports = { dataService, DataServiceError }