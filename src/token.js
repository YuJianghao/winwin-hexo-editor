const router = require('koa-router')()
const auth = require('./auth')

router.prefix('/token')

router.get('/', auth.basicAuth, auth.getToken)

router.get('/refresh', auth.jwtAuth, auth.requestRefreshToken, auth.getToken)

module.exports = router
