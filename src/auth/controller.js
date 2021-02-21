// TODO: basic-auth
// TODO: jwt-auth
// TODO: apikey-auth
const auth = require('basic-auth')
const jwt = require('jsonwebtoken')
const compose = require('koa-compose')
const { SHA1 } = require('crypto-js')
const { v4: uuidv4 } = require('uuid')
const storage = require('../services/storage')
const logger = require('log4js').getLogger('auth')
exports.basicAuth = async function (ctx, next) {
  // get name and pass from reqest header
  const user = auth(ctx.request)
  if (!user) {
    // if not a valide basic auth header
    const err = new Error()
    err.status = 401
    err.message = 'basic authentication required'
    throw err
  } else {
    // find if user exist in database
    let valid = true
    if (user.name !== storage.get('config').username) valid = false
    else if (SHA1(user.pass).toString() !== storage.get('config').password) valid = false
    // let query = await User.find(user)
    if (valid) {
      logger.info('basic auth pass')
      await next()
    } else {
      const err = new Error()
      err.status = 401
      err.message = 'wrong username or password'
      throw err
    }
  }
}

exports.getToken = async function (ctx, next) {
  const uuid = uuidv4()
  const accessToken = jwt.sign({ type: 'access', uuid }, storage.get('config').secret, { expiresIn: storage.get('config').expire })
  const refreshToken = jwt.sign({ type: 'refresh', uuid }, storage.get('config').secret, { expiresIn: storage.get('config').refresh })
  const refreshTokens = storage.get('refresh') || {}
  refreshTokens[uuid] = refreshToken
  storage.set('refresh', refreshTokens)
  ctx.body = { accessToken, refreshToken }
}
function extractToken (ctx) {
  return ctx.header.authorization.split(' ')[1]
}
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
  throw new Error('Authtication Error')
}
exports.jwtAuth = compose([async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (err.message === 'Authtication Error') {
      ctx.status = 401
      ctx.body = {
        message: 'Authtication Error'
      }
    }
  }
}, async function (ctx, next) {
  // 为了动态读取secret
  const token = resolveAuthorizationHeader(ctx)
  if (!token) {
    throw new Error('Authtication Error')
  } else {
    try {
      const decoded = jwt.verify(token, storage.get('config').secret)
      logger.debug('jwt auth pass')
      ctx.state.user = decoded
    } catch (err) {
      throw new Error('Authtication Error')
    }
    await next()
  }
}])

/**
 * 检查当前refresh token是否在黑名单
 */
exports.blacklist = async (ctx, next) => {
  const token = extractToken(ctx)
  if ((storage.get('blacklist') || []).map(o => o.token).includes(token)) {
    logger.info('block invalid refresh token')
    const err = new Error()
    err.status = 401
    err.message = 'Authentication Error'
    throw err
  }
  await next()
}

exports.requestAccessToken = async function (ctx, next) {
  if (ctx.state.user.type !== 'access') {
    const err = new Error()
    err.status = 403
    err.message = 'Require Access Token'
    throw err
  }
  await next()
}
exports.requestRefreshToken = async function (ctx, next) {
  if (ctx.state.user.type !== 'refresh') {
    const err = new Error()
    err.status = 403
    err.message = 'Require Refresh Token'
    throw err
  }
  logger.info('refresh token used')
  await next()
}
exports.logout = async (ctx, next) => {
  const token = extractToken(ctx)
  let blacklist = (storage.get('blacklist') || [])
  const refreshTokens = (storage.get('refresh') || {})
  const refreshToken = refreshTokens[ctx.state.user.uuid]
  if (refreshToken) {
    blacklist.push({ token, exp: ctx.state.user.exp })
    blacklist = blacklist.filter(o => o.exp > parseInt((new Date()).valueOf() / 1000, 10))
    logger.info('block token')
    storage.set('blacklist', blacklist)
    delete refreshTokens[ctx.state.user.uuid]
    storage.set('refresh', refreshTokens)
  }
  ctx.status = 200
}
exports.info = async (ctx, next) => {
  ctx.body = {
    name: storage.get('config').username
  }
}
