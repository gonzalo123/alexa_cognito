function getResolvedSlotIDValue (request, slotName) {
  const slot = request.intent.slots[slotName]

  if (slot &&
    slot.value &&
    slot.resolutions &&
    slot.resolutions.resolutionsPerAuthority &&
    slot.resolutions.resolutionsPerAuthority[0] &&
    slot.resolutions.resolutionsPerAuthority[0].values &&
    slot.resolutions.resolutionsPerAuthority[0].values[0] &&
    slot.resolutions.resolutionsPerAuthority[0].values[0].value &&
    slot.resolutions.resolutionsPerAuthority[0].values[0].value.name) {

    return slot.resolutions.resolutionsPerAuthority[0].values[0].value.id
  }
  return null
}


const RequestInfoHandler = {
  canHandle (handlerInput) {
    const request = handlerInput.requestEnvelope.request
    return (request.type === 'IntentRequest'
      && request.intent.name === 'RequestInfoIntent')
  },
  handle (handlerInput) {
    const request = handlerInput.requestEnvelope.request
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes()
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()
    const repromptOutput = requestAttributes.t('FOLLOW_UP_MESSAGE')
    const cardTitle = requestAttributes.t('SKILL_NAME')

    let speakOutput = ''

    let inquiryTypeId = getResolvedSlotIDValue(request, 'infoTypeRequested')
    if (!inquiryTypeId) {
      inquiryTypeId = 'fullProfile'
      speakOutput += requestAttributes.t('NOT_SURE_OF_TYPE_MESSAGE')
    } else {
      if (inquiryTypeId === 'emailAddress' || inquiryTypeId === 'fullProfile') {
        speakOutput += requestAttributes.t('REPORT_EMAIL_ADDRESS', sessionAttributes.emailAddress)
      }

      if (inquiryTypeId === 'userName' || inquiryTypeId === 'fullProfile') {
        speakOutput += requestAttributes.t('REPORT_USERNAME', sessionAttributes.userName)
      }
    }

    speakOutput += repromptOutput

    return handlerInput.responseBuilder.
      speak(speakOutput).
      reprompt(repromptOutput).
      withSimpleCard(cardTitle, speakOutput).
      getResponse()
  }
}

module.exports = RequestInfoHandler
