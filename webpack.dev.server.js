const webpack = require('webpack');
const config = require('./webpack.config');
console.log('create compiler');
export const compiler = webpack(config);

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  noInfo: false,
  stats: {colors: true},
  publicPath: config.output.publicPath
});

export default app => {
  console.log('start dev middleware');
  app.use(devMiddleware);
  app.use(require('webpack-hot-middleware')(compiler));

  // Do "hot-reloading" of react stuff on the server
  // Throw away the cached client modules and let them be re-required next time
  compiler.plugin('done', () => {
    Object
      .keys(require.cache)
      .filter(module => module.startsWith(__dirname))
      .forEach(module => delete require.cache[module])
    // Refresh Webpack assets
    webpackTools.refresh()
  });

  // Do "hot-reloading" of express stuff on the server
  // here just server.js and api.js
  // Throw away cached modules and re-require next time
  // Ensure there's no important state in there!
  const chokidar = require('chokidar');
  const watcher = chokidar.watch('./src');
  watcher.on('ready', function () {
    watcher.on('all', function () {
      Object.keys(require.cache).forEach(function (id) {
        if (/wishlist-client[\/\\]src[\/\\]server/.test(id) ||
           /wishlist-client[\/\\]src[\/\\]api/.test(id)) {
          console.log("clear :"+ id);
          delete require.cache[id];
        }
      });
      webpackTools.refresh()
    });
  });
};
