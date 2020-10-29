/**
 * @module hexo-editor-serever
 * @author winwin2011
 */

const router = require('koa-router')()
const chalk = require('chalk')
const { HexoError } = require('./hexo')
const logger = require('log4js').getLogger('hexo-editor-server')

/**
 * mount hexo-editor-server to koa app
 * @param {Koa} app - koa app instance
 * @param {Object} opts - options
 * @param {String} [opts.base='/hexo/'] - hexo-editor-server base url. e.g. `/` or `/editor/`, default is `/hexo/`. Must match `^/?([a-zA-Z0-9]+/?)?$`
 * @param {Function} [opts.auth] - custom authentication middleware
 * @returns {void}
 */
exports.hexoeditorserver = function (app, opts = {}) {
  logger.debug('module opts input base:', opts.base)

  if (!app) {
    // check if koa app exists
    console.error('This is not a function. Koa app is required.')
    console.error('Use `hexoeditorserver(app)` instead')
    throw new Error('koa app required')
  }

  if (opts.base) {
    const reg = /^\/?([a-zA-Z0-9]+\/?)?$/i
    if (opts.base.search(reg) < 0) throw new Error('Invalid opts.base! Must match ^/?([a-zA-Z0-9]+/?)?$')
    // format server base and router prefix
    opts.base = (opts.base.slice(0, 1) === '/' ? '' : '/') + opts.base
    opts.base += opts.base.slice(-1) === '/' ? '' : '/'
    logger.debug('module opts formated base:', opts.base)
  } else {
    opts.base = '/hexo/'
    logger.info('using default base /hexo/')
  }
  opts.prefix = opts.base.slice(0, -1)

  // setup router prefix
  router.prefix(opts.prefix || '')

  // apply custom auth middleware
  if (opts.auth) {
    logger.debug('apply custom auth middleware')
    router.use(opts.auth)
  }

  // setup routes
  require('./router')(router)

  // setup router
  app.use(router.routes(), router.allowedMethods())
}
const isProd = process.env.NODE_ENV === 'production'

/**
 * 可能的错误：HexoError.EMPTY_HEXO_ROOT | HexoError.NOT_BLOG_ROOT | other
 * @param {string} hexoRoot Hexo博客目录
 */
exports.initHexo = async (hexoRoot) => {
  const hexo = require('./controller').hexo
  return hexo.init(hexoRoot, { debug: !isProd, silent: isProd }).catch(err => {
    switch (err.code) {
      case HexoError.EMPTY_HEXO_ROOT:
        logger.warn(chalk.yellow.bold('HEXO_ROOT is required!'))
        break
      case HexoError.NOT_BLOG_ROOT:
        logger.warn(chalk.yellow.bold('Hexo init failed, check your HEXO_ROOT settings first!'))
        break
      default:
        break
    }
    throw err
  })
}

exports.HexoError = HexoError
