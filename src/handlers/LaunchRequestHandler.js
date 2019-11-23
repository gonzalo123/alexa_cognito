const LaunchRequestHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
  },
  handle (handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes()
    const speechOutput = requestAttributes.t('GREETING_MESSAGE') + requestAttributes.t('HELP_MESSAGE')
    const cardTitle = requestAttributes.t('SKILL_NAME')
    const reprompt = requestAttributes.t('FOLLOW_UP_MESSAGE')

    return handlerInput.responseBuilder.
      speak(speechOutput).
      reprompt(reprompt).
      withSimpleCard(cardTitle, speechOutput).
      getResponse()
  }
}

module.exports = LaunchRequestHandler
