const log4js = require('log4js')
const path = require('path')
const fs = require('fs')
const {
  isDev
} = require('./utils')
const logFolder = path.resolve(process.cwd(), 'log')
const getLogfilePath = filename => {
  return path.resolve(logFolder, filename)
}
if (!fs.existsSync(logFolder)) {
  fs.mkdirSync(logFolder)
}
const NOCONSOLE_DEFAULT = {
  appenders: ['default'],
  level: isDev ? 'debug' : 'info'
}
const categories = {
  'hexo-editor-server:hexo': {
    appenders: ['hexo-editor-server'].concat(isDev ? ['console'] : []),
    level: isDev ? 'debug' : 'info'
  },
  'hexo-editor-server': {
    appenders: ['hexo-editor-server'].concat(isDev ? ['console'] : []),
    level: isDev ? 'debug' : 'info'
  },
  http: {
    appenders: ['console', 'hexo-editor-server', 'default'],
    level: isDev ? 'debug' : 'info'
  },
  default: {
    appenders: ['console', 'default'],
    level: isDev ? 'debug' : 'info'
  }
}
const services = ['services:apikey-service', 'services:config-service', 'services:data-service']
services.map(key => {
  categories[key] = NOCONSOLE_DEFAULT
})
log4js.configure({
  appenders: {
    default: {
      type: 'file',
      filename: getLogfilePath('default.log'),
      removeColor: true
    },
    'hexo-editor-server': {
      type: 'file',
      filename: getLogfilePath('hexo-editor-server.log'),
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
  },
  categories
})
