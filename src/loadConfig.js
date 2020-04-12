
const fs = require('fs')
const path = require('path')

let config = require('../config.default')
if (fs.existsSync(path.join(process.cwd(), 'config.user.js'))) {
  const userConfig = require('../config.user')
  config = Object.assign(config, userConfig)
}
module.exports = config
