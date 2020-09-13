const log4js = require('log4js')
const path = require('path')
const { isDev } = require('./utils')
const getLogfilePath = filename => {
  return path.resolve(process.cwd(), 'log', filename)
}
log4js.configure({
  appenders: {
    everything: {
      type: 'file',
      filename: getLogfilePath('all.log'),
      removeColor: true
    },
    console: {
      type: 'console'
    }
  },
  categories: {
    default: { appenders: ['console', 'everything'], level: isDev ? 'debug' : 'info' }
  }
})
