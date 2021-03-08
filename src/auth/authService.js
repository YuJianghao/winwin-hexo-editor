// #region config
const DI = require('../util/di')
const AuthConfig = require('./config')
const { IConfigService, genDescriptor } = require('../base/configService')
const configService = DI.inject(IConfigService)
// defalut username is admin
configService.register(AuthConfig.AUTH_USERNAME, genDescriptor('admin', 'string'))
// default password is admin SHA1(SHA1('admin').toString()).toString()
configService.register(AuthConfig.AUTH_PASSWORD, genDescriptor('7b2e9f54cdff413fcde01f330af6896c3cd7e6cd', 'string'))
configService.register(AuthConfig.AUTH_SECRET, genDescriptor('secret', 'string'))
configService.register(AuthConfig.AUTH_EXPIRE, genDescriptor('1h', 'string'))
configService.register(AuthConfig.AUTH_REFRESH, genDescriptor('7d', 'string'))
// #endregion

const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const { SHA1 } = require('crypto-js')
const { IStorageService } = require('../base/storageService')

class AuthService {
  constructor () {
    this._configService = DI.inject(IConfigService)
  }

  basicAuth (username, password) {
    console.log(username, this._configService.get(AuthConfig.AUTH_USERNAME))
    console.log(SHA1(password).toString(), this._configService.get(AuthConfig.AUTH_PASSWORD))
    if (username !== this._configService.get(AuthConfig.AUTH_USERNAME)) return false
    else if (SHA1(password).toString() !== this._configService.get(AuthConfig.AUTH_PASSWORD)) return false
    return true
  }

  getToken () {
    const storage = DI.inject(IStorageService)
    const uuid = uuidv4()
    const secret = this._configService.get(AuthConfig.AUTH_SECRET)
    const expire = this._configService.get(AuthConfig.AUTH_EXPIRE)
    const refresh = this._configService.get(AuthConfig.AUTH_REFRESH)
    const accessToken = jwt.sign({ type: 'access', uuid }, secret, { expiresIn: expire })
    const refreshToken = jwt.sign({ type: 'refresh', uuid }, secret, { expiresIn: refresh })
    const refreshTokens = storage.get('refresh') || {}
    refreshTokens[uuid] = refreshToken
    storage.set('refresh', refreshTokens)
    return { accessToken, refreshToken }
  }

  verifyToken (token) {
    return jwt.verify(token, this._configService.get(AuthConfig.AUTH_SECRET))
  }

  getUserInfo () {
    return {
      name: this._configService.get(AuthConfig.AUTH_USERNAME)
    }
  }
}
const IAuthService = 'IAuthService'
DI.provide(IAuthService, AuthService)
exports.IAuthService = IAuthService
