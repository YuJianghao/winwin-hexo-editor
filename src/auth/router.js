const Router = require('koa-router')
const controller = require('./controller')
const router = new Router()
router.post('/login', controller.basicAuth, controller.getToken)
router.post('/refresh', controller.jwtAuth, controller.requestRefreshToken, controller.getToken)
router.post('/logout', controller.jwtAuth, controller.requestAccessToken, controller.logout)
module.exports = router
