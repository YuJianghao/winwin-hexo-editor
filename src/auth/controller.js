const auth = require('basic-auth')
const jwt = require('jsonwebtoken')
const compose = require('koa-compose')
const logger = require('log4js').getLogger('server:auth')
const parallel = require('../lib/koa-parallel')
const fs = require('fs')
if (!fs.existsSync('./data/'))fs.mkdirSync('./data')
const { storageService, ConfigServiceError } = require('../service/config_service')
const { ApikeyService, ApikeyServiceError } = require('../service/apikey_service')
const { UserService } = require('../service/user_service')

class AuthError extends Error {
  constructor (message, code) {
    super(message || code)
    Error.captureStackTrace(this)
    this.code = code
    this.status = 401
  }
}
AuthError.prototype.name = 'AuthError'
AuthError.AuthticationError = 'AuthticationError'
AuthError.NO_APIKEY = 'NO_APIKEY'
AuthError.NO_BEARER_TOKEN = 'NO_BEARER_TOKEN'
AuthError.API_TOKEN_EXPIRE = 'API_TOKEN_EXPIRE'

function resolveAuthorizationHeader (ctx) {
  if (!ctx.header || !ctx.header.authorization) {
    return
  }

  const parts = ctx.header.authorization.split(' ')

  if (parts.length === 2) {
    const scheme = parts[0]
    const credentials = parts[1]

    if (/^Bearer$/i.test(scheme)) {
      return credentials
    }
  }
  ctx.throw(401, 'Bad Authorization header format. Format is "Authorization: Bearer <token>"')
}

exports.apiKeyAuth = async function (ctx, next) {
  const apikey = resolveAuthorizationHeader(ctx)
  if (!apikey) {
    ctx.throw(new AuthError('APIKEY is required', AuthError.NO_APIKEY))
  } else {
    if (await ApikeyService.hasApikey(apikey)) {
      logger.debug('apikey auth pass')
      ctx.state.apikey = apikey
      ctx.state.user = ApikeyService.getUserFromApikey(apikey).toObject()
      ctx.state.user.id = ctx.state.user._id
      delete ctx.state.user._id
      await next()
    } else {
      logger.debug('apikey auth failed, try others')
      ctx.throw(new AuthError('Authtication Error', AuthError.AuthticationError))
    }
  }
}

exports.requestApikey = async function (ctx, next) {
  const token = ApikeyService.requestApikey(ctx.state.user.id)
  ctx.body = {
    success: true,
    data: {
      token
    }
  }
}

exports.removeApikey = async function (ctx, next) {
  if (ctx.state.apikey) {
    const apikey = ctx.state.apikey
    await ApikeyService.removeApikeyByApikey(apikey)
  } else {
    const _id = ctx.params.id
    await ApikeyService.removeApikeyById(_id)
  }
  ctx.body = {
    success: true
  }
}

exports.addApikey = async function (ctx, next) {
  // 这个apikey只是一个随机字符串没啥含义
  const id = ctx.state.user.id
  const deviceType = ctx.request.body.deviceType
  const deviceSystem = ctx.request.body.deviceSystem
  let data
  try {
    data = await ApikeyService.addApikey({ id, deviceType, deviceSystem })
  } catch (err) {
    if (err.code === ConfigServiceError.BAD_OPTIONS) {
      logger.debug(err.message)
      ctx.status = 400
      ctx.body = {
        success: false,
        message: err.message
      }
    } else {
      throw err
    }
  }
  ctx.body = {
    success: true,
    data
  }
}

exports.getAPIKEYInfo = async function (ctx, next) {
  ctx.body = {
    success: true,
    data: {
      apikeys: ApikeyService.getApikeysInfo()
    }
  }
}

exports.apiKeyJwtAuth = async function (ctx, next) {
  const token = resolveAuthorizationHeader(ctx)
  if (!token) {
    ctx.throw(new AuthError('APIKEY is required', AuthError.NO_APIKEY))
  } else {
    let decoded
    try {
      decoded = ApikeyService.decodeApikeyToken(token)
    } catch (e) {
      if (e.code === ApikeyServiceError.INVALID_APIKEY_TOKEN) {
        ctx.throw(new AuthError('Authtication Error', AuthError.AuthticationError))
      }
      throw e
    }
    ctx.state.user = decoded
    await next()
  }
}

exports.jwtAuth = async function (ctx, next) {
  const token = resolveAuthorizationHeader(ctx)
  if (!token) {
    ctx.throw(new AuthError('Bearer token required', AuthError.NO_BEARER_TOKEN))
  } else {
    try {
      const decoded = jwt.verify(token, storageService.getJwtSecret())
      logger.debug('jwt auth pass')
      ctx.state.user = decoded
    } catch (err) {
      ctx.throw(new AuthError('Authtication Error', AuthError.AuthticationError))
    }
    if (!await UserService.hasUserById(ctx.state.user.id)) {
      ctx.throw(new AuthError('Authtication Error', AuthError.AuthticationError))
    }
    await next()
  }
}

exports.requestAccessToken = async function (ctx, next) {
  if (ctx.state.user.type === 'refresh') {
    const err = new Error()
    err.status = 400
    err.name = 'Require Access token'
    err.message = 'Access Token is required.'
    throw err
  }
  await next()
}

exports.requestRefreshToken = async function (ctx, next) {
  if (ctx.state.user.type === 'access') {
    const err = new Error()
    err.status = 400
    err.name = 'Require Refresh token'
    err.message = 'Refresh Token is required.'
    throw err
  }
  await next()
}

exports.basicAuth = async function (ctx, next) {
  // get name and pass from reqest header
  var user = auth(ctx.request)
  if (!user) {
    // if not a valide basic auth header
    ctx.status = 401
    ctx.body = {
      success: false,
      message: 'basic authentication required'
    }
  } else {
    // find if user exist in database
    var dbuser = await UserService.hasUser(user.name, user.pass)
    // var query = await User.find(user)
    if (dbuser) {
      // if user exist then set id
      ctx.state.id = dbuser._id
      ctx.state.name = dbuser.username
      await next()
    } else {
      ctx.status = 401
      ctx.body = {
        success: false,
        message: 'wrong username or password'
      }
    }
  }
}

exports.getToken = async function (ctx, next) {
  // set id and token type into jwt payload
  const id = ctx.state.id || ctx.state.user.id
  const name = ctx.state.name || ctx.state.user.name
  var token = jwt.sign({ id, name, type: 'access' }, storageService.getJwtSecret(), { expiresIn: storageService.getJwtExpire() })
  var refreshToken = jwt.sign({ id, name, type: 'refresh' }, storageService.getJwtSecret(), { expiresIn: storageService.getJwtRefresh() })
  ctx.body = {
    success: true,
    message: 'success',
    data: { id, name, token, refreshToken }
  }
}

exports.apikeyOrJwt = parallel([{
  fn: exports.apiKeyAuth,
  validator: err => err.status === 401
}, {
  fn: compose([exports.jwtAuth, exports.requestAccessToken])
}])
