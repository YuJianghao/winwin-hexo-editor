const JSONdb = require('simple-json-db')
const path = require('path')
const APIKEYS = 'apikeys'
class StorageService {
  constructor () {
    this._db = new JSONdb(path.resolve(process.cwd(), './data/db.json'))
  }

  _get (key) {
    return this._db.get(key)
  }

  _set (key, value) {
    this._db.set(key, value)
    this.sync()
  }

  sync () {
    this._db.sync()
  }

  /**
   * 添加一个APIKEY
   * @param {Object} opt 选项
   */
  addAPIKEY (opt) {
    // 格式化参数
    if (!opt.apikey) throw new Error('opt.apikey is required')
    if (!opt.deviceType) throw new Error('opt.deviceType is required')
    if (!opt.deviceSystem) throw new Error('opt.deviceSystem is required')
    const apikey = opt.apikey
    const deviceType = opt.deviceType
    const deviceSystem = opt.deviceSystem
    const issuedAt = new Date().valueOf()
    const apikeys = this._get(APIKEYS) || {}
    apikeys[apikey] = { apikey, deviceType, deviceSystem, issuedAt }
    this._set(APIKEYS, apikeys)
  }

  setAPIKEYLastUsed (apikey) {
    const apikeys = this._get(APIKEYS) || {}
    apikeys[apikey].lastUsedAt = new Date().valueOf()
    console.log(apikeys)
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
}
module.exports = new StorageService()
