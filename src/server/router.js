const controller = require('./controller')

module.exports = (router) => {
  router.all('/', (ctx, next) => {
    ctx.body = 'Greeting guys!'
  })

  router.use(controller.errorHandler)

  // router.get('/restrictedkeys',
  //   controller.getRestrictedKeys
  // )

  router.post('/post', controller.createPost)
  router.post('/page', controller.createPage)

  router.get('/posts', controller.listPostsObj)
  router.get('/pages', controller.listPagesObj)
  router.get('/tags', controller.listTagsObj)
  router.get('/categories', controller.listCategoriesObj)

  router.get('/post/:id', controller.getPostObj)
  router.get('/page/:id', controller.getPageObj)

  router.put('/post/:id', controller.updatePost)
  router.put('/page/:id', controller.updatePage)

  router.delete('/post/:id', controller.removePost)
  router.delete('/page/:id', controller.removePage)

  router.post('/post/:id/publish', controller.publishPost)
  router.post('/post/:id/unpublish', controller.unpublishPost)

  // router.post('/reload',
  //   controller.reload
  // )

  // router.post('/sync',
  //   controller.sync
  // )

  // router.post('/reset',
  //   controller.reset
  // )

  // router.post('/save',
  //   controller.save
  // )

  router.post('/deploy', controller.deploy)
  router.post('/generate', controller.generate)
  router.post('/clean', controller.clean)

  // router.get('/search',
  //   controller.search
  // )
}
