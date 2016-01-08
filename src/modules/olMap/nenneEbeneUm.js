'use strict'

var initiiereLayertree = require('./initiiereLayertree')
var aktualisiereEbeneInLocalStorage = require('./aktualisiereEbeneInLocalStorage')

module.exports = function (layer, title) {
  layer.set('title', title)
  initiiereLayertree('Eigene Ebenen')
  // layer in localStorage speichern
  aktualisiereEbeneInLocalStorage(layer)
}
