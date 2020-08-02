const Hexo = require('./hexo')
const debug = require('debug')('hexo:search')

class Search {
  /**
   * 初始化
   * @param {Hexo} hexo hexo实例
   */
  constructor (hexo) {
    this._setHexoInstance(hexo)
    this.ready = true
  }

  /**
   * 设置hexo
   * @param {Hexo} hexo hexo实例
   */
  _setHexoInstance (hexo) {
    debug('set hexo instance')
    if (!(hexo instanceof Hexo)) throw new Error('Not a Hexo instance!')
    this.hexo = hexo
    this.ready = true
  }

  /**
   * 检测是否完成初始化
   * @private
   */
  async _checkReady () {
    if (!this.ready) {
      debug('Please set hexo instance before search')
      const err = new Error('Please set hexo instance before search')
      err.name = 'Need hexo'
      throw err
    }
  }

  /**
   * 从原始字符串中截取子串附近的内容
   * @param {String} str 原始字符串
   * @param {String} idx 子串位置
   * @param {Number}} queryLength 子串长度
   * @param {Number} size 返回查询字符串前后临近文字的数量，前后共2*size
   */
  _getBrief (str, idx, queryLength, size) {
    const start = idx - size > 0 ? idx - size : 0
    const startIdx = idx - size > 0 ? size : idx
    const result = str.slice(start, start + queryLength + 2 * size)
    return {
      idx,
      str: result,
      start: startIdx
    }
  }

  /**
   * 查询字符串中所有子串的位置
   * @param {String} str 需要搜索的字符串
   * @param {String} q 子串
   */
  _searchAll (str, q) {
    const idxs = []
    const idx = str.indexOf(q)
    if (idx < 0) return []
    if (idx + 1 > str.length) return []
    idxs.push(idx)
    return idxs.concat(this._searchAll(str.slice(idx + 1), q).map(item => item + idx + 1))
  }

  /**
   * 按文章内容查询
   * @param {Object} post 文章
   * @param {String} query 查询字符串
   * @param {Number} size 返回查询字符串前后临近文字的数量，前后共2*size
   */
  _searchPost (post, query, size) {
    const raw = post.raw.toLowerCase()
    const idxs = this._searchAll(raw, query)
    return idxs.map(idx => this._getBrief(raw, idx, query.length, size)).map(item => {
      item._id = post._id
      return item
    })
  }

  /**
   * 查询所有文章
   * @param {String} q 查询字符串
   * @param {Number} size 返回查询字符串前后临近文字的数量，前后共2*size
   */
  async search (q = '', size = 200) {
    await this._checkReady()
    if (!q) {
      debug('empty search query')
      return {}
    }
    debug('search request:', '`' + q + '`', 'with size', size)
    const query = q.toLowerCase()
    const posts = await this.hexo.listPostsRaw()
    return {
      result: posts.map(post => this._searchPost(post, query, size)).reduce((a, b) => a.concat(b)),
      size
    }
  }
}

module.exports = Search
