const HelloWorldIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent'
  },
  handle (handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes()
    const reprompt = requestAttributes.t('FOLLOW_UP_MESSAGE')
    const cardTitle = requestAttributes.t('SKILL_NAME')
    const hello = requestAttributes.t('HELLO_WORLD')

    return handlerInput.responseBuilder.
      speak(hello).
      reprompt(reprompt).
      withSimpleCard(cardTitle, hello).
      getResponse()
  }
}

module.exports = HelloWorldIntentHandler
