// TODO: basic-auth
// TODO: jwt-auth
// TODO: apikey-auth
const auth = require('basic-auth')
const jwt = require('jsonwebtoken')
const koaJWT = require('koa-jwt')
const compose = require('koa-compose')
const { SHA1 } = require('crypto-js')
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
    if (user.name !== storage.get('config').username)valid = false
    else if (SHA1(user.pass).toString() !== storage.get('config').password)valid = false
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
  var accessToken = jwt.sign({ type: 'access' }, storage.get('config').secret, { expiresIn: storage.get('config').expire })
  var refreshToken = jwt.sign({ type: 'refresh' }, storage.get('config').secret, { expiresIn: storage.get('config').refresh })
  ctx.body = {
    success: true,
    message: 'success',
    data: { accessToken, refreshToken }
  }
}
function extractToken (ctx) {
  return ctx.header.authorization.split(' ')[1]
}
exports.jwtAuth = compose([koaJWT({ secret: storage.get('config').secret }), blacklist])

/**
 * 讲当前token加入黑名单
 */
async function blacklist (ctx, next) {
  const token = extractToken(ctx)
  if ((storage.get('blacklist') || []).map(o => o.token).includes(token)) {
    logger.info('block invalid token')
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
    err.name = 'Require Access token'
    err.message = 'Access Token is required.'
    throw err
  }
  await next()
}
exports.requestRefreshToken = async function (ctx, next) {
  if (ctx.state.user.type !== 'refresh') {
    const err = new Error()
    err.status = 403
    err.name = 'Require Refresh token'
    err.message = 'Refresh Token is required.'
    throw err
  }
  logger.info('refresh token used')
  await next()
}
exports.logout = async (ctx, next) => {
  const token = extractToken(ctx)
  let blacklist = (storage.get('blacklist') || [])
  blacklist.push({ token, exp: ctx.state.user.exp })
  blacklist = blacklist.filter(o => o.exp > parseInt((new Date()).valueOf() / 1000, 10))
  logger.info('block token')
  storage.set('blacklist', blacklist)
  ctx.status = 200
}
exports.info = async (ctx, next) => {
  ctx.body = {
    name: storage.get('config').username
  }
}
