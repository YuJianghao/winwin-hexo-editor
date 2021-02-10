const Joi = require('joi')
const path = require('path')
const Hexo = require('../core/hexo')
const h = new Hexo()
h.init(path.resolve(process.cwd(), '../testblog'))

// #region actions
exports.generate = async (ctx, next) => {
  await h.generate()
  ctx.status = 200
}
exports.deploy = async (ctx, next) => {
  await h.deploy()
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
const shcemaNew = Joi.object({
  title: Joi.string().required(),
  layout: Joi.string(),
  path: Joi.string(),
  slug: Joi.string(),
  replace: Joi.boolean()
})
exports.new = async (ctx, next) => {
  try {
    await shcemaNew.validateAsync(ctx.request.body)
  } catch (err) {
    ctx.status = 400
    ctx.body = err
  }
  const { title, layout, path, slug, replace } = ctx.request.body
  await h.new(title, { layout, path, slug, replace })
  ctx.status = 200
}
// #endregion

// #region update
const schemaUpdate = Joi.object({
  id: Joi.string().required(),
  page: Joi.boolean(),
  obj: Joi.object().required()
})
exports.update = async (ctx, next) => {
  try {
    await schemaUpdate.validateAsync(ctx.request.body)
  } catch (err) {
    ctx.status = 400
    ctx.body = err
  }
  const { id, page, obj } = ctx.request.body
  await h.write(id, obj, page)
  ctx.status = 200
}
// #endregion

// #region delete
const schemaDelete = Joi.object({
  id: Joi.string().required(),
  page: Joi.boolean()
})
exports.delete = async (ctx, next) => {
  try {
    await schemaDelete.validateAsync(ctx.request.body)
  } catch (err) {
    ctx.status = 400
    ctx.body = err
  }
  const { id, page } = ctx.request.body
  await h.delete(id, page)
  ctx.status = 200
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
