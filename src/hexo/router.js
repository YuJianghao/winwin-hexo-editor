const Router = require('koa-router')
const controller = require('./controller')
const router = new Router()

router.post('/generate', controller.generate)
router.post('/deploy', controller.deploy)
router.post('/clean', controller.clean)

router.get('/posts', controller.listPost)
router.get('/pages', controller.listPage)
router.get('/tags', controller.listTag)
router.get('/categories', controller.listCategory)

router.post('/new', controller.notFound, controller.new)
router.post('/update', controller.notFound, controller.update)
router.post('/delete', controller.notFound, controller.delete)
module.exports = router
