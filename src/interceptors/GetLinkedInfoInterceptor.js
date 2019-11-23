const log = require('../lib/log')
const cognito = require('../lib/cognito')
const utils = require('../lib/utils')

const GetLinkedInfoInterceptor = {
  async process (handlerInput) {
    if (utils.isAccountLinked(handlerInput)) {
      const userData = await cognito.getUserData(handlerInput.requestEnvelope.session.user.accessToken)
      log.info('GetLinkedInfoInterceptor: getUserData: ', userData)
      const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()
      if (userData.Username !== undefined) {
        sessionAttributes.auth = true
        sessionAttributes.emailAddress = cognito.getAttribute(userData.UserAttributes, 'email')
        sessionAttributes.userName = userData.Username
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
      } else {
        sessionAttributes.auth = false
        log.error('GetLinkedInfoInterceptor: No user data was found.')
      }
    }
  }
}

module.exports = GetLinkedInfoInterceptor
