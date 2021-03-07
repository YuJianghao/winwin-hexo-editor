exports.validateRequestBody = v => {
  return async (ctx, next) => {
    try {
      await v.validateAsync(ctx.request.body)
    } catch (err) {
      ctx.status = 400
      ctx.body = {
        message: 'Validation failed',
        details: err.details.map(d => d.message)
      }
      return
    }
    await next()
  }
}
exports.validateRequestQuery = v => {
  return async (ctx, next) => {
    try {
      await v.validateAsync(ctx.request.query)
    } catch (err) {
      ctx.status = 400
      ctx.body = {
        message: 'Validation failed',
        details: err.details.map(d => d.message)
      }
      return
    }
    await next()
  }
}
