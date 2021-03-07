const logger = require('log4js').getLogger('DI')
const ctors = new Map()
const services = new Map()
function error (message) {
  throw new Error('[DI]: ' + message)
}
const stack = []
class DI {
  static provide (descriptor, ctor) {
    if (ctors.has(descriptor)) error(`descriptor ${descriptor} in use`)
    ctors.set(descriptor, ctor)
    logger.debug('provide', descriptor)
  }

  static inject (descriptor) {
    if (!descriptor) error('descriptor is required')
    if (!ctors.has(descriptor)) error(`descriptor ${descriptor} not found`)
    if (stack.includes(descriptor)) { error('circular dependences: ' + stack.concat(descriptor).join(' > ')) }
    logger.debug('inject', descriptor)
    stack.push(descriptor)
    let service
    service = services.get(descriptor)
    if (!service) {
      logger.debug('instantiate', descriptor)
      service = new (ctors.get(descriptor))()
      services.set(descriptor, service)
    }
    stack.pop(descriptor)
    return service
  }
}
module.exports = DI
