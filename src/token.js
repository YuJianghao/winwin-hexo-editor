const router = require('koa-router')()
const auth = require('./auth')

router.prefix('/token')

router.get('/', auth.basicAuth, auth.getToken)

module.exports = router
