const log = require("../lib/log");

const RequestInterceptor = {
  process(handlerInput) {
    log.info('INCOMING REQUEST', handlerInput.requestEnvelope);
  }
};

module.exports = RequestInterceptor
