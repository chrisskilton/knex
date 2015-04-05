var webpack = require('webpack');

module.exports = {

  entry: './src/knex.js',

  output: {
    library: 'Knex',
    libraryTarget: 'umd',
    filename: 'knex.build.js'
  },

  module: {
    loaders: [
      { 
        test: /\.js$/, 
        exclude:/node_modules/, 
        loader: 'babel-loader?loose=all' 
      }
    ]
  },

  node: {
    Buffer: false
  }

};