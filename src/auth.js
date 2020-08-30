const auth = require('basic-auth')
const koaJwt = require('koa-jwt')
const jwt = require('jsonwebtoken')
const JSONdb = require('simple-json-db')
const fs = require('fs')
const config = require('./loadConfig')
if (!fs.existsSync('./data/'))fs.mkdirSync('./data')
const db = new JSONdb('./data/db.json')
db.set('name', config.username)
db.set('pass', config.password)
const debug = require('debug')('hexo-editor:server')

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
  let err
  if (!apikey) {
    err = new Error()
    err.status = 401
    err.message = 'APIKEY required'
  } else {
    const availableAPIKEYS = db.get('apikeys') || []
    if (availableAPIKEYS.includes(apikey)) {
      debug('apikey auth pass')
      ctx.state.apikey = apikey
      await next()
    } else {
      debug('APIKEY not available')
      err = new Error()
      err.status = 401
      err.message = 'Authentication Error'
    }
  }
  if (err) {
    debug('apikey auth fail')
    throw err
  }
}

exports.requestAPIKEY = async function (ctx, next) {
  ctx.body = {
    success: true,
    data: {
      token: jwt.sign({ issueat: new Date().valueOf(), type: 'apikeytoken' }, config.apikeySecret, { expiresIn: '5min' })
    }
  }
}

exports.removeAPIKEY = async function (ctx, next) {
  const apikey = ctx.state.apikey ? ctx.state.apikey : ctx.body.apikey
  const apikeys = db.get('apikeys') || []
  apikeys.splice(apikeys.indexOf(apikey), 1)
  db.set('apikeys', apikeys)
  db.sync()
  ctx.body = {
    success: true
  }
}

exports.getAPIKEY = async function (ctx, next) {
  // 这个apikey只是一个随机字符串没啥含义
  const apikey = jwt.sign({ issueat: new Date().valueOf(), type: 'apikey' }, 's' + Math.random())
  const apikeys = db.get('apikeys') || []
  apikeys.push(apikey)
  db.set('apikeys', apikeys)
  db.sync()
  ctx.body = {
    success: true,
    data: {
      apikey
    }
  }
}

exports.apiKeyJwtAuth = koaJwt({ secret: config.apikeySecret })

exports.jwtAuth = koaJwt({ secret: config.jwtSecret })
// after jwtAuth payload is set inside ctx.state.user
// payload should be { id: ObjectId }

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
    var valid = db.get('name') === user.name && db.get('pass') === user.pass
    // var query = await User.find(user)
    if (valid) {
      // if user exist then set id
      ctx.state.id = user.name
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
  var token = jwt.sign({ id, type: 'access' }, config.jwtSecret, { expiresIn: config.jwtExpire })
  var refreshToken = jwt.sign({ id, type: 'refresh' }, config.jwtSecret, { expiresIn: config.jwtRefresh })
  ctx.body = {
    success: true,
    message: 'success',
    data: { id, token, refreshToken }
  }
}
