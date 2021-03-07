const Router = require('koa-router')
const { IStorageService } = require('./services/storageService')
const Joi = require('joi')
const { validateRequestBody } = require('./util/middlewares')
const sha1 = require('crypto-js/sha1')
const DI = require('./util/di')
const { IHexo } = require('./hexo/core/hexo')
const { IConfigService } = require('./services/configService')
const logger = require('log4js').getLogger('installer')
const AuthConfig = require('./auth/config')
const HexoConfig = require('./hexo/core/config')

const router = new Router()
router.prefix('/install')
router.use(async (ctx, next) => {
  const storage = DI.inject(IStorageService)
  const config = storage.get('config') || {}
  if (config.installed) {
    ctx.status = 404
  } else await next()
})
const install = Joi.object({
  root: Joi.string().required(),
  secret: Joi.string().required(),
  expire: Joi.string().required(),
  refresh: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required()
})
router.get('/', (ctx) => { ctx.status = 200 })
router.post('/', validateRequestBody(install), async (ctx, next) => {
  const hexo = DI.inject(IHexo)
  const storage = DI.inject(IStorageService)
  const { root, secret, expire, refresh, username, password } = ctx.request.body
  try {
    await hexo.checkIsBlog(root)
  } catch (err) {
    ctx.status = 400
    ctx.body = {
      message: `'${root}' is not a hexo blog`
    }
  }
  const configService = DI.inject(IConfigService)
  configService.set(HexoConfig.HEXO_ROOT, root)
  configService.set(AuthConfig.AUTH_SECRET, secret)
  configService.set(AuthConfig.AUTH_EXPIRE, expire)
  configService.set(AuthConfig.AUTH_REFRESH, refresh)
  configService.set(AuthConfig.AUTH_USERNAME, username)
  configService.set(AuthConfig.AUTH_PASSWORD, sha1(password).toString())
  const config = storage.get('config') || {}
  config.installed = true
  storage.set('config', config)
  hexo.init()
  ctx.status = 200
  logger.info('installed')
})
const root = Joi.object({
  root: Joi.string().required()
})
router.post('/checkroot', validateRequestBody(root), async (ctx, next) => {
  const hexo = DI.inject(IHexo)
  const { root } = ctx.request.body
  try {
    await hexo.checkIsBlog(root)
    ctx.status = 200
  } catch (err) {
    ctx.status = 400
    ctx.body = {
      message: `'${root}' is not a hexo blog`
    }
  }
})
module.exports = router
