const AuthConfig = require('../auth/config')
const HexoConfig = require('../hexo/core/config')
const DI = require('../util/di')
const { IStorageService } = require('./storageService')

class ConfigService {
  constructor () {
    this._storageService = DI.inject(IStorageService)
    this._map = new Map()
    // defalut username is admin
    this.register(AuthConfig.AUTH_USERNAME, genDescriptor('admin', 'string'))
    // default password is admin SHA1(SHA1('admin').toString()).toString()
    this.register(AuthConfig.AUTH_PASSWORD, genDescriptor('7b2e9f54cdff413fcde01f330af6896c3cd7e6cd', 'string'))
    this.register(AuthConfig.AUTH_SECRET, genDescriptor('secret', 'string'))
    this.register(AuthConfig.AUTH_EXPIRE, genDescriptor('1h', 'string'))
    this.register(AuthConfig.AUTH_REFRESH, genDescriptor('7d', 'string'))
    this.register(HexoConfig.HEXO_ROOT, genDescriptor('', 'string', true))
  }

  getConfigDefs () {
    return [...this._map.keys()].map(key => ({ ...this._map.get(key), key }))
  }

  getConfig () {
    return this._storageService.get('config') || {}
  }

  _setConfig (config) {
    this._storageService.set('config', config)
  }

  _hasKey (key) {
    if (!this._map.has(key)) { throw Error('Unknown config key: ' + key) }
  }

  get (key) {
    this._hasKey(key)
    const config = this.getConfig()
    if (Object.prototype.hasOwnProperty.call(config, key)) return config[key]
    else if (this._map.get(key).required) throw new Error(`config ${key} shoundn't be null`)
    else return this._map.get(key).defaultValue
  }

  set (key, value) {
    this._hasKey(key)
    let config = this.getConfig()
    if (typeof value === 'undefined') delete config[key]
    else config = { ...config, [key]: value }
    this._setConfig(config)
  }

  register (key, descriptor = null) {
    if (this._map.has(key)) return false
    this._map.set(key, descriptor)
    return true
  }
}
function genDescriptor (defaultValue, type, required = false) {
  return { defaultValue, type, required }
}
const IConfigService = 'IConfigService'
DI.provide(IConfigService, ConfigService)
exports.IConfigService = IConfigService
