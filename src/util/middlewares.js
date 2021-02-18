exports.validateRequestBody = v => {
  return async (ctx, next) => {
    try {
      await v.validateAsync(ctx.request.body)
    } catch (err) {
      ctx.status = 400
      ctx.body = {
        success: false,
        message: 'Validation failed',
        details: err.details.map(d => d.message)
      }
      return
    }
    await next()
  }
}
