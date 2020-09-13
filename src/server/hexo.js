const HexoAPI = require('hexo')
const path = require('path')
const YAML = require('yamljs')
const fs = require('hexo-fs')
const Git = require('simple-git/promise')
const isGit = require('is-git-repository')
const { exec } = require('child_process')
const Post = require('./post')
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
HexoError.POST_NOT_FOUND = 'POST_NOT_FOUND'
HexoError.UNINITIALIZED = 'UNINITIALIZED'
HexoError.CANT_DEPLOY = 'CANT_DEPLOY'
HexoError.GIT_CANT_SAVE = 'GIT_CANT_SAVE'
HexoError.GIT_CANT_SYNC = 'GIT_CANT_SYNC'
HexoError.BAD_PARAMS = 'BAD_PARAMS'
HexoError.NOT_GIT_REPO = 'NOT_GIT_REPO'

/**
 * 用于和hexo交互的模型
 * @class
 */
class Hexo {
  /**
   * 初始化
   * @param {String} [cwd=process.cwd()] - 工作路径
   */
  constructor () {
    this.ready = false
    this.git = null
  }

  /**
   * 检测是否是hexo博客目录
   * 如果没有依赖hexo或者没有`_config.yml`则视为不是博客目录
   * 可能的错误：HexoError.NOT_BLOG_ROOT | other
   * @private
   */
  _checkIsBlog (cwd) {
    logger.debug('try HEXO_ROOT', cwd)
    let file
    try {
      // 检查是否有对应文件
      file = fs.readFileSync(path.join(cwd, 'package.json'))
      fs.readFileSync(path.join(cwd, '_config.yml'))
    } catch (err) {
      if (err.code === 'ENOENT') {
        const e = new HexoError(`${cwd} isn't a hexo blog folder!`, HexoError.NOT_BLOG_ROOT)
        e.data = {
          path: path.join(process.cwd(), cwd)
        }
        logger.warn(`${path.join(process.cwd(), cwd)} isn't a hexo blog folder!`)
        throw e
      }
      throw err
    }
    // 检查是否有hexo依赖
    const packageJSON = JSON.parse(file)
    if (!packageJSON.dependencies.hexo) throw new HexoError(`${cwd} isn't a hexo blog folder!`, HexoError.NOT_BLOG_ROOT)
  }

  /**
   * 检查是否存在hexo部署配置，如果_config.yml>deploy>type存在则视为有配置
   * 可能的错误：null
   * @private
   */
  async _checkCanDeploy () {
    logger.debug('checing blog can deploy')
    const hexoConfigYML = YAML.parse(fs.readFileSync(path.join(this.cwd, '_config.yml')).toString())
    this.canDeploy = hexoConfigYML.deploy && hexoConfigYML.deploy.type
    if (!this.canDeploy) {
      logger.warn(`Hexo deploy config not exists in ${this.cwd}. Can't deploy blog.`)
    } else {
      logger.debug('blog can deploy')
    }
  }

  /**
   * 初始化并开始监听文件
   * 可能的错误：HexoError.EMPTY_HEXO_ROOT | HexoError.NOT_BLOG_ROOT | other
   * @param {String} cwd Hexo博客目录
   */
  async init (cwd) {
    logger.info('init')
    if (!cwd) throw new HexoError('Hexo Root is required!', HexoError.EMPTY_HEXO_ROOT)
    this._checkIsBlog(cwd)
    this.cwd = cwd
    logger.debug('set HEXO_ROOT', this.cwd)
    logger.info('starting')
    await this._checkCanDeploy()
    this.isGit = isGit(this.cwd)
    if (!this.isGit) {
      logger.warn(`${this.cwd} isn't a git repository`)
      logger.warn('Function syncGit, resetGit and saveGit will cause errors')
    }

    this.hexo = new HexoAPI(this.cwd, { debug: false, draft: true, silent: process.env.NODE_ENV !== 'development' })
    if (this.isGit) { this.git = new Git(this.cwd) }

    // 初始化hexo
    await this.hexo.init()

    // 监听事件
    this.hexo.on('new', post => {
      logger.info('new file', post.path)
    })

    // 载入数据
    await this.load()

    // Ready to go!
    this.ready = true
    logger.info('ready')
  }

  /**
   * 检测hexo是否完成初始化
   * @private
   */
  _checkReady () {
    if (!this.ready) {
      logger.warn('Hexo uninitiated, try again later')
      throw new HexoError('Hexo uninitiated, try again later', HexoError.UNINITIALIZED)
    }
  }

  /**
   * 从磁盘载入数据
   * @private
   */
  async load () {
    logger.debug('load data')
    await this.hexo.load()
  }

