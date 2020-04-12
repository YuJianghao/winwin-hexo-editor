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
