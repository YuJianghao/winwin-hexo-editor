const log4js = require('log4js')
const path = require('path')
const fs = require('fs')
const {
  isDev
} = require('./common')
/**
 * 日志目录
 */
const LOG_FOLDER = path.resolve(process.cwd(), 'log')
const getLogfilePath = filename => {
  return path.resolve(LOG_FOLDER, filename)
}
if (!fs.existsSync(LOG_FOLDER)) {
  fs.mkdirSync(LOG_FOLDER)
}
const HEXO_EDITOR_APPENDER = 'hexo-editor'
/**
 * 输出通道
 */
const appenders = {
  default: {
    type: 'file',
    filename: getLogfilePath('default.log'),
    removeColor: true
  },
  [HEXO_EDITOR_APPENDER]: {
    type: 'file',
    filename: getLogfilePath('hexo-editor.log'),
    removeColor: true
  },
  console: {
    type: 'console',
    layout: isDev ? {
      type: 'pattern',
      pattern: '%[[%d{hh:mm:ss.SSS}][%c][%p]%] %m'
    } : {
      type: 'pattern',
      pattern: '%[[winwin-hexo-editor][%p]%] %m'
    }
  }
}
/**
 * 默认输出配置
 */
const NOCONSOLE_DEFAULT = {
  appenders: ['default'].concat(isDev ? ['console'] : []),
  level: isDev ? 'debug' : 'info'
}
/**
 * 输出分类
 */
const categories = {
  /**
   * hexo核心输出
   */
  hexo: {
    appenders: [].concat(isDev ? ['console'] : []).concat([HEXO_EDITOR_APPENDER]),
    level: isDev ? 'debug' : 'info'
  },
  /**
   * 应用服务输出
   */
  server: {
    appenders: ['console'].concat([HEXO_EDITOR_APPENDER]),
    level: isDev ? 'debug' : 'info'
  },
  /**
   * http服务输出
   */
  http: {
    appenders: ['console', HEXO_EDITOR_APPENDER, 'default'],
    level: isDev ? 'debug' : 'info'
  },
  default: {
    appenders: ['console', 'default'],
    level: isDev ? 'debug' : 'info'
  }
}
/**
 * 各种服务，使用默认配置
 */
const services = []
services.map(key => {
  categories[key] = NOCONSOLE_DEFAULT
})
log4js.configure({
  appenders,
  categories
})
