const Router = require('koa-router')
const { IStorageService } = require('./services/storageService')
const hexo = require('./hexo/core/hexo')
const Joi = require('joi')
const { validateRequestBody } = require('./util/middlewares')
const sha1 = require('crypto-js/sha1')
const DI = require('./util/di')
const logger = require('log4js').getLogger('installer')

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
  const config = storage.get('config') || {}
  config.root = root
  config.secret = secret
  config.expire = expire
  config.refresh = refresh
  config.username = username
  config.password = sha1(password).toString()
  config.installed = true
  storage.set('config', config)
  hexo.init(root)
  ctx.status = 200
  logger.info('installed')
})
const root = Joi.object({
  root: Joi.string().required()
})
router.post('/checkroot', validateRequestBody(root), async (ctx, next) => {
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
