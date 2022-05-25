const axios = require('axios').default

function getSwagger(options) {
  return axios
    .get(options.url)
    .then(res => {
      return res.data
    })
    .catch(err => {
      console.error(err)
      console.log(
        `error occurred when request swagger.json, please confirm the url is correct: ${options.url}`
      )
    })
}

module.exports = getSwagger
