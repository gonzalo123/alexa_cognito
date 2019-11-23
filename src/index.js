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
