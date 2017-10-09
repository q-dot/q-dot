//import path module to resolve filepaths
const path = require('path');
const webpack = require('webpack');

const config = {
  entry: {
    //if you have a new entry point for a new page, add it here
    customerApp: path.resolve(__dirname, 'client/src/customerIndex.jsx'),
    managerApp: path.resolve(__dirname, 'client/src/managerIndex.jsx'),
    managerLogin: path.resolve(__dirname, 'client/src/managerLoginIndex.jsx')
  },
  output: {
    path: path.resolve(__dirname, 'client/dist/js'),
    filename: '[name]-bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      bootstrap: 'bootstrap'
    })
  ]
};

module.exports = config;
