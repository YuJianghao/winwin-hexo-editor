const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const koaLogger = require('koa-logger')
const cors = require('koa-cors')
const path = require('path')
const log4js = require('log4js')
const logger = log4js.getLogger('server')
const authController = require('./auth/controller')
const authRouter = require('./auth/router')
const settings = require('./settings/router')
const version = require('./version')
const { configService } = require('./service/config_service')
const {
  hexoeditorserver,
  initHexo,
  HexoError
} = require('./server')

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
      logger.error(500, err)
    }
  }
})

const { dataServiceErrorHandler } = require('./errorHandlers')
app.use(dataServiceErrorHandler)

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

// static resources
const serveStatic = require('koa-static')
app.use(serveStatic(path.join(process.cwd(), '/frontend/dist/pwa')))

// install
const isInstalled = configService.isInstalled()
if (!isInstalled) {
  const install = require('./install')
  app.use(install.routes(), install.allowedMethods())
} else {
  initHexo(configService.getHexoRoot()).catch(err => {
    if (![HexoError.EMPTY_HEXO_ROOT, HexoError.NOT_BLOG_ROOT].includes(err.code)) {
      logger.error('Unknown Error:', err)
      process.exit(1)
    }
  })
}

// hexo-editor-server
hexoeditorserver(app, {
  base: 'hexoeditorserver',
  auth: authController.apikeyOrJwt
})

// routes
app.use(authRouter.routes(), authRouter.allowedMethods())
app.use(settings.routes(), settings.allowedMethods())
app.use(version.routes(), version.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
