const Router = require('koa-router')
const { initHexo, HexoError } = require('./server')
const { ds } = require('./service')
const StorageService = require('./service/StorageService')
const router = new Router()
const config = require('../config.default')
router.prefix('/install')
router.get('/info', async (ctx, next) => {
  if (StorageService.isInstalled()) {
    ctx.status = 404
  } else {
    ctx.status = 200
  }
})
router.post('/do', async (ctx, next) => {
  if (StorageService.isInstalled()) {
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
    await ds.clear()
    await ds.addUser(username, password)
    StorageService.clear()
    StorageService.setJwtSecret(JWT_SECRET)
    StorageService.setJwtExpire(JW_EXPIRE)
    StorageService.setJwtRefresh(JW_REFRESH)
    StorageService.setApikeySecret(APIKEY_SECRET)
    await StorageService.setHexoRoot(HEXO_ROOT)
    await initHexo(HEXO_ROOT)
    StorageService.markInstalled()
    ctx.body = 'installed'
  } catch (err) {
    if (err.code === HexoError.NOT_BLOG_ROOT) {
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
