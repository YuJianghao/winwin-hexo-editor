const auth = require('basic-auth')
const jwt = require('jsonwebtoken')
const compose = require('koa-compose')
const parallel = require('../lib/koa-parallel')
const fs = require('fs')
if (!fs.existsSync('./data/'))fs.mkdirSync('./data')
const debug = require('debug')('hexo-editor:server')
const StorageService = require('../service/StorageService')
const { ds } = require('../service')

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
    const availableAPIKEYS = StorageService.getAvailableAPIKEY()
    if (availableAPIKEYS.includes(apikey)) {
      debug('apikey auth pass')
      StorageService.setAPIKEYLastUsed(apikey)
      ctx.state.apikey = apikey
      await next()
    } else {
      debug('APIKEY not available')
      ctx.throw(new AuthError('Authtication Error', AuthError.AuthticationError))
    }
  }
}

const tokens = {}
exports.requestAPIKEY = async function (ctx, next) {
  const token = jwt.sign({ issueat: new Date().valueOf(), type: 'apikeytoken' }, StorageService.getApikeySecret(), { expiresIn: '5min' })
  tokens[token] = true
  ctx.body = {
    success: true,
    data: {
      token
    }
  }
}

exports.removeAPIKEY = async function (ctx, next) {
  if (ctx.state.apikey) {
    const apikey = ctx.state.apikey
    StorageService.removeAPIKEY(apikey)
  } else {
    const issuedAt = ctx.request.body.issuedAt
    StorageService.removeAPIKEYByIssuedAt(issuedAt)
  }
  ctx.body = {
    success: true
  }
}

exports.getAPIKEY = async function (ctx, next) {
  // 这个apikey只是一个随机字符串没啥含义
  const apikey = jwt.sign({ issueat: new Date().valueOf(), type: 'apikey' }, 's' + Math.random())
  const deviceType = ctx.request.body.deviceType || 'unknown'
  const deviceSystem = ctx.request.body.deviceSystem || 'unknown'
  StorageService.addAPIKEY({ apikey, deviceType, deviceSystem })
  ctx.body = {
    success: true,
    data: {
      apikey
    }
  }
}

exports.getAPIKEYInfo = async function (ctx, next) {
  // 这个apikey只是一个随机字符串没啥含义
  ctx.body = {
    success: true,
    data: {
      apikeys: StorageService.getAPIKEYInfo()
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
      decoded = jwt.verify(token, StorageService.getApikeySecret())
    } catch (e) {
      ctx.throw(new AuthError('Authtication Error', AuthError.AuthticationError))
    }
    if (!Object.keys(tokens).includes(token)) {
      ctx.throw(new AuthError('APIKEY token expired', AuthError.API_TOKEN_EXPIRE))
    } else {
      delete tokens[token]
      ctx.state.user = decoded
      await next()
    }
  }
}

exports.jwtAuth = async function (ctx, next) {
  const token = resolveAuthorizationHeader(ctx)
  if (!token) {
    ctx.throw(new AuthError('Bearer token required', AuthError.NO_BEARER_TOKEN))
  } else {
    try {
      const decoded = jwt.verify(token, StorageService.getJwtSecret())
      ctx.state.user = decoded
    } catch (err) {
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
    var dbuser = await ds.hasUser(user.name, user.pass)
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
  var token = jwt.sign({ id, name, type: 'access' }, StorageService.getJwtSecret(), { expiresIn: StorageService.getJwtExpire() })
  var refreshToken = jwt.sign({ id, name, type: 'refresh' }, StorageService.getJwtSecret(), { expiresIn: StorageService.getJwtRefresh() })
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
