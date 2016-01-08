'use strict'

var saveAs = require('saveAs')
var canvas = require('canvas')

module.exports = function () {
  canvas = document.getElementsByTagName('canvas')[0]
  canvas.toBlob(function (blob) {
    saveAs(blob, 'ch-karte.png')
  })
}
