const controllers = require('./controllers')
const Router = require('koa-router')
const { apikeyOrJwt } = require('../auth/controller')
const router = new Router()

router.use(apikeyOrJwt)
router.use(controllers.errorHandler)

router.prefix('/settings')

router.get('/user', controllers.getUser)
router.get('/user/:id', controllers.getUser)
router.put('/user', controllers.updateUser)
router.put('/user/:id', controllers.updateUser)

router.put('/hexo', controllers.hexo)

router.put('/security', controllers.security)

module.exports = router
