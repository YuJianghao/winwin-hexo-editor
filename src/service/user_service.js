const { dataService } = require('./data_service')
const config = require('../../config.default')
const WarehouseError = require('warehouse/lib/error')

class UserServiceError extends Error {
  constructor (message, code) {
    super(message)
    Error.captureStackTrace(this)
    this.code = code
  }
}

UserServiceError.prototype.name = 'UserServiceError'
UserServiceError.USER_EXIST = 'USER_EXIST'
UserServiceError.USER_NOT_EXIST = 'USER_NOT_EXIST'
UserServiceError.SAVE_FAIL = 'SAVE_FAIL'

class UserService {
  /**
   * 可能的错误：UserServiceError.USER_EXIST
   * @param {String} username 用户名
   * @param {String} password 密码
   */
  static async addUser (username, password) {
    const User = dataService.model(dataService.modelTypes.User)
    if (User.findOne({ username })) {
      throw new UserServiceError('duplicate user:' + username, UserServiceError.USER_EXIST)
    }
    await User.insertOne({ username, password })
    await dataService.save()
  }

  /**
   * 获取用户信息
   * @param {String} id 用户id
   * @param {Boolean} password 是否保留密码
   */
  static async getUser (id, password) {
    const User = dataService.model(dataService.modelTypes.User)
    const result = User.findOne({ _id: id })
    if (result && !password) delete result.password
    return result
  }

  /**
   * 可能的错误：UserServiceError.USER_NOT_EXIST | other
   * @param {String} id 用户id
   * @param {String} username 用户名
   * @param {String} password 密码
   */
  static async updateUser (id, username, password) {
    const User = dataService.model(dataService.modelTypes.User)
    const update = {}
    update.username = username || config.username
    update.password = password || config.password
    try {
      await User.updateById(id, update)
      await dataService.save()
    } catch (err) {
      if (err.name === WarehouseError.ID_NOT_EXIST) {
        throw new UserServiceError('user not exists', UserServiceError.USER_NOT_EXIST)
      }
      throw err
    }
  }

  static async hasUser (username, password) {
    const User = dataService.model(dataService.modelTypes.User)
    if (password) {
      return User.findOne({ username, password })
    } else {
      return User.findOne({ username })
    }
  }

  static async hasUserById (_id) {
    const User = dataService.model(dataService.modelTypes.User)
    return User.findOne({ _id })
  }
}

module.exports = { UserService, UserServiceError }
