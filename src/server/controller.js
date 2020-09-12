const { Hexo } = require('./hexo')
const hexo = new Hexo()
const Search = require('./search')
const search = new Search(hexo)
const warn = require('./utils').warn
const restrictedKeys = require('./info').restrictedKeys

exports.hexo = hexo

exports.getRestrictedKeys = async function (ctx, next) {
  ctx.body = {
    success: true,
    data: {
      restrictedKeys
    }
  }
}

exports.defaultErrorHandler = async function (ctx, next) {
  try {
    await next()
  } catch (err) {
    if (err.status !== 404 && err.status !== 503) throw err
    ctx.status = err.status
    ctx.body = {
      success: false,
      message: err.message
    }
  }
}
exports.serviceErrorHandler = async function (ctx, next) {
  try {
    await next()
  } catch (err) {
    if (err.name === 'Hexo Init') {
      err.status = 503
    }
    if (err.name === 'Hexo Cant Deploy') {
      err.status = 503
    }
    if (err.name === 'Git Cant Save') {
      err.status = 503
    }
    if (err.name === 'Git Cant Sync') {
      err.status = 503
    }
    if (err.status === 503) warn(err.name, ':', err.message)
    throw err
  }
}

exports.postNotFoundErrorHandler = async function (ctx, next) {
  try {
    await next()
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.log(err)
    if (err.name === 'Not Found') {
      err.status = 404
    }
    throw err
  }
}

exports.reload = async function (ctx, next) {
  await hexo.load()
  ctx.body = {
    success: true
  }
}

exports.addPost = async function (ctx, next) {
  if (!ctx.request.body.title) {
    const err = new Error()
    err.status = 400
    err.message = 'title is required'
    throw err
  }
  const post = await hexo.addPost(ctx.request.body)
  ctx.body = {
    success: true,
    data: {
      post: post
    }
  }
}

exports.addPage = async function (ctx, next) {
  if (!ctx.request.body.title) {
    const err = new Error()
    err.status = 400
    err.message = 'title is required'
    throw err
  }
  const post = await hexo.addPost(ctx.request.body, true)
  ctx.body = {
    success: true,
    data: {
      post: post
    }
  }
}

exports.getPosts = async function (ctx, next) {
  const posts = await hexo.listArticles()
  ctx.body = {
    success: true,
    data: {
      posts: posts
    }
  }
}

exports.getPost = async function (ctx, next) {
  const post = await hexo.getPost(ctx.params.id)
  if (post === null) {
    const err = new Error('Post not found')
    err.name = 'Not Found'
    throw err
  }
  ctx.body = {
    success: true,
    data: {
      post: post
    }
  }
}

exports.getPage = async function (ctx, next) {
  const post = await hexo.getPost(ctx.params.id, true)
  if (post === null) {
    const err = new Error('Page not found')
    err.name = 'Not Found'
    throw err
  }
  ctx.body = {
    success: true,
    data: {
      post: post
    }
  }
}

exports.updatePost = async function (ctx, next) {
  const post = await hexo.updatePost({ _id: ctx.params.id, ...ctx.request.body })
  ctx.body = {
    success: true,
    data: {
      post: post
    }
  }
}

exports.updatePage = async function (ctx, next) {
  const post = await hexo.updatePost({ _id: ctx.params.id, ...ctx.request.body }, true)
  ctx.body = {
    success: true,
    data: {
      post: post
    }
  }
}

exports.removePost = async function (ctx, next) {
  const post = await hexo.deletePost(ctx.params.id)
  ctx.body = {
    success: true,
    data: {
      post: post
    }
  }
}

exports.removePage = async function (ctx, next) {
  const post = await hexo.deletePost(ctx.params.id, true)
  ctx.body = {
    success: true,
    data: {
      post: post
    }
  }
}

exports.publishPost = async function (ctx, next) {
  const post = await hexo.publishPost(ctx.params.id)
  ctx.body = {
    success: true,
    data: {
      post: post
    }
  }
}

exports.unpublishPost = async function (ctx, next) {
  const post = await hexo.unpublishPost(ctx.params.id)
  ctx.body = {
    success: true,
    data: {
      post: post
    }
  }
}

exports.getTags = async function (ctx, next) {
  const tags = await hexo.listTags()
  ctx.body = {
    success: true,
    data: {
      tags: tags
    }
  }
}

exports.getCategories = async function (ctx, next) {
  const categories = await hexo.listCategories()
  ctx.body = {
    success: true,
    data: {
      categories: categories
    }
  }
}

exports.sync = async function (ctx, next) {
  await hexo.syncGit()
  ctx.body = {
    success: true
  }
}

exports.reset = async function (ctx, next) {
  await hexo.resetGit()
  ctx.body = {
    success: true
  }
}

exports.save = async function (ctx, next) {
  await hexo.saveGit()
  ctx.body = {
    success: true
  }
}

exports.deploy = async function (ctx, next) {
  await hexo.deploy()
  ctx.body = {
    success: true
  }
}

exports.generate = async function (ctx, next) {
  await hexo.generate()
  ctx.body = {
    success: true
  }
}

exports.clean = async function (ctx, next) {
  await hexo.clean()
  ctx.body = {
    success: true
  }
}

exports.search = async function (ctx, next) {
  const size = parseInt(ctx.query.size)
  let data
  if (!isNaN(size)) {
    data = await search.search(ctx.query.q, size)
  } else {
    data = await search.search(ctx.query.q)
  }
  ctx.body = {
    success: true,
    data: {
      ...data,
      q: ctx.query.q
    }
  }
}
