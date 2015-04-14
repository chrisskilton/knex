var webpack = require('webpack');

module.exports = {

  entry: './src/knex.js',

  output: {
    library: 'Knex',
    libraryTarget: 'umd',
    filename: 'knex.build.js'
  },

  externals: {
    "fs":     "fs",
    "pg":     "pg",
    "pg.js":  "pg.js",
    "mysql":  "mysql",
    "mysql":  "mysql2",
    "oracle": "oracle",
    "mysql":  "mysql2",
    "pg-query-stream": "pg-query-stream"
  },

  module: {
    loaders: [
      { 
        test: /\.js$/, 
        exclude:/node_modules|duce/, 
        loader: 'babel-loader?loose=all&optional=runtime' 
      }
    ]
  },

  node: {
    Buffer: false
  }

};