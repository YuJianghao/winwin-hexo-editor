const router = require('koa-router')()
const auth = require('./auth')
const compose = require('koa-compose')

router.prefix('/token')

router.get('/', auth.basicAuth, auth.getToken)

router.get('/refresh', auth.jwtAuth, auth.requestRefreshToken, auth.getToken)

router.post('/apikey', auth.jwtAuth, auth.requestAPIKEY)

router.get('/apikeys', auth.jwtAuth, auth.getAPIKEYInfo)

router.delete('/apikey', require('./lib/koa-parallel')([{
  fn: auth.apiKeyAuth,
  validator: err => err.status === 401
}, {
  fn: compose([auth.jwtAuth, auth.requestAccessToken])
}]), auth.removeAPIKEY)

router.get('/apikey', auth.apiKeyJwtAuth, auth.getAPIKEY)

module.exports = router
