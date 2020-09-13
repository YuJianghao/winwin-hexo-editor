const JSONdb = require('simple-json-db')
const path = require('path')
const logger = require('log4js').getLogger('StorageService')
const {
  initHexo
} = require('../server')
const APIKEYS = 'APIKEYS'
const JWT_SECRET = 'JWT_SECRET'
const JW_EXPIRE = 'JW_EXPIRE'
const JW_REFRESH = 'JW_REFRESH'
const APIKEY_SECRET = 'APIKEY_SECRET'
const HEXO_ROOT = 'HEXO_ROOT'
const INSTALLED = 'INSTALLED'

class StorageServiceError extends Error {
  constructor (message, code) {
    super(message)
    Error.captureStackTrace(this)
    this.code = code
  }
}

StorageServiceError.prototype.name = 'StorageServiceError'
StorageServiceError.BAD_OPTIONS = 'BAD_OPTIONS'

class StorageService {
  constructor () {
    try {
      this._db = new JSONdb(path.resolve(process.cwd(), './data/db.json'))
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
    } catch (err) {
      logger.error('failed to save database to json file')
      throw err
    }
  }

  clear () {
    this._db.JSON({})
    this.sync()
  }

  /**
   * 添加一个APIKEY
   * @param {Object} opt 选项
   */
  addAPIKEY (opt) {
    // 格式化参数
    if (!opt.apikey) throw new StorageServiceError('opt.apikey is required', StorageServiceError.BAD_OPTIONS)
    if (!opt.deviceType) throw new StorageServiceError('opt.deviceType is required', StorageServiceError.BAD_OPTIONS)
    if (!opt.deviceSystem) throw new StorageServiceError('opt.deviceSystem is required', StorageServiceError.BAD_OPTIONS)
    const apikey = opt.apikey
    const deviceType = opt.deviceType
    const deviceSystem = opt.deviceSystem
    const issuedAt = new Date().valueOf()
    const apikeys = this._get(APIKEYS) || {}
    apikeys[apikey] = {
      apikey,
      deviceType,
      deviceSystem,
      issuedAt
    }
    this._set(APIKEYS, apikeys)
  }

  setAPIKEYLastUsed (apikey) {
    const apikeys = this._get(APIKEYS) || {}
    apikeys[apikey].lastUsedAt = new Date().valueOf()
    this._set(APIKEYS, apikeys)
  }

  removeAPIKEY (apikey) {
    const apikeys = this._get(APIKEYS) || {}
    delete apikeys[apikey]
    this._set(APIKEYS, apikeys)
  }

  removeAPIKEYByIssuedAt (issuedAt) {
    const apikeys = this._get(APIKEYS) || {}
    Object.keys(apikeys).filter(apikey => apikeys[apikey].issuedAt === issuedAt).map(apikey => this.removeAPIKEY(apikey))
  }

  getAPIKEY (apikey) {
    const apikeys = this._get(APIKEYS) || {}
    return apikeys[apikey] || {}
  }

  getAvailableAPIKEY () {
    const apikeys = this._get(APIKEYS) || {}
    return Object.keys(apikeys)
  }

  getAPIKEYInfo () {
    return this.getAvailableAPIKEY().map(apikey => this.getAPIKEY(apikey)).map(obj => {
      delete obj.apikey
      return obj
    })
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
const storageService = new StorageService()
module.exports = {
  storageService,
  StorageServiceError
}
