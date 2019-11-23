const i18n = require('i18next')
const sprintf = require('i18next-sprintf-postprocessor')
const languageStrings = require('../i18n/languageStrings')

const LocalizationInterceptor = {
  process (handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      resources: languageStrings
    })

    localizationClient.localize = function localize () {
      const args = arguments
      const values = []
      for (let i = 1; i < args.length; i += 1) {
        values.push(args[i])
      }
      const value = i18n.t(args[0], {
        returnObjects: true,
        postProcess: 'sprintf',
        sprintf: values
      })
      if (Array.isArray(value)) {
        return value[Math.floor(Math.random() * value.length)]
      }
      return value
    }
    const attributes = handlerInput.attributesManager.getRequestAttributes()
    attributes.t = function translate (...args) {
      return localizationClient.localize(...args)
    }
  }
}

module.exports = LocalizationInterceptor
