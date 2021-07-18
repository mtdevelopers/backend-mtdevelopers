var requestify = require('requestify')
// var fs = require('fs')

let perNums = ['Û°', 'Û±', 'Û²', 'Û³', 'Û´', 'Ûµ', 'Û¶', 'Û·', 'Û¸', 'Û¹']
let arNums = ['Ù©', 'Ù¨', 'Ù§', 'Ù¦', 'Ù¥', 'Ù¤', 'Ù£', 'Ù¢', 'Ù¡', 'Ù ']
let enNums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

function toPer (str) {
  let rStr = String(str) || ""
  for (let i = 0; i < 10; i++) {
    rStr = rStr.replace(new RegExp(enNums[i], 'g'), perNums[i])
    rStr = rStr.replace(new RegExp(arNums[i], 'g'), perNums[i])
  }
  return rStr
}

module.exports = {
  sendSms: function (number, body, cb) {
    requestify.post('http://ws.sms.ir/api/Token', {
      'UserApiKey': 'f768517f265686b5e72d6f4e',
      'SecretKey': 'elyarhesami',
      'System': 'node'
    }, {
      'Content-Type': 'application/json'
    })
    .then(res => {
      let token = String(JSON.parse(res.body).TokenKey)
      requestify.post('http://ws.sms.ir/api/MessageSend', {
        'Messages': [body],
        'MobileNumbers': [number],
        'LineNumber': '10004133858686',
        'SendDateTime': '',
        'CanContinueInCaseOfError': 'false'
      }, {
        'Content-Type': 'application/json',
        headers: {
          'x-sms-ir-secure-token': token
        }
      })
      .then(res1 => {
        cb(res1.getBody())
      })
      .catch(err => {
        cb(null, err)
        console.log(err)
      })
    })
    .catch(err => {
      cb(null, err)
      console.log(err)
    })
  },
  // gesmate params dar inja ba faraxnie function to authController hamxani nadare
  sendSmsByTemplate: function (number, templateId, params, cb) {
    params = params.map(param => {
      param.ParameterValue = toPer(param.ParameterValue)
      return param
    })
    requestify.post('http://ws.sms.ir/api/Token', {
      'UserApiKey': 'f768517f265686b5e72d6f4e',
      'SecretKey': 'elyarhesami',
      'System': 'node'
    }, {
      'Content-Type': 'application/json'
    })
    .then(res => {
      let token = String(JSON.parse(res.body).TokenKey)
      requestify.post('http://RestfulSms.com/api/UltraFastSend', {
        'TemplateId': templateId,
        'Mobile': number,
        'ParameterArray': params
      }, {
        'Content-Type': 'application/json',
        headers: {
          'x-sms-ir-secure-token': token
        }
      })
      .then(res1 => {
        cb(res1.getBody())
      })
      .catch(err => {
        cb(null, err)
        console.log(err)
      })
    })
    .catch(err => {
      cb(null, err)
      console.log(err)
    })
  }
}
// var requestify = require('requestify')
// export default {
//   sendSms: function (number, body, cb) {
//     requestify.post('http://birweb.ir/smsapi/index.php', {
//       send: 'hjfjkd',
//       number: number,
//       body: body
//     },
//     { dataType: 'form-url-encoded' })
//     .then(function (response) {
//       var respon = response.getBody()
//       if (cb) {
//         cb(respon)
//       }
//     })
//   }
// }
