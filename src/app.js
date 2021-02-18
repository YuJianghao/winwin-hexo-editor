const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const koaLogger = require('koa-logger')
const cors = require('koa-cors')
const log4js = require('log4js')
const logger = log4js.getLogger('server')

// error handler
onerror(app)
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = {
      success: false,
      message: err.message
    }
    if (ctx.status === 500) {
      ctx.body.message = 'server internal error. Fix problem and try again later. This can be caused by unexpected input or server error.'
      logger.error(500, err)
    }
  }
})

// cors
app.use(cors())

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(koaLogger((str, args) => {
  // redirect koa logger to other output pipe
  // default is process.stdout(by console.log function)
  log4js.getLogger('http').info(str)
}))

app.use(require('koa-static')(require('path').resolve(__dirname, '../frontend/dist/pwa')))

const auth = require('./auth/router')
const { jwtAuth, requestAccessToken } = require('./auth/controller')
app.use(auth.routes(), auth.allowedMethods())
app.use(jwtAuth)
app.use(requestAccessToken)

const hexo = require('./hexo/router')
app.use(hexo.routes(), hexo.allowedMethods())
module.exports = app
