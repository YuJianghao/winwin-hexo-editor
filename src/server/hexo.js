const path = require('path')
const fs = require('fs')
const HexoAPI = require('hexo')
const hfm = require('hexo-front-matter')
const logger = require('log4js').getLogger('hexo-editor-server:hexo')

class HexoError extends Error {
  constructor (message, code) {
    super(message)
    Error.captureStackTrace(this)
    this.code = code
  }
}
HexoError.prototype.name = 'HexoError'
HexoError.NOT_BLOG_ROOT = 'NOT_BLOG_ROOT'
HexoError.EMPTY_HEXO_ROOT = 'EMPTY_HEXO_ROOT'
HexoError.NOT_FOUND = 'NOT_FOUND'
HexoError.UNINITIALIZED = 'UNINITIALIZED'
HexoError.CANT_DEPLOY = 'CANT_DEPLOY'
HexoError.BAD_PARAMS = 'BAD_PARAMS'
HexoError.NOT_GIT_REPO = 'NOT_GIT_REPO'
HexoError.SHELL_COMMAND_FAIL = 'SHELL_COMMAND_FAIL'

class Hexo {
  /**
   * See https://hexo.io/api/index.html
   * @param {string} base
   * @param {Object} options Hexo option
   */
  async init (base = process.cwd(), options = {}) {
    this._cwd = base
    this._hexo = new HexoAPI(base, options)
    await this._hexo.init()
    await this._hexo.load()
    logger.debug('hexo initiated')
  }

  /**
   * Transform categories to string[][]
   * @param {string | string[] | string[][]} categories
   * @returns {string[][]}
   */
  postCategoriesRaw2Array2d (categories) {
    if (!categories) return [[]]
    if (!Array.isArray(categories)) return [[categories]]
    else {
      if (!categories.filter((cat) => Array.isArray(cat)).length) {
        return [categories]
      }
      return categories.map((cat) => {
        return Array.isArray(cat) ? cat : [cat]
      })
    }
  }

  /**
   * Transform warehouse post document into plane javascript object with
   * some formating.
   *
   * `date` and `updated` have been formated into `number`(ms) from 1970-1-1
   *
   * `__raw_keys` shows the raw keys detected in file
   *
   * `__frontmatters_keys` shows all user added frontmatters
   * @param {Document} postDocument
   */
  postDocument2Obj (postDocument) {
    if (postDocument.prev) postDocument.prev = postDocument.prev._id
    if (postDocument.next) postDocument.next = postDocument.next._id
    const postObj = postDocument.toObject()
    if (postObj.date) postObj.date = postDocument.date.valueOf()
    if (postObj.updated) postObj.updated = postDocument.updated.valueOf()
    const rawObj = hfm.parse(postObj.raw)
    if (postObj.tags) postObj.tags = rawObj.tags
    if (postObj.categories) {
      postObj.categories = this.postCategoriesRaw2Array2d(rawObj.categories)
    }
    postObj.__raw_keys = Object.keys(rawObj)
    postObj.__frontmatters_keys = postObj.__raw_keys.filter((item) => {
      return ![
        'title',
        '_content',
        'date',
        'update',
        'tags',
        'categories'
      ].includes(item)
    })
    return postObj
  }

  /**
   * Transform warehouse page document into plane javascript object with
   * some formating.
   *
   * `__raw_keys` shows the raw keys detected in file
   *
   * `__frontmatters_keys` shows all user added frontmatters
   * @param {Document} postDocument
   */
  pageDocument2Obj (pageDocument) {
    const pageObj = pageDocument.toObject()
    if (pageObj.date) pageObj.date = pageDocument.date.valueOf()
    if (pageObj.updated) pageObj.updated = pageDocument.updated.valueOf()
    const rawObj = hfm.parse(pageObj.raw)
    pageObj.__raw_keys = Object.keys(rawObj)
    pageObj.__frontmatters_keys = pageObj.__raw_keys.filter((item) => {
      return ![
        'title',
        '_content',
        'date',
        'update',
        'tags',
        'categories'
      ].includes(item)
    })
    return pageObj
  }

  async listPostsObj () {
    await this._hexo.load()
    console.log(this._cwd)
    const posts = this._hexo.locals.get('posts').toArray()
    const postsObj = posts.map(this.postDocument2Obj.bind(this))
    logger.debug('list posts object', postsObj.length)
    return postsObj
  }

  async listPagesObj () {
    await this._hexo.load()
    const pages = this._hexo.locals.get('pages').toArray()
    const pagesObj = pages.map(this.pageDocument2Obj.bind(this))
    logger.debug('list pages object', pagesObj.length)
    return pagesObj
  }

