const log = require('../lib/log')

const ErrorHandler = {
  canHandle () {
    return true
  },
  handle (handlerInput, error) {
    log.error('ERROR HANDLED', error)
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes()

    return handlerInput.responseBuilder.
      speak(requestAttributes.t('ERROR')).
      reprompt(requestAttributes.t('FOLLOW_UP_MESSAGE')).
      getResponse()
  }
}

module.exports = ErrorHandler
