const auth = require('basic-auth')
const koaJwt = require('koa-jwt')
const jwt = require('jsonwebtoken')
const JSONdb = require('simple-json-db')
const fs = require('fs')
if (!fs.existsSync('./data/'))fs.mkdirSync('./data')
const db = new JSONdb('./data/db.json')
db.set('name', process.env.HEXO_EDITOR_USERNAME)
db.set('pass', process.env.HEXO_EDITOR_PASSWORD)

exports.jwtAuth = koaJwt({ secret: process.env.JWT_SECRET })
// after jwtAuth payload is set inside ctx.state.user
// payload should be { id: ObjectId }

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
  // set id into jwt payload
  var token = jwt.sign({ id: ctx.state.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
  ctx.body = {
    success: true,
    message: 'success',
    data: { id: ctx.state.id, token }
  }
}
