'use strict'

const Promise = require('any-promise')

/**
 * Expose compositor.
 */

module.exports = compose

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array[Object]} middleware
 * @return {Function}
 * @api public
 */

function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array[{fn,validator}]!')
  for (const item of middleware) {
    if (typeof item.fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
    if (item.validator && typeof item.validator !== 'function') throw new TypeError('Validator must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // last called middleware #
    return dispatch(0)
    async function dispatch (i) {
      const fn = middleware[i].fn
      const validator = middleware[i].validator || function () { return true }
      try {
        try {
          const res = await fn(context, next)
          return Promise.resolve(res)
        } catch (err) {
          if (i + 1 < middleware.length && validator(err)) {
            return dispatch(i + 1)
          } else {
            return Promise.reject(err)
          }
        }
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
