const fs = require('fs')
const path = require('path')
const logger = require('log4js').getLogger('services:data-service')
const registerModels = require('./register_models')
const Database = require('warehouse')
const { ModelTypes } = require('../models')
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

class DataService {
  constructor () {
    this._ready = false
    this.modelTypes = ModelTypes
    this.init()
  }

  _checkReady () {
    if (!this._ready) {
      logger.warn('service initiating')
      throw new DataServiceError('service initiating', DataServiceError.INITIATING)
    }
  }

  async init () {
    logger.info('starting')
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
    // register models
    registerModels(this)
    // load
    if (fs.existsSync(path.resolve(__dirname, DB_PATH, DB_FILE))) {
      await this.database.load()
    }
    logger.info('ready')
    this._ready = true
  }

  save () {
    this._checkReady()
    try {
      return this.database.save()
    } catch (err) {
      logger.error('fail to save database')
      throw err
    }
  }

  model (name, schema) {
    this._checkReady()
    return this.database.model(name, schema)
  }

  async clear () {
    this._checkReady()
    this.database = new Database({
      version: DB_VERSION,
      path: path.resolve(__dirname, DB_PATH, 'wdb.json')
    })
    await this.save()
  }
}

const dataService = new DataService()
module.exports = {
  dataService,
  DataServiceError
}
