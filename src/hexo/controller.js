const Joi = require('joi')
const storage = require('../services/storage')
const Hexo = require('./core/hexo')
const h = new Hexo()
h.init(storage.get('config').root)

// #region validate
exports.v = {
  generate: Joi.object({
    deploy: Joi.boolean(),
    watch: Joi.boolean(),
    bail: Joi.boolean(),
    force: Joi.boolean(),
    concurrency: Joi.boolean()
  }),
  deploy: Joi.object({
    generate: Joi.boolean()
  }),
  new: Joi.object({
    title: Joi.string().required(),
    layout: Joi.string(),
    path: Joi.string(),
    slug: Joi.string(),
    replace: Joi.boolean()
  }),
  update: Joi.object({
    id: Joi.string().required(),
    page: Joi.boolean(),
    obj: Joi.object().required()
  }),
  delete: Joi.object({
    id: Joi.string().required(),
    page: Joi.boolean()
  }),
  publish: Joi.object({
    id: Joi.string().required()
  })
}
// #endregion

// #region actions
exports.generate = async (ctx, next) => {
  await h.generate(ctx.request.body)
  ctx.status = 200
}
exports.deploy = async (ctx, next) => {
  await h.deploy(ctx.request.body)
  ctx.status = 200
}
exports.clean = async (ctx, next) => {
  await h.clean()
  ctx.status = 200
}
// #endregion

// #region list
exports.listPost = async (ctx, next) => {
  ctx.body = await h.listPost()
}
exports.listPage = async (ctx, next) => {
  ctx.body = await h.listPage()
}
exports.listTag = async (ctx, next) => {
  ctx.body = await h.listTag()
}
exports.listCategory = async (ctx, next) => {
  ctx.body = await h.listCategory()
}
// #endregion

// #region new
exports.new = async (ctx, next) => {
  const { title, layout, path, slug, replace } = ctx.request.body
  const res = await h.new(title, { layout, path, slug, replace })
  ctx.status = 200
  ctx.body = res
}
// #endregion

// #region update
exports.update = async (ctx, next) => {
  const { id, page, obj } = ctx.request.body
  const res = await h.write(id, obj, page)
  ctx.status = 200
  ctx.body = res
}
// #endregion

// #region delete
exports.delete = async (ctx, next) => {
  const { id, page } = ctx.request.body
  await h.delete(id, page)
  ctx.status = 200
}
// #endregion

// #region publish
exports.publish = async (ctx, next) => {
  const { id } = ctx.request.body
  const res = await h.publish(id)
  ctx.body = res
  ctx.status = 200
}
// #endregion

// #region git
exports.gitSync = async (ctx, next) => {
  await h.gitSync()
  ctx.status = 200
}
exports.gitSave = async (ctx, next) => {
  await h.gitSave()
  ctx.status = 200
}
exports.notGitRepo = async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    // TODO 其他平台和git版本如何检测
    if (e.message.indexOf('not a git repo') > -1) {
      ctx.status = 503
      ctx.body = {
        success: false,
        message: 'not a git repo'
      }
    } else throw e
  }
}
// #endregion

// #region error handler
exports.notFound = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (err.message === 'Not found') {
      ctx.status = 404
      ctx.body = { success: false, message: 'id not found' }
    } else throw err
  }
}
// #endregion
