const Router = require('koa-router')
const { initHexo, HexoError } = require('./server')
const { dataService } = require('./service/data_service')
const { storageService } = require('./service/config_service')
const { UserService } = require('./service/user_service')
const router = new Router()
const config = require('../config.default')
router.prefix('/install')
router.get('/info', async (ctx, next) => {
  if (storageService.isInstalled()) {
    ctx.status = 404
  } else {
    ctx.status = 200
  }
})
router.post('/do', async (ctx, next) => {
  if (storageService.isInstalled()) {
    ctx.status = 404
    return
  }
  const username = ctx.request.body.username || config.username
  const password = ctx.request.body.password || config.password
  const HEXO_ROOT = ctx.request.body.HEXO_ROOT
  const JWT_SECRET = ctx.request.body.JWT_SECRET || config.jwtSecret
  const JW_EXPIRE = ctx.request.body.JW_EXPIRE || config.jwtExpire
  const JW_REFRESH = ctx.request.body.JW_REFRESH || config.jwtRefresh
  const APIKEY_SECRET = ctx.request.body.APIKEY_SECRET || config.apikeySecret
  try {
    await dataService.clear()
    await UserService.addUser(username, password)
    storageService.clear()
    storageService.setJwtSecret(JWT_SECRET)
    storageService.setJwtExpire(JW_EXPIRE)
    storageService.setJwtRefresh(JW_REFRESH)
    storageService.setApikeySecret(APIKEY_SECRET)
    await storageService.setHexoRoot(HEXO_ROOT)
    await initHexo(HEXO_ROOT)
    storageService.markInstalled()
    ctx.body = 'installed'
  } catch (err) {
    if (err.code === HexoError.NOT_BLOG_ROOT || err.code === HexoError.EMPTY_HEXO_ROOT) {
      ctx.status = 400
      ctx.body = {
        success: false,
        message: err.message,
        data: err.data
      }
      return
    }
    throw err
  }
})

module.exports = router
