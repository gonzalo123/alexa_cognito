const AWS = require('aws-sdk')
const log = require('../lib/log')

const COGNITO_REGION = getEnvVar('COGNITO_REGION')

function getEnvVar (envVarName, defaultValue) {
  if (process.env[envVarName]) {
    return process.env[envVarName]
  }
  return defaultValue
}

function getAttribute (attrArray, attrName) {
  let value = 'NOTFOUND'
  for (let i = 0; i < attrArray.length; i += 1) {
    if (attrArray[i].Name === attrName) {
      value = attrArray[i].Value
      break
    }
  }
  return value
}

function getUserData (accToken) {
  return new Promise(((resolve, reject) => {
    const cognitoISP = new AWS.CognitoIdentityServiceProvider({ region: COGNITO_REGION })
    const cognitoParams = {
      AccessToken: accToken
    }
    cognitoISP.getUser(cognitoParams, (error, data) => {
      if (error) {
        reject(error)
      } else {
        log.info('getUserData success', data)
        resolve(data)
      }
    })
  }))
}

module.exports.getUserData = getUserData
module.exports.getAttribute = getAttribute
