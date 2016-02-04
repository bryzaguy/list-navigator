'use strict';

require('es6-promise').polyfill();

module.exports = {
  entry: './index.js',
  output: {
    path: './',
    filename: 'app.js'
  },
  module: {
    loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel"
      }, {
        test: /\.css$/,
        loader: "style!css"
      }
    ]
  }
};