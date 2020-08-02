const validate = require('koa2-validation')
const controller = require('./controller')

module.exports = router => {
  router.all('/', (ctx, next) => { ctx.body = 'Greeting guys!' })

  router.use(controller.defaultErrorHandler)
  router.use(controller.serviceErrorHandler)

  router.post('/post',
    validate(controller.v.addPost),
    controller.addPost
  )

  router.get('/posts',
    controller.getPosts
  )

  router.get('/post/:id/',
    controller.postNotFoundErrorHandler,
    controller.getPost
  )

  router.put('/post/:id/',
    controller.postNotFoundErrorHandler,
    controller.updatePost
  )

  router.delete('/post/:id/',
    controller.postNotFoundErrorHandler,
    controller.removePost
  )

  router.post('/post/:id/publish',
    controller.postNotFoundErrorHandler,
    controller.publishPost
  )

  router.post('/post/:id/unpublish',
    controller.postNotFoundErrorHandler,
    controller.unpublishPost
  )

  router.get('/tags',
    controller.getTags
  )

  router.get('/categories',
    controller.getCategories
  )

  router.post('/reload',
    controller.reload
  )

  router.post('/sync',
    controller.sync
  )

  router.post('/reset',
    controller.reset
  )

  router.post('/save',
    controller.save
  )

  router.post('/deploy',
    controller.deploy
  )

  router.post('/clean',
    controller.clean
  )

  router.get('/search',
    controller.search
  )
}
