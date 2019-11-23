const HelpIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
  },
  handle (handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes()
    const help = requestAttributes.t('HELP_MESSAGE')
    const cardTitle = requestAttributes.t('SKILL_NAME')
    const reprompt = requestAttributes.t('FOLLOW_UP_MESSAGE')

    return handlerInput.responseBuilder.
      speak(help).
      reprompt(reprompt).
      withSimpleCard(cardTitle, help).
      getResponse()
  }
}

module.exports = HelpIntentHandler
