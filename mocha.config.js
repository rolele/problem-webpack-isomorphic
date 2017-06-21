// Bootstrap babel-register
require('babel-register')

// Ensure correct NODE_ENV
if (process.env.NODE_ENV !== 'test') {
  throw new Error('Running tests require NODE_ENV=test')
}

// Globals
global.__DEV__ = true
global.__PROD__ = false
global.__SERVER__ = true
global.__CLIENT__ = false
global.__SSR__ = true

// Set up chai and sinon
const chai  = require('chai')
const sinon = require('sinon')

chai.use(require('chai-as-promised'))
chai.use(require('sinon-chai'))
chai.use(require('chai-enzyme')())

global.expect = chai.expect
global.sinon  = sinon

// Set up jsdom
const jsdom = require('jsdom')

const document = new jsdom.JSDOM()

global.document  = document
global.window    = document.defaultView
global.navigator = { userAgent: 'node.js' }

// Hook for CSS Module imports enables using classes in tests
const hook = require('css-modules-require-hook')
const sass = require('node-sass')
const path = require('path')

const includePaths = [
  path.resolve(__dirname, "src/theme/")
]

const prepend = `
`

hook({
  extensions: ['.scss'],
  generateScopedName: '[local]__[hash:base64:4]',
  preprocessCss: (data, filename) => sass.renderSync(
    (() => {
      new_data = prepend + data
      return {
        data: new_data,
        file: filename,
        includePaths
      }
    })()).css
})

// Load tests
const glob = require('glob')
glob.sync('./src/**/*.spec.js').forEach(require)
