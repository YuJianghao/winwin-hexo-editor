exports.isDev = process.env.NODE_ENV === 'development'
const _ = require('lodash')
/**
 * 格式化数据
 * @param {Object} obj 对象
 * @param {Object} schema 默认对象，每一个项目为部分对象或者 value => validatedValue 的函数
 */
const objparser = (obj = {}, schema, defaultObj) => {
  if (!schema) throw new Error('schema is required')
  if (!defaultObj) throw new Error('defaultObj is required')
  const newObj = _.merge(obj, defaultObj)
  Object.keys(newObj).map(key => {
    if (schema[key]) {
      if (typeof schema[key] === 'function') {
        if (obj) {
          newObj[key] = schema[key](obj[key]) ? obj[key] : defaultObj[key]
        } else {
          newObj[key] = defaultObj[key]
        }
      } else {
        newObj[key] = objparser(obj[key] ? obj[key] : {}, schema[key], defaultObj[key])
      }
    }
  })
  return newObj
}

exports.objparser = objparser
