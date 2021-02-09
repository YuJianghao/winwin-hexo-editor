const chalk = require('chalk')
const { spawn } = require('hexo-util')
require('../util/logger')

class HexoCLI {
  /**
   * 有关hexo的cli操作封装
   * @param {String} HEXO_ROOT hexo路径
   */
  constructor (HEXO_ROOT) {
    this.HEXO_ROOT = HEXO_ROOT
    this.logger = require('log4js').getLogger('hexo')
  }

  /**
   *运行hexo命令
  * @param {String} cwd 路径
  * @param {String} command hexo命令
  * @param {Object} opt 命令选项
  */
  async run (cwd, command, opt = {}) {
    const args = Object.keys(opt).filter(key => opt[key]).map(key => '--' + key)
    await this.runcli(cwd, 'hexo', [command].concat(args))
  }

  /**
   * 运行cli命令
   * @param {String} cwd 路径
   * @param {String} command 命令
   * @param {String[]} args 参数
   */
  async runcli (cwd, command, args = []) {
    const string = [command].concat(args).map(key => {
      if (key.includes(' ')) return '"' + key + '"'
      else return key
    }).join(' ')
    this.logger.debug('Run `' + string + '` ' + chalk.gray(cwd))
    try {
      await spawn(command, args, { cwd, stdio: 'inherit' })
      this.logger.debug('Finished')
    } catch (err) {
      this.logger.error('Fail to run `' + string + '`')
      this.logger.error(err)
    }
  }

  /**
   * hexo generate
   * https://hexo.io/zh-cn/docs/commands.html#generate
   */
  async generate (opt = { deploy: false, watch: false, bail: false, force: false, concurrency: false }) {
    await this.run(this.HEXO_ROOT, 'generate', opt)
  }

  /**
   * hexo deploy
   * https://hexo.io/zh-cn/docs/commands.html#deploy
   */
  async deploy (opt = { generate: false }) {
    await this.run(this.HEXO_ROOT, 'deploy', opt)
  }

  /**
   * hexo clean
   * https://hexo.io/zh-cn/docs/commands.html#clean
   */
  async clean () {
    await this.run(this.HEXO_ROOT, 'clean')
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
    const args = ['new']
    if (opt.layout)args.push(opt.layout)
    if (opt.path) {
      args.push('--path')
      args.push(opt.path)
    }
    if (opt.replace)args.push('--replace')
    if (opt.slug) {
      args.push('--slug')
      args.push(opt.slug)
    }
    if (title)args.push(title)
    return this.runcli(this.HEXO_ROOT, 'hexo', args)
  }

  /**
   * hexo publish
   * https://hexo.io/zh-cn/docs/commands.html#publish
   * @param {String} filename 文件名
   * @param {String} layout 布局
   */
  async publish (filename, layout) {
    const args = ['publish']
    if (layout)args.push(layout)
    args.push(filename)
    await this.runcli(this.HEXO_ROOT, 'hexo', args)
  }

  async server () {
    throw new Error('Not Implemented')
  }

  async render () {
    throw new Error('Not Implemented')
  }

  async migrate () {
    throw new Error('Not Implemented')
  }

  async list () {
    throw new Error('Not Implemented')
  }

  async init () {
    throw new Error('Not Implemented')
  }

  /**
   * https://hexo.io/zh-cn/docs/commands.html#version
  */
  async version () {
    this.runcli(this.HEXO_ROOT, 'hexo', ['version'])
  }
}
module.exports = HexoCLI
