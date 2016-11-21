var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
  // or devtool: 'eval' to debug issues with compiled output:
 /* devtool: 'cheap-module-eval-source-map',*/
  devtool: 'eval',
  entry: [
    // necessary for hot reloading with IE:
    'eventsource-polyfill',
    // listen to code updates emitted by hot middleware:
    'webpack-hot-middleware/client',
    // source code:
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin("bundle.css")
  ],
  devtool: "source-map",
  module: {
    loaders: [
      {
        test: /\.js/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.rt/, 
        loaders: ['react-templates-loader'], 
        include: path.join(__dirname, 'src')
      },

      { 
        test: /\.png$/, 
        loader: "url-loader?limit=100000",
        include: path.join(__dirname, 'assets')
      },

      { 
        test: /\.jpg$/, 
        loader: "file-loader", 
        include: path.join(__dirname, 'assets')
      },

      { 
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', '!css-loader?sourceMap')
      },
      
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      }, 
      {
        test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loaders : ['url-loader']
      }
    ]
  }
};