  /**
   * See https://hexo.io/api/posts.
   *
   * - Frontmatters are not supported here
   * - data.date has type `number` instead of `Date`(which hexo use)
   * @param {Object} data
   * @param {string} data.title
   * @param {string} [data.slug]
   * @param {string} [data.layout]
   * @param {number} [data.date]
   * @param {boolean} replace
   */
  async createPost (data = {}, replace) {
    const title = data.title
    const slug = data.slug || data.title
    if (!title && !slug) throw new HexoError('title or slug is required!', HexoError.BAD_PARAMS)
    const layout = data.layout
    const path = data.path
    const date = data.date ? new Date(data.date) : undefined
    const file = await this._hexo.post.create(
      { title, slug, layout, path, date },
      replace
    )
    await this._hexo.load()
    if (layout === 'page') {
      logger.debug(
        'created page with keys',
        Object.keys(data).filter(key => key !== 'layout'),
        'replace:',
        replace
      )
      return this.postDocument2Obj(this._hexo.locals
        .get('pages')
        .toArray()
        .filter((item) => item.full_source === file.path)[0])
    } else {
      logger.debug(
        'created post with keys',
        Object.keys(data),
        'replace:',
        replace,
        'layout:',
        layout
      )
      return this.postDocument2Obj(this._hexo.locals
        .get('posts')
        .toArray()
        .filter((item) => item.full_source === file.path)[0])
    }
  }

  /**
   * See https://hexo.io/api/posts.
   *
   * - Frontmatters are not supported here
   * - `data.date` has type `number` instead of `Date`(which hexo use)
   * - `data.layout` will be ignored
   * @param {Object} data
   * @param {string} [data.title]
   * @param {string} [data.slug]
   * @param {number} [data.date]
   * @param {boolean} replace
   */
  async createPage (data, replace) {
    data.layout = 'page'
    return this.createPost(data, replace)
  }

  /**
   * Update post by _id and data. Data will write directly into file without passing through hexo.
   *
   * - `data.date` and `data.updated` has type `number` instead of `Date`(which hexo use)
   * @param {String} _id warehouse post _id
   * @param {Object} data data use by hfm.stringify()
   * @param {number} [data.date]
   * @param {number} [data.updated]
   * @returns updated post obj
   */
  async updatePost (_id, data) {
    const post = this.postDocument2Obj(this._getPostDocument(_id))
    const fullSource = post.full_source
    if (data.date) data.date = new Date(data.date)
    if (data.updated) data.updated = new Date(data.updated)
    let str = ''
    str += hfm.split(post.raw).separator
    str += '\n'
    str += hfm.stringify(data)
    fs.writeFileSync(fullSource, str)
    await this._hexo.locals.invalidate()
    await this._hexo.load()
    logger.debug('updated post with keys', Object.keys(data))
    return this._hexo.locals
      .get('posts')
      .toArray()
      .filter((item) => item.full_source === fullSource)[0]
  }

  /**
   * Update page by _id and data. Data will write directly into file without passing through hexo.
   *
   * - `data.date` and `data.updated` has type `number` instead of `Date`(which hexo use)
   * @param {String} _id warehouse post _id
   * @param {Object} data data use by hfm.stringify()
   * @param {number} [data.date]
   * @param {number} [data.updated]
   * @returns updated page obj
   */
  async updatePage (_id, data) {
    const post = this.pageDocument2Obj(this._getPageDocument(_id))
    const fullSource = post.full_source
    if (data.date) data.date = new Date(data.date)
    if (data.updated) data.updated = new Date(data.updated)
    let str = ''
    str += hfm.split(post.raw).separator
    str += '\n'
    str += hfm.stringify(data)
    fs.writeFileSync(fullSource, str)
    await this._hexo.locals.invalidate()
    await this._hexo.load()
    logger.debug('updated page with keys', Object.keys(data))
    return this._hexo.locals
      .get('pages')
      .toArray()
      .filter((item) => item.full_source === fullSource)[0]
  }

  async removePost (_id) {
    const post = this.postDocument2Obj(
      this._hexo.locals
        .get('posts')
        .toArray()
        .filter((item) => item._id === _id)[0]
    )
    const fullSource = post.full_source
    fs.unlinkSync(fullSource)
    await this._hexo.locals.invalidate()
    await this._hexo.load()
    logger.debug('removed post', _id)
  }

  async removePage (_id) {
    const page = this.pageDocument2Obj(
      this._hexo.locals
        .get('pages')
        .toArray()
        .filter((item) => item._id === _id)[0]
    )
    const fullSource = page.full_source
    fs.unlinkSync(fullSource)
    await this._hexo.locals.invalidate()
    await this._hexo.load()
    const dirname = path.dirname(fullSource)
    if (fs.readdirSync(dirname).length === 0) {
      fs.rmdirSync(dirname)
    }
    logger.debug('removed page', _id)
  }

  _getPostDocument (_id) {
    const posts = this._hexo.locals
      .get('posts')
      .toArray()
      .filter((item) => item._id === _id)
    if (posts.length < 1) { throw new HexoError('post not found', HexoError.NOT_FOUND) }
    return posts[0]
  }

  _getPageDocument (_id) {
    const pages = this._hexo.locals
      .get('pages')
      .toArray()
      .filter((item) => item._id === _id)
    if (pages.length < 1) { throw new HexoError('page not found', HexoError.NOT_FOUND) }
    return pages[0]
  }

  getPostObj (_id) {
    const post = this.postDocument2Obj(this._getPostDocument(_id))
    logger.debug('get post', _id)
    return post
  }

  getPageObj (_id) {
    const page = this.pageDocument2Obj(this._getPageDocument(_id))
    logger.debug('get page', _id)
    return page
  }
}
module.exports = { Hexo, HexoError }
