const isAccountLinked = (handlerInput) => {
  return (handlerInput.requestEnvelope.session.user &&
    handlerInput.requestEnvelope.session.user.accessToken)
}

module.exports.isAccountLinked = isAccountLinked