  unlinkSync () {
    try {
      fs.unlinkSync(...arguments)
    } catch (err) {
      logger.error('fail to delete fail:', ...arguments)
      throw err
    }
  }

  /**
   * 保存文章到磁盘
   * @param {Post[]} posts - 需要更新的文章
   * @returns {_Document[]} - 更新后的文章文档
   * @private
   */
  async _save (posts) {
    const pathes = []
    var file = null
    await Promise.all(posts.map(async item => {
      const { post, isPage } = item
      logger.info('save', post._id, 'isPage', isPage)
      const src = await this._get(post._id, isPage)
      // 删除源文件
      this.unlinkSync(src.full_source)
      if (!post.published && !isPage)post.layout = 'draft'
      // 创建新文件
      post.freeze()
      file = await this.hexo.post.create(post)
      pathes.push(file.path)
    }))
    // 更新数据
    await this.load()
    // 查询新数据
    const p1 = this.hexo.locals.get('posts').toArray()
      .filter(item => pathes.includes(item.full_source))
      .map(doc => new Post(doc))
    const p2 = this.hexo.locals.get('pages').toArray()
      .filter(item => pathes.includes(item.full_source))
      .map(doc => new Post(doc))
    return p1.concat(p2)
  }

  /**
   * 抛出文章未找到异常
   * @private
   */
  _throwPostNotFound () {
    throw new HexoError('post not found', HexoError.POST_NOT_FOUND)
  }

  /**
   * 从磁盘和数据库删除文章
   * @param {String[]} ids - 需要删除的文章id列表
   * @returns {Post[]} - 已删除的文章列表
   * @private
   */
  async _remove (ids) {
    var posts = []
    var post = null
    await Promise.all(ids.map(async item => {
      const { id, isPage } = item
      logger.info('remove', id)
      post = await this._get(id, isPage)
      // 删除文件
      this.unlinkSync(post.full_source)
      // 清除数据
      await this.load()
      posts.push(new Post(post))
    }))
    return posts
  }

  /**
   * 新建一篇文章
   * @param {Post} post - 用于新建的文章
   * @param {Number} [addon=0] - slug的后缀，如果不为零则添加此数字为后缀
   * @param {Boolean} isPage - 是否是page
   * @returns {Post} - 新建的文章
   * @private
   */
  async _add (post, addon = 0, isPage = false) {
    logger.info('_add with slug', post.slug, Object.keys(post))
    // 存在slug就查询slug是否被占用
    if (!isPage && post.slug && this.hexo.locals.get('posts').find({ slug: post.slug }).length) {
      // 如果被占用
      if (addon) {
        // 清除后缀
        post.slug = post.slug.slice(0, addon.toString().length)
      }
      // 添加后缀  slug1
      post.slug += (addon + 1)
      return this._add(post, addon + 1)
    }
    post.published = false
    if (isPage) {
      delete post.slug
      post.layout = 'page'
    }
    // 创建文件
    const file = await this.hexo.post.create(post)
    // 更新数据
    await this.load()
    // 读取文件
    return new Post(this.hexo.locals.get(isPage ? 'pages' : 'posts')
      .findOne({ full_source: file.path }))
  }

  /**
   * 更新文章并存储
   * @param {Post} post - 需要更新的文章及其参数
   * @param {String} post._id - 文章id
   * @param {Boolean} isPage - 是否是page
   * @returns {Post} - 更新过的文章
   * @private
   */
  async _update (post, isPage = false) {
    logger.info('update', post._id, Object.keys(post))
    var src = await this._get(post._id, isPage)
    if (!src) return null
    src = new Post(src)
    src.update(post)
    var posts = await this._save([{ post: src, isPage }])
    if (posts.length === 0) {
      const err = new Error()
      err.status = 500
      err.message = 'Unknown error'
      err.message = 'Cant find post' + post._id
      throw err
    }
    if (posts.length > 1) throw new Error('multiple posts found')
    return posts[0]
  }

  /**
   * 从_id读取数据库文章
   * @param {String} _id - 文章id
   * @param {Boolean} isPage - 是否是page
   * @returns {_Document} - 文章文档
   * @private
   */
  async _get (_id, isPage = false) {
    const name = isPage ? 'pages' : 'posts'
    const query = this.hexo.locals.get(name).findOne({ _id })
    if (!query) {
      logger.info('not found', _id)
      this._throwPostNotFound()
    }
    return query
  }

