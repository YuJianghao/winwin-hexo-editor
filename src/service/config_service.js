const JSONdb = require('simple-json-db')
const path = require('path')
const logger = require('log4js').getLogger('services:config-service')
const { initHexo } = require('../server')
const JWT_SECRET = 'JWT_SECRET'
const JW_EXPIRE = 'JW_EXPIRE'
const JW_REFRESH = 'JW_REFRESH'
const APIKEY_SECRET = 'APIKEY_SECRET'
const HEXO_ROOT = 'HEXO_ROOT'
const INSTALLED = 'INSTALLED'

class ConfigServiceError extends Error {
  constructor (message, code) {
    super(message)
    Error.captureStackTrace(this)
    this.code = code
  }
}

ConfigServiceError.prototype.name = 'ConfigServiceError'
ConfigServiceError.BAD_OPTIONS = 'BAD_OPTIONS'

class ConfigService {
  constructor () {
    try {
      this._db = new JSONdb(path.resolve(process.cwd(), './data/db.json'))
      logger.info('database loaded')
    } catch (err) {
      logger.error('failed to create database from json file')
      throw err
    }
  }

  _get (key) {
    return this._db.get(key)
  }

  _set (key, value) {
    this._db.set(key, value)
    this.sync()
  }

  sync () {
    try {
      this._db.sync()
      logger.info('database synced')
    } catch (err) {
      logger.error('failed to save database to json file')
      throw err
    }
  }

  clear () {
    this._db.JSON({})
    this.sync()
  }

  setJwtSecret (secret) {
    if (!secret) return
    this._db.set(JWT_SECRET, secret)
    this.sync()
  }

  getJwtSecret () {
    return this._db.get(JWT_SECRET)
  }

  setJwtExpire (expire) {
    if (!expire) return
    this._db.set(JW_EXPIRE, expire)
    this.sync()
  }

  getJwtExpire () {
    return this._db.get(JW_EXPIRE)
  }

  setJwtRefresh (refresh) {
    if (!refresh) return
    this._db.set(JW_REFRESH, refresh)
    this.sync()
  }

  getJwtRefresh () {
    return this._db.get(JW_REFRESH)
  }

  setApikeySecret (secret) {
    if (!secret) return
    this._db.set(APIKEY_SECRET, secret)
    this.sync()
  }

  getApikeySecret () {
    return this._db.get(APIKEY_SECRET)
  }

  async setHexoRoot (hexoRoot) {
    if (!hexoRoot) return
    const originalHexoRoot = this.getHexoRoot()
    this._db.set(HEXO_ROOT, hexoRoot)
    try {
      await initHexo(hexoRoot)
    } catch (err) {
      this._db.set(HEXO_ROOT, originalHexoRoot)
      throw err
    }
    this.sync()
  }

  getHexoRoot () {
    return this._db.get(HEXO_ROOT)
  }

  markInstalled () {
    this._db.set(INSTALLED, true)
    this._db.sync()
  }

  isInstalled () {
    return this._db.get(INSTALLED)
  }
}
const storageService = new ConfigService()
module.exports = {
  storageService,
  ConfigServiceError
}
