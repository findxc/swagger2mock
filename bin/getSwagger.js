const path = require('path')
const axios = require('axios').default

function getSwagger(options) {
  if (options.path) {
    const swaggerPath = path.resolve(process.cwd(), options.path)
    try {
      return require(swaggerPath)
    } catch (err) {
      console.error(err)
      console.log(`please confirm the path is correct: ${swaggerPath}`)
    }
    return
  }

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
