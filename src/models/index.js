const User = require('./user')
const Apikey = require('./apikey')

exports.models = { User, Apikey }

class ModelTypes {}
ModelTypes.User = 'User'
ModelTypes.Apikey = 'Apikey'

exports.ModelTypes = ModelTypes
