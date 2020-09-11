const router = require('koa-router')()
const version = require('../package.json').version
const apidoc = require('../swagger.json')

router.prefix('/info')

router.get('/apidoc', async (ctx, next) => {
  ctx.body = apidoc
})

router.get('/version', async (ctx, next) => {
  ctx.body = version
})

module.exports = router
