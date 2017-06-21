import Express from 'express';
import favicon from 'serve-favicon';
import compression from 'compression';
import path from 'path';
import http from 'http';

const app = new Express();
app.use(compression());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

if (__DEV__) {
  require('../webpack.dev.server').default(app)
} else {
  app.use(Express.static(path.join(__dirname, '..', 'dist')));
}

// Include server routes as a middleware
app.use('/api', function (req, res, next) {
  require('./api')(req, res, next);
});

app.get('*', function (req, res, next) {
  require('./server')(req, function (err, page) {
    if (err) return next(err);
    res.send(page);
  });
});


const server = new http.Server(app);
export default server
