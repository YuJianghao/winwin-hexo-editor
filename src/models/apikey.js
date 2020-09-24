const { Schema } = require('warehouse')

module.exports = ctx => {
  const Apikey = new Schema({
    apikey: String,
    deviceType: String,
    deviceSystem: String,
    issuedAt: Date,
    lastUsedAt: Date,
    user_id: { type: Schema.Types.CUID, ref: 'User' }
  })

  Apikey.virtual('username').get(function () {
    const User = ctx.model('User')
    return User.findOne({ _id: this.user_id }).username
  })

  return Apikey
}
