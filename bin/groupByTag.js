const schema2mock = require('./schema2mock')

function groupByTag(options, swagger) {
  const { paths } = swagger

  const map = {}

  for (const path in paths) {
    const methods = paths[path]
    Object.keys(methods)
      .filter(method => method === 'get' && !methods[method].deprecated)
      .forEach(method => {
        const { summary, tags, responses } = methods[method]
        const successCode = Object.keys(responses).find(code => /^2/.test(code))
        const mock =
          successCode && responses[successCode].schema
            ? schema2mock(options, swagger, responses[successCode].schema)
            : {}
        tags.forEach(tag => {
          if (!map[tag]) {
            map[tag] = {}
          }
          map[tag][`${method.toUpperCase()} ${path}`] = { summary, mock }
        })
      })
  }

  return map
}

module.exports = groupByTag
