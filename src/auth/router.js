const router = require('koa-router')()
const auth = require('./controller')

router.prefix('/auth')

router.post('/token', auth.basicAuth, auth.getToken)

router.post('/refresh', auth.jwtAuth, auth.requestRefreshToken, auth.getToken)

router.post('/apikeytoken', auth.jwtAuth, auth.requestAPIKEY)

router.get('/apikeys', auth.jwtAuth, auth.getAPIKEYInfo)

router.delete('/apikey', auth.apikeyOrJwt, auth.removeAPIKEY)

router.post('/apikey', auth.apiKeyJwtAuth, auth.getAPIKEY)

module.exports = router
