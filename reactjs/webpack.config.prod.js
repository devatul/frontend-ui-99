var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

const paths = {
    output: 'dist',
    source: './src/',
    vendor: './assets/vendor/',
    css: './assets/stylesheets/'
}

module.exports = {
  devtool: 'source-map',
  entry: {
    'main': [
      paths.source + 'index'
    ],
    'vendor': [
      paths.vendor + 'jquery/jquery.js'
    ],
    'styles': [
      paths.css + 'theme.css'
    ]
  },
  output: {
    path: path.join(__dirname, paths.output),
    filename: 'bundle-[name].js',
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
    }),
    new ExtractTextPlugin('main.css')
  ],
  module: {
    loaders: [
      //js, jsx
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/
      },

      //React templates
      {
        test: /\.rt$/,
        loaders: ['react-templates-loader'],
        include: path.join(__dirname, 'src')
      },

      //CSS, SCSS
      {
        test: /\.css$/,
        loaders: ExtractTextPlugin.extract("style-loader","css-loader"),
        include: path.join(__dirname, 'assets/stylesheets')
      }
    ]
  }
};
