const { objparser } = require('../utils')
const { dataService } = require('./data_service')

class UserConfigService {
  static _parseConfig (config = {}, oldConfig) {
    return objparser(config, UserConfigService.schema, oldConfig || UserConfigService.defaultConfig)
  }

  static async _initConfigById (id) {
    const Model = dataService.model(dataService.modelTypes.UserConfig)
    await Model.insertOne({
      config: {},
      user_id: id
    })
    await dataService.save()
  }

  static async _getOrCreateConfig (id) {
    const Model = dataService.model(dataService.modelTypes.UserConfig)
    let config = Model.findOne({
      user_id: id
    })
    if (!config) {
      await UserConfigService._initConfigById(id)
      config = Model.findOne({
        user_id: id
      })
    }
    return UserConfigService._parseConfig(config.toObject().config)
  }

  static async getConfigById (id, parts = []) {
    const config = await UserConfigService._getOrCreateConfig(id)
    const result = {}
    parts.map(key => { result[key] = config[key] })
    return result
  }

  static async setConfigById (id, config = {}, parts = []) {
    const Model = dataService.model(dataService.modelTypes.UserConfig)
    const oldConfig = await UserConfigService._getOrCreateConfig(id)
    parts.map(key => { oldConfig[key] = config[key] })
    await Model.replace({ user_id: id }, {
      config: oldConfig,
      user_id: id
    })
    await dataService.save()
    return UserConfigService.getConfigById(id, parts)
  }
}

UserConfigService.schema = {
  // ui: {
  //   editor: {
  //     toolbar: {
  //       direction: v => ['vertical', 'horizontal'].includes(v)
  //     }
  //   }
  // }
}
UserConfigService.defaultConfig = {
  // ui: {
  //   editor: {
  //     toolbar: {
  //       direction: 'vertical'
  //     }
  //   }
  // }
}

module.exports = {
  UserConfigService
}
