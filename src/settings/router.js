const controllers = require('./controllers')
const Router = require('koa-router')
const { apikeyOrJwt } = require('../auth/controller')
const router = new Router()

router.use(apikeyOrJwt)

router.prefix('/settings')

router.get('/user/:id', controllers.getUser)
router.put('/user/:id', controllers.updateUser)

router.put('/hexo', controllers.hexo)

router.put('/auth', controllers.auth)

module.exports = router
