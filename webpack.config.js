'use strict' // eslint-disable-line strict

// TODO use webpack-merge to remove duplication!!!!!!!!

const path = require('path')
const webpack = require('webpack')
var merge = require('webpack-merge')

const webpackToolsConfig = require('./webpack.isomorphic.tools')
const WebpackToolsPlugin = require('webpack-isomorphic-tools/plugin')
const CompressionPlugin = require("compression-webpack-plugin")
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const buildDate = new Date(Date.now()).toUTCString();
console.log(buildDate);

// Globals
const NODE_ENV = process.env.NODE_ENV || 'development'
const __DEV__ = NODE_ENV !== 'production'
const __PROD__ = NODE_ENV === 'production'
const __SERVER__ = false
const __CLIENT__ = true
const __SSR__ = true
const __FAKEAPIURL__ = JSON.stringify('http://localhost:3000')


// *********************** COMMON ************************
const common = {
  context: path.join(__dirname, 'src'),
  node: {
    fs: "empty",
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      theme: path.join( __dirname, 'src/theme' ),
      public: path.join( __dirname, 'src/public' ),
      modules: path.join( __dirname, 'src/modules' ),
      middlewares: path.join( __dirname, 'src/middlewares' ),
      helpers: path.join( __dirname, 'src/helpers' ),
      src: path.join( __dirname, 'src' ),
      interfaces: path.join( __dirname, 'interfaces' ),
      resources: path.join( __dirname, 'resources' )
    },
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/' // in prod this could be a CDN
  },
  module: {
    rules: [{
      test: /\.png$/,
      use: ["file-loader?name=[name].[ext]"]
    }, {
      test: /\.jpe?g$|\.gif$/i,
      loader: "url-loader?name=/img/[name].[ext]"
    }, {
      test: /\.otf$/,
      loader: "url-loader?name=/fonts/Brown/[name].[ext]"
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: "url-loader?limit=10000&mimetype=application/font-woff"
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: "url-loader"
    }]
  }
}

// **************************** DEV *****************************
let config
if (__DEV__) {
  config = {
    entry: {
      app: [
        'webpack-hot-middleware/client',
        'react-hot-loader/patch',
        './client.js'
      ]
    },
    resolve: {
      modules: [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'node_modules')
      ]
    },
    module: {
      rules: [{
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['react', ['es2015', { modules: false }], 'stage-0'],
            plugins: ['react-hot-loader/babel']
          }
        }
          /* , {
           * loader: 'eslint-loader',
           * options: {emitWarning: true}
             }*/
        ]
      }, {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader?modules&localIdentName=[hash:base64:4]&importLoaders=1&sourceMap&camelCase=true'
        }, {
          loader: 'postcss-loader',
          options: {sourceMap: true}
        }, {
          loader: 'sass-loader',
          options: {sourceMap: true}
        }],
      }]
    },
    plugins: [
      new webpack.DefinePlugin({__FAKEAPIURL__, __DEV__, __PROD__, __SERVER__, __CLIENT__, __SSR__}),
      new webpack.HotModuleReplacementPlugin(),
      new WebpackToolsPlugin(webpackToolsConfig).development(__DEV__),
      // new StyleLintPlugin({context: 'src/modules',})
    ],
    devtool: 'inline-source-map'
  }
}

// **************************** PROD *****************************
if (__PROD__) {
  const extractSass = new ExtractTextPlugin({
    filename: 'app.[contenthash:20].css',
  })
  config = {
    entry: {
      app: ['./client.js']
    },
    output: {
      filename: '[name].[chunkhash].js',
    },
    module: {
      rules: [{
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        use: [{
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: ['react', ['es2015', { modules: false }], 'stage-0'],
            plugins: [],
          }
        }]
      }, {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [{
            loader: 'css-loader?modules&localIdentName=[hash:base64:4]&importLoaders=1&camelCase=true&minimize=true'
          }, {
            loader: 'postcss-loader'
          }, {
            loader: 'sass-loader',
          }],
          fallback: "style-loader"
        })
      }]
    },
    plugins: [
      new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production'), __DEV__, __PROD__, __SERVER__, __CLIENT__}),
      extractSass,
      new webpack.optimize.UglifyJsPlugin({compressor: {warnings: false}, output: {comments: false} }),
      new CompressionPlugin({asset: "[path].gz[query]", algorithm: "gzip", test: /\.(js|html)$/, threshold: 10240, minRatio: 0.8}),
      new WebpackToolsPlugin(webpackToolsConfig).development(__DEV__),
      new BundleAnalyzerPlugin({analyzerMode: 'static', reportFilename: `../stats/${buildDate}.html`, openAnalyzer: false})
    ],
  }
}

const webpackConfig = merge({}, common, config);
const pretty = require('js-object-pretty-print').pretty;
console.log(pretty(webpackConfig));
module.exports = webpackConfig
