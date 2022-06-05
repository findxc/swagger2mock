#!/usr/bin/env node
const path = require('path')
const args = require('args')
const getSwagger = require('./getSwagger')
const groupByTag = require('./groupByTag')
const generateFiles = require('./generateFiles')

args
  .option('url', 'The swagger.json url', '')
  .option('path', 'The local swagger.json path relative to root', '')
  .option('directory', 'The directory to put generated mock files', 'mock')
  .option('arrayLength', 'The mocked array length', 10)
  .option('filenameSuffix', 'The suffix of filename', '.generated.js')

let packageJson = {}
try {
  packageJson = require(path.resolve(process.cwd(), 'package.json'))
} catch (err) {}

const options = {
  ...args.parse(process.argv),
  ...{
    prettier: {
      parser: 'babel',
      semi: false,
      singleQuote: true,
    },
  },
  ...(packageJson['swagger2mock'] || {}),
}

;(async function () {
  try {
    const swagger = await getSwagger(options)
    if (!swagger) {
      return
    }
    const group = groupByTag(options, swagger)
    generateFiles(options, group)
  } catch (err) {
    console.error(err)
  }
})()
