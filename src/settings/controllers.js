const { ds } = require('../service')
const config = require('../../config.default')
const StorageService = require('../service/StorageService')
const { initHexo } = require('../server')

exports.updateUser = async (ctx, next) => {
  const id = ctx.params.id
  const username = ctx.request.body.username || config.username
  const password = ctx.request.body.password || config.password
  await ds.updateUser(id, username, password)
  const user = await ds.getUser(id)
  ctx.body = {
    success: true,
    data: {
      user
    }
  }
}

exports.getUser = async (ctx, next) => {
  console.log(111)
  const id = ctx.params.id
  const user = await ds.getUser(id)
  ctx.body = {
    success: true,
    data: {
      user
    }
  }
}

exports.hexo = async (ctx, next) => {
  const HEXO_ROOT = ctx.request.body.HEXO_ROOT || StorageService.getHexoRoot()
  try {
    StorageService.setHexoRoot(HEXO_ROOT)
    await initHexo(HEXO_ROOT)
    ctx.body = {
      success: true
    }
  } catch (err) {
    ctx.status = 400
    ctx.body = {
      success: false,
      message: err.message
    }
  }
}

exports.auth = async (ctx, next) => {
  const JWT_SECRET = ctx.request.body.JWT_SECRET || StorageService.getJwtSecret()
  const JW_EXPIRE = ctx.request.body.JW_EXPIRE || StorageService.getJwtExpire()
  const JW_REFRESH = ctx.request.body.JW_REFRESH || StorageService.getJwtRefresh()
  const APIKEY_SECRET = ctx.request.body.APIKEY_SECRET || StorageService.getApikeySecret()
  StorageService.setJwtSecret(JWT_SECRET)
  StorageService.setJwtExpire(JW_EXPIRE)
  StorageService.setJwtRefresh(JW_REFRESH)
  StorageService.setApikeySecret(APIKEY_SECRET)
  ctx.body = {
    success: true
  }
}
