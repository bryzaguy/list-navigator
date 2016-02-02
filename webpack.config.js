'use strict';

module.exports = {
  entry: './index.js',
  output: {
    path: './',
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel"
      }
    ]
  }
};