  /**
   * 获取文章列表
   * @returns {Post[]} - 文章列表
   * @public
   */
  async listArticles () {
    this._checkReady()
    logger.info('list posts', this.hexo.locals.get('posts').toArray().length)
    await this.load()
    const posts = this.hexo.locals.get('posts')
      .map(doc => new Post(doc)).map(post => {
        post._whe_brief = post._content.slice(0, 200)
        delete post._content
        delete post.raw
        return post
      })
    const pages = this.hexo.locals.get('pages')
      .map(doc => new Post(doc)).map(post => {
        post._whe_brief = post._content.slice(0, 200)
        delete post._content
        delete post.raw
        return post
      })
    return posts.concat(pages)
  }

  async listArticlesRaw () {
    this._checkReady()
    logger.info('list posts', this.hexo.locals.get('posts').toArray().length)
    await this.load()
    const posts = this.hexo.locals.get('posts')
      .map(doc => new Post(doc)).map(post => {
        return {
          _id: post._id,
          raw: post.raw,
          layout: post.layout,
          published: post.published
        }
      })
    const pages = this.hexo.locals.get('pages')
      .map(doc => new Post(doc)).map(post => {
        return {
          _id: post._id,
          raw: post.raw
        }
      })
    return posts.concat(pages)
  }

  /**
   * 获取标签列表
   * @returns {Object[]} - 标签对象列表
   * @public
   */
  async listTags () {
    this._checkReady()
    const tags = this.hexo.locals.get('tags')
      .toArray()
      .map(item => {
        return this._formatTag(item)
      })
    logger.info('list tag', tags.length)
    return tags
  }

  /**
   * 获取分类列表
   * @returns {Object[]} - 分类列表
   * @public
   */
  async listCategories () {
    this._checkReady()
    const categories = this.hexo.locals.get('categories')
      .toArray()
      .map(item => {
        return this._formatCategorie(item)
      })
    logger.info('list categories', categories.length)
    return categories
  }

  /**
   * 获取单篇文章
   * @param {String} _id - 文章id
   * @param {Boolean} isPage - 是否是page
   * @returns {Post|null} - 文章对象，如果没有则为`null`
   * @public
   */
  async getPost (_id, isPage = false) {
    this._checkReady()
    logger.info('get post', _id, 'is page:', isPage)
    if (!_id) throw new HexoError('_id should be String!', HexoError.BAD_PARAMS)
    const query = await this._get(_id, isPage)
    return query ? new Post(query) : null
  }

  /**
   * 新建一篇文章
   * @param {Object} options - 新建参数
   * @param {String} options.title - 文章名
   * @param {String} [options.slug] - 网址，参见[hexo API]{@link https://hexo.io/zh-cn/api/posts}
   * @param {Boolean} isPage - 是否是page
   * @returns {Post} - 新建的文章
   * @public
   */
  async addPost (options, isPage) {
    this._checkReady()
    if (!options.title) throw new HexoError('post.title is required!', HexoError.BAD_PARAMS)
    logger.info('add post', Object.keys(options))
    var post = new Post(options, false)
    // 新文章不能指定`_id`
    delete post._id
    // post.published是计算出来的，不是指定的
    delete post.published
    post = await this._add(post, undefined, isPage)
    return post
  }

  /**
   * 更新一篇文章
   * @param {Object} options - 更新参数
   * @param {String} options._id - 文章id
   * @param {Array} options._whe_delete - 需要删除的键的数组
   * @param {Boolean} isPage - 是否是page
   * @returns {Post} - 更新过的文章
   * @public
   */
  async updatePost (options, isPage) {
    this._checkReady()
    if (!options._id) throw new Error('options._id is required!')
    console.log('update post', options._id, 'isPage', isPage)
    return this._update(new Post(options, false), isPage)
  }

  /**
   * 删除一篇文章
   * @param {String} _id - 文章id
   * @returns {Post} - 被删除的文章
   */
  async deletePost (_id, isPage = false, hard = true) {
    this._checkReady()
    if (!_id) throw new Error('_id is required!')
    console.log('delete post', _id)
    if (hard) {
      var posts = await this._remove([{ id: _id, isPage }])
      if (posts.length === 0) this._throwPostNotFound()
      if (posts.length > 1) {
        throw new Error('multiple posts found')
      }
      return posts[0]
    } else {
      const post = await this._get(_id, isPage)
      if (!post) this._throwPostNotFound()
      await this._moveFile('_discarded', post)
      await this.load()
      return new Post(post)
    }
  }

  /**
   * 发布文章
   * @param {String} _id - 文章id
   * @returns {Post} - 发布后的文章，**注意，id会改变！**
   * @public
   */
  async publishPost (_id) {
    this._checkReady()
    if (!_id) throw new Error('_id is required!')
    console.log('publish post', _id)
    var doc = await this._get(_id)
    try {
      await this.hexo.post.publish({ slug: doc.slug }, true)
    } catch (err) {
      this._throwPostNotFound()
    }
    await this.load()
    const post = this.hexo.locals.get('posts')
      .findOne({ slug: doc.slug })
    if (!post) this._throwPostNotFound()
    return new Post(post)
  }

