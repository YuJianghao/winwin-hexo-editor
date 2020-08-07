const router = require('koa-router')()
const version = require('../package.json').version

router.get('/version', async (ctx, next) => {
  ctx.body = version
})

module.exports = router
