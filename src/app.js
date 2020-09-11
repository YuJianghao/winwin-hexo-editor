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
const authController = require('./auth/controller')
const authRouter = require('./auth/router')
const version = require('./version')

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
      console.log(err)
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

// static resources
const serveStatic = require('koa-static')
const mount = require('koa-mount')
const pathToSwaggerUi = path.join(__dirname, '../swagger-ui-dist')
const swaggerKoa = new Koa()
swaggerKoa.use(serveStatic(pathToSwaggerUi))
app.use(mount('/apidoc', swaggerKoa))
app.use(serveStatic(path.join(process.cwd(), '/frontend/dist/pwa')))

// hexo-editor-server
require('./server')(app, {
  hexoRoot: config.hexoRoot,
  base: 'hexoeditorserver',
  auth: require('./lib/koa-parallel')([{
    fn: authController.apiKeyAuth,
    validator: err => err.status === 401
  }, {
    fn: compose([authController.jwtAuth, authController.requestAccessToken])
  }])
})

// routes
app.use(authRouter.routes(), authRouter.allowedMethods())
app.use(version.routes(), version.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
