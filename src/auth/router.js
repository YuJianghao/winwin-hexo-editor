const router = require('koa-router')()
const auth = require('./controller')
const compose = require('koa-compose')

router.prefix('/auth')

router.post('/token', auth.basicAuth, auth.getToken)

router.post('/refresh', auth.jwtAuth, auth.requestRefreshToken, auth.getToken)

router.post('/apikeytoken', auth.jwtAuth, auth.requestAPIKEY)

router.get('/apikeys', auth.jwtAuth, auth.getAPIKEYInfo)

router.delete('/apikey', require('../lib/koa-parallel')([{
  fn: auth.apiKeyAuth,
  validator: err => err.status === 401
}, {
  fn: compose([auth.jwtAuth, auth.requestAccessToken])
}]), auth.removeAPIKEY)

router.post('/apikey', auth.apiKeyJwtAuth, auth.getAPIKEY)

module.exports = router
