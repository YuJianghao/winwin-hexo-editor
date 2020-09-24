const jwt = require('jsonwebtoken')
const { dataService } = require('./data_service')
const { storageService } = require('./config_service')
const logger = require('log4js').getLogger('services:apikey-service')

class ApikeyServiceError extends Error {
  constructor (message, code) {
    super(message)
    Error.captureStackTrace(this)
    this.code = code
  }
}
ApikeyServiceError.prototype.name = 'ApikeyServiceError'
ApikeyServiceError.BAD_OPTIONS = 'BAD_OPTIONS'
ApikeyServiceError.INVALID_APIKEY_TOKEN = 'INVALID_APIKEY_TOKEN'

class ApikeyDocumentConverter {
  static documentToObject (doc, apikey = true) {
    const obj = doc.toObject()
    const dateKeys = ['issuedAt', 'lastUsedAt']
    dateKeys.map(key => {
      if (obj[key]) obj[key] = obj[key].valueOf()
    })
    if (!apikey) { delete obj.apikey }
    return obj
  }
}

class ApikeyService {
  // #region 添加apikey
  /**
   * 为id用户申请新api
   * @param {String} id 用户id
   * @returns 返回用于新建apikey的token
   */
  static requestApikey (id) {
    const apikeyToken = jwt.sign({ issueat: new Date().valueOf(), type: 'apikeytoken', id }, storageService.getApikeySecret(), { expiresIn: '5min' })
    ApikeyService.ApikeyTokens[apikeyToken] = apikeyToken
    Object.keys(ApikeyService.ApikeyTokens).map(key => {
      logger.info('apikey token')
      logger.debug(key)
    })
    return apikeyToken
  }

  static decodeApikeyToken (apikeyToken) {
    const has = Object.keys(ApikeyService.ApikeyTokens).includes(apikeyToken)
    if (!has) {
      logger.info('invalid apikey token')
      logger.debug(apikeyToken)
      throw new ApikeyServiceError('invalid apikey token', ApikeyServiceError.INVALID_APIKEY_TOKEN)
    }
    try {
      const decoded = jwt.verify(apikeyToken, storageService.getApikeySecret())
      if (has) delete ApikeyService.ApikeyTokens[apikeyToken]
      logger.info('apikey token decoded')
      return decoded
    } catch (err) {
      logger.info('invalid apikey token')
      logger.debug(apikeyToken)
      throw new ApikeyServiceError('invalid apikey token', ApikeyServiceError.INVALID_APIKEY_TOKEN)
    }
  }

  /**
   * 为id用户添加一个apikey
   * @param {Object} opt 选项
   * @param {String} opt.id 用户id
   * @param {String} [opt.deviceType] 设备类型
   * @param {String} [opt.deviceSystem] 设备系统
   */
  static async addApikey (opt) {
    // 格式化参数
    if (!opt.id) throw new ApikeyServiceError('opt.id is required', ApikeyServiceError.BAD_OPTIONS)
    const id = opt.id
    const apikey = jwt.sign({ issueat: new Date().valueOf(), type: 'apikey' }, 's' + Math.random())
    const deviceType = opt.deviceType || 'unknown type'
    const deviceSystem = opt.deviceSystem || 'unknown system'
    const issuedAt = new Date().valueOf()
    const Apikey = dataService.model(dataService.modelTypes.Apikey)
    await Apikey.insert({
      apikey,
      deviceType,
      deviceSystem,
      issuedAt,
      user_id: id
    })
    dataService.save()
    logger.info('new apikey added', Apikey.findOne({ apikey })._id)
    return { apikey, deviceType, deviceSystem, issuedAt, id }
  }
  // #endregion

  // #region 获取apikey信息
  static getApikeysInfo () {
    const Apikey = dataService.model(dataService.modelTypes.Apikey)
    const result = Apikey.find({}).map(item => ApikeyDocumentConverter.documentToObject(item, false))
    logger.info('get apikeys info', result.length)
    return result
  }
  // #endregion

  // #region apikey 使用
  static async hasApikey (apikey) {
    const Apikey = dataService.model(dataService.modelTypes.Apikey)
    const has = Apikey.findOne({ apikey })
    if (has) {
      await Apikey.update({ apikey }, { lastUsedAt: new Date() })
      dataService.save()
      logger.info('apikey used', Apikey.findOne({ apikey })._id)
    }
    return has
  }

  static async removeApikeyById (_id) {
    const Apikey = dataService.model(dataService.modelTypes.Apikey)
    await Apikey.remove({ _id })
    if (Apikey.findOne({ _id })) {
      logger.info('apikey removed', _id)
    } else {
      logger.info('invalid apikey id, do nothing', _id)
    }
    dataService.save()
  }

  static async removeApikeyByApikey (apikey) {
    const Apikey = dataService.model(dataService.modelTypes.Apikey)
    const one = Apikey.findOne({ apikey })
    await Apikey.remove({ apikey })
    if (one) {
      logger.info('apikey removed', one._id)
    } else {
      logger.info('invalid apikey, do nothing')
      logger.debug(apikey)
    }
    dataService.save()
  }
  // #endregion
}

ApikeyService.ApikeyTokens = {}

module.exports = { ApikeyService, ApikeyServiceError }
