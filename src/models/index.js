const User = require('./user')
const Apikey = require('./apikey')
const UserConfig = require('./user_config')

exports.models = { User, Apikey, UserConfig }

class ModelTypes {}
ModelTypes.User = 'User'
ModelTypes.Apikey = 'Apikey'
ModelTypes.UserConfig = 'UserConfig'

exports.ModelTypes = ModelTypes
