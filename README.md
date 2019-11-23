## Alexa skill and account linking with Cognito

Sometimes when we're building one Alexa skill, we need to identify the user. To do that Alexa provides account linking. Basically we need an Oauth2 server to link our account within our Alexa skill. AWS provide us a managed Oauth2 service called Cognito, so we can use use Cognito identity pool to handle authentication for our Alexa Skills. 

In this example I've followed the following blog post: https://aws.amazon.com/blogs/compute/amazon-cognito-for-alexa-skills-user-management/. Cognito is is a bit weird to set up but after following all the steps we can use Account Linking in Alexa skill.

There's also a good sample skill here: https://github.com/alexa/skill-sample-nodejs-linked-profile. I've studied a little bit this example and create a working example by my own basically to understand the process.

That's my skill:
```javascript
const Alexa = require('ask-sdk')

const RequestInterceptor = require('./interceptors/RequestInterceptor')
const ResponseInterceptor = require('./interceptors/ResponseInterceptor')
const LocalizationInterceptor = require('./interceptors/LocalizationInterceptor')
const GetLinkedInfoInterceptor = require('./interceptors/GetLinkedInfoInterceptor')

const LaunchRequestHandler = require('./handlers/LaunchRequestHandler')
const CheckAccountLinkedHandler = require('./handlers/CheckAccountLinkedHandler')
const HelloWorldIntentHandler = require('./handlers/HelloWorldIntentHandler')
const HelpIntentHandler = require('./handlers/HelpIntentHandler')
const CancelAndStopIntentHandler = require('./handlers/CancelAndStopIntentHandler')
const SessionEndedRequestHandler = require('./handlers/SessionEndedRequestHandler')
const FallbackHandler = require('./handlers/FallbackHandler')
const ErrorHandler = require('./handlers/ErrorHandler')
const RequestInfoHandler = require('./handlers/RequestInfoHandler')

let skill

module.exports.handler = async (event, context) => {
  if (!skill) {
    skill = Alexa.SkillBuilders.custom().
      addRequestInterceptors(
        RequestInterceptor,
        ResponseInterceptor,
        LocalizationInterceptor,
        GetLinkedInfoInterceptor
      ).
      addRequestHandlers(
        LaunchRequestHandler,
        CheckAccountLinkedHandler,
        HelloWorldIntentHandler,
        RequestInfoHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        FallbackHandler).
      addErrorHandlers(
        ErrorHandler).
      create()
  }

  return await skill.invoke(event, context)
}
```

The most important thing here is maybe GetLinkedInfoInterceptor.

```javascript
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
```

This interceptor retrieves the user info from cognito when we provide the accessToken. We can obtain the accessToken from session (if our skill is account linked). Then we inject the user information (in my example the email and the username of the Cognito identity pool) into the session.

Then we can create one intent in our request handlers chain called CheckAccountLinkedHandler. With this intent we check if our skill is account linked. If not we can provide 'withLinkAccountCard' to force user to login with Cognito and link the skill's account.

```javascript
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
```

Later we can create one intent to give the information to the user of maybe, in another case, perform an authorization workflow

```javascript
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
```

And basically that's all. In fact isn't very different than traditional web authentication. Maybe the most complicated part especially if you're not used to Oauth2 is to configure Cognito properly.
