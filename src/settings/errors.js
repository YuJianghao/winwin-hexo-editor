class SettingsError extends Error {
  constructor (message, code) {
    super(message)
    Error.captureStackTrace(this)
    this.code = code
  }
}
SettingsError.prototype.name = 'SettingsError'
SettingsError.INVALID_PARAMS = 'INVALID_PARAMS'

module.exports = SettingsError
