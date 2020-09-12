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

router.get('/hexo', controllers.getHexoInfo)
router.put('/hexo', controllers.setHexoInfo)

router.put('/security', controllers.security)

module.exports = router
