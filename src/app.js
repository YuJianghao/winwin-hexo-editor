const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const compose = require('koa-compose')
const cors = require('koa-cors')
const path = require('path')

const config = require('./loadConfig')
const auth = require('./auth')
const token = require('./token')

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
      ctx.body.message = 'server internal error, try again later'
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
app.use(logger())
app.use(require('koa-static')(path.join(process.cwd(), '/public')))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// hexo-editor-server
require('@winwin/hexo-editor-server')(app, {
  hexoRoot: config.hexoRoot,
  base: 'hexoeditorserver',
  auth: compose([auth.jwtAuth, auth.requestAccessToken])
})

// routes
app.use(token.routes(), token.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