  /**
  * 取消发布文章
  * @param {String} _id - 文章id
  * @returns {Post} - 取消发布后的文章，**注意，id会改变！**
  * @public
  */
  async unpublishPost (_id) {
    this._checkReady()
    if (!_id) throw new Error('_id is required!')
    console.log('unpublish post', _id)
    var doc = await this._get(_id)
    var post = new Post(doc)
    post.published = false
    return this._update(post)
  }

  /**
   * 将hexo数据库中categories处理为可以序列化为json的对象
   * @param {Query} category - 分类
   * @returns {Object} - 可以转化为JSON的对象
   * @private
   */
  _formatCategorie (category) {
    category = category.toObject()
    var posts = category.posts.toArray()
    category.posts = posts.map(post => post._id)
    return category
  }

  /**
   * 将hexo数据库中tags处理为可以序列化为json的对象
   * @param {_Document} tag - 标签文档
   * @returns {Object} - 可以转化为JSON的对象
   * @private
   */
  _formatTag (tag) {
    tag = tag.toObject()
    var posts = tag.posts.toArray()
    tag.posts = posts.map(post => post._id)
    return tag
  }

  /**
   * 移动文章源文件
   * @param {String} to
   * @param {String} from
   * @param {String} folder source/_xxx
   * @param {String} data post.raw
   * @private
   */
  async _moveFile (dest, post) {
    logger.info(`move file from ${post.source} to ${dest}/`)
    const src = post.full_source
    const des = post.full_source.replace(post.source.split(path.sep)[0], dest)
    const folder = path.join(this.hexo.source_dir, dest)

    if (!fs.exists(folder)) {
      fs.mkdir(folder)
    }
    fs.writeFile(des, post.raw)
    this.unlinkSync(src)
  }

  /**
   * 部署网站
   */
  async deploy () {
    this._checkReady()
    if (!this.canDeploy) {
      throw new HexoError('No deploy config found. Can\'t deploy.', HexoError.CANT_DEPLOY)
    }
    logger.info('deploy')
    return this._runShell('hexo generate -d')
  }

  /**
   * 生成网站
   */
  async generate () {
    this._checkReady()
    logger.info('generate')
    return this._runShell('hexo generate')
  }

  /**
   * 清理hexo数据
   */
  async clean () {
    this._checkReady()
    logger.info('clean')
    return this._runShell('hexo clean')
  }

  /**
   * 运行控制台程序
   * @param {String} cmd 命令
   * @private
   */
  async _runShell (cmd) {
    return new Promise((resolve, reject) => {
      const workProcess = exec(cmd, {
        cwd: this.cwd,
        maxBuffer: 5000 * 1024 // 默认 200 * 1024
      })
      // 打印正常的后台可执行程序输出
      workProcess.stdout.on('data', function (data) {
        logger.info(data)
      })

      // 打印错误的后台可执行程序输出
      workProcess.stderr.on('data', function (data) {
        logger.error(data)
      })

      // 退出之后的输出
      workProcess.on('close', function (code, signal) {
        if (code === 0) {
          resolve(0)
        } else {
          logger.error('failed to run command', cmd)
          logger.error(code, signal)
          reject(code, signal)
        }
      })
    })
  }

  /**
   * 抛出不是git目录的异常
   * @private
   */
  _notGitRepo () {
    throw new HexoError(`${this.cwd} isn't a git repository`, HexoError.NOT_GIT_REPO)
  }

  /**
   * 从GIT同步
   */
  async syncGit () {
    logger.info('sync git')
    if (!this.isGit) this._notGitRepo()
    try {
      await this.git.reset('hard')
      await this.git.pull()
    } catch (err) {
      if (err.message.indexOf('no tracking information') >= 0) {
        throw new HexoError('No configured remote origin. Reset only.', HexoError.GIT_CANT_SYNC)
      }
      throw err
    }
  }

  /**
   * 重置本地文件
   */
  async resetGit () {
    logger.info('reset git')
    if (!this.isGit) this._notGitRepo()
    await this.git.reset('hard')
  }

  /**
   * 保存到git
   */
  async saveGit () {
    logger.info('save git')
    if (!this.isGit) this._notGitRepo()
    try {
      await this._runShell('git add . --all')
      await this.git.commit('server update posts: ' + (new Date()).toString(), () => {})
      await this.git.push()
    } catch (err) {
      if (err.message.indexOf('No configured push destination') >= 0) {
        throw new HexoError('No configured push destination', HexoError.GIT_CANT_SAVE)
      }
      throw err
    }
  }
}

module.exports = { Hexo, HexoError }
