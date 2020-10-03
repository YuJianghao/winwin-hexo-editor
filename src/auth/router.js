const router = require('koa-router')()
const auth = require('./controller')

router.prefix('/auth')

router.post('/token', auth.basicAuth, auth.getToken)

router.post('/refresh', auth.jwtAuth, auth.requestRefreshToken, auth.getToken)

router.post('/apikeytoken', auth.jwtAuth, auth.requestApikey)

router.get('/apikeys', auth.jwtAuth, auth.getAPIKEYInfo)

router.delete('/apikey', auth.apiKeyAuth, auth.removeApikey)

router.delete('/apikey/:id', auth.jwtAuth, auth.removeApikey)

router.post('/apikey', auth.apiKeyJwtAuth, auth.addApikey)

module.exports = router
