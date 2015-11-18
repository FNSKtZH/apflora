'use strict'

var getConfig = require('hjs-webpack')
// var indexTemplate = require('./indexTemplate.js')

let config = getConfig({
  // entry point for the app
  in: 'src/app.js',

  // Name or full path of output directory
  // commonly named `www` or `public`. This
  // is where your fully static site should
  // end up for simple deployment.
  out: 'public',
  isDev: process.env.NODE_ENV !== 'production' /*,

  // This will destroy and re-create your
  // `out` folder before building so you always
  // get a fresh folder. Usually you want this
  // but since it's destructive we make it
  // false by default
  clearBeforeBuild: true,
  html: function (context) {
    return {
      'index.html': indexTemplate()
    }
  },
  output: {
    filename: 'app.js',
    cssFilename: 'app.css'
  }*/
})

config.module.loaders.push(
  {
    test: /\.jsx?$/,
    exclude: /(node_modules|bower_components)/,
    loader: 'babel',
    query: {
      presets: ['es2015', 'react', 'stage-0']
    }
  } /*,
  {
    test: /\.js?$/,
    exclude: /(node_modules|bower_components)/,
    loader: 'babel',
    query: {
      presets: ['es2015', 'react', 'stage-0']
    }
  },
  {
    test: /\.hbs$/, loader: 'handlebars-loader'
  }*/
)

module.exports = config
