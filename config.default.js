let user
try {
  user = require('./config.user')
} catch (err) {
  user = {}
}
module.exports = Object.assign({
  port: 5777,
  hexoRoot: '',
  apikeySecret: 'apikey',
  jwtSecret: 'secret',
  jwtExpire: '1h',
  jwtRefresh: '7d',
  username: 'admin',
  password: 'admin'
}, user)
