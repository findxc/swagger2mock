const fs = require('fs')
const path = require('path')
const prettier = require('prettier')

function safeMkdirSync(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true })
  }
}

function generateFiles(options, group) {
  const mockFolder = path.resolve(process.cwd(), options.directory)

  for (const tag in group) {
    const tagPaths = group[tag]

    const mockContents = Object.keys(tagPaths)
      .map(key => {
        const { summary, mock } = tagPaths[key]
        const str = JSON.stringify(mock)
        const mockData = Array.isArray(mock)
          ? `mock({'list|${options.arrayLength}': ${str}}).list`
          : `mock(${str})`
        // format /user/{id} to /user/:id, because mock server uses :id
        const formatedKey = key.replace(/\{([a-z0-9_-]+)\}/gi, ':$1')
        return `
          // ${summary}
          '${formatedKey}': (req, res) => {
            res.send(${mockData})
          },
        `
      })
      .join('\n\n')

    const fileContent = `
      const { mock } = require('mockjs')

      module.exports = {
        ${mockContents}
      }
    `

    const filename = `${mockFolder}/${tag}${options.filenameSuffix}`
    // make sure dir exist before write file
    safeMkdirSync(path.dirname(filename))
    fs.writeFileSync(filename, prettier.format(fileContent, options.prettier))
    console.log(`generated ${filename}`)
  }
}

module.exports = generateFiles
