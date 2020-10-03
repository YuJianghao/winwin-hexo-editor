const { DataServiceError } = require('../service/data_service')
const { configService } = require('../service/config_service')
const { UserService, UserServiceError } = require('../service/user_service')
const { UserConfigService } = require('../service/user_config_service')
const SettingsError = require('./errors')
const { HexoError } = require('../server/hexo')

exports.errorHandler = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    switch (err.code) {
      case UserServiceError.USER_NOT_EXIST:
        err.status = 404
        break
      case DataServiceError.INITIATING:
        err.status = 503
        break
      case SettingsError.INVALID_PARAMS:
        err.status = 400
        break
      case HexoError.NOT_BLOG_ROOT:
        ctx.status = 404
        ctx.body = {
          success: false,
          message: err.message,
          data: err.data
        }
        return
      case HexoError.EMPTY_HEXO_ROOT:
        ctx.status = 404
        ctx.body = {
          success: false,
          message: err.message,
          data: err.data
        }
        break
    }
    throw err
  }
}

exports.updateUser = async (ctx, next) => {
  const id = ctx.params.id || ctx.state.user.id
  if (!id) throw new SettingsError('id is required', SettingsError.INVALID_PARAMS)
  const username = ctx.request.body.username
  const oldpassword = ctx.request.body.oldpassword
  const password = ctx.request.body.password
  if (!await UserService.hasUserWithIdPassword(id, oldpassword)) {
    ctx.status = 403
    ctx.body = {
      success: false,
      message: 'old password wrong'
    }
    return
  }
  await UserService.updateUser(id, username, password)
  const user = await UserService.getUser(id)
  ctx.body = {
    success: true,
    data: {
      user
    }
  }
}

exports.getUser = async (ctx, next) => {
  const id = ctx.params.id || ctx.state.user.id
  if (!id) throw new SettingsError('id is required', SettingsError.INVALID_PARAMS)
  const user = await UserService.getUser(id, false)
  ctx.body = {
    success: true,
    data: {
      user
    }
  }
}

exports.setHexoInfo = async (ctx, next) => {
  const HEXO_ROOT = ctx.request.body.HEXO_ROOT
  await configService.setHexoRoot(HEXO_ROOT)
  ctx.body = {
    success: true
  }
}

exports.getHexoInfo = async (ctx, next) => {
  const HEXO_ROOT = configService.getHexoRoot()
  ctx.body = {
    success: false,
    data: {
      HEXO_ROOT
    }
  }
}

exports.security = async (ctx, next) => {
  const JWT_SECRET = ctx.request.body.JWT_SECRET
  const JWT_EXPIRE = ctx.request.body.JWT_EXPIRE
  const JWT_REFRESH = ctx.request.body.JWT_REFRESH
  const APIKEY_SECRET = ctx.request.body.APIKEY_SECRET
  configService.setJwtSecret(JWT_SECRET)
  configService.setJwtExpire(JWT_EXPIRE)
  configService.setJwtRefresh(JWT_REFRESH)
  configService.setApikeySecret(APIKEY_SECRET)
  ctx.body = {
    success: true
  }
}

exports.getUiConfig = async (ctx, next) => {
  const id = ctx.state.user.id
  const config = await UserConfigService.getConfigById(id, ['ui'])
  ctx.body = {
    config
  }
}

exports.setUiConfig = async (ctx, next) => {
  const id = ctx.state.user.id
  const config = ctx.request.body
  const newConfig = await UserConfigService.setConfigById(id, { ui: config }, ['ui'])
  ctx.body = {
    config: newConfig
  }
}
