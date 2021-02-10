require('../util/logger')
const HexoAPI = require('./hexo_api')
const HexoCLI = require('./hexo_cli')
const fs = require('hexo-fs')
const path = require('path')
const chalk = require('chalk')

class Hexo {
  _checkReady () {
    if (!this.ready) throw new Error('Hexo initiating')
  }

  /**
   * 检测是否是hexo博客目录
   * 如果没有依赖hexo或者没有`_config.yml`则视为不是博客目录
   * 可能的错误：HexoError.NOT_BLOG_ROOT | other
   * @private
   */
  _checkIsBlog (cwd) {
    let file
    try {
      // 检查是否有对应文件
      file = fs.readFileSync(path.join(cwd, 'package.json'))
      fs.readFileSync(path.join(cwd, '_config.yml'))
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new Error('Not blog')
      }
      throw err
    }
    // 检查是否有hexo依赖
    const packageJSON = JSON.parse(file)
    if (!packageJSON.dependencies.hexo) throw new Error('Not blog')
  }

  async init (cwd) {
    // TOD： 验证是不是hexo目录
    this.cwd = cwd
    this._checkIsBlog(cwd)
    this.hapi = new HexoAPI(this.cwd)
    await this.hapi.init()
    this.hcli = new HexoCLI(this.cwd)
    this.logger = require('log4js').getLogger('hexo')
    this.ready = true
  }

  async listPost () {
    this._checkReady()
    return this.hapi.listPost()
  }

  async listPage () {
    this._checkReady()
    return this.hapi.listPage()
  }

  async listTag () {
    this._checkReady()
    return this.hapi.listTag()
  }

  async listCategory () {
    this._checkReady()
    return this.hapi.listCategory()
  }

  /**
   * hexo new
   * https://hexo.io/zh-cn/docs/commands.html#new
   * @param {String} title 文章名
   * @param {Object} opt 选项
   * @param {String} opt.layout 布局
   * @param {String} opt.path 路径
   * @param {String} opt.slug
   * @param {Boolean} opt.replace 是否替换已存在文件
   */
  async new (title, opt = { layout: undefined, path: undefined, slug: undefined, replace: false }) {
    this._checkReady()
    return this.hcli.new(...arguments)
  }

  /**
   * 从id获取文件路径
   * @param {String} id 文章id
   * @param {Boolean} page 是否是页面
   */
  async _getSource (id, page = false) {
    const res = (page ? (await this.hapi.listPage()) : (await this.hapi.listPost())).filter(r => r._id === id)
    if (res.length < 1) throw new Error('Not found')
    return res[0].full_source
  }

  /**
   * 从id获取原数据
   * @param {String} id 文章id
   * @param {Boolean} page 是否是页面
   */
  async _getRaw (id, page = false) {
    const res = (page ? (await this.hapi.listPage()) : (await this.hapi.listPost())).filter(r => r._id === id)
    if (res.length < 1) throw new Error('Not found')
    return res[0].raw
  }

  async write (id, obj, page = false) {
    this._checkReady()
    const string = await this.hapi.stringify(await this._getRaw(id, page), obj)
    const source = await this._getSource(id, page)
    fs.writeFileSync(source, string)
    this.logger.info('Write file', chalk.magenta(source))
  }

  /**
   * 根据id删除文章
   * @param {String} id 需要删除的文章id
   * @param {Boolean} page 是否是页面
   */
  async delete (id, page = false) {
    this._checkReady()
    const source = await this._getSource(id, page)
    fs.unlinkSync(source)
    this.logger.info('Delete file', chalk.magenta(source))
  }

  /**
   * hexo generate
   * https://hexo.io/zh-cn/docs/commands.html#generate
   */
  async generate (opt = { deploy: false, watch: false, bail: false, force: false, concurrency: false }) {
    this._checkReady()
    return this.hcli.generate(...arguments)
  }

  /**
   * hexo deploy
   * https://hexo.io/zh-cn/docs/commands.html#deploy
   */
  async deploy (opt = { generate: false }) {
    this._checkReady()
    return this.hcli.deploy(...arguments)
  }

  /**
   * hexo clean
   * https://hexo.io/zh-cn/docs/commands.html#clean
   */
  async clean () {
    this._checkReady()
    return this.hcli.clean(...arguments)
  }

  /**
   * hexo publish
   * https://hexo.io/zh-cn/docs/commands.html#publish
   * @param {String} filename 文件名
   * @param {String} layout 布局
   */
  async publish (id, layout = 'post') {
    this._checkReady()
    const posts = (await this.listPost()).filter(p => p._id === id)
    if (posts.length < 1) throw new Error('Not found')
    const post = posts[0]
    if (post.published) throw new Error('Already published')
    const filename = path.basename(post.source, path.extname(post.source))
    return this.hcli.publish(filename, layout)
  }
}
module.exports = Hexo
