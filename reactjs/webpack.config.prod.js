var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var PurifyCSSPlugin = require('purifycss-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const paths = {
    output: 'dist',
    source: './src/',
    vendor: './assets/vendor/',
    css: './assets/stylesheets/'
}

function getFilesFromDir(dir, fileTypes) {
  var filesToReturn = {};
  filesToReturn["main"] = dir + 'index';
  function walkDir(currentPath) {
    var files = fs.readdirSync(currentPath);
    for (var i in files) {
      var curFile = path.join(currentPath, files[i]);      
      if (fs.statSync(curFile).isFile() && fileTypes.indexOf(path.extname(curFile)) != -1) {
          var filename = (curFile.replace('.rt', ''));
          filesToReturn[filename.replace(dir, '').replace(currentPath + '/', '')] = './' + filename;
      } else if (fs.statSync(curFile).isDirectory()) {
        walkDir(curFile);
      }
    }
  };
  walkDir(dir);
  
  console.log(filesToReturn);
  return filesToReturn; 
}

module.exports = {
  devtool: 'source-map',
  entry: {
    main: './src/index' 
  },
  output: {
    path: path.join(__dirname, paths.output),
    filename: 'bundle-[name].js',
    publicPath: '/assets/',
    chunkFilename: "[id].chunk.js"
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
    new ExtractTextPlugin("bundle-[name].css"),
    new PurifyCSSPlugin({
      basePath: paths.css,
      purifyOptions: {
        minify: true 
      },
      paths: [
        path.join(__dirname, 'src')
      ]
    }),
    new HtmlWebpackPlugin({
      minify: {
        removeComments: true,
        preserveLineBreaks: true
      }
    })
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

      { 
        test: /\.css$/, 
        loader: ExtractTextPlugin.extract("style-loader","css-loader")
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
      }
    ]
  }
};
