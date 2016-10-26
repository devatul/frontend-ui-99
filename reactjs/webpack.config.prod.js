var path = require('path');
var webpack = require('webpack');

const paths = {
    output: 'dist',
    source: './src/'
}

module.exports = {
  devtool: 'source-map',
  entry: [
    paths.source + 'index'
  ],
  output: {
    path: path.join(__dirname, paths.output),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true
      },

      beautify: false,

      comments: false,
    })
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src'),
      exclude: /node_modules/
    },
    {
      test: /\.rt$/,
      loaders: ['react-templates-loader'],
      include: path.join(__dirname, 'src')
    }]
  }
};
