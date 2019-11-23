const utils = require('../lib/utils')

const CheckAccountLinkedHandler = {
  canHandle (handlerInput) {
    return !utils.isAccountLinked(handlerInput)
  },
  handle (handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes()
    const speakOutput = requestAttributes.t('NEED_TO_LINK_MESSAGE', 'SKILL_NAME')
    return handlerInput.responseBuilder.
      speak(speakOutput).
      withLinkAccountCard().
      getResponse()
  }
}

module.exports = CheckAccountLinkedHandler
