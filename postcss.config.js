module.exports = {
  plugins: [
    require('autoprefixer')({
      browsers: ['last 2 versions']
    }),
    require('cssnano')({
      discardComments: {
        removeAll: true
      },
      autoprefixer: false,
      zindex: false,
      normalizeUrl: false
    })
  ]
};
