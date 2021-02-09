const Hexo = require('hexo')
const hfm = require('hexo-front-matter')
function postDocument2Object (doc) {
  if (doc.next)doc.next = doc.next._id
  if (doc.prev)doc.prev = doc.prev._id
  if (doc.date)doc.date = doc.date.valueOf()
  if (doc.updated)doc.updated = doc.updated.valueOf()
  const obj = doc.toObject()
  obj.tags = obj.tags.data.map(t => t._id)
  obj.categories = obj.categories.data.map(t => t._id)
  obj.fm = hfm.parse(obj.raw)
  return obj
}
function pageDocument2Object (doc) {
  if (doc.date)doc.date = doc.date.valueOf()
  if (doc.updated)doc.updated = doc.updated.valueOf()
  const obj = doc.toObject()
  obj.fm = hfm.parse(obj.raw)
  return obj
}
function tagDocument2Object (doc) {
  const obj = doc.toObject()
  obj.posts = obj.posts.map(p => p._id)
  return obj
}
function categoryDocument2Object (doc) {
  const obj = doc.toObject()
  obj.posts = obj.posts.map(p => p._id)
  return obj
}
class HexoAPI {
  /**
   * 有关hexo的api操作封装
   * @param {String} HEXO_ROOT hexo路径
   */
  constructor (HEXO_ROOT) {
    this.HEXO_ROOT = HEXO_ROOT
    this.logger = require('log4js').getLogger('hexo')
    this.hexo = new Hexo(this.HEXO_ROOT, {
      debug: false,
      draft: true,
      silent: process.env.NODE_ENV !== 'development'
    })
  }

  async init () {
    await this.hexo.init()
  }

  async listPost () {
    await this.hexo.locals.invalidate()
    await this.hexo.load()
    const res = await this.hexo.locals.get('posts').toArray().map(postDocument2Object)
    this.logger.info('List posts', res.length)
    return res
  }

  async listPage () {
    await this.hexo.locals.invalidate()
    await this.hexo.load()
    const res = await this.hexo.locals.get('pages').toArray().map(pageDocument2Object)
    this.logger.info('List pages', res.length)
    return res
  }

  async listTag () {
    await this.hexo.locals.invalidate()
    await this.hexo.load()
    const res = await this.hexo.locals.get('tags').toArray().map(tagDocument2Object)
    this.logger.info('List tags', res.length)
    return res
  }

  async listCategory () {
    await this.hexo.locals.invalidate()
    await this.hexo.load()
    const res = await this.hexo.locals.get('categories').toArray().map(categoryDocument2Object)
    this.logger.info('List categories', res.length)
    return res
  }

  async stringify () {
    return hfm.stringify(...arguments)
  }
}
module.exports = HexoAPI
