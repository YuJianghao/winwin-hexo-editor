const { DataServiceError } = require('./service/data_service')
exports.dataServiceErrorHandler = async function (ctx, next) {
  try {
    await next()
  } catch (err) {
    if (err.code === DataServiceError.INITIATING) {
      ctx.status = 503
      ctx.body = {
        success: false,
        message: 'initiating, try again later'
      }
    } else {
      throw err
    }
  }
}
