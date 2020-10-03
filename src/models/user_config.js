const { Schema } = require('warehouse')

module.exports = ctx => {
  const Ui = new Schema({
    config: Object,
    user_id: { type: Schema.Types.CUID, ref: 'User' }
  })

  return Ui
}
