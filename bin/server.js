
const path = require('path')

// Globals
const NODE_ENV = process.env.NODE_ENV || 'development'
global.__DEV__ = NODE_ENV !== 'production'
global.__PROD__ = NODE_ENV === 'production'
global.__SERVER__ = true
global.__CLIENT__ = false
global.__SSR__ = true
global.__FAKEAPIURL__ = JSON.stringify("http://localhost:3000")

if (__DEV__) {
  // Bootstrap babel-register
  require('babel-register')
  require('babel-polyfill')
  // Bootstrap webpack (required for webpack-isomorphic-tools)
  require('../webpack.dev.server')
}

require.extensions['.png'] = () => {
  return;
};
const basePath = path.resolve(__dirname, __DEV__ ? '../src' : '../lib')
console.log(basePath)
const WebpackTools = require('webpack-isomorphic-tools')
const webpackToolsConfig = require('../webpack.isomorphic.tools')

global.webpackTools = new WebpackTools(webpackToolsConfig)
  .server(basePath, () => {
    //https://medium.com/@kentcdodds/misunderstanding-es6-modules-upgrading-babel-tears-and-a-solution-ad2d5ab93ce
    const server = require(basePath).default

    server.listen(3000, () => {
      console.info('Server is running!') // eslint-disable-line no-console
    })
  })
