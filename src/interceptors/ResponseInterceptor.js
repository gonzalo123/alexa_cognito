const log = require('../lib/log')

const ResponseInterceptor = {
  process (handlerInput, response) {
    log.info('OUTGOING REQUEST', response)
  }
}

module.exports = ResponseInterceptor
