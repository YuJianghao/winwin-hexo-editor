let user
try {
  user = require('./config.user')
} catch (err) {
  user = {}
}
module.exports = Object.assign({
  port: 5777
}, user)
