const { Schema } = require('warehouse')

module.exports = ctx => {
  const User = new Schema({
    username: String,
    password: String
  })
  return User
}
