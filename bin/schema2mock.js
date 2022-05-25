function schema2mock(options, swagger, schema, key) {
  if (schema && schema.$ref) {
    return schema2mock(
      options,
      swagger,
      parseJsonRef(swagger, schema.$ref),
      key
    )
  }

  const { type } = schema

  if (type === 'object') {
    const { properties = {} } = schema
    return Object.keys(properties).reduce((total, key) => {
      const mock = schema2mock(options, swagger, properties[key], key)
      if (Array.isArray(mock) && mock.length) {
        total[`${key}|${options.arrayLength}`] = mock
      } else {
        total[key] = mock
      }
      return total
    }, {})
  }

  if (type === 'array') {
    if (schema.items) {
      const mock = schema2mock(options, swagger, schema.items, key)
      if (Array.isArray(mock) && !mock.length) {
        return []
      }
      return [mock]
    } else {
      return []
    }
  }

  return parseMockValue(schema, key)
}

function parseMockValue(option, key) {
  const {
    type,
    format,
    enum: eenum,
    minLength,
    maxLength,
    minimum,
    maximum,
  } = option

  if (type === 'string') {
    if (format === 'ObjectId') {
      return '@id'
    }
    if (format === 'email') {
      return '@email'
    }
    if (format === 'date-time') {
      return '@datetime'
    }
    if (format === 'date') {
      return '@date'
    }
    if (eenum) {
      return `@pick(${JSON.stringify(eenum)})`
    }
    if ('minLength' in option && 'maxLength' in option) {
      return `@string(${minLength},${maxLength})`
    }
    return '@string'
  }

  if (type === 'integer') {
    if ('minimum' in option && 'maximum' in option) {
      return `@natural(${minimum},${maximum})`
    }
    if (key === 'total') {
      return '@natural(60,100)'
    }
    return '@natural'
  }

  return `@${type}`
}

function parseJsonRef(json, ref) {
  const value = ref
    .replace(/^#\//, '')
    .split('/')
    .reduce((total, current) => total[current], json)
  return value
}

module.exports = schema2mock